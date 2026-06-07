import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Extraímos o 'tipo' (que acabámos de enviar no Mural). Se não vier, assume "aviso".
    const { titulo, mensagem, paginaDestino, tipo = "aviso", comunidadeTarget, targetAgapeOnly } = body;

    const { adminDb, adminMessaging } = getFirebaseAdmin();
    
    let tokensQuery: FirebaseFirestore.Query | FirebaseFirestore.CollectionReference = adminDb.collection("tokens_notificacao");
    if (comunidadeTarget) {
      tokensQuery = tokensQuery.where("comunidade", "==", comunidadeTarget);
    }
    if (targetAgapeOnly) {
      tokensQuery = tokensQuery.where("isAgape", "==", true);
    }
    
    const tokensSnapshot = await tokensQuery.get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, enviados: 0 });
    }

    const todosTokens = tokensSnapshot.docs.map((doc) => doc.data().token);
    const tokensUnicos = [...new Set(todosTokens)].filter(
      (t) => typeof t === "string" && t.length > 10
    );

    if (tokensUnicos.length === 0) {
      return NextResponse.json({ success: true, enviados: 0 });
    }

    // ============================================
    // A MÁGICA DAS CORES E CANAIS AQUI
    // ============================================
    const isOracao = tipo === "oracao";
    const corNotificacao = isOracao ? "#10b981" : "#2563eb"; // Verde para Oração, Azul para Avisos
    const canalId = isOracao ? "agape-oracoes" : "agape-avisos";
    const urlDestino = paginaDestino || (isOracao ? "/mural" : "/");

    const payload = {
      notification: {
        title: titulo,
        body: mensagem,
        // ✅ URL absoluta obrigatória para renderizar imagem enriquecida
        imageUrl: "https://liturgia-agape.vercel.app/icon-512x512.png",
      },
      data: { url: urlDestino },
      android: {
        priority: "high" as const,
        notification: {
          channelId: canalId,
          icon: "icon_notification",
          color: corNotificacao,
          actions: [
            { action: "open_app", title: "Ver" },
            { action: "close", title: "Fechar" },
          ],
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            // ✅ category consistente com o cron para habilitar ações no iOS
            category: canalId,
          },
        },
      },
      webpush: {
        headers: { Urgency: "high" },
        notification: {
          icon: "/icon-192x192.png",
          // ✅ badge removido — path PNG é ignorado pelos navegadores
          actions: [
            { action: "open_app", title: "Abrir" },
            { action: "close", title: "Fechar" },
          ],
        },
      },
      tokens: tokensUnicos,
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    // Limpeza de tokens inválidos (O seu código já estava brilhante aqui)
    if (response.failureCount > 0) {
      const tokensParaRemover: Promise<unknown>[] = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const erro = resp.error?.code;
          if (erro === "messaging/registration-token-not-registered" || erro === "messaging/invalid-argument") {
            const tokenFalho = tokensUnicos[idx];
            const queryRemover = adminDb
              .collection("tokens_notificacao")
              .where("token", "==", tokenFalho)
              .get()
              .then((snap) => {
                const deletes: Promise<unknown>[] = [];
                snap.forEach((doc) => deletes.push(doc.ref.delete()));
                return Promise.all(deletes);
              });
            tokensParaRemover.push(queryRemover);
          }
        }
      });
      await Promise.all(tokensParaRemover);
    }

    return NextResponse.json({
      success: true,
      enviados: response.successCount,
      falhas: response.failureCount,
    });
  } catch (error: unknown) {
    console.error("Erro no envio:", error);
    const msg = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
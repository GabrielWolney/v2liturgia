import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { getLiturgiaDoDia } from "@/services/api-liturgia";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Não autorizado', { status: 401 });
  }

  try {
    const { adminDb, adminMessaging } = getFirebaseAdmin();

    const liturgia = await getLiturgiaDoDia();
    const titulo = "Pequena Via: Liturgia de Hoje";
    const mensagem = liturgia
      ? `Bom dia! Hoje é ${liturgia.liturgia}. Vamos rezar?`
      : "Bom dia! A liturgia de hoje já está disponível. Que tal um momento com Deus?";

    const tokensSnapshot = await adminDb.collection("tokens_notificacao").get();

    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, message: "Ninguém para notificar." });
    }

    const todosTokens = tokensSnapshot.docs.map((doc) => doc.data().token);
    const tokensUnicos = [...new Set(todosTokens)].filter(
      (t) => typeof t === "string" && t.length > 10
    );

    if (tokensUnicos.length === 0)
      return NextResponse.json({ success: true, message: "0 tokens válidos." });

    const payload = {
      notification: {
        title: titulo,
        body: mensagem,
        // ✅ URL absoluta obrigatória para renderizar imagem enriquecida
        imageUrl: "https://liturgia-agape.vercel.app/icon-512x512.png",
      },
      data: { url: "/jornada" },
      android: {
        priority: "high" as const,
        notification: {
          channelId: "agape-liturgia",
          icon: "icon_notification",
          color: "#2563eb",
          actions: [
            { action: "open_liturgia", title: "Liturgia" },
            { action: "open_terco", title: "Terço" },
          ],
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
            category: "agape-liturgia",
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

    // ✅ Limpeza de tokens inválidos (alinhado com /api/notificacoes)
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
  } catch (error) {
    console.error("Erro no Cron:", error);
    return NextResponse.json(
      { error: "Falha no disparo automático" },
      { status: 500 }
    );
  }
}
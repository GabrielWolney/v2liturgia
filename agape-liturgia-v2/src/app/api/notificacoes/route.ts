import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";



export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, mensagem, paginaDestino } = body;

    const { adminDb, adminMessaging } = getFirebaseAdmin();
    const tokensSnapshot = await adminDb.collection("tokens_notificacao").get();
    
    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, enviados: 0 });
    }

    // 1. Remove duplicados usando Set para evitar notificações repetidas
    const todosTokens = tokensSnapshot.docs.map(doc => doc.data().token);
    const tokensUnicos = [...new Set(todosTokens)].filter(t => typeof t === 'string' && t.length > 10);

    if (tokensUnicos.length === 0) {
      return NextResponse.json({ success: true, enviados: 0 });
    }

    const payload = {
      notification: { title: titulo, body: mensagem },
      data: { url: paginaDestino || "/" },
      tokens: tokensUnicos,
    };

    // 2. Envio em massa
    const response = await adminMessaging.sendEachForMulticast(payload);

    // 3. LIMPEZA AUTOMÁTICA (Sem o erro de 'any')
    if (response.failureCount > 0) {
      const tokensParaRemover: Promise<unknown>[] = []; // Mudamos para unknown aqui!
      
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const erro = resp.error?.code;
          if (erro === 'messaging/registration-token-not-registered' || erro === 'messaging/invalid-argument') {
            const tokenFalho = tokensUnicos[idx];
            
            const queryRemover = adminDb.collection("tokens_notificacao")
              .where("token", "==", tokenFalho)
              .get()
              .then(snap => {
                const deletes: Promise<unknown>[] = [];
                snap.forEach(doc => deletes.push(doc.ref.delete()));
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
      falhas: response.failureCount 
    });

  } catch (error: unknown) {
    console.error("Erro no envio:", error);
    const msg = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
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
    const titulo = "🕊️ Pequena Via: Liturgia de Hoje";
    const mensagem = liturgia 
      ? `Bom dia! Hoje é ${liturgia.liturgia}. Vamos rezar?`
      : "Bom dia! A liturgia de hoje já está disponível. Que tal um momento com Deus?";

    
    const tokensSnapshot = await adminDb.collection("tokens_notificacao").get();
    
    if (tokensSnapshot.empty) {
      return NextResponse.json({ success: true, message: "Ninguém para notificar." });
    }

    const todosTokens = tokensSnapshot.docs.map(doc => doc.data().token);
    const tokensUnicos = [...new Set(todosTokens)].filter(t => typeof t === 'string' && t.length > 10);

    if (tokensUnicos.length === 0) return NextResponse.json({ success: true, message: "0 tokens válidos." });

    
    const payload = {
      notification: { title: titulo, body: mensagem },
      data: { url: "/jornada" },
      tokens: tokensUnicos,
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({ 
      success: true, 
      enviados: response.successCount,
      falhas: response.failureCount 
    });

  } catch (error) {
    console.error("Erro no Cron:", error);
    return NextResponse.json({ error: "Falha no disparo automático" }, { status: 500 });
  }
}
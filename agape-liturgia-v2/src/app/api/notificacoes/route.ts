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
      return NextResponse.json({ success: true, enviados: 0, falhas: 0, message: "Base de tokens vazia." });
    }

    const tokens = tokensSnapshot.docs
      .map(doc => doc.data().token)
      .filter(t => typeof t === 'string' && t.length > 20);

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, enviados: 0, falhas: 0, message: "Nenhum token válido." });
    }

    const payload = {
      notification: { title: titulo, body: mensagem },
      data: { url: paginaDestino || "/" },
      tokens: tokens,
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({ 
      success: true, 
      enviados: response.successCount,
      falhas: response.failureCount 
    });

  } catch (error: unknown) {
    console.error("ERRO DETALHADO:", error);

    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    
    const errorCode = (error as { code?: string })?.code || "sem_codigo";

    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      stack: errorCode
    }, { status: 500 });
  }
}
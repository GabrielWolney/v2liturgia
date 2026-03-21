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
      return NextResponse.json({ success: true, enviados: 0, falhas: 0, message: "Nenhum token na base." });
    }

    // FILTRA APENAS OS TOKENS VÁLIDOS E RECENTES
    const tokens = tokensSnapshot.docs
      .map(doc => doc.data().token)
      .filter(token => typeof token === "string" && token.length > 10);

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, enviados: 0, falhas: 0, message: "Nenhum token válido encontrado." });
    }

    const payload = {
      notification: { title: titulo, body: mensagem },
      data: { url: paginaDestino || "/" },
      tokens: tokens, // O Firebase aceita até 500 por vez aqui
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({ 
      success: true, 
      enviados: response.successCount,
      falhas: response.failureCount 
    });

  } catch (error) {
    console.error("Erro na API de Notificações:", error);
    return NextResponse.json({ success: false, error: "Falha interna no servidor." }, { status: 500 });
  }
}
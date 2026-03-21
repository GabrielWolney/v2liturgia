import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";


export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, mensagem, paginaDestino } = body;

    
    const { adminDb, adminMessaging } = getFirebaseAdmin();

    const tokensSnapshot = await adminDb.collection("fcm_tokens").get();
    
    if (tokensSnapshot.empty) {
      return NextResponse.json({ message: "Nenhum token encontrado no banco." }, { status: 200 });
    }

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    const payload = {
      notification: {
        title: titulo,
        body: mensagem,
      },
      data: {
        url: paginaDestino || "/",
      },
      tokens: tokens,
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({ 
      success: true, 
      enviados: response.successCount,
      falhas: response.failureCount 
    });

  } catch (error) {
    console.error("Erro na API de Notificações:", error);
    return NextResponse.json({ error: "Falha ao enviar notificações" }, { status: 500 });
  }
}
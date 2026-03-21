import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, mensagem, paginaDestino } = body;

    // 1. Busca todos os tokens salvos na sua coleção 'fcm_tokens'
    const tokensSnapshot = await adminDb.collection("fcm_tokens").get();
    
    if (tokensSnapshot.empty) {
      return NextResponse.json({ message: "Nenhum token encontrado no banco." }, { status: 200 });
    }

    // 2. Extrai apenas as strings dos tokens
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    // 3. Monta a carga da notificação
    const payload = {
      notification: {
        title: titulo,
        body: mensagem,
      },
      // Dados extras para o celular saber qual página abrir ao clicar
      data: {
        url: paginaDestino || "/",
      },
      tokens: tokens,
    };

    // 4. Faz o envio em massa (Multicast)
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
import * as admin from 'firebase-admin';

if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  // Limpeza extra na chave para remover aspas acidentais
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n')
    ?.replace(/"/g, ''); // Remove aspas duplas que possam ter vindo da Vercel

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (e) {
    console.error("Falha ao inicializar Firebase Admin:", e);
  }
}

export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    throw new Error("O Firebase Admin não foi inicializado. Verifique se as variáveis de ambiente (PROJECT_ID, etc) estão na Vercel.");
  }
  return {
    adminDb: admin.firestore(),
    adminMessaging: admin.messaging()
  };
}
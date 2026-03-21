import * as admin from 'firebase-admin';

// Verifica se a aplicação admin já foi inicializada para não dar erro no Next.js
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // O replace é fundamental para o Next.js ler as quebras de linha da chave corretamente
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const adminDb = admin.firestore();
const adminMessaging = admin.messaging();

export { adminDb, adminMessaging };
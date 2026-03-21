import * as admin from 'firebase-admin';



if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}



export function getFirebaseAdmin() {
  if (!admin.apps.length) {
    throw new Error("Firebase Admin não está inicializado. Verifique as chaves.");
  }
  return {
    adminDb: admin.firestore(),
    adminMessaging: admin.messaging()
  };
}
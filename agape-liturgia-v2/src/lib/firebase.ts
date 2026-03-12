import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8HrJeZ-QHGQHHGTn5-N7L_2CpSUd42gM",
  authDomain: "agape-avisos.firebaseapp.com",
  projectId: "agape-avisos",
  storageBucket: "agape-avisos.firebasestorage.app",
  messagingSenderId: "556421268172",
  appId: "1:556421268172:web:b9cb0955e3e95dd8e8f869",
  measurementId: "G-ZMW9FY1H4N",
};

// Padrão Singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Inicializa o Analytics de forma segura (Apenas no Navegador)
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
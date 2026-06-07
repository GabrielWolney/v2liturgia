import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported as isMessagingSupported, Messaging } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { persistentSingleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// ─── Firebase App Check (Segurança contra Bots/Spam) ─────────────────────────
if (typeof window !== "undefined") {
  // @ts-expect-error - Evita problemas de SSR e garante que corre apenas no cliente
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NODE_ENV !== "production";
  
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6LdzxwItAAAAAHvKNK36pdYhjXdl7HUXn4MwWiAz"),
    isTokenAutoRefreshEnabled: true
  });
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Firestore com persistência offline ──────────────────────────────────────
// initializeFirestore com localCache substitui o deprecated enableIndexedDbPersistence.
// Configura persistência de forma síncrona, sem race condition.
// persistentMultipleTabManager() evita o erro "failed-precondition" com múltiplas abas.
// try/catch protege contra dupla inicialização durante HMR no Next.js dev.
let db: Firestore;
try {
  const isIOS = typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  db =
    typeof window !== "undefined"
      ? initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: isIOS ? persistentSingleTabManager({}) : persistentMultipleTabManager(),
          }),
        })
      : initializeFirestore(app, {});
} catch {
  // Já inicializado (HMR reload) — recupera instância existente
  db = getFirestore(app);
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── FCM: Lazy Singleton assíncrono ──────────────────────────────────────────
// Exportamos uma função async em vez de uma variável null, eliminando a race
// condition onde componentes liam `messaging` antes da Promise resolver.
let _messagingPromise: Promise<Messaging | null> | null = null;

export async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!_messagingPromise) {
    _messagingPromise = isMessagingSupported().then((supported) => {
      if (!supported) return null;
      return getMessaging(app);
    });
  }
  return _messagingPromise;
}
// ─────────────────────────────────────────────────────────────────────────────

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
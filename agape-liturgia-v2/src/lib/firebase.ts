import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, isSupported as isMessagingSupported, Messaging } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  isMessagingSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}


let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}


export { app, db, auth, messaging, analytics };
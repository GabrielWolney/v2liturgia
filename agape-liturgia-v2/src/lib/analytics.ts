import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

// Trocamos o "any" por tipos reais (string, número ou booleano)
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && analytics) {
    logEvent(analytics, eventName, params);
  }
}
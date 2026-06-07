"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useRef, useState } from "react";

type ViewState = "hidden" | "banner" | "badge";

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  // ✅ Nunca retornamos null — usamos CSS para mostrar/esconder.
  // O padrão return null + setTimeout causava removeChild(null) no React 19.
  const [view, setView] = useState<ViewState>("hidden");
  const [wasOffline, setWasOffline] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpa timers anteriores
    if (timerRef.current) clearTimeout(timerRef.current);
    if (outerTimerRef.current) clearTimeout(outerTimerRef.current);

    outerTimerRef.current = setTimeout(() => {
      if (!isOnline) {
        setWasOffline(true);
        setView("banner");
        timerRef.current = setTimeout(() => setView("badge"), 4000);
      } else if (wasOffline) {
        setView("banner");
        timerRef.current = setTimeout(() => {
          setView("hidden");
          setWasOffline(false);
        }, 3000);
      }
    }, 10);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (outerTimerRef.current) clearTimeout(outerTimerRef.current);
    };
  }, [isOnline, wasOffline]);

  // ✅ Visibilidade controlada por CSS — o componente permanece no DOM
  const isBannerVisible = view === "banner";
  const isBadgeVisible = view === "badge";
  const isHidden = view === "hidden";

  return (
    <div aria-hidden={isHidden}>
      {/* 1. BANNER DE NOTIFICAÇÃO */}
      <div
        className={`fixed top-24 left-0 right-0 z-[100] flex justify-center px-5 pointer-events-none transition-all duration-500 ease-out ${
          isBannerVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div
          className={`flex items-center gap-4 p-3 pr-5 rounded-[1.5rem] shadow-soft border bg-card pointer-events-auto transition-colors duration-300 ${
            isOnline ? "border-emerald-500/30" : "border-orange-500/30"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-[1rem] flex items-center justify-center shrink-0 ${
              isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
            }`}
          >
            <span className="material-symbols-rounded text-[24px]">
              {isOnline ? "wifi" : "wifi_off"}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-extrabold leading-none mb-1 ${
                isOnline
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-orange-600 dark:text-orange-400"
              }`}
            >
              {isOnline ? "Conexão Restaurada" : "Você está offline"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              {isOnline ? "Tudo sincronizado" : "Modo offline ativado"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. ÍCONE FLUTUANTE */}
      <div
        className={`fixed top-24 right-5 z-[90] flex justify-center transition-all duration-500 ease-out ${
          isBadgeVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-12 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setView("banner")}
          className="w-12 h-12 rounded-full bg-card border-2 border-orange-500/30 shadow-md flex items-center justify-center text-orange-500 active:scale-95 transition-all hover:bg-orange-500/10 animate-pulse"
          aria-label="Sem conexão à Internet"
        >
          <span className="material-symbols-rounded text-[22px]">wifi_off</span>
        </button>
      </div>
    </div>
  );
}
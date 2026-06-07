"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAlertStore } from "@/store/useAlertStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

export function NativeAlert() {
  const { isOpen, title, message, type, showCancel, onConfirm, onCancel, hideAlert } = useAlertStore();
  // ✅ Nunca retornamos null — usamos CSS para mostrar/esconder.
  // Isso evita o "removeChild(null)" no React 19 que ocorre quando um componente
  // transiciona de null → conteúdo enquanto timers assíncronos ainda estão rodando.
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { playPop, playError, playSuccess, playClick } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isOpen) {
      // Pequeno delay para garantir que o CSS transition dispara após o paint
      timerRef.current = setTimeout(() => setIsVisible(true), 10);

      if (type === "success") {
        playSuccess();
        triggerHaptic("success");
      } else if (type === "error") {
        playError();
        triggerHaptic("error");
      } else {
        playPop();
        triggerHaptic("medium");
      }
    } else {
      timerRef.current = setTimeout(() => setIsVisible(false), 0);
      // Não precisamos de timer longo para desmontar — o componente permanece no DOM com aria-hidden
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, type, playPop, playError, playSuccess, triggerHaptic]);

  const handleConfirm = () => {
    playClick();
    triggerHaptic("light");
    if (onConfirm) onConfirm();
    hideAlert();
  };

  const handleCancel = () => {
    playClick();
    triggerHaptic("light");
    if (onCancel) onCancel();
    hideAlert();
  };

  const getIcon = () => {
    switch (type) {
      case "success": return <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3 mx-auto shadow-inner"><span className="material-symbols-rounded text-2xl">check_circle</span></div>;
      case "error": return <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-3 mx-auto shadow-inner"><span className="material-symbols-rounded text-2xl">error</span></div>;
      case "info":
      default: return <div className="w-12 h-12 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center mb-3 mx-auto shadow-inner"><span className="material-symbols-rounded text-2xl">info</span></div>;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "success": return "bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_0_#059669] text-white";
      case "error": return "bg-red-500 hover:bg-red-600 shadow-[0_4px_0_#B91C1C] text-white";
      case "info":
      default: return "bg-[#2F6BFF] hover:bg-blue-600 shadow-[0_4px_0_#1E4BCC] text-white";
    }
  };

  return (
    // ✅ aria-hidden quando fechado — acessível e sem removeChild
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[999999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible
          ? "bg-background/80 backdrop-blur-sm opacity-100 pointer-events-auto"
          : "bg-transparent backdrop-blur-none opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-[320px] bg-card border border-border/50 shadow-2xl rounded-[2rem] p-6 text-center transform transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
          isVisible ? "scale-100 translate-y-0 opacity-100" : "scale-90 translate-y-8 opacity-0"
        }`}
      >
        {getIcon()}
        {title && <h3 className="text-xl font-black mb-2 text-foreground tracking-tight">{title}</h3>}
        {message && <p className="text-sm font-medium text-muted mb-6 leading-relaxed">{message}</p>}

        <div className={`flex ${showCancel ? 'gap-3' : ''}`}>
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 font-bold py-3.5 rounded-2xl bg-muted/10 hover:bg-muted/20 text-foreground transition-all"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`${showCancel ? 'flex-1' : 'w-full'} font-bold py-3.5 rounded-2xl active:translate-y-[4px] active:shadow-none transition-all ${getButtonClass()}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

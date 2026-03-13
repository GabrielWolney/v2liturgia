"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";
import { subscribeToProposito } from "@/services/db-home";
import { Proposito } from "@/services/db-admin";

export default function PropositosPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [proposito, setProposito] = useState<Proposito | null>(null);
  
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "proposito_comunidade" });
    
    const unsubProposito = subscribeToProposito(setProposito);

    return () => {
      clearTimeout(timer);
      unsubProposito();
    };
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- CLASSES DO TEMA ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';
  const fontTitle = tamanhoFonte === 'grande' ? 'text-3xl' : 'text-2xl';

  const hasProposito = proposito?.ativo === true || String(proposito?.ativo) === "true";

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <button onClick={() => router.back()} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${fontClass}`}>Missão Ágape</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary mb-5 shadow-inner">
            <span className="material-symbols-rounded text-[40px]">flag</span>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}>Propósito</h2>
          <p className={`font-medium text-sm ${textMuted}`}>O foco espiritual da nossa comunidade.</p>
        </div>

        {!hasProposito ? (
          <div className={`text-center py-16 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center ${borderColor} ${cardBg}`}>
             <span className={`material-symbols-rounded text-[48px] mb-3 opacity-20 ${textMain}`}>hourglass_empty</span>
             <p className={`font-medium ${textMuted}`}>Nenhum propósito ativo no momento.</p>
          </div>
        ) : (
          <section className="bg-gradient-to-br from-primary to-[#1E4BCC] text-white p-8 rounded-[2rem] shadow-lg relative overflow-hidden">
            <div className="absolute -right-8 -top-8 text-white/10 pointer-events-none">
              <span className="material-symbols-rounded text-[140px]">group</span>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full mb-6 border border-white/20 shadow-sm">
                <span className="material-symbols-rounded text-[14px]">volunteer_activism</span>
                <span className="text-xs font-bold uppercase tracking-widest">Comunidade</span>
              </div>
              <h3 className={`font-black mb-4 leading-tight ${fontTitle}`}>{proposito?.tema}</h3>
              <p className={`font-serif italic leading-relaxed text-white/95 ${tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>
                &quot;{proposito?.texto}&quot;
              </p>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
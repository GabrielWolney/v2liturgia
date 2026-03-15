"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function AnotacoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { minhasNotas, setNotas, modoVisual, tamanhoFonte } = useUserStore();
  const [saveStatus, setSaveStatus] = useState<"ocioso" | "guardando" | "guardado">("ocioso");

  useEffect(() => {
    
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(mountTimer);
  }, []);

  const handleMudancaTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotas(e.target.value);
    setSaveStatus("guardando");
    setTimeout(() => { 
      setSaveStatus("guardado"); 
      setTimeout(() => setSaveStatus("ocioso"), 2000); 
    }, 500);
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";
  
  
  const fontClass = tamanhoFonte === 'grande' ? 'text-xl' : 'text-base';
  const leadingClass = tamanhoFonte === 'grande' ? 'leading-[1.8]' : 'leading-[1.6]';

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link href="/jornada" className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${saveStatus === "guardando" ? "bg-amber-500/20 text-amber-500" : saveStatus === "guardado" ? "bg-emerald-500/20 text-emerald-500" : `${cardBg} border ${borderColor} ${textMuted}`}`}>
          <span className={`material-symbols-rounded text-[14px] ${saveStatus === "guardando" ? "animate-spin" : ""}`}>{saveStatus === "guardando" ? "sync" : "cloud_done"}</span>
          {saveStatus === "guardando" ? "A guardar" : "Salvo"}
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 flex flex-col h-full animate-fade-in">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#2F6BFF]/10 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">edit_note</span>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight mb-1 ${textMain}`}>Meu Diário</h2>
          <p className={`font-medium text-sm ${textMuted}`}>Anotações e reflexões espirituais.</p>
        </div>

        <div className={`flex-1 flex flex-col rounded-[2rem] shadow-soft border overflow-hidden relative group mb-10 transition-colors duration-300 ${cardBg} ${borderColor}`}>
          <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-[#2F6BFF] rounded-r-full opacity-80"></div>
          <textarea 
            value={minhasNotas} 
            onChange={handleMudancaTexto} 
            placeholder="Comece a escrever as suas reflexões de hoje..." 
            spellCheck="false"
            className={`flex-1 w-full bg-transparent p-6 sm:p-10 pl-8 sm:pl-10 resize-none outline-none font-serif transition-colors duration-300 placeholder:opacity-50 ${fontClass} ${leadingClass} ${textMain}`}
          />
        </div>
      </main>
    </div>
  );
}
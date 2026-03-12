"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

export default function AnotacoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { minhasNotas, setNotas } = useUserStore();
  const [saveStatus, setSaveStatus] = useState<"ocioso" | "guardando" | "guardado">("ocioso");

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "anotacoes_v2" });
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

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/jornada"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        
        {/* Feedback visual de gravação */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${
          saveStatus === "guardando" ? "bg-amber-100 text-amber-700" :
          saveStatus === "guardado" ? "bg-emerald-100 text-emerald-700" :
          "bg-slate-200/50 text-[#6B6B6B]"
        }`}>
          <span className={`material-symbols-rounded text-[14px] ${saveStatus === "guardando" ? "animate-spin" : ""}`}>
            {saveStatus === "guardando" ? "sync" : "cloud_done"}
          </span>
          {saveStatus === "guardando" ? "A guardar" : "Salvo"}
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 flex flex-col h-full animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#2F6BFF]/10 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">edit_note</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-1">Meu Diário</h2>
          <p className="text-[#6B6B6B] font-medium text-sm">Anotações e reflexões espirituais.</p>
        </div>

        <div className="flex-1 flex flex-col bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden relative group mb-10">
          {/* Marcador lateral estético */}
          <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-[#2F6BFF] rounded-r-full opacity-80"></div>

          <textarea 
            value={minhasNotas}
            onChange={handleMudancaTexto}
            placeholder="Comece a escrever as suas reflexões de hoje..."
            className="flex-1 w-full bg-transparent p-6 sm:p-10 pl-8 sm:pl-10 resize-none outline-none font-serif text-lg leading-[2] text-[#1F1F1F] placeholder:text-slate-300"
            spellCheck="false"
          />
        </div>
      </main>
    </div>
  );
}
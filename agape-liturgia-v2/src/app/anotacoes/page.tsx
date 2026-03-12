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
    trackEvent("page_view", { page_name: "anotacoes" });
    return () => clearTimeout(mountTimer);
  }, []);

  // Lógica de Auto-Save com feedback visual elegante
  const handleMudancaTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotas(e.target.value);
    setSaveStatus("guardando");
    
    // Simula um pequeno atraso para dar a sensação de "saving..."
    setTimeout(() => {
      setSaveStatus("guardado");
      
      // Volta ao estado neutro após 2 segundos
      setTimeout(() => {
        setSaveStatus("ocioso");
      }, 2000);
    }, 500);
  };

  // TELA DE CARREGAMENTO (Escudo Anti-Hidratação)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center text-blue-500">
          <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32 h-screen">
      
      {/* HEADER CONTROLS */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/menu" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm active:scale-95">
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
          <span className="text-sm font-bold">Voltar</span>
        </Link>

        {/* FEEDBACK DE AUTO-SAVE */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          saveStatus === "guardando" ? "bg-amber-50 text-amber-600 border border-amber-200" :
          saveStatus === "guardado" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
          "bg-slate-50 text-slate-400 border border-transparent opacity-50"
        }`}>
          <span className={`material-symbols-rounded text-[14px] ${saveStatus === "guardando" ? "animate-spin" : ""}`}>
            {saveStatus === "guardando" ? "sync" : "cloud_done"}
          </span>
          {saveStatus === "guardando" ? "A guardar..." : "Guardado no telemóvel"}
        </div>
      </div>

      {/* HEADER DA PÁGINA */}
      <header className="mb-8 px-2">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-2xl">edit_note</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Diário Espiritual
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Anotações de pregações, reflexões e orações.
        </p>
      </header>

      {/* ÁREA DE ESCRITA (Distraction-Free) */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden relative group">
        
        {/* Marcador lateral estético */}
        <div className="absolute left-0 top-10 bottom-10 w-1 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-100 rounded-r-full opacity-50"></div>

        <textarea 
          value={minhasNotas}
          onChange={handleMudancaTexto}
          placeholder="Comece a escrever as suas reflexões de hoje..."
          className="flex-1 w-full bg-transparent p-6 sm:p-10 pl-8 sm:pl-12 resize-none outline-none font-serif text-lg leading-[2] text-slate-700 placeholder:text-slate-300"
          spellCheck="false"
        />
        
        {/* Contagem de caracteres (Sutil no rodapé) */}
        <div className="absolute bottom-4 right-6 text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
          {minhasNotas.length} caracteres
        </div>
      </div>

    </div>
  );
}
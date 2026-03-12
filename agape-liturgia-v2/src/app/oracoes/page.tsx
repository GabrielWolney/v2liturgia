"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

// Auxiliar para busca sem sotaque
const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function OracoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [busca, setBusca] = useState("");
  const { modoVisual, tamanhoFonte } = useUserStore();
  
  const listaOracoes = Object.values(dbOracoes);

  useEffect(() => { 
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "oracoes_index" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

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

  // Lógica de filtragem
  const oracoesFiltradas = listaOracoes.filter(o => 
    removerAcentos(o.titulo).includes(removerAcentos(busca))
  );

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link href="/jornada" className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>Devocionário</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* TÍTULO E ÍCONE */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-[#2F6BFF] mb-5 shadow-inner ${isDark ? 'bg-blue-900/20' : isSepia ? 'bg-[#E8DEC1]' : 'bg-[#2F6BFF]/10'}`}>
            <span className="material-symbols-rounded text-[40px]">self_improvement</span>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}>Orações Comuns</h2>
          <p className={`font-medium text-sm ${textMuted}`}>A sua base diária de diálogo com Deus.</p>
        </div>

        {/* BARRA DE PESQUISA (Agora embaixo do título) */}
        <div className="mb-10 max-w-[600px] mx-auto w-full relative">
          <span className={`material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}>search</span>
          <input 
            type="text" 
            placeholder="Procurar oração..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            className={`w-full border rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#2F6BFF] focus:ring-4 focus:ring-[#2F6BFF]/10 transition-all font-bold shadow-sm placeholder:opacity-60 ${cardBg} ${borderColor} ${textMain}`}
          />
        </div>

        <div className="mb-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {oracoesFiltradas.length > 0 ? (
              oracoesFiltradas.map((oracao) => (
                <li key={oracao.id}>
                  <Link href={`/oracoes/${oracao.id}`} className={`border p-5 rounded-[1.5rem] flex items-center justify-between hover:border-[#2F6BFF]/50 transition-all active:scale-95 group shadow-sm ${cardBg} ${borderColor}`}>
                    <span className={`font-extrabold group-hover:text-[#2F6BFF] transition-colors ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>
                      {oracao.titulo}
                    </span>
                    <span className={`material-symbols-rounded group-hover:text-[#2F6BFF] transition-transform group-hover:translate-x-1 rounded-full p-1.5 ${isDark ? 'bg-slate-800 text-slate-400' : isSepia ? 'bg-[#E8DEC1] text-[#8C7B65]' : 'bg-background text-muted'}`}>
                      chevron_right
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <div className={`col-span-full text-center py-10 ${textMuted}`}>
                <p className="italic">Nenhuma oração encontrada.</p>
              </div>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { getNovenaStatus } from "@/lib/date-utils";
import { NovenasData, NovenaCalendario } from "@/types/novena";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";

type Aba = 'agora' | 'breve' | 'fim';

export default function NovenasPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>('agora');
  const db = novenasJson as unknown as NovenasData;
  
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novenas_index_v2" });
    return () => clearTimeout(mountTimer);
  }, []);

  const novenasFiltradas = useMemo(() => {
    return db.calendario.filter((n: NovenaCalendario) => getNovenaStatus(n.inicio, n.fim) === abaAtiva);
  }, [abaAtiva, db.calendario]);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";
  const tabContainerBg = isDark ? "bg-slate-900/50" : isSepia ? "bg-[#E8DEC1]/50" : "bg-slate-200/50";

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-sm';

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link 
          href="/jornada"
          className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>Novenas</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner ${isDark ? 'bg-blue-900/20' : isSepia ? 'bg-[#E8DEC1]' : 'bg-[#2F6BFF]/10'}`}>
            <span className="material-symbols-rounded text-[32px]">event</span>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight mb-1 ${textMain}`}>Devoções</h2>
          <p className={`font-medium text-sm ${textMuted}`}>Acompanhe o Calendário Litúrgico.</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className={`${tabContainerBg} p-1.5 rounded-2xl inline-flex shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar border ${borderColor}`}>
            {(['agora', 'breve', 'fim'] as Aba[]).map((aba) => (
              <button 
                key={aba}
                onClick={() => setAbaAtiva(aba)} 
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  abaAtiva === aba ? `${cardBg} text-[#2F6BFF] shadow-sm` : `${textMuted} hover:brightness-95`
                }`}
              >
                {aba === 'agora' ? 'Agora' : aba === 'breve' ? 'Em Breve' : 'Encerradas'}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex flex-col gap-4">
          {novenasFiltradas.length === 0 && (
            <div className="text-center py-12 text-muted font-medium">
              <span className={`material-symbols-rounded text-5xl mb-2 opacity-50 ${textMuted}`}>calendar_today</span>
              <p className={textMuted}>Nenhuma novena nesta categoria.</p>
            </div>
          )}
          
          {novenasFiltradas.map((n: NovenaCalendario) => {
            const temDetalhes = !!db.detalhes[n.id];
            return (
              <li key={n.id} className={`rounded-[1.5rem] p-5 shadow-soft border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md ${cardBg} ${borderColor}`}>
                <div>
                  <h3 className={`font-extrabold mb-1 ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{n.nome}</h3>
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${textMuted}`}>
                    <span className="material-symbols-rounded text-[16px]">date_range</span>
                    {n.inicio.replace('-', '/')} a {n.fim.replace('-', '/')}
                  </div>
                </div>
                
                {temDetalhes ? (
                  <Link 
                    href={`/novenas/${n.id}`} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2F6BFF]/10 text-[#2F6BFF] font-bold rounded-full hover:bg-[#2F6BFF]/20 transition-colors active:scale-95 whitespace-nowrap"
                  >
                    Abrir Novena
                    <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
                  </Link>
                ) : (
                  <div className={`flex items-center justify-center gap-2 px-5 py-2.5 border font-bold text-sm rounded-full whitespace-nowrap cursor-not-allowed ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-500' : 'bg-background border-border text-slate-400'}`}>
                    <span className="material-symbols-rounded text-[18px]">lock</span>
                    Em breve
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
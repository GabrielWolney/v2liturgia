"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { getNovenaStatus } from "@/lib/date-utils";
import { NovenasData, NovenaCalendario } from "@/types/novena";
import { trackEvent } from "@/lib/analytics";

type Aba = 'agora' | 'breve' | 'fim';

export default function NovenasPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>('agora');
  const db = novenasJson as unknown as NovenasData;

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novenas_index_v2" });
    return () => clearTimeout(mountTimer);
  }, []);

  const novenasFiltradas = useMemo(() => {
    return db.calendario.filter((n: NovenaCalendario) => getNovenaStatus(n.inicio, n.fim) === abaAtiva);
  }, [abaAtiva, db.calendario]);

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* HEADER NAVEGAÇÃO FIXA (Voltando para a Jornada) */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/jornada"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Novenas</h1>
        <div className="w-10 h-10"></div> {/* Espaçador */}
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* TÍTULO */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#2F6BFF]/10 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">event</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-1">
            Devoções
          </h2>
          <p className="text-[#6B6B6B] font-medium text-sm">
            Acompanhe o Calendário Litúrgico.
          </p>
        </div>

        {/* ABAS (Segmented Control Estilo iOS) */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setAbaAtiva('agora')} 
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                abaAtiva === 'agora' ? 'bg-white text-[#2F6BFF] shadow-sm' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
              }`}
            >
              Acontecendo
            </button>
            <button 
              onClick={() => setAbaAtiva('breve')} 
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                abaAtiva === 'breve' ? 'bg-white text-[#2F6BFF] shadow-sm' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
              }`}
            >
              Em Breve
            </button>
            <button 
              onClick={() => setAbaAtiva('fim')} 
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                abaAtiva === 'fim' ? 'bg-white text-[#2F6BFF] shadow-sm' : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
              }`}
            >
              Encerradas
            </button>
          </div>
        </div>

        {/* LISTA DE NOVENAS */}
        <ul className="flex flex-col gap-4">
          {novenasFiltradas.length === 0 && (
            <div className="text-center py-12 text-[#6B6B6B] font-medium">
              <span className="material-symbols-rounded text-5xl mb-2 opacity-50">calendar_today</span>
              <p>Nenhuma novena nesta categoria.</p>
            </div>
          )}
          
          {novenasFiltradas.map((n: NovenaCalendario) => {
            const temDetalhes = !!db.detalhes[n.id];
            
            return (
              <li key={n.id} className="bg-white rounded-[1.5rem] p-5 shadow-soft border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                <div>
                  <h3 className="font-extrabold text-lg text-[#1F1F1F] mb-1">{n.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B6B6B] uppercase tracking-widest">
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
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-400 font-bold text-sm rounded-full whitespace-nowrap cursor-not-allowed">
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
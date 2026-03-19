"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { getNovenaStatus } from "@/lib/date-utils";
import { NovenasData, NovenaCalendario } from "@/types/novena";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";

type Aba = 'agora' | 'breve' | 'fim';

const formatarDataBR = (dataString: string) => {
  if (!dataString) return "";
  
  
  const partes = dataString.replace(/\//g, '-').split('-');
  
  
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}`;
  }
  
  
  if (partes.length === 2) {
    
    return `${partes[1]}/${partes[0]}`;
  }
  
  return dataString; 
};

export default function NovenasPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<Aba>('agora');
  const db = novenasJson as NovenasData;
  
  const { tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novenas_index_v2" });
    return () => clearTimeout(mountTimer);
  }, []);

  const novenasFiltradas = useMemo(() => {
    return db.calendario.filter((n: NovenaCalendario) => getNovenaStatus(n.inicio, n.fim) === abaAtiva);
  }, [abaAtiva, db.calendario]);

  const fontClass =  tamanhoFonte === 'grande' ? 'text-lg' : 'text-sm';

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link 
          href="/jornada"
          className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight text-foreground ${ tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>Novenas</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-primary mb-4 shadow-inner bg-primary/10">
            <span className="material-symbols-rounded text-[32px]">event</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">Devoções</h2>
          <p className="font-medium text-sm text-muted">Acompanhe o Calendário Litúrgico.</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-muted/10 p-1.5 rounded-2xl inline-flex shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar border border-border">
            {(['agora', 'breve', 'fim'] as Aba[]).map((aba) => (
              <button 
                key={aba}
                onClick={() => setAbaAtiva(aba)} 
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  abaAtiva === aba ? `bg-card text-primary shadow-sm` : `text-muted hover:text-foreground`
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
              <span className="material-symbols-rounded text-5xl mb-2 opacity-50 text-muted">calendar_today</span>
              <p className="text-muted">Nenhuma novena nesta categoria.</p>
            </div>
          )}
          
          {novenasFiltradas.map((n: NovenaCalendario) => {
            const temDetalhes = !!db.detalhes[n.id];
            return (
              <li key={n.id} className="rounded-[1.5rem] p-5 shadow-soft border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md bg-card border-border">
                <div>
                  <h3 className={`font-extrabold mb-1 text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{n.nome}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted">
                    <span className="material-symbols-rounded text-[16px]">date_range</span>
                    {/* UTILIZANDO A NOVA FUNÇÃO DE FORMATAÇÃO DE DATA */}
                    {formatarDataBR(n.inicio)} a {formatarDataBR(n.fim)}
                  </div>
                </div>
                
                {temDetalhes ? (
                  <Link 
                    href={`/novenas/${n.id}`} 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors active:scale-95 whitespace-nowrap"
                  >
                    Abrir Novena
                    <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-5 py-2.5 border font-bold text-sm rounded-full whitespace-nowrap cursor-not-allowed bg-muted/10 border-border text-muted">
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
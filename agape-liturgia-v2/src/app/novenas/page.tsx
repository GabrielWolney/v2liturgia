"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { getNovenaStatus } from "@/lib/date-utils";
import { NovenasData, NovenaCalendario } from "@/types/novena";

type Aba = 'agora' | 'breve' | 'fim';

export default function NovenasPage() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('agora');
  const db = novenasJson as unknown as NovenasData;

  const novenasFiltradas = useMemo(() => {
    return db.calendario.filter((n: NovenaCalendario) => getNovenaStatus(n.inicio, n.fim) === abaAtiva);
  }, [abaAtiva, db.calendario]);

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER DA PÁGINA */}
      <header className="mb-10 text-center flex flex-col items-center">
        <Link href="/oracoes" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 mb-6 transition-colors self-start bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm active:scale-95">
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
          <span className="text-sm font-bold">Voltar a Orações</span>
        </Link>
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">event</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Novenas e Devoções
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Acompanhe o Calendário Litúrgico
        </p>
      </header>

      {/* ABAS (Segmented Control Estilo iOS) */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setAbaAtiva('agora')} 
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
              abaAtiva === 'agora' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Acontecendo
          </button>
          <button 
            onClick={() => setAbaAtiva('breve')} 
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
              abaAtiva === 'breve' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Em Breve
          </button>
          <button 
            onClick={() => setAbaAtiva('fim')} 
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
              abaAtiva === 'fim' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Encerradas
          </button>
        </div>
      </div>

      {/* LISTA DE NOVENAS */}
      <ul className="flex flex-col gap-4">
        {novenasFiltradas.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium">
            <span className="material-symbols-rounded text-5xl mb-2 opacity-50">calendar_today</span>
            <p>Nenhuma novena nesta categoria.</p>
          </div>
        )}
        
        {novenasFiltradas.map((n: NovenaCalendario) => {
          const temDetalhes = !!db.detalhes[n.id];
          
          return (
            <li key={n.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{n.nome}</h3>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span className="material-symbols-rounded text-[18px]">date_range</span>
                  {n.inicio.replace('-', '/')} a {n.fim.replace('-', '/')}
                </div>
              </div>
              
              {temDetalhes ? (
                <Link 
                  href={`/novenas/${n.id}`} 
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-100 transition-colors active:scale-95 whitespace-nowrap"
                >
                  Abrir Novena
                  <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-400 font-bold text-sm rounded-full whitespace-nowrap cursor-not-allowed">
                  <span className="material-symbols-rounded text-[18px]">lock</span>
                  Em breve
                </div>
              )}
            </li>
          );
        })}
      </ul>

    </div>
  );
}
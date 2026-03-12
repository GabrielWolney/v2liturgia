"use client";

import { useState, use } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { useUserStore } from "@/store/useUserStore";
import { NovenasData, NovenaDia } from "@/types/novena";

export default function NovenaLeituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const db = novenasJson as unknown as NovenasData;
  const novena = db.detalhes[slug];

  const { novenasProgresso, toggleDiaNovena } = useUserStore();
  const progresso = novenasProgresso[slug] || [];
  
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  if (!novena) return <div className="p-8 text-center text-slate-500 mt-20">Novena não encontrada.</div>;

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* BOTÃO VOLTAR */}
      <Link href="/novenas" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 mb-8 transition-colors self-start bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm active:scale-95">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        <span className="text-sm font-bold">Voltar ao Calendário</span>
      </Link>
      
      {/* CABEÇALHO E INTRODUÇÃO DA NOVENA */}
      <header className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">church</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-6">
          {novena.titulo}
        </h1>
        <div 
          className="bg-white p-6 md:p-8 rounded-[2rem] shadow-soft border border-slate-100 text-slate-600 leading-relaxed text-left text-sm md:text-base font-serif"
          dangerouslySetInnerHTML={{ __html: novena.intro }} 
        />
      </header>

      {/* SELETOR DE DIAS (A JORNADA) */}
      <div className="mb-10">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-rounded text-blue-600">route</span>
          A Sua Jornada
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 md:gap-3">
          {novena.dias.map((d: NovenaDia, index: number) => {
            const isDone = progresso.includes(index);
            const isSelected = diaSelecionado === index;
            
            return (
              <button 
                key={index} 
                onClick={() => setDiaSelecionado(index)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl font-bold transition-all active:scale-90 relative ${
                  isSelected 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border-2 border-blue-600" 
                    : isDone 
                      ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200" 
                      : "bg-white text-slate-600 border-2 border-slate-100 hover:border-blue-300"
                }`}
              >
                <span className="text-xs uppercase tracking-widest opacity-80 mb-0.5">Dia</span>
                <span className="text-lg leading-none">{index + 1}</span>
                {isDone && (
                  <span className="material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 bg-white rounded-full text-lg shadow-sm">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA DE LEITURA DO DIA SELECIONADO */}
      {diaSelecionado !== null ? (
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-soft border border-slate-100 animate-fade-in relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-serif">Leitura do Dia</h2>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mt-1">{diaSelecionado + 1}º Dia</p>
            </div>
            
            <button 
              onClick={() => toggleDiaNovena(slug, diaSelecionado)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${
                progresso.includes(diaSelecionado) 
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                  : "bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
              }`}
            >
              <span className="material-symbols-rounded text-[20px]">
                {progresso.includes(diaSelecionado) ? "check_circle" : "task_alt"}
              </span>
              {progresso.includes(diaSelecionado) ? "Dia Concluído" : "Marcar como Concluído"}
            </button>
          </div>
          
          <div className="space-y-10 font-serif text-lg leading-[1.85] text-slate-800">
            
            <section>
              <h4 className="font-sans text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Oração Inicial (Todos os dias)</h4>
              <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoInicial }} />
            </section>
            
            <div className="flex justify-center my-8">
              <span className="w-12 h-1 bg-slate-200 rounded-full"></span>
            </div>
            
            <section className="bg-blue-50/50 p-6 md:p-8 rounded-3xl border border-blue-100/50">
              <h4 className="font-sans text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Meditação Específica do {diaSelecionado + 1}º Dia</h4>
              <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.dias[diaSelecionado].texto }} />
            </section>
            
            <div className="flex justify-center my-8">
              <span className="w-12 h-1 bg-slate-200 rounded-full"></span>
            </div>
            
            <section>
              <h4 className="font-sans text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">Oração Final (Todos os dias)</h4>
              <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoFinal }} />
            </section>

          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
          <span className="material-symbols-rounded text-5xl mb-3 opacity-50">touch_app</span>
          <p>Selecione um dia na grelha acima<br/>para começar a sua oração.</p>
        </div>
      )}
      
    </div>
  );
}
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { useUserStore } from "@/store/useUserStore";
import { NovenasData, NovenaDia } from "@/types/novena";
import { trackEvent } from "@/lib/analytics";

export default function NovenaLeituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [isMounted, setIsMounted] = useState(false);
  
  const db = novenasJson as unknown as NovenasData;
  const novena = db.detalhes[slug];

  const { novenasProgresso, toggleDiaNovena } = useUserStore();
  const progresso = novenasProgresso[slug] || [];
  
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novena_detalhe", slug });
    return () => clearTimeout(mountTimer);
  }, [slug]);

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;
  if (!novena) return <div className="min-h-[100dvh] bg-[#F5F7FA] p-8 text-center text-[#6B6B6B] mt-20 font-bold">Novena não encontrada.</div>;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* HEADER NAVEGAÇÃO FIXA (Voltando para a Lista de Novenas) */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/novenas"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight truncate max-w-[200px] sm:max-w-[400px]">
          {novena.titulo}
        </h1>
        <div className="w-10 h-10"></div> {/* Espaçador */}
      </header>
      
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* INTRODUÇÃO DA NOVENA */}
        <header className="mb-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[#2F6BFF]/10 rounded-[1.5rem] flex items-center justify-center text-[#2F6BFF] mb-5 shadow-inner">
            <span className="material-symbols-rounded text-[40px]">church</span>
          </div>
          <div 
            className="bg-white p-6 md:p-8 rounded-[2rem] shadow-soft border border-slate-100 text-[#6B6B6B] leading-relaxed text-left text-sm md:text-base font-serif"
            dangerouslySetInnerHTML={{ __html: novena.intro }} 
          />
        </header>

        {/* SELETOR DE DIAS (A JORNADA) */}
        <div className="mb-10">
          <h3 className="font-bold text-sm text-[#6B6B6B] uppercase tracking-widest mb-4 pl-2">A Sua Jornada</h3>
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
                      ? "bg-[#2F6BFF] text-white shadow-[0_4px_0_#1E4BCC] translate-y-[-2px] border-2 border-[#2F6BFF]" 
                      : isDone 
                        ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200" 
                        : "bg-white text-[#6B6B6B] border-2 border-slate-100 hover:border-[#2F6BFF]/50 hover:bg-[#2F6BFF]/5"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">Dia</span>
                  <span className="text-xl leading-none font-black">{index + 1}</span>
                  {isDone && (
                    <span className="material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 bg-white rounded-full text-lg shadow-sm border border-emerald-100">
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
          <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-soft border border-slate-100 animate-fade-in relative overflow-hidden">
            
            {/* CABEÇALHO DO DIA ATIVO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1F1F1F] font-serif">Leitura do Dia</h2>
                <p className="text-[#2F6BFF] font-bold uppercase tracking-widest text-sm mt-1">{diaSelecionado + 1}º Dia</p>
              </div>
              
              <button 
                onClick={() => {
                  toggleDiaNovena(slug, diaSelecionado);
                  trackEvent("novena_dia_concluido", { slug, dia: diaSelecionado + 1 });
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${
                  progresso.includes(diaSelecionado) 
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                    : "bg-[#2F6BFF] text-white shadow-md shadow-[#2F6BFF]/20 hover:brightness-105"
                }`}
              >
                <span className="material-symbols-rounded text-[20px]">
                  {progresso.includes(diaSelecionado) ? "check_circle" : "task_alt"}
                </span>
                {progresso.includes(diaSelecionado) ? "Dia Concluído" : "Marcar como Concluído"}
              </button>
            </div>
            
            <div className="space-y-10 font-serif text-lg leading-[1.9] text-[#1F1F1F]">
              
              <section>
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Oração Inicial (Todos os dias)</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoInicial }} />
              </section>
              
              <div className="flex justify-center my-8">
                <span className="w-12 h-1 bg-slate-200 rounded-full"></span>
              </div>
              
              <section className="bg-[#F5F7FA] p-6 md:p-8 rounded-[1.5rem] border border-slate-200">
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Meditação do {diaSelecionado + 1}º Dia</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.dias[diaSelecionado].texto }} />
              </section>
              
              <div className="flex justify-center my-8">
                <span className="w-12 h-1 bg-slate-200 rounded-full"></span>
              </div>
              
              <section>
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Oração Final (Todos os dias)</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoFinal }} />
              </section>

            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-[#6B6B6B] font-medium flex flex-col items-center justify-center">
            <span className="material-symbols-rounded text-[48px] mb-3 opacity-30">touch_app</span>
            <p>Selecione um dia na grelha acima<br/>para começar a sua oração.</p>
          </div>
        )}
        
      </main>
    </div>
  );
}
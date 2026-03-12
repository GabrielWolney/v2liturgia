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

  const { novenasProgresso, toggleDiaNovena, modoVisual, tamanhoFonte } = useUserStore();
  const progresso = novenasProgresso[slug] || [];
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  useEffect(() => { 
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novena_detail", slug });
    return () => clearTimeout(mountTimer);
  }, [slug]);

  if (!isMounted || !novena) return <div className="min-h-[100dvh] bg-background" />;

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
  
  const fontReading = tamanhoFonte === 'grande' ? 'text-xl leading-[2.2]' : 'text-base leading-[1.8]';

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link href="/novenas" className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight truncate max-w-[200px] sm:max-w-[400px] ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>
          {novena.titulo}
        </h1>
        <div className="w-10 h-10"></div>
      </header>
      
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="mb-10">
          <h3 className={`font-bold text-sm uppercase tracking-widest mb-4 pl-2 ${textMuted}`}>A Sua Jornada</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 md:gap-3">
            {novena.dias.map((d: NovenaDia, index: number) => {
              const isDone = progresso.includes(index);
              const isSelected = diaSelecionado === index;
              
              return (
                <button 
                  key={index} onClick={() => setDiaSelecionado(index)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl font-bold transition-all active:scale-90 relative border-2 ${
                    isSelected 
                      ? "bg-[#2F6BFF] text-white shadow-[0_4px_0_#1E4BCC] translate-y-[-2px] border-[#2F6BFF]" 
                      : isDone 
                        ? isDark ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50" : "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" 
                        : `${cardBg} ${textMuted} ${borderColor} hover:border-[#2F6BFF]/50`
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">Dia</span>
                  <span className="text-lg leading-none font-black">{index + 1}</span>
                  {isDone && <span className={`material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 rounded-full text-base shadow-sm ${cardBg}`}>check_circle</span>}
                </button>
              );
            })}
          </div>
        </div>

        {diaSelecionado !== null && (
          <div className={`rounded-[2rem] p-6 sm:p-10 shadow-soft border animate-fade-in relative transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b ${borderColor}`}>
              <div>
                <h2 className={`text-2xl font-extrabold font-serif ${textMain}`}>Leitura do Dia</h2>
                <p className="text-[#2F6BFF] font-bold uppercase tracking-widest text-sm mt-1">{diaSelecionado + 1}º Dia</p>
              </div>
              
              <button onClick={() => toggleDiaNovena(slug, diaSelecionado)} className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${progresso.includes(diaSelecionado) ? "bg-emerald-500/20 text-emerald-600" : "bg-[#2F6BFF] text-white shadow-md shadow-[#2F6BFF]/20"}`}>
                <span className="material-symbols-rounded text-[20px]">{progresso.includes(diaSelecionado) ? "check_circle" : "task_alt"}</span>
                {progresso.includes(diaSelecionado) ? "Dia Concluído" : "Marcar como Concluído"}
              </button>
            </div>
            
            <div className={`space-y-10 font-serif ${fontReading} ${textMain}`}>
              <section>
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Oração Inicial</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoInicial }} />
              </section>
              
              <div className="flex justify-center my-8"><span className={`w-12 h-1 rounded-full ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]' : 'bg-slate-200'}`}></span></div>
              
              <section className={`p-6 md:p-8 rounded-[1.5rem] border transition-colors ${borderColor} ${isDark ? 'bg-slate-950/50' : isSepia ? 'bg-[#E8DEC1]/20' : 'bg-background'}`}>
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Meditação</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.dias[diaSelecionado].texto }} />
              </section>

              <div className="flex justify-center my-8"><span className={`w-12 h-1 rounded-full ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]' : 'bg-slate-200'}`}></span></div>
              
              <section>
                <h4 className="font-sans text-xs font-bold text-[#2F6BFF] uppercase tracking-widest mb-4">Oração Final</h4>
                <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoFinal }} />
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
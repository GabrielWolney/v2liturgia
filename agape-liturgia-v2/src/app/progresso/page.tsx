"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";
import { subscribeToContador } from "@/services/db-home";
import { getDataIso } from "@/lib/date-utils";

export default function ProgressoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [leiturasComunidade, setLeiturasComunidade] = useState(0);
  const [tercosComunidade, setTercosComunidade] = useState(0);
  
  const { modoVisual, tamanhoFonte, streak, leiturasConcluidas, tercosConcluidos } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "progresso_espiritual" });

    const dataHoje = getDataIso();
    
    // Ouve em tempo real as duas estatísticas da comunidade
    const unsubLeituras = subscribeToContador(dataHoje, 'leitura', setLeiturasComunidade);
    const unsubTercos = subscribeToContador(dataHoje, 'terco', setTercosComunidade);

    return () => {
      clearTimeout(timer);
      unsubLeituras();
      unsubTercos();
    };
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- ESTATÍSTICAS PESSOAIS NESTE MÊS ---
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  const leiturasEsteMes = Object.keys(leiturasConcluidas).filter(dataIso => {
    const [ano, mes] = dataIso.split('-').map(Number);
    return ano === anoAtual && mes === mesAtual;
  }).length;

  const tercosEsteMes = Object.keys(tercosConcluidos).filter(dataIso => {
    const [ano, mes] = dataIso.split('-').map(Number);
    return ano === anoAtual && mes === mesAtual;
  }).length;

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

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <button onClick={() => router.back()} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${fontClass}`}>Meu Progresso</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* O FOGUINHO (OFENSIVA) */}
        <section className={`flex flex-col items-center justify-center p-8 rounded-[2rem] shadow-soft border mb-6 transition-colors duration-300 ${cardBg} ${borderColor}`}>
          <div className={`relative flex items-center justify-center w-24 h-24 rounded-full mb-4 ${streak > 0 ? 'bg-orange-500/10' : 'bg-slate-500/10 grayscale opacity-50'}`}>
            <span className={`material-symbols-rounded text-[56px] ${streak > 0 ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'text-slate-400'}`}>
              local_fire_department
            </span>
          </div>
          <h2 className={`font-black text-4xl mb-1 ${textMain}`}>{streak} {streak === 1 ? 'dia' : 'dias'}</h2>
          <p className={`font-bold uppercase tracking-widest text-xs ${textMuted}`}>De Ofensiva Espiritual</p>
          
          {streak === 0 && (
            <p className={`mt-4 text-center text-sm font-medium ${textMuted}`}>
              Leia a Palavra ou reze o Terço hoje para acender a sua chama!
            </p>
          )}
        </section>

        {/* ESTATÍSTICAS PESSOAIS */}
        <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 pl-2 mt-8 ${textMuted}`}>Neste Mês</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-[1.5rem] shadow-sm border flex flex-col transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <span className="material-symbols-rounded text-[#2F6BFF] mb-2 text-[28px]">menu_book</span>
            <span className={`font-black text-3xl mb-1 ${textMain}`}>{leiturasEsteMes}</span>
            <span className={`text-xs font-bold leading-tight ${textMuted}`}>Liturgias<br/>Lidas</span>
          </div>
          
          <div className={`p-5 rounded-[1.5rem] shadow-sm border flex flex-col transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <span className="material-symbols-rounded text-[#6E3AA5] mb-2 text-[28px]">cruelty_free</span>
            <span className={`font-black text-3xl mb-1 ${textMain}`}>{tercosEsteMes}</span>
            <span className={`text-xs font-bold leading-tight ${textMuted}`}>Terços<br/>Rezados</span>
          </div>
        </div>

        {/* ESTATÍSTICAS DA COMUNIDADE */}
        <h3 className={`font-bold text-sm uppercase tracking-widest mb-3 pl-2 mt-8 ${textMuted}`}>O Ágape de jovens hoje</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`p-5 rounded-[1.5rem] shadow-sm border flex flex-col justify-between transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ao vivo</span>
            </div>
            <span className={`font-black text-3xl mb-1 text-[#2F6BFF]`}>{leiturasComunidade}</span>
            <span className={`text-xs font-bold leading-tight ${textMuted}`}>Fizeram a<br/>Leitura</span>
          </div>
          
          <div className={`p-5 rounded-[1.5rem] shadow-sm border flex flex-col justify-between transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ao vivo</span>
            </div>
            <span className={`font-black text-3xl mb-1 text-[#6E3AA5]`}>{tercosComunidade}</span>
            <span className={`text-xs font-bold leading-tight ${textMuted}`}>Rezaram o<br/>Terço</span>
          </div>
        </div>

      </main>
    </div>
  );
}
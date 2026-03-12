"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { eventos2026 } from "@/data/eventos-2026";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function CalendarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mesAtivo, setMesAtivo] = useState(1);
  
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      setMesAtivo(new Date().getMonth() + 1);
    }, 0);
    trackEvent("page_view", { page_name: "calendario_v2" });
    return () => clearTimeout(mountTimer);
  }, []);

  const eventosFormatados = useMemo(() => {
    const lista = [];
    for (const [chave, dados] of Object.entries(eventos2026)) {
      const [diaStr, mesStr] = chave.split('-');
      lista.push({ dia: parseInt(diaStr), mes: parseInt(mesStr), ...dados });
    }
    return lista.sort((a, b) => a.dia - b.dia);
  }, []);

  const eventosDoMes = eventosFormatados.filter(e => e.mes === mesAtivo);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";
  
  const fontClass = tamanhoFonte === 'grande' ? 'text-readable' : 'text-base';

  const getBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'formacao': case 'reuniao': 
        return isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-blue-100 text-blue-700';
      case 'oracao': case 'retiro': case 'vivencia': 
        return isDark ? 'bg-purple-900/30 text-purple-400 border border-purple-800/50' : 'bg-purple-100 text-purple-700';
      case 'missa': case 'solenidade': 
        return isDark ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' : 'bg-amber-100 text-amber-700';
      case 'festivo': case 'social': 
        return isDark ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-100 text-emerald-700';
      default: 
        return isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-200 text-slate-700';
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link 
          href="/jornada"
          className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${fontClass}`}>Agenda</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner ${isDark ? 'bg-blue-900/20' : isSepia ? 'bg-[#E8DEC1]' : 'bg-[#2F6BFF]/10'}`}>
            <span className="material-symbols-rounded text-[32px]">calendar_month</span>
          </div>
          <h2 className={`text-3xl font-extrabold tracking-tight mb-1 ${textMain}`}>Calendário</h2>
          <p className={`font-medium text-sm ${textMuted}`}>Eventos e encontros pastorais.</p>
        </div>

        {/* CARROSSEL DE MESES */}
        <div className="mb-10 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2">
            {mesesNomes.map((nome, index) => {
              const numMes = index + 1;
              const isSelected = mesAtivo === numMes;
              return (
                <button 
                  key={numMes} 
                  onClick={() => setMesAtivo(numMes)}
                  className={`px-5 py-3 rounded-[1rem] font-extrabold text-sm whitespace-nowrap transition-all active:scale-95 ${
                    isSelected 
                      ? isDark ? "bg-[#2F6BFF] text-white shadow-md" : "bg-[#1F1F1F] text-white shadow-md"
                      : `${cardBg} ${textMuted} border ${borderColor} hover:brightness-95`
                  }`}
                >
                  {nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIMELINE */}
        <section className={`rounded-[2rem] p-6 shadow-soft border transition-colors duration-300 ${cardBg} ${borderColor}`}>
          {eventosDoMes.length === 0 ? (
            <div className={`text-center py-8 font-medium ${textMuted}`}>Nenhum evento agendado.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {eventosDoMes.map((evento, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center min-w-[40px] shrink-0 pt-1">
                    <span className="text-2xl font-black text-[#2F6BFF] leading-none">
                      {String(evento.dia).padStart(2, '0')}
                    </span>
                  </div>
                  <div className={`flex-1 pb-6 border-b group-last:border-0 group-last:pb-0 ${borderColor}`}>
                    <h3 className={`font-extrabold leading-tight mb-2 ${textMain} ${fontClass}`}>
                      {evento.titulo}
                    </h3>
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${getBadgeStyle(evento.tipo)}`}>
                      {evento.tipo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
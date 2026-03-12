"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { eventos2026 } from "@/data/eventos-2026";
import { trackEvent } from "@/lib/analytics";

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const getBadgeStyle = (tipo: string) => {
  switch (tipo) {
    case 'formacao': case 'reuniao': return 'bg-blue-100 text-blue-700';
    case 'oracao': case 'retiro': case 'vivencia': return 'bg-purple-100 text-purple-700';
    case 'missa': case 'solenidade': return 'bg-amber-100 text-amber-700';
    case 'festivo': case 'social': return 'bg-emerald-100 text-emerald-700';
    default: return 'bg-slate-200 text-slate-700';
  }
};

export default function CalendarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mesAtivo, setMesAtivo] = useState(1);

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

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/jornada"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Agenda</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#2F6BFF]/10 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">calendar_month</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-1">Calendário</h2>
          <p className="text-[#6B6B6B] font-medium text-sm">Eventos e encontros pastorais.</p>
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
                      ? "bg-[#1F1F1F] text-white shadow-md" 
                      : "bg-white text-[#6B6B6B] border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* TIMELINE */}
        <section className="bg-white rounded-[2rem] p-6 shadow-soft border border-slate-100">
          {eventosDoMes.length === 0 ? (
            <div className="text-center py-8 text-[#6B6B6B] font-medium">Nenhum evento agendado.</div>
          ) : (
            <div className="flex flex-col gap-6">
              {eventosDoMes.map((evento, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="flex flex-col items-center min-w-[40px] shrink-0 pt-1">
                    <span className="text-2xl font-black text-[#2F6BFF] leading-none">
                      {String(evento.dia).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 pb-6 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                    <h3 className="text-lg font-extrabold text-[#1F1F1F] leading-tight mb-2">
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
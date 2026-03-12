"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { eventos2026 } from "@/data/eventos-2026";
import { trackEvent } from "@/lib/analytics";

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Função para dar cores diferentes aos crachás (badges) dependendo do tipo de evento
const getBadgeStyle = (tipo: string) => {
  switch (tipo) {
    case 'formacao': case 'reuniao': 
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'oracao': case 'retiro': case 'vivencia': case 'dinamica': 
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'missa': case 'solenidade': case 'liturgia': 
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'festivo': case 'social': case 'acao': 
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'feriado': 
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default: 
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export default function CalendarioPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [mesAtivo, setMesAtivo] = useState(1);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      // Só define o mês atual depois de montar no cliente para evitar erros de fuso horário
      setMesAtivo(new Date().getMonth() + 1);
    }, 0);
    
    trackEvent("page_view", { page_name: "calendario" });
    return () => clearTimeout(mountTimer);
  }, []);

  const eventosFormatados = useMemo(() => {
    const lista: Array<{ dia: number; mes: number; titulo: string; tipo: string }> = [];
    for (const [chave, dados] of Object.entries(eventos2026)) {
      const [diaStr, mesStr] = chave.split('-');
      lista.push({ dia: parseInt(diaStr), mes: parseInt(mesStr), ...dados });
    }
    return lista.sort((a, b) => a.dia - b.dia);
  }, []);

  const eventosDoMes = eventosFormatados.filter(e => e.mes === mesAtivo);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center text-blue-500">
          <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER */}
      <header className="mb-8 text-center flex flex-col items-center">
        <Link href="/menu" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 mb-6 transition-colors self-start bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm active:scale-95">
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
          <span className="text-sm font-bold">Voltar ao Menu</span>
        </Link>
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">calendar_month</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Calendário Pastoral
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Agenda Ágape 2026
        </p>
      </header>

      {/* CARROSSEL DE MESES */}
      <div className="mb-10 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {mesesNomes.map((nome, index) => {
            const numMes = index + 1;
            const isSelected = mesAtivo === numMes;
            return (
              <button 
                key={numMes} 
                onClick={() => setMesAtivo(numMes)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all active:scale-95 border-2 ${
                  isSelected 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20" 
                    : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                {nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* LINHA DO TEMPO (TIMELINE) DE EVENTOS */}
      <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-soft border border-slate-100">
        <h2 className="font-bold text-xl text-slate-900 mb-8 flex items-center gap-2">
          <span className="material-symbols-rounded text-blue-600">event_note</span>
          Eventos de {mesesNomes[mesAtivo - 1]}
        </h2>

        {eventosDoMes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-3xl">
            <span className="material-symbols-rounded text-4xl mb-2 opacity-50">free_cancellation</span>
            <p>Nenhum evento agendado para este mês.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {eventosDoMes.map((evento, i) => (
              <div key={i} className="flex gap-5 items-start group">
                
                {/* DATA (Bloco à esquerda) */}
                <div className="flex flex-col items-center min-w-[50px] shrink-0">
                  <span className="text-2xl font-extrabold text-blue-600 leading-none">
                    {String(evento.dia).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {mesesNomes[mesAtivo - 1].substring(0, 3)}
                  </span>
                </div>

                {/* LINHA VERTICAL E CONTEÚDO */}
                <div className="flex-1 pb-6 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {evento.titulo}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getBadgeStyle(evento.tipo)}`}>
                    {evento.tipo}
                  </span>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
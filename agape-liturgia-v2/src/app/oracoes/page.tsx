"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { obterMisterioDoDia } from "@/lib/date-utils";
import { trackEvent } from "@/lib/analytics";

export default function OracoesPage() {
  // ESCUDO ANTI-HIDRATAÇÃO (Crucial porque o dia da semana muda de dispositivo para dispositivo)
  const [isMounted, setIsMounted] = useState(false);
  const listaOracoes = Object.values(dbOracoes);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "oracoes_index" });
    return () => clearTimeout(mountTimer);
  }, []);

  // TELA DE CARREGAMENTO
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center text-blue-500">
          <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  const misterioHoje = obterMisterioDoDia(); 

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER */}
      <header className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">self_improvement</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Devocionário
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          A sua vida de oração diária
        </p>
      </header>

      {/* SANTO TERÇO (DESTAQUE PREMIUM) */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 sm:p-10 shadow-lg shadow-blue-900/20 mb-12 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-6 text-white/10 pointer-events-none">
          <span className="material-symbols-rounded text-[160px]">cruelty_free</span>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <span className="material-symbols-rounded text-lg">calendar_today</span>
            <span className="text-xs font-bold uppercase tracking-widest">Santo Terço de Hoje</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif mb-3 leading-tight">
            Mistérios {misterioHoje.tipo}
          </h2>
          <p className="text-blue-100 font-medium flex items-center gap-2">
            Foco da meditação: <em className="text-white font-bold not-italic bg-white/20 px-3 py-1 rounded-lg">{misterioHoje.foco}</em>
          </p>
        </div>
      </section>

      {/* LISTA DE ORAÇÕES */}
      <div className="mb-12">
        <h3 className="font-bold text-lg text-slate-900 mb-5 px-2 flex items-center gap-2">
          <span className="material-symbols-rounded text-blue-600">menu_book</span>
          Orações Comuns
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {listaOracoes.map((oracao) => (
            <li key={oracao.id}>
              <Link 
                href={`/oracoes/${oracao.id}`} 
                className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all active:scale-95 group shadow-sm"
              >
                <span className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                  {oracao.titulo}
                </span>
                <span className="material-symbols-rounded text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1">
                  chevron_right
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* BANNER PARA AS NOVENAS */}
      <Link 
        href="/novenas" 
        className="bg-slate-900 text-white rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-lg hover:bg-slate-800 transition-colors active:scale-95 group"
      >
        <div>
          <h3 className="text-xl font-bold mb-1">Novenas e Devoções</h3>
          <p className="text-slate-400 text-sm font-medium">Aceder ao calendário litúrgico</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-rounded text-white">event</span>
        </div>
      </Link>

    </div>
  );
}
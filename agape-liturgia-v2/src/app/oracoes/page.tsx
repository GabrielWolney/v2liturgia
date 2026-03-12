"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { trackEvent } from "@/lib/analytics";

export default function OracoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const listaOracoes = Object.values(dbOracoes);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "oracoes_index" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* HEADER NAVEGAÇÃO FIXA (CORRIGIDO PARA VOLTAR SEMPRE À JORNADA) */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/jornada"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Devocionário</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-[#2F6BFF]/10 rounded-[1.5rem] flex items-center justify-center text-[#2F6BFF] mb-5 shadow-inner">
            <span className="material-symbols-rounded text-[40px]">self_improvement</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-2">Orações Comuns</h2>
          <p className="text-[#6B6B6B] font-medium text-sm">A sua base diária de diálogo com Deus.</p>
        </div>

        <div className="mb-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listaOracoes.map((oracao) => (
              <li key={oracao.id}>
                <Link 
                  href={`/oracoes/${oracao.id}`} 
                  className="bg-white border border-slate-100 p-5 rounded-[1.5rem] flex items-center justify-between hover:border-[#2F6BFF]/30 hover:shadow-md transition-all active:scale-95 group shadow-sm"
                >
                  <span className="font-extrabold text-[#1F1F1F] group-hover:text-[#2F6BFF] transition-colors">
                    {oracao.titulo}
                  </span>
                  <span className="material-symbols-rounded text-[#6B6B6B] group-hover:text-[#2F6BFF] transition-transform group-hover:translate-x-1 bg-[#F5F7FA] p-1.5 rounded-full">
                    chevron_right
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
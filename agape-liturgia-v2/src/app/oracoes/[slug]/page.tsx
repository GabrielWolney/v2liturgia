"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { notFound } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function OracaoLeituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isMounted, setIsMounted] = useState(false);
  const oracao = dbOracoes[slug];

  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(mountTimer);
  }, []);

  if (!oracao) return notFound();
  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

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
  
  const fontReading = tamanhoFonte === 'grande' ? 'text-xl leading-[2.2]' : 'text-lg leading-[1.8]';

  const htmlTexto = oracao.texto.replace(/\n/g, '<br />');

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30 transition-colors duration-300 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link 
          href="/oracoes"
          className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <span className={`font-extrabold text-xs uppercase tracking-widest ${textMuted}`}>
          Oração
        </span>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <span className={`material-symbols-rounded text-5xl mb-4 drop-shadow-sm ${isDark ? 'text-blue-500/40' : 'text-[#2F6BFF]/40'}`}>self_improvement</span>
          <h1 className={`text-3xl md:text-4xl font-extrabold font-serif tracking-tight mb-6 px-4 ${textMain}`}>
            {oracao.titulo}
          </h1>
          <div className="w-16 h-1.5 bg-[#2F6BFF] rounded-full"></div>
        </div>

        <article className={`p-8 md:p-12 rounded-[2rem] shadow-soft border transition-colors duration-300 ${cardBg} ${borderColor}`}>
          <div 
            className={`font-serif text-center whitespace-pre-wrap ${textMain} ${fontReading}`}
            dangerouslySetInnerHTML={{ __html: htmlTexto }}
          />
        </article>

        <div className={`mt-12 text-center flex justify-center opacity-30 ${textMuted}`}>
          <span className="material-symbols-rounded text-4xl">church</span>
        </div>

      </main>
    </div>
  );
}
"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia, Capitulo, Versiculo } from "@/types/biblia";
import { useUserStore } from "@/store/useUserStore";

const bibliaData = bibliaJson as unknown as BibliaData;

const normalizarLivro = (str: string) => {
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  s = s.replace(/\bsao\s+/g, ""); 
  s = s.replace(/^i\s+/, "1 "); s = s.replace(/^ii\s+/, "2 "); s = s.replace(/^iii\s+/, "3 ");
  s = s.replace(/^1a\s+/, "1 "); s = s.replace(/^2a\s+/, "2 "); s = s.replace(/^3a\s+/, "3 ");
  s = s.replace(/^primeira\s+/, "1 "); s = s.replace(/^segunda\s+/, "2 "); s = s.replace(/^terceira\s+/, "3 ");
  if (s === "cantico dos canticos") s = "canticos";
  return s.trim();
};

export default function LeituraCapituloPage({ params }: { params: Promise<{ livro: string, capitulo: string }> }) {
  const { livro: slug, capitulo: capString } = use(params);
  const numeroCapitulo = parseInt(capString);
  const [isMounted, setIsMounted] = useState(false);
  
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  
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

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className={`p-8 text-center mt-20 font-bold ${textMuted}`}>Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  const slugLimpo = normalizarLivro(slug.replace(/-/g, " "));
  const nomeLimpo = normalizarLivro(bookInfo.nome);

  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = normalizarLivro(l.nome);
    return nomeJson === slugLimpo || nomeJson === nomeLimpo || nomeJson.includes(slugLimpo) || nomeJson.includes(nomeLimpo);
  });

  if (!livroEncontrado) return <div className={`p-8 text-center mt-20 font-bold ${textMuted}`}>Erro de sincronização.</div>;

  const capituloData = livroEncontrado.capitulos.find((c: Capitulo) => c.capitulo === numeroCapitulo);
  if (!capituloData) return <div className={`p-8 text-center mt-20 font-bold ${textMuted}`}>Capítulo não encontrado.</div>;

  const totalCapitulos = livroEncontrado.capitulos.length;
  const hasPrev = numeroCapitulo > 1;
  const hasNext = numeroCapitulo < totalCapitulos;

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30 transition-colors duration-300 ${wrapperClass}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <Link href={`/biblia/${slug}`} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight ${textMain}`}>
          {bookInfo.nome} <span className="text-[#2F6BFF] ml-1">{numeroCapitulo}</span>
        </h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <article className={`p-6 md:p-10 rounded-[2rem] shadow-soft border font-serif text-left mb-10 transition-colors duration-300 ${cardBg} ${borderColor} ${textMain} ${fontReading}`}> 
          {capituloData.versiculos.map((v: Versiculo) => (
            <span key={v.versiculo} className="inline">
              <sup className="font-sans font-bold text-[#2F6BFF] text-[0.65em] align-super mr-1.5 ml-1 select-none">
                {v.versiculo}
              </sup>
              {v.texto}{" "}
            </span>
          ))}
        </article>

        <nav className="flex items-center justify-between gap-4">
          {hasPrev ? (
            <Link 
              href={`/biblia/${slug}/${numeroCapitulo - 1}`} 
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] border-2 font-bold text-sm shadow-sm transition-all active:scale-95 ${cardBg} ${borderColor} ${textMuted} hover:border-[#2F6BFF] hover:text-[#2F6BFF]`}
            >
              <span className="material-symbols-rounded">chevron_left</span> Anterior
            </Link>
          ) : <div className="flex-1" />}

          {hasNext ? (
            <Link 
              href={`/biblia/${slug}/${numeroCapitulo + 1}`} 
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] bg-[#2F6BFF] border-2 border-[#2F6BFF] text-white hover:brightness-105 font-bold text-sm shadow-[0_4px_0_#1E4BCC] active:shadow-none active:translate-y-1 transition-all"
            >
              Próximo <span className="material-symbols-rounded">chevron_right</span>
            </Link>
          ) : <div className="flex-1" />}
        </nav>
      </main>
    </div>
  );
}
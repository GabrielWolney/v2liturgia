"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

interface BibliaLivroClientProps {
  nomeLivro: string;
  slug: string;
  totalCapitulos: number;
}

export function BibliaLivroClient({ nomeLivro, slug, totalCapitulos }: BibliaLivroClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { modoVisual } = useUserStore();

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
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-card/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";

  const capitulos = Array.from({ length: totalCapitulos }, (_, i) => i + 1);

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 ${wrapperClass}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors ${headerBg} ${borderColor}`}>
        <Link href="/biblia" className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className={`font-extrabold text-readable tracking-tight ${textMain}`}>{nomeLivro}</h1>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{capitulos.length} Capítulos</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {capitulos.map((cap) => (
            <Link key={cap} href={`/biblia/${slug}/${cap}`} className={`aspect-square flex items-center justify-center rounded-2xl border-2 text-readable font-extrabold hover:bg-[#2F6BFF] hover:text-white hover:border-[#2F6BFF] shadow-sm hover:shadow-[0_4px_0_#1E4BCC] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none ${cardBg} ${borderColor} ${textMain}`}>
              {cap}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
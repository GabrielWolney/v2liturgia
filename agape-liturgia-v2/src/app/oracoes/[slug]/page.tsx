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
          <svg viewBox="0 0 682.67 682.67" xmlns="http://www.w3.org/2000/svg" className={`icone-oracao-custom w-12 h-12 mb-4 drop-shadow-sm ${isDark ? 'text-blue-500/40' : 'text-[#2F6BFF]/40'}`}>
            <g transform="matrix(1.33,0,0,-1.33,0,682.67)">
              <g>
                <path d="m 0,0 v 120 h -40 v 40 H 0 v 60 H 40 V 160 H 80 V 120 H 40 V 0 Z" transform="translate(58,282)"></path>
                <path d="m 0,0 -90.48,60.31 -56.19,-75.87 90,-60 86.65,115.54 c 2.19,2.92 3.54,6.38 3.9,10.01 l 16.17,161.63 c 0.21,2.05 0.2,4.07 0,6.03 -1.31,12.85 -10.87,23.48 -23.5,26.15 -2,0.42 -4.08,0.64 -6.21,0.64 -15.33,0 -28.17,-11.62 -29.7,-26.88 l -9.31,-93.12" transform="translate(247.67,85.56)"></path>
                <path d="M 0,0 -24.93,16.62" transform="translate(155.68,93.55)"></path>
                <path d="m 0,0 22.27,105.65 c 4.3,23.68 9.62,48.22 15.91,72.91" transform="translate(157.19,145.87)"></path>
                <path d="m 0,0 c 10.66,31.02 22.89,61.05 36.67,88.61 3.77,7.53 11.47,12.29 19.9,12.29 12.48,0 22.24,-10.17 22.24,-22.2 0,-1.21 -0.1,-2.45 -0.31,-3.7 L 56.01,-71.93" transform="translate(218.18,401.1)"></path>
                <path d="m 0,0 90.47,60.31 56.19,-75.87 -90,-60 -86.65,115.54 c -2.19,2.92 -3.54,6.38 -3.9,10.01 l -16.16,161.63 c -0.21,2.05 -0.2,4.07 0,6.03 1.31,12.85 10.86,23.48 23.49,26.15 2,0.42 4.08,0.64 6.21,0.64 15.34,0 28.18,-11.62 29.7,-26.88 L 18.66,124.44" transform="translate(347.77,85.56)"></path>
                <path d="m 0,0 24.55,16.37 h 0.01" transform="translate(440.13,93.8)"></path>
                <path d="m 0,0 -22.26,105.65 c -14.29,78.59 -39.68,166.74 -75.4,238.19 -3.77,7.53 -11.47,12.29 -19.89,12.29 -12.48,0 -22.25,-10.17 -22.25,-22.2 0,-1.22 0.1,-2.45 0.31,-3.7 L -117,183.3" transform="translate(438.24,145.87)"></path>
                <path d="m 0,0 c 5.52,0 10,-4.48 10,-10 0,-5.52 -4.48,-10 -10,-10 -5.52,0 -10,4.48 -10,10 0,5.52 4.48,10 10,10" transform="translate(206,373)"></path>
              </g>
            </g>
          </svg>
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
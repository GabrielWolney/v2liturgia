"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";
import { SantoDoDia } from "@/services/api-santo";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

interface SantoClientProps {
  santoData: SantoDoDia | null;
}

export function SantoClient({ santoData }: SantoClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { modoVisual, tamanhoFonte } = useUserStore();
  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  let baseFontSize = "text-base";
  let titleFontSize = "text-2xl";
  if (tamanhoFonte === "grande") {
    baseFontSize = "text-lg";
    titleFontSize = "text-3xl";
  }

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 bg-background text-foreground`}>
      <header className={`sticky top-0 z-40 px-5 py-4 flex items-center justify-between backdrop-blur-md transition-colors duration-300 bg-background/90 border-b border-border shadow-sm`}>
        <Link href="/" onClick={() => { playPop(); triggerHaptic('light'); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
          <span className="material-symbols-rounded">arrow_back</span>
        </Link>
        <h1 className="font-bold text-lg">Santo do Dia</h1>
        <div className="w-10" /> 
      </header>

      <main className="px-5 mt-6 max-w-[600px] mx-auto">
        {!santoData ? (
          <div className={`p-8 text-center rounded-[2rem] border bg-card border-border shadow-sm`}>
            <span className="material-symbols-rounded text-4xl mb-3 opacity-50">cloud_off</span>
            <p className="font-medium">Não foi possível carregar o Santo do Dia.</p>
          </div>
        ) : (
          <article className="animate-fade-in">
            {santoData.imagem && (
              <div className={`w-full h-72 sm:h-80 relative mb-8 rounded-[2rem] overflow-hidden shadow-xl border border-border`}>
                <Image 
                  src={santoData.imagem} 
                  alt={santoData.titulo} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  unoptimized 
                  className="transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            )}
            
            <h1 className={`font-black mb-2 leading-tight text-foreground ${titleFontSize}`}>
              {santoData.titulo}
            </h1>
            
            <div className="w-16 h-1.5 bg-primary rounded-full mb-8"></div>

            <div className={`space-y-6 ${baseFontSize} leading-relaxed font-serif`}>
              {santoData.historia.map((paragrafo, idx) => {
                if (paragrafo.startsWith("### ")) {
                  return <h3 key={idx} className="font-extrabold text-xl mt-8 mb-2 text-primary">{paragrafo.replace("### ", "")}</h3>;
                }
                return <p key={idx}>{paragrafo}</p>;
              })}
            </div>
            
            <div className="mt-12 pt-6 border-t opacity-50 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <span className="material-symbols-rounded text-[16px]">info</span>
              Fonte: {santoData.fonte}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}

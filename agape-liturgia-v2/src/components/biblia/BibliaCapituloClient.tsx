"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Versiculo } from "@/types/biblia";
import { useUserStore } from "@/store/useUserStore";

interface BibliaCapituloClientProps {
  nomeLivro: string;
  slug: string;
  numeroCapitulo: number;
  versiculos: Versiculo[];
  hasPrev: boolean;
  hasNext: boolean;
}

export function BibliaCapituloClient({ nomeLivro, slug, numeroCapitulo, versiculos, hasPrev, hasNext }: BibliaCapituloClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { tamanhoFonte } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const fontReading =  tamanhoFonte === 'grande' ? 'text-xl leading-[2.2]' : 'text-base leading-[1.8]';

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 selection:bg-primary/30 transition-colors duration-300 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href={`/biblia/${slug}`} className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold tracking-tight text-foreground">
          {nomeLivro} <span className="text-primary ml-1">{numeroCapitulo}</span>
        </h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <article className={`p-6 md:p-10 rounded-[2rem] shadow-soft border font-serif text-left mb-10 transition-colors duration-300 bg-card border-border text-foreground ${fontReading}`}> 
          {versiculos.map((v: Versiculo) => (
            <span key={v.versiculo} className="inline">
              <sup className="font-sans font-bold text-primary text-[0.65em] align-super mr-1.5 ml-1 select-none">
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
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] border-2 font-bold text-sm shadow-sm transition-all active:scale-95 bg-card border-border text-muted hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-rounded">chevron_left</span> Anterior
            </Link>
          ) : <div className="flex-1" />}

          {hasNext ? (
            <Link 
              href={`/biblia/${slug}/${numeroCapitulo + 1}`} 
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] bg-primary border-2 border-primary text-white hover:brightness-105 font-bold text-sm shadow-[0_4px_0_var(--primary-light)] active:shadow-none active:translate-y-1 transition-all"
            >
              Próximo <span className="material-symbols-rounded">chevron_right</span>
            </Link>
          ) : <div className="flex-1" />}
        </nav>
      </main>
    </div>
  );
}
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
  const { tamanhoFonte } = useUserStore();

  useEffect(() => { 
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const capitulos = Array.from({ length: totalCapitulos }, (_, i) => i + 1);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors bg-background/90 border-border">
        <Link href="/biblia" className="w-10 h-10 flex items-center justify-center rounded-full transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className={`font-extrabold text-foreground tracking-tight ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{nomeLivro}</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{capitulos.length} Capítulos</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>
      
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3">
          {capitulos.map((cap) => (
            <Link key={cap} href={`/biblia/${slug}/${cap}`} className="aspect-square flex items-center justify-center rounded-2xl border-2 font-extrabold hover:bg-primary hover:text-white hover:border-primary shadow-sm hover:shadow-[0_4px_0_var(--primary-light)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none bg-card border-border text-foreground">
              <span className={ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}>{cap}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
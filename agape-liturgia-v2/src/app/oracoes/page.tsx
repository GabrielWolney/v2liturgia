"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function OracoesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [busca, setBusca] = useState("");
  const { tamanhoFonte } = useUserStore();
  
  const listaOracoes = Object.values(dbOracoes);

  useEffect(() => { 
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "oracoes_index" });
    return () => clearTimeout(mountTimer);
  }, []);

  const oracoesFiltradas = listaOracoes.filter(o => 
    removerAcentos(o.titulo).includes(removerAcentos(busca))
  );

  const fontClass = isMounted && tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';
  const fontHeader = isMounted && tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg';

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href="/jornada" className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight text-foreground ${fontHeader}`}>Devocionário</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* TÍTULO E ÍCONE */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-primary mb-5 shadow-inner bg-primary/10">
            <svg viewBox="0 0 682.67 682.67" xmlns="http://www.w3.org/2000/svg" className="icone-oracao-custom w-10 h-10">
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
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Orações Comuns</h2>
          <p className="font-medium text-sm text-muted">A sua base diária de diálogo com Deus.</p>
        </div>

        {/* BARRA DE PESQUISA */}
        <div className="mb-10 max-w-[600px] mx-auto w-full relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-muted">search</span>
          <input 
            type="text" 
            placeholder="Procurar oração..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold shadow-sm placeholder:opacity-60 bg-card border-border text-foreground"
          />
        </div>

        <div className="mb-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {oracoesFiltradas.length > 0 ? (
              oracoesFiltradas.map((oracao) => (
                <li key={oracao.id}>
                  <Link href={`/oracoes/${oracao.id}`} className="border p-5 rounded-[1.5rem] flex items-center justify-between hover:border-primary/50 transition-all active:scale-95 group shadow-sm bg-card border-border">
                    <span className={`font-extrabold group-hover:text-primary transition-colors text-foreground ${fontClass}`}>
                      {oracao.titulo}
                    </span>
                    <span className="material-symbols-rounded group-hover:text-primary transition-transform group-hover:translate-x-1 rounded-full p-1.5 bg-muted/10 text-muted">
                      chevron_right
                    </span>
                  </Link>
                </li>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-muted">
                <p className="italic">Nenhuma oração encontrada.</p>
              </div>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
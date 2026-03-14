"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { modoVisual } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    
    const toggleVisibility = (e?: Event) => {
      // Tenta apanhar o scroll de 3 sítios diferentes (Janela, HTML ou Body)
      // O "e?.target" garante que se um <div> interno rolar, ele também apanha!
      const target = e?.target as Document | Element;
      const scrollTop = 
        window.scrollY || 
        document.documentElement.scrollTop || 
        document.body.scrollTop || 
        (target && 'scrollTop' in target ? target.scrollTop : 0);
      
      if (scrollTop > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // O truque de mestre: "capture: true" obriga o navegador a reportar TODOS os scrolls
    window.addEventListener("scroll", toggleVisibility, { passive: true, capture: true });
    
    toggleVisibility(); // Verificação inicial
    
    return () => {
      clearTimeout(mountTimer);
      window.removeEventListener("scroll", toggleVisibility, { capture: true });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  // Cores de fallback seguras para o primeiro milissegundo de carregamento
  const isDark = isMounted && modoVisual === 'escuro';
  const isSepia = isMounted && modoVisual === 'leitura';

  const btnBg = isDark 
    ? "bg-slate-800 text-[#2F6BFF] border-slate-700 shadow-black/50" 
    : isSepia 
    ? "bg-[#E8DEC1] text-[#b45309] border-[#D9CFB3] shadow-[#8C7B65]/20" 
    : "bg-white text-[#2F6BFF] border-slate-200 shadow-[#2F6BFF]/30";

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      // bottom-4 e right-4 encostam o botão bem no canto inferior. 
      // translate-y-16 garante que ele desce para fora da tela quando se esconde.
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl border-2 flex items-center justify-center transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      } ${btnBg}`}
    >
      <span className="material-symbols-rounded text-[24px] sm:text-[28px] font-black">arrow_upward</span>
    </button>
  );
}
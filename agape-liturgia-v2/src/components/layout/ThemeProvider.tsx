"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { modoVisual, tamanhoFonte } = useUserStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // Estados da Splash Screen
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");

  // EFEITO 1: Motor de Temas e Tipografia
  useEffect(() => {
    const root = document.documentElement;
    if (modoVisual === 'escuro') root.setAttribute("data-theme", "dark");
    else if (modoVisual === 'leitura') root.setAttribute("data-theme", "sepia");
    else root.removeAttribute("data-theme");
    
    root.classList.remove('text-sm', 'text-base', 'text-readable', 'text-lg');
    if (tamanhoFonte === 'grande') root.classList.add('text-readable');
    else root.classList.add('text-base');
  }, [modoVisual, tamanhoFonte]);

  // EFEITO 2: Animações da Splash Screen
  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    
    // 1. Animação da Barra de Progresso
    setTimeout(() => setProgress(100), 100);

    // 2. Animação de Máquina de Escrever
    const fullText = "Liturgia Ágape";
    let currentLen = 0;
    const typingInterval = setInterval(() => {
      currentLen++;
      setTypedText(fullText.slice(0, currentLen));
      if (currentLen >= fullText.length) clearInterval(typingInterval);
    }, 60);

    // 3. Fazer a Splash Screen Desaparecer
    const t1 = setTimeout(() => setFadeSplash(true), 1600);
    const t2 = setTimeout(() => setShowSplash(false), 2100);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(typingInterval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = !isMounted ? "bg-[#F5F7FA]" : isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-[#F5F7FA]";
  const textMain = !isMounted ? "text-[#1F1F1F]" : isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-[#1F1F1F]";
  const borderColor = !isMounted ? "border-slate-200" : isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-slate-200";

  return (
    <>
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${wrapperClass} ${fadeSplash ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
        >
          {/* BLOCO CENTRAL (Logo + Nome + Barra) */}
          <div className="flex flex-col items-center animate-float w-full max-w-[220px]">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#2F6BFF] blur-2xl opacity-20 rounded-full animate-pulse"></div>
              <img 
                src="/icon-192x192.png" 
                alt="Logo Ágape" 
                className={`relative w-28 h-28 rounded-[2rem] shadow-2xl  transition-colors duration-300 ${borderColor}`} 
              />
            </div>
            
            <h1 className={`text-3xl font-black tracking-tighter flex items-center h-10 transition-colors duration-300 mb-5 ${textMain}`}>
              {typedText}
              <span className="w-1 h-7 ml-1 bg-[#2F6BFF] animate-pulse rounded-full"></span>
            </h1>

            {/* Barra de Progresso colada ao nome */}
            <div className="w-full flex flex-col gap-2">
              <div className={`w-full h-2 rounded-full overflow-hidden shadow-inner transition-colors duration-300 ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]' : 'bg-slate-200'}`}>
                <div 
                  className="h-full bg-[#2F6BFF] rounded-full transition-all duration-[1200ms] ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
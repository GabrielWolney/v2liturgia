"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/store/useUserStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { modoVisual, tamanhoFonte } = useUserStore();
  
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState("");

  // Aplica o tema e o tamanho da fonte nativamente no HTML
  useEffect(() => {
    const root = document.documentElement;
    let themeColor = "#f1f5f9"; // claro
    
    if (modoVisual === 'escuro') {
      root.setAttribute("data-theme", "dark");
      themeColor = "#020617";
    }
    else if (modoVisual === 'leitura') {
      root.setAttribute("data-theme", "sepia");
      themeColor = "#FDF6E3";
    }
    else {
      root.removeAttribute("data-theme");
    }
    
    root.classList.remove('text-sm', 'text-base', 'text-readable', 'text-lg');
    if (tamanhoFonte === 'grande') root.classList.add('text-readable');
    else root.classList.add('text-base');

    // Atualiza TODAS as meta tags de theme-color para PWAs nativos sem remover nenhuma.
    // Remover tags criadas pelo Next.js com el.remove() causa "Cannot read properties of null (reading 'removeChild')" no React 19.
    const allMetaColors = document.querySelectorAll('meta[name="theme-color"]');
    if (allMetaColors.length > 0) {
      allMetaColors.forEach((el) => {
        (el as HTMLMetaElement).content = themeColor;
        el.removeAttribute('media');
      });
    } else {
      const metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      metaThemeColor.content = themeColor;
      document.head.appendChild(metaThemeColor);
    }

  }, [modoVisual, tamanhoFonte]);

  useEffect(() => {
    setTimeout(() => setProgress(100), 100);

    const fullText = "Liturgia Ágape";
    let currentLen = 0;
    const typingInterval = setInterval(() => {
      currentLen++;
      setTypedText(fullText.slice(0, currentLen));
      if (currentLen >= fullText.length) clearInterval(typingInterval);
    }, 60);

    const t1 = setTimeout(() => setFadeSplash(true), 1600);
    const t2 = setTimeout(() => setShowSplash(false), 2100);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ease-in-out bg-background ${fadeSplash ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
        >
          <div className="flex flex-col items-center animate-float w-full max-w-[220px]">
            <div className="relative mb-6">
              <Image 
                src="/icon-192x192.png" 
                alt="Logo Ágape" 
                width={112}
                height={112}
                className="relative w-28 h-28 rounded-[2rem] shadow-2xl transition-colors duration-300 border border-border" 
              />
            </div>
            
            <h1 className="text-3xl font-black tracking-tighter flex items-center h-10 transition-colors duration-300 mb-5 text-foreground">
              {typedText}
              <span className="w-1 h-7 ml-1 bg-primary animate-pulse rounded-full"></span>
            </h1>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full h-2 rounded-full overflow-hidden shadow-inner transition-colors duration-300 bg-muted/20">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-[1200ms] ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-full bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* O SEGREDO ESTÁ AQUI: RENDERIZAR O CHILDREN DIRETAMENTE! */}
      {children}
    </>
  );
}
"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Aplica o Tema (Cores)
    if (modoVisual === 'escuro') {
      root.setAttribute("data-theme", "dark");
    } else if (modoVisual === 'leitura') {
      root.setAttribute("data-theme", "sepia");
    } else {
      root.removeAttribute("data-theme");
    }
    
    // 2. Aplica o Tamanho da Fonte Global
    root.classList.remove('text-sm', 'text-base', 'text-readable', 'text-readable');
    if (tamanhoFonte === 'grande') {
      root.classList.add('text-readable');
    } else {
      root.classList.add('text-base');
    }
  }, [modoVisual, tamanhoFonte]);

  return <>{children}</>;
}

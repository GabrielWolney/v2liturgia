"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, fontSize } = useThemeStore();

  useEffect(() => {
    // 1. Aplica o Tema (Cores)
    document.documentElement.setAttribute("data-theme", theme);
    
    // 2. Aplica o Tamanho da Fonte globalmente
    // Removemos as antigas para não acumular
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    // Adicionamos a fonte selecionada
    document.documentElement.classList.add(fontSize);
  }, [theme, fontSize]);

  return <>{children}</>;
}
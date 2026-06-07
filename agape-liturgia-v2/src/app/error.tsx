"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry later
    console.error("Aplicação quebrou:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-card border border-border shadow-2xl p-8 rounded-[2.5rem] animate-fade-in">
        
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
          <span className="material-symbols-rounded text-[40px]">warning</span>
        </div>

        <h2 className="text-2xl font-black mb-2 text-center">Algo correu mal</h2>
        
        <p className="text-muted text-center text-sm leading-relaxed mb-8">
          Infelizmente, ocorreu um erro inesperado ao carregar esta página. Não se preocupe, os seus dados estão a salvo.
        </p>

        <button
          onClick={() => reset()}
          className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-sm hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded">refresh</span>
          Tentar Novamente
        </button>

      </div>
    </div>
  );
}

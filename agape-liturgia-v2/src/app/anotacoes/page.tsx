"use client";

import { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export default function AnotacoesPage() {
  
  const { minhasNotas, setNotas, tamanhoFonte } = useUserStore();
  const [saveStatus, setSaveStatus] = useState<"ocioso" | "salvando" | "salvo">("ocioso");

  const handleMudancaTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotas(e.target.value);
    setSaveStatus("salvando");
    setTimeout(() => { 
      setSaveStatus("salvo"); 
      setTimeout(() => setSaveStatus("ocioso"), 2000); 
    }, 500);
  };

  
  const fontClass = tamanhoFonte === 'grande' ? 'text-xl' : 'text-base';
  const leadingClass = tamanhoFonte === 'grande' ? 'leading-[1.8]' : 'leading-[1.6]';

  return (
    
    <div className="min-h-screen flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href="/jornada" className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all duration-300 ${saveStatus === "salvando" ? "bg-amber-500/20 text-amber-500" : saveStatus === "salvo" ? "bg-emerald-500/20 text-emerald-500" : "bg-card border border-border text-muted"}`}>
          <span className={`material-symbols-rounded text-[14px] ${saveStatus === "salvando" ? "animate-spin" : ""}`}>{saveStatus === "salvando" ? "sync" : "cloud_done"}</span>
          {saveStatus === "salvando" ? "Salvando" : "Salvo"}
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 flex flex-col h-full animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">edit_note</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">Meu Diário</h2>
          <p className="font-medium text-sm text-muted">Anotações e reflexões espirituais.</p>
        </div>

        <div className="flex-1 flex flex-col rounded-[2rem] shadow-soft border overflow-hidden relative group mb-10 transition-colors duration-300 bg-card border-border">
          <div className="absolute left-0 top-10 bottom-10 w-1.5 bg-primary rounded-r-full opacity-80"></div>
          <textarea 
            value={minhasNotas} 
            onChange={handleMudancaTexto} 
            placeholder="Comece a escrever as suas reflexões de hoje..." 
            spellCheck="false"
            className={`flex-1 w-full bg-transparent p-6 sm:p-10 pl-8 sm:pl-10 resize-none outline-none font-serif transition-colors duration-300 placeholder:opacity-50 ${fontClass} ${leadingClass} text-foreground`}
          />
        </div>

      </main>
    </div>
  );
}
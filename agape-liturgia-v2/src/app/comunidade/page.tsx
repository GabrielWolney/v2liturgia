"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";
import { subscribeToAvisos, Aviso, subscribeToConfigComunidade } from "@/services/db-home";
import { ConfigComunidade } from "@/services/db-admin";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

export default function ComunidadePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [configComunidade, setConfigComunidade] = useState<ConfigComunidade | null>(null);
  
  const { tamanhoFonte, comunidade, statusComunidade } = useUserStore();
  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "comunidade_local" });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!comunidade || statusComunidade !== "aprovado") return;
    const unsubAvisos = subscribeToAvisos(comunidade, setAvisos);
    const unsubConfig = subscribeToConfigComunidade(comunidade, setConfigComunidade);
    
    return () => {
      unsubAvisos();
      unsubConfig();
    };
  }, [comunidade, statusComunidade]);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 bg-background text-foreground ${fontClass} selection:bg-primary/20`}>
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full bg-background/90 border-border">
        <button onClick={() => { playPop(); triggerHaptic('light'); router.push('/jornada'); }} className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-muted/20 active:scale-95 transition-transform">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="font-extrabold tracking-tight">A Sua Comunidade</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 animate-fade-in flex flex-col gap-6">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 mb-5 shadow-inner">
            <span className="material-symbols-rounded text-[40px]">groups</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">{comunidade || "Sem Comunidade"}</h2>
          <p className="font-medium text-sm text-muted">Avisos e comunicados da comunidade.</p>
        </div>

        {statusComunidade === "pendente" ? (
          <div className="text-center py-16 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center border-amber-500/30 bg-amber-500/5">
             <span className="material-symbols-rounded text-[48px] mb-3 text-amber-500">hourglass_empty</span>
             <h3 className="font-bold text-amber-600 dark:text-amber-400 text-xl mb-2">Aguardando Aprovação</h3>
             <p className="font-medium text-amber-700/70 dark:text-amber-500/70 max-w-[250px]">
               O coordenador da comunidade precisa aceitar sua solicitação de entrada.
             </p>
          </div>
        ) : (
          <>
            {/* CARDS COMUNIDADE CONFIG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#2F6BFF]/10 border border-[#2F6BFF]/20 p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -right-4 -bottom-4 text-[#2F6BFF]/5 pointer-events-none">
                  <span className="material-symbols-rounded text-[100px]">flag</span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-[#2F6BFF]">
                  <span className="material-symbols-rounded text-[18px]">flag</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Propósito da Comunidade</span>
                </div>
                <p className="font-bold text-foreground relative z-10 leading-snug">
                  {configComunidade?.propositoLocal || "Nenhum propósito definido."}
                </p>
              </div>

              <div className="bg-[#6E3AA5]/10 border border-[#6E3AA5]/20 p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -right-4 -bottom-4 text-[#6E3AA5]/5 pointer-events-none">
                  <span className="material-symbols-rounded text-[100px]">event</span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-[#6E3AA5]">
                  <span className="material-symbols-rounded text-[18px]">event</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Próxima Vivência</span>
                </div>
                <p className="font-bold text-foreground flex flex-col gap-1 relative z-10">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-rounded text-[14px] opacity-60">calendar_today</span> {configComunidade?.dataVivencia || "A definir"}</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-rounded text-[14px] opacity-60">location_on</span> {configComunidade?.localVivencia || "A definir"}</span>
                </p>
              </div>
            </div>

            <div className="h-px bg-border my-2"></div>

            {/* AVISOS LOCAIS */}
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-rounded text-[20px] text-emerald-500">campaign</span>
              Mural de Avisos
            </h3>

            {avisos.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center border-border bg-card">
                 <span className="material-symbols-rounded text-[40px] mb-3 opacity-20">notifications_off</span>
                 <p className="font-medium text-muted">Nenhum aviso no momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {avisos.map(aviso => (
                  <div key={aviso.id} className="bg-card border border-border p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                    <div className="inline-flex items-center gap-1 mb-3 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-rounded text-[14px]">notifications_active</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Aviso Importante</span>
                    </div>
                    <p className="font-medium">{aviso.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

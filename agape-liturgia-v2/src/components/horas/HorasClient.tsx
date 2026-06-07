"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { LiturgiaHorasDia } from "@/services/api-horas";
import { atualizarContador } from "@/services/db-home";
import { getDataIso } from "@/lib/date-utils";
import { trackEvent } from "@/lib/analytics";
import { set, get } from "idb-keyval";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

interface HorasClientProps {
  horasData: LiturgiaHorasDia | null;
  tipo: string;
}

export function HorasClient({ horasData, tipo }: HorasClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [localHorasData, setLocalHorasData] = useState<LiturgiaHorasDia | null>(horasData);
  
  const { modoVisual, tamanhoFonte, registrarAtividade, oficiosConcluidos, marcarOficioConcluido } = useUserStore();
  const router = useRouter();
  const { playPop, playSuccess } = useSound();
  const { triggerHaptic } = useHaptics();

  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

  useEffect(() => {
    const initCache = async () => {
      const dataHoje = getDataIso();
      const cacheKey = `horas-${tipo}-${dataHoje}`;
      
      if (horasData) {
        // Se veio do servidor com sucesso (online), salvamos no cache local
        await set(cacheKey, horasData);
        setLocalHorasData(horasData);
      } else {
        // Se o servidor falhou (offline), tentamos resgatar do IndexedDB
        const cached = await get<LiturgiaHorasDia>(cacheKey);
        if (cached) {
          setLocalHorasData(cached);
        }
      }
      setIsMounted(true);
    };
    initCache();
  }, [horasData, tipo]);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background transition-colors duration-300" />;

  let baseFontSize = "text-xl";
  let titleFontSize = "text-2xl";
  if (tamanhoFonte === "grande") {
    baseFontSize = "text-2xl";
    titleFontSize = "text-3xl";
  }

  const formatarNome = (t: string) => {
    if (t === "oficio-das-leituras") return "Ofício das Leituras";
    if (t === "hora-media") return "Hora Média";
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  if (!localHorasData) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center bg-background">
        <span className="material-symbols-rounded text-4xl mb-3 opacity-50">cloud_off</span>
        <p className="font-medium">Você está offline e esta oração ainda não foi baixada hoje.</p>
        <button onClick={() => router.push('/horas')} className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-full">Voltar</button>
      </div>
    );
  }

  // 1. Agrupar blocos em passos (steps)
  const steps: { titulo: string, blocos: typeof localHorasData.blocos }[] = [];
  let currentGroup = { titulo: "Invocação", blocos: [] as typeof localHorasData.blocos };
  
  localHorasData.blocos.forEach(bloco => {
    // Qualquer título inicia uma nova secção
    if (bloco.tipo === 'titulo') {
      
      // Verificar se o último bloco do grupo atual é uma antífona
      let lastAntifona = null;
      if (currentGroup.blocos.length > 0) {
        const ultimo = currentGroup.blocos[currentGroup.blocos.length - 1];
        if (ultimo.tipo === 'antifona' || (ultimo.tipo === 'subtitulo' && ultimo.conteudo.startsWith('Ant.'))) {
          lastAntifona = currentGroup.blocos.pop(); // Remove do grupo atual
        }
      }

      // Se o grupo atual tem conteúdo suficiente para ser um passo próprio
      if (currentGroup.titulo === "Invocação" ? currentGroup.blocos.length > 0 : currentGroup.blocos.length > 1) {
        steps.push(currentGroup);
      }
      
      // Inicia novo grupo
      currentGroup = { titulo: bloco.conteudo, blocos: [] };
      if (lastAntifona) {
        currentGroup.blocos.push(lastAntifona); // A antífona entra ANTES do título do Salmo
      }
      currentGroup.blocos.push(bloco); // O título do Salmo
      
    } else {
      currentGroup.blocos.push(bloco);
    }
  });
  if (currentGroup.blocos.length > 0) {
    steps.push(currentGroup);
  }

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      const dataHoje = getDataIso();
      if (!oficiosConcluidos[dataHoje]) {
        atualizarContador(dataHoje, 'oficio', true);
      }
      marcarOficioConcluido(dataHoje);
      registrarAtividade();
      setIsFinished(true);
      trackEvent("oficio_concluido", { tipo });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  if (isFinished) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors bg-background">
        <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative bg-emerald-500/20">
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
          <div className="absolute -top-3 -right-3 border-2 rounded-full p-2 flex items-center justify-center shadow-md bg-card border-background">
            <span className="material-symbols-rounded text-orange-500 text-[24px]">local_fire_department</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Oração Concluída!</h1>
        <p className="font-medium mb-12 text-muted">A sua alma glorifica ao Senhor.</p>
        <button onClick={() => { playSuccess(); triggerHaptic('success'); router.push('/jornada'); }} className="w-full max-w-[400px] bg-primary text-white font-bold py-5 rounded-[1.5rem] shadow-[0_8px_0_var(--primary-light)] active:translate-y-[8px] active:shadow-none transition-all hover:brightness-105">
          VOLTAR À PEQUENA VIA
        </button>
      </div>
    );
  }



  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-40 selection:bg-primary/30 transition-colors bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-5 py-4 flex items-center gap-4 max-w-[800px] mx-auto w-full transition-colors bg-background/95 border-border">
        <button onClick={() => { playPop(); triggerHaptic('light'); router.push('/horas'); }} className="transition-colors flex items-center justify-center w-8 h-8 rounded-full active:scale-95 shrink-0 text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[28px]">close</span>
        </button>
        <div className="flex-1 h-3.5 rounded-full overflow-hidden shadow-inner bg-muted/20">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative" style={{ width: `${progressPercentage}%` }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-8 md:pt-10 animate-fade-in pb-32">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-extrabold text-[10px] uppercase tracking-widest mb-3">
          <span className="material-symbols-rounded text-[14px]">wb_twilight</span>
          {formatarNome(tipo)}
        </div>

        <h2 className={`font-black tracking-tight leading-tight mb-8 ${titleFontSize} text-foreground`}>
          {currentStep.titulo}
        </h2>

        <div className={`space-y-6 ${baseFontSize} leading-relaxed font-serif text-foreground/90`}>
          {currentStep.blocos.map((bloco, idx) => {
            if (bloco.tipo === 'titulo') {
              if (idx === 0) return null; // já mostramos no topo
              return <h3 key={idx} className="font-extrabold text-xl mt-12 mb-4 uppercase tracking-widest opacity-80 text-center">{bloco.conteudo}</h3>;
            }
            if (bloco.tipo === 'subtitulo') {
              return <h4 key={idx} className="font-bold mt-8 mb-2 opacity-90">{bloco.conteudo}</h4>;
            }
            if (bloco.tipo === 'antifona') {
              let antFormatado = bloco.conteudo.replace(/\n/g, '<br />');
              return <p key={idx} dangerouslySetInnerHTML={{ __html: antFormatado }} className="italic pl-4 border-l-4 border-primary/40 opacity-90 my-6 text-sm md:text-base" />;
            }
            if (bloco.tipo === 'rubrica') {
              return <p key={idx} className="italic text-primary/80 text-sm md:text-base my-4 text-center">{bloco.conteudo}</p>;
            }
            
            // Texto normal
            let textoNormal = bloco.conteudo;
            if (textoNormal.startsWith("V.") || textoNormal.startsWith("R.")) {
              textoNormal = textoNormal.replace(/([V|R]\.)/g, '<strong class="text-primary">$1</strong>');
            }
            
            textoNormal = textoNormal.replace(/\n/g, '<br />');

            return (
              <p key={idx} dangerouslySetInnerHTML={{ __html: textoNormal }} className="text-left mb-4" />
            );
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background from-70% to-transparent pt-12 pb-6 px-5 z-50 pointer-events-none">
        <div className="max-w-[800px] mx-auto flex gap-3 pointer-events-auto">
          {currentStepIndex > 0 && (
            <button 
              onClick={() => { playPop(); triggerHaptic('light'); prevStep(); }}
              className="flex items-center justify-center px-5 font-bold rounded-[1.5rem] border-2 border-border bg-card text-muted hover:text-foreground transition-all active:translate-y-[4px] shadow-[0_4px_0_var(--border)] active:shadow-none"
              aria-label="Voltar para a secção anterior"
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </button>
          )}

          <button 
            onClick={() => { playPop(); triggerHaptic('light'); nextStep(); }}
            className={`flex-1 font-bold py-5 rounded-[1.5rem] transition-all active:translate-y-[8px] flex items-center justify-center gap-2 bg-primary text-white shadow-[0_8px_0_var(--primary-light)] active:shadow-none hover:brightness-105 ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}
          >
            {currentStepIndex === steps.length - 1 ? 'CONCLUIR' : 'CONTINUAR'}
          </button>
        </div>
      </footer>
    </div>
  );
}

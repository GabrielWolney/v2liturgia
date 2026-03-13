"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { formatarTextoLiturgico, formatarSalmo } from "@/lib/formatters";
import { LiturgiaDiaria } from "@/types/liturgia";
import { useUserStore } from "@/store/useUserStore";
import { getDataIso } from "@/lib/date-utils";
import { trackEvent } from "@/lib/analytics";
import { atualizarContador } from "@/services/db-home";

type Step = {
  id: string;
  titulo: string;
  referencia: string;
  texto: string;
  refrao?: string; 
  isOverview?: boolean; // <--- NOVA FLAG PARA O PASSO DE REFERÊNCIAS
};

export default function LiturgiaAulaPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { marcarLeituraConcluida, modoVisual, tamanhoFonte, registrarAtividade, leiturasConcluidas } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    
    getLiturgiaDoDia().then((data) => {
      if (data) {
        setLiturgia(data);
        const newSteps: Step[] = [];

        // --- 1. O NOVO PASSO: VISÃO GERAL DAS REFERÊNCIAS ---
        newSteps.push({
          id: '0',
          titulo: 'Visão Geral',
          referencia: 'Prepare a sua Bíblia',
          texto: '', // Vazio porque o conteúdo será renderizado por Cards
          isOverview: true
        });

        // --- 2. OS PASSOS DE LEITURA NORMAIS ---
        if (data.primeiraLeitura) {
          newSteps.push({ id: '1', titulo: 'Primeira Leitura', referencia: data.primeiraLeitura.referencia, texto: data.primeiraLeitura.texto });
        }
        if (data.salmo) {
          newSteps.push({ 
            id: '2', 
            titulo: 'Salmo', 
            referencia: data.salmo.referencia, 
            texto: data.salmo.texto,
            refrao: data.salmo.refrao 
          });
        }
        if (data.segundaLeitura && typeof data.segundaLeitura !== 'string') {
          newSteps.push({ id: '3', titulo: 'Segunda Leitura', referencia: data.segundaLeitura.referencia, texto: data.segundaLeitura.texto });
        }
        if (data.evangelho) {
          newSteps.push({ id: '4', titulo: 'Evangelho', referencia: data.evangelho.referencia, texto: data.evangelho.texto });
        }
        setSteps(newSteps);
      }
    });

    trackEvent("page_view", { page_name: "liturgia_aula" });
    return () => clearTimeout(mountTimer);
  }, []);

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const dataHoje = getDataIso();
      
      // Só soma +1 na Igreja se for a primeira vez do dia!
      if (!leiturasConcluidas[dataHoje]) {
        atualizarContador(dataHoje, 'leitura', true);
      }

      marcarLeituraConcluida(dataHoje);
      registrarAtividade();
      setIsFinished(true);
      trackEvent("liturgia_concluida");
    }
  };

  if (!isMounted) return null;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/95" : isSepia ? "bg-[#FDF6E3]/95" : "bg-background/95";
  
  const footerGradient = isDark 
    ? "from-slate-950" 
    : isSepia 
    ? "from-[#FDF6E3]" 
    : "from-[#F5F7FA]";

  const fontReading = tamanhoFonte === 'grande' ? 'text-xl leading-[2.1]' : 'text-base leading-[1.8]';

  if (steps.length === 0) {
    return (
      <div className={`h-[100dvh] flex flex-col items-center justify-center transition-colors ${wrapperClass}`}>
        <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/20 flex items-center justify-center">
          <span className="material-symbols-rounded text-[#2F6BFF] text-2xl animate-spin">sync</span>
        </div>
        <p className={`font-bold text-sm mt-4 animate-pulse ${textMuted}`}>A preparar a Palavra...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className={`h-[100dvh] flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors ${wrapperClass}`}>
        <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
          <div className={`absolute -top-3 -right-3 border-2 rounded-full p-2 flex items-center justify-center shadow-md ${isDark ? 'bg-slate-800 border-slate-900' : 'bg-orange-100 border-white'}`}>
            <span className="material-symbols-rounded text-orange-500 text-[24px]">local_fire_department</span>
          </div>
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}>Palavra Concluída!</h1>
        <p className={`font-medium mb-12 ${textMuted}`}>A sua jornada espiritual de hoje está fortificada.</p>
        <button 
          onClick={() => router.push('/jornada')}
          className="w-full max-w-[400px] bg-[#2F6BFF] text-white font-bold py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:translate-y-[8px] active:shadow-none transition-all hover:brightness-105"
        >
          VOLTAR À JORNADA
        </button>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  const textoFormatado = currentStep.isOverview ? "" : (
    currentStep.titulo === "Salmo" 
      ? (currentStep.refrao ? formatarSalmo(currentStep.texto, currentStep.refrao) : currentStep.texto.replace(/\n/g, '<br />'))
      : formatarTextoLiturgico(currentStep.texto)
  );

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-40 selection:bg-[#2F6BFF]/30 transition-colors ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-5 py-4 flex items-center gap-4 max-w-[800px] mx-auto w-full transition-colors ${headerBg} ${borderColor}`}>
        <button 
          onClick={() => router.push('/jornada')}
          className={`transition-colors flex items-center justify-center w-8 h-8 rounded-full active:scale-95 shrink-0 ${isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-muted hover:bg-slate-200'}`}
        >
          <span className="material-symbols-rounded text-[28px]">close</span>
        </button>
        <div className={`flex-1 h-3.5 rounded-full overflow-hidden shadow-inner ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
          <div 
            className="h-full bg-[#2F6BFF] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-8 md:pt-10 animate-fade-in">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-lg font-extrabold text-[10px] uppercase tracking-widest mb-3">
          <span className="material-symbols-rounded text-[14px]">
            {currentStep.isOverview ? 'format_list_bulleted' : currentStep.titulo === 'Evangelho' ? 'church' : currentStep.titulo === 'Salmo' ? 'music_note' : 'auto_stories'}
          </span>
          {currentStep.titulo}
        </div>

        <h2 className={`font-bold text-sm mb-6 pb-4 border-b ${textMuted} ${borderColor}`}>
          {currentStep.referencia}
        </h2>

        {/* SE FOR A TELA DE REFERÊNCIAS (PASSO 1) */}
        {currentStep.isOverview ? (
          <div className="flex flex-col gap-3 animate-fade-in">
            <p className={`font-medium text-sm mb-4 ${textMuted}`}>
              Se preferir acompanhar as leituras de hoje na sua própria Bíblia, procure as seguintes passagens:
            </p>

            {liturgia?.primeiraLeitura && (
              <div className={`p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors ${cardBg} ${borderColor}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-[#2F6BFF]/10 text-[#2F6BFF]'}`}>
                  <span className="material-symbols-rounded text-[20px]">auto_stories</span>
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Primeira Leitura</p>
                  <p className={`font-bold ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.primeiraLeitura.referencia}</p>
                </div>
              </div>
            )}

            {liturgia?.salmo && (
              <div className={`p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors ${cardBg} ${borderColor}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-[#2F6BFF]/10 text-[#2F6BFF]'}`}>
                  <span className="material-symbols-rounded text-[20px]">music_note</span>
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Salmo Responsorial</p>
                  <p className={`font-bold ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.salmo.referencia}</p>
                </div>
              </div>
            )}

            {liturgia?.segundaLeitura && typeof liturgia.segundaLeitura !== 'string' && (
              <div className={`p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors ${cardBg} ${borderColor}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-[#2F6BFF]/10 text-[#2F6BFF]'}`}>
                  <span className="material-symbols-rounded text-[20px]">menu_book</span>
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Segunda Leitura</p>
                  <p className={`font-bold ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.segundaLeitura.referencia}</p>
                </div>
              </div>
            )}

            {liturgia?.evangelho && (
              <div className={`p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors ${cardBg} ${borderColor}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-emerald-900/30 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                  <span className="material-symbols-rounded text-[20px]">church</span>
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Evangelho</p>
                  <p className={`font-bold ${textMain} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.evangelho.referencia}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // SE FOR O TEXTO DA LEITURA NORMAL (PASSO 2, 3, 4...)
          <div className="animate-fade-in">
            {currentStep.refrao && (
              <div className={`mb-8 p-6 border-2 rounded-[1.5rem] shadow-sm flex flex-col items-center text-center transition-colors ${cardBg} ${borderColor}`}>
                <span className={`font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1 ${textMuted}`}>
                  <span className="material-symbols-rounded text-[14px]">graphic_eq</span>
                  Refrão
                </span>
                <h3 className={`font-serif text-lg sm:text-2xl font-bold leading-snug ${textMain}`}>
                  <span className="text-[#2F6BFF] mr-2">—</span>
                  {currentStep.refrao}
                </h3>
              </div>
            )}

            <article 
              className={`font-serif ${textMain} ${fontReading} text-left ${ 
                currentStep.titulo === 'Evangelho' ? `p-6 md:p-8 rounded-3xl shadow-sm border ${cardBg} ${borderColor}` : ''
              } ${currentStep.titulo === 'Salmo' ? 'text-center italic' : ''}`}
              dangerouslySetInnerHTML={{ __html: textoFormatado }}
            />
          </div>
        )}
      </main>

      <footer className={`fixed bottom-0 left-0 w-full bg-gradient-to-t ${footerGradient} from-70% to-transparent pt-12 pb-6 px-5 z-50`}>
        <div className="max-w-[800px] mx-auto">
          <button 
            onClick={handleNextStep}
            className={`w-full font-bold py-5 rounded-[1.5rem] transition-all active:translate-y-[8px] flex items-center justify-center gap-2 ${
              currentStep.titulo === 'Evangelho' 
                ? 'bg-emerald-500 text-white shadow-[0_8px_0_#059669] active:shadow-none'
                : 'bg-[#2F6BFF] text-white shadow-[0_8px_0_#1E4BCC] active:shadow-none'
            } hover:brightness-105 ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}
          >
            {currentStep.isOverview ? 'INICIAR LEITURA' : currentStep.titulo === 'Evangelho' ? 'CONCLUIR' : 'CONTINUAR'}
          </button>
        </div>
      </footer>
    </div>
  );
}
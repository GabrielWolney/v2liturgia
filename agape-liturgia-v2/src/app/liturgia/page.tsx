"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { formatarTextoLiturgico, formatarSalmo } from "@/lib/formatters";
import { LiturgiaDiaria } from "@/types/liturgia";
import { useUserStore } from "@/store/useUserStore";
import { getDataIso } from "@/lib/date-utils";
import { trackEvent } from "@/lib/analytics";

// Adicionámos o 'refrao' como opcional no nosso Passo (Step)
type Step = {
  id: string;
  titulo: string;
  referencia: string;
  texto: string;
  refrao?: string; 
};

export default function LiturgiaAulaPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  
  // Estado da "Aula"
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { marcarLeituraConcluida } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    
    getLiturgiaDoDia().then((data) => {
      if (data) {
        setLiturgia(data);
        
        // Fatiamos a Liturgia em Passos
        const newSteps: Step[] = [];
        if (data.primeiraLeitura) {
          newSteps.push({ id: '1', titulo: 'Primeira Leitura', referencia: data.primeiraLeitura.referencia, texto: data.primeiraLeitura.texto });
        }
        if (data.salmo) {
          newSteps.push({ 
            id: '2', 
            titulo: 'Salmo', 
            referencia: data.salmo.referencia, 
            texto: data.salmo.texto,
            // Agora o TypeScript sabe que isto é seguro! Sem 'any'.
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
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo suavemente
    } else {
      marcarLeituraConcluida(getDataIso());
      setIsFinished(true);
      trackEvent("liturgia_concluida");
    }
  };

  // 1. TELA DE CARREGAMENTO
  if (!isMounted || steps.length === 0) {
    return (
      <div className="h-[100dvh] bg-[#F5F7FA] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/20 animate-pulse flex items-center justify-center">
          <span className="material-symbols-rounded text-[#2F6BFF] text-2xl animate-spin">sync</span>
        </div>
        <p className="text-[#6B6B6B] font-bold text-sm mt-4 animate-pulse">A preparar a Palavra...</p>
      </div>
    );
  }

  // 2. TELA DE SUCESSO
  if (isFinished) {
    return (
      <div className="h-[100dvh] bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center animate-fade-in selection:bg-[#2F6BFF]/30">
        <div className="w-32 h-32 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative">
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
          <div className="absolute -top-3 -right-3 bg-orange-100 border-2 border-white rounded-full p-2 flex items-center justify-center shadow-md">
            <span className="material-symbols-rounded text-orange-500 text-[24px]">local_fire_department</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-2">Palavra Concluída!</h1>
        <p className="text-[#6B6B6B] font-medium mb-12">A sua jornada espiritual de hoje está fortificada.</p>

        <button 
          onClick={() => router.push('/jornada')}
          className="w-full max-w-[400px] bg-[#2F6BFF] text-white font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[8px] transition-all hover:brightness-105"
        >
          VOLTAR À JORNADA
        </button>
      </div>
    );
  }

  // 3. TELA DA AULA
  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  // MÁGICA DA FORMATAÇÃO: Usa a função formatarSalmo se tiver refrão, senão usa a formatação normal
  const textoFormatado = currentStep.titulo === "Salmo" 
    ? (currentStep.refrao ? formatarSalmo(currentStep.texto, currentStep.refrao) : currentStep.texto.replace(/\n/g, '<br />'))
    : formatarTextoLiturgico(currentStep.texto);

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* CABEÇALHO */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/95 backdrop-blur-md border-b border-slate-200/50 px-5 py-4 flex items-center gap-4 max-w-[800px] mx-auto w-full">
        <button 
          onClick={() => router.push('/jornada')}
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[28px]">close</span>
        </button>
        
        <div className="flex-1 h-3.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-[#2F6BFF] rounded-full transition-all duration-500 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* ÁREA DA LEITURA */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-8 md:pt-10 animate-fade-in">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2F6BFF]/10 text-[#2F6BFF] rounded-lg font-extrabold text-[10px] uppercase tracking-widest mb-3">
          <span className="material-symbols-rounded text-[14px]">
            {currentStep.titulo === 'Evangelho' ? 'menu_book' : currentStep.titulo === 'Salmo' ? 'music_note' : 'auto_stories'}
          </span>
          {currentStep.titulo}
        </div>

        <h2 className="text-[#6B6B6B] font-bold text-sm mb-6 pb-4 border-b border-slate-200">
          {currentStep.referencia}
        </h2>

        {/* BLOCO DO REFRÃO DO SALMO */}
        {currentStep.refrao && (
          <div className="mb-8 p-6 bg-white border-2 border-slate-100 rounded-[1.5rem] shadow-sm flex flex-col items-center text-center">
            <span className="text-[#6B6B6B] font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1">
              <span className="material-symbols-rounded text-[14px]">graphic_eq</span>
              Refrão
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1F1F1F] leading-snug">
              <span className="text-[#2F6BFF] mr-2">—</span>
              {currentStep.refrao}
            </h3>
          </div>
        )}

        {/* O TEXTO PRINCIPAL */}
        <article 
          className={`font-serif text-lg md:text-xl leading-[1.9] text-[#1F1F1F] text-justify ${currentStep.titulo === 'Evangelho' ? 'bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100' : ''} ${currentStep.titulo === 'Salmo' ? 'text-center italic' : ''}`}
          dangerouslySetInnerHTML={{ __html: textoFormatado }}
        />

      </main>

      {/* RODAPÉ E BOTÃO 3D */}
      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-[#F5F7FA] from-70% to-transparent pt-12 pb-6 px-5 z-50">
        <div className="max-w-[800px] mx-auto">
          <button 
            onClick={handleNextStep}
            className={`w-full font-bold text-lg py-5 rounded-[1.5rem] transition-all active:translate-y-[8px] flex items-center justify-center gap-2 ${
              currentStep.titulo === 'Evangelho' 
                ? 'bg-emerald-500 text-white shadow-[0_8px_0_#059669] active:shadow-[0_0px_0_#059669]'
                : 'bg-[#2F6BFF] text-white shadow-[0_8px_0_#1E4BCC] active:shadow-[0_0px_0_#1E4BCC]'
            } hover:brightness-105`}
          >
            {currentStep.titulo === 'Evangelho' ? 'CONCLUIR' : 'CONTINUAR'}
          </button>
        </div>
      </footer>

    </div>
  );
}
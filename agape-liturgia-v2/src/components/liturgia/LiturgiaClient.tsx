"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  isOverview?: boolean; 
};

interface LiturgiaClientProps {
  liturgiaServer: LiturgiaDiaria | null;
}

export function LiturgiaClient({ liturgiaServer }: LiturgiaClientProps) {
  const router = useRouter();
  
  // Estados para gerenciar a liturgia atual e a de vigília
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  const [liturgiaDomingo, setLiturgiaDomingo] = useState<LiturgiaDiaria | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'hoje' | 'vigilia'>('hoje');
  const [isSabadoTarde, setIsSabadoTarde] = useState(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [erroApi, setErroApi] = useState(false);

  const { marcarLeituraConcluida, tamanhoFonte, registrarAtividade, leiturasConcluidas } = useUserStore();

  // 1. Ao abrir: Verificar o horário e buscar a Liturgia de Domingo se for o caso
  useEffect(() => {
    const mountTimer = setTimeout(() => {
      if (!liturgiaServer) {
        setErroApi(true);
        return;
      }
      
      setLiturgia(liturgiaServer);

      // O "Pulo do Gato": Verificar se é Sábado (6) e se passou das 17h no celular do jovem
      const hoje = new Date();
      if (hoje.getDay() === 6 && hoje.getHours() >= 17) {
        setIsSabadoTarde(true);
        
        // Busca a liturgia de domingo silenciosamente direto da API
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        const dia = String(amanha.getDate()).padStart(2, '0');
        const mes = String(amanha.getMonth() + 1).padStart(2, '0');
        
        fetch(`https://liturgia.up.railway.app/?dia=${dia}&mes=${mes}`)
          .then(res => res.json())
          .then(data => {
            if (data) setLiturgiaDomingo(data);
          })
          .catch(err => console.error("Erro ao buscar liturgia de domingo:", err));
      }
    }, 0);

    trackEvent("page_view", { page_name: "liturgia_aula" });
    return () => clearTimeout(mountTimer);
  }, [liturgiaServer]);

  // 2. A MAGIA DO USEMEMO: O React calcula as telas "on the fly" sem precisar de useEffect!
  const steps = useMemo(() => {
    if (!liturgia) return [];

    const newSteps: Step[] = [];
    newSteps.push({ id: '0', titulo: 'Visão Geral', referencia: 'Prepare a sua Bíblia', texto: '', isOverview: true });

    if (liturgia.primeiraLeitura) {
      newSteps.push({ id: '1', titulo: 'Primeira Leitura', referencia: liturgia.primeiraLeitura.referencia, texto: liturgia.primeiraLeitura.texto });
    }
    if (liturgia.salmo) {
      newSteps.push({ id: '2', titulo: 'Salmo', referencia: liturgia.salmo.referencia, texto: liturgia.salmo.texto, refrao: liturgia.salmo.refrao });
    }
    if (liturgia.segundaLeitura && typeof liturgia.segundaLeitura !== 'string') {
      newSteps.push({ id: '3', titulo: 'Segunda Leitura', referencia: liturgia.segundaLeitura.referencia, texto: liturgia.segundaLeitura.texto });
    }
    if (liturgia.evangelho) {
      newSteps.push({ id: '4', titulo: 'Evangelho', referencia: liturgia.evangelho.referencia, texto: liturgia.evangelho.texto });
    }
    
    return newSteps;
  }, [liturgia]);

  const handleTrocarAba = (aba: 'hoje' | 'vigilia') => {
    setAbaAtiva(aba);
    if (aba === 'hoje' && liturgiaServer) setLiturgia(liturgiaServer);
    if (aba === 'vigilia' && liturgiaDomingo) setLiturgia(liturgiaDomingo);
    
    // O Index agora é zerado exatamente no momento do clique, que é o correto no React!
    setCurrentStepIndex(0); 
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const dataHoje = getDataIso();
      if (!leiturasConcluidas[dataHoje]) {
        atualizarContador(dataHoje, 'leitura', true);
      }
      marcarLeituraConcluida(dataHoje);
      registrarAtividade();
      setIsFinished(true);
      trackEvent("liturgia_concluida");
    }
  };

  // NOVA FUNÇÃO: Voltar para a leitura anterior
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fontReading = tamanhoFonte === 'grande' ? 'text-xl leading-[2.1]' : 'text-base leading-[1.8]';

  if (erroApi) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center animate-fade-in transition-colors bg-background">
        <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
          <span className="material-symbols-rounded text-[48px]">cloud_off</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight text-foreground">Servidor em Oração...</h2>
        <p className="mb-8 max-w-[320px] leading-relaxed text-muted">A Liturgia de hoje está a demorar um pouco a chegar. Enquanto o sistema recupera o fôlego, que tal alimentar a alma de outra forma?</p>
        <div className="flex flex-col w-full max-w-[320px] gap-3">
          <Link href="/biblia" className="bg-primary text-white py-4 rounded-[1rem] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_6px_0_var(--primary-light)] hover:brightness-105">
            <span className="material-symbols-rounded">menu_book</span> LER A BÍBLIA
          </Link>
          <Link href="/terco" className="py-4 rounded-[1rem] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all mt-2 bg-card text-foreground border border-border">
            <span className="material-symbols-rounded">psychology_alt</span> REZAR O TERÇO
          </Link>
          <button onClick={() => window.location.reload()} className="text-sm font-bold text-primary mt-4 p-2 opacity-80 hover:opacity-100">Tentar carregar novamente</button>
        </div>
        <button onClick={() => router.push('/jornada')} className="mt-10 font-bold p-3 rounded-full text-muted hover:text-foreground transition-colors">
          <span className="material-symbols-rounded text-[32px]">cancel</span>
        </button>
      </div>
    );
  }

  if (steps.length === 0) return <div className="h-[100dvh] bg-background"></div>;

  if (isFinished) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors bg-background">
        <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative bg-emerald-500/20">
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
          <div className="absolute -top-3 -right-3 border-2 rounded-full p-2 flex items-center justify-center shadow-md bg-card border-background">
            <span className="material-symbols-rounded text-orange-500 text-[24px]">local_fire_department</span>
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Palavra Concluída!</h1>
        <p className="font-medium mb-12 text-muted">A sua jornada espiritual de hoje está fortificada.</p>
        <button onClick={() => router.push('/jornada')} className="w-full max-w-[400px] bg-primary text-white font-bold py-5 rounded-[1.5rem] shadow-[0_8px_0_var(--primary-light)] active:translate-y-[8px] active:shadow-none transition-all hover:brightness-105">
          VOLTAR À PEQUENA VIA
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
    <div className="min-h-[100dvh] flex flex-col font-sans pb-40 selection:bg-primary/30 transition-colors bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-5 py-4 flex items-center gap-4 max-w-[800px] mx-auto w-full transition-colors bg-background/95 border-border">
        <button onClick={() => router.push('/jornada')} className="transition-colors flex items-center justify-center w-8 h-8 rounded-full active:scale-95 shrink-0 text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[28px]">close</span>
        </button>
        <div className="flex-1 h-3.5 rounded-full overflow-hidden shadow-inner bg-muted/20">
          <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out relative" style={{ width: `${progressPercentage}%` }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-8 md:pt-10 animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-extrabold text-[10px] uppercase tracking-widest mb-3">
          <span className="material-symbols-rounded text-[14px]">
            {currentStep.isOverview ? 'format_list_bulleted' : currentStep.titulo === 'Evangelho' ? 'church' : currentStep.titulo === 'Salmo' ? 'music_note' : 'auto_stories'}
          </span>
          {currentStep.titulo}
        </div>
        <h2 className="font-bold text-sm mb-6 pb-4 border-b text-muted border-border">{currentStep.referencia}</h2>

        {currentStep.isOverview ? (
          <div className="flex flex-col gap-3 animate-fade-in">
            
            {/* O NOVO MENU MÁGICO (Aparece no Sábado após as 17h) */}
            {isSabadoTarde && liturgiaDomingo && (
              <div className="flex p-1.5 rounded-2xl w-full border shadow-inner border-border bg-muted/10 mb-4 animate-fade-in">
                <button 
                  onClick={() => handleTrocarAba('hoje')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    abaAtiva === 'hoje' ? 'bg-card text-primary shadow-sm' : 'text-muted hover:text-foreground'
                  }`}
                >
                  Sábado
                </button>
                <button 
                  onClick={() => handleTrocarAba('vigilia')}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                    abaAtiva === 'vigilia' ? 'bg-card text-primary shadow-sm' : 'text-muted hover:text-foreground'
                  }`}
                >
                  Domingo (Vigília)
                </button>
              </div>
            )}

            <p className="font-medium text-sm mb-4 text-muted">Se preferir acompanhar as leituras de hoje na sua própria Bíblia, procure as seguintes passagens:</p>

            {liturgia?.primeiraLeitura && (
              <div className="p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors bg-card border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary"><span className="material-symbols-rounded text-[20px]">auto_stories</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Primeira Leitura</p>
                  <p className={`font-bold text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.primeiraLeitura.referencia}</p>
                </div>
              </div>
            )}
            {liturgia?.salmo && (
              <div className="p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors bg-card border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary"><span className="material-symbols-rounded text-[20px]">music_note</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Salmo Responsorial</p>
                  <p className={`font-bold text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.salmo.referencia}</p>
                </div>
              </div>
            )}
            {liturgia?.segundaLeitura && typeof liturgia.segundaLeitura !== 'string' && (
              <div className="p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors bg-card border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary"><span className="material-symbols-rounded text-[20px]">menu_book</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Segunda Leitura</p>
                  <p className={`font-bold text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.segundaLeitura.referencia}</p>
                </div>
              </div>
            )}
            {liturgia?.evangelho && (
              <div className="p-4 rounded-[1.25rem] border shadow-sm flex items-center gap-4 transition-colors bg-card border-border">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"><span className="material-symbols-rounded text-[20px]">church</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Evangelho</p>
                  <p className={`font-bold text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>{liturgia.evangelho.referencia}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {currentStep.refrao && (
              <div className="mb-8 p-6 border-2 rounded-[1.5rem] shadow-sm flex flex-col items-center text-center transition-colors bg-card border-border">
                <span className="font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1 text-muted">
                  <span className="material-symbols-rounded text-[14px]">graphic_eq</span> Refrão
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold leading-snug text-foreground">
                  <span className="text-primary mr-2">—</span> {currentStep.refrao}
                </h3>
              </div>
            )}
            <article 
              className={`font-serif text-foreground ${fontReading} text-left ${currentStep.titulo === 'Evangelho' ? `p-6 md:p-8 rounded-3xl shadow-sm border bg-card border-border` : ''} ${currentStep.titulo === 'Salmo' ? 'text-center italic' : ''}`}
              dangerouslySetInnerHTML={{ __html: textoFormatado }}
            />
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-background from-70% to-transparent pt-12 pb-6 px-5 z-50">
        <div className="max-w-[800px] mx-auto flex gap-3">
          {/* BOTÃO VOLTAR: Só aparece se não estiver na primeira tela (Visão Geral) */}
          {currentStepIndex > 0 && (
            <button 
              onClick={handlePrevStep}
              className="flex items-center justify-center px-5 font-bold rounded-[1.5rem] border-2 border-border bg-card text-muted hover:text-foreground transition-all active:translate-y-[4px] shadow-[0_4px_0_var(--border)] active:shadow-none"
              aria-label="Voltar para a leitura anterior"
            >
              <span className="material-symbols-rounded">arrow_back</span>
            </button>
          )}

          {/* BOTÃO AVANÇAR / CONCLUIR */}
          <button 
            onClick={handleNextStep}
            className={`flex-1 font-bold py-5 rounded-[1.5rem] transition-all active:translate-y-[8px] flex items-center justify-center gap-2 ${currentStep.titulo === 'Evangelho' ? 'bg-emerald-500 text-white shadow-[0_8px_0_#059669] active:shadow-none' : 'bg-primary text-white shadow-[0_8px_0_var(--primary-light)] active:shadow-none'} hover:brightness-105 ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}
          >
            {currentStep.isOverview ? 'INICIAR LEITURA' : currentStep.titulo === 'Evangelho' ? 'CONCLUIR' : 'CONTINUAR'}
          </button>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import novenasJson from "@/data/novenas.json";
import { useUserStore } from "@/store/useUserStore";
import { NovenasData, NovenaDia } from "@/types/novena";
import { trackEvent } from "@/lib/analytics";

export default function NovenaLeituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [isMounted, setIsMounted] = useState(false);
  
  const db = novenasJson as NovenasData;
  const novena = db.detalhes[slug];

  const { novenasProgresso, toggleDiaNovena, tamanhoFonte, registrarAtividade } = useUserStore();
  const progresso = novenasProgresso[slug] || [];
  
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);

  const isNoveMeses = slug === '9-meses-com-maria';

  useEffect(() => { 
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "novena_detail", slug });
    return () => clearTimeout(mountTimer);
  }, [slug]);

  // Calendário Exato (25 de Março a 25 de Dezembro = 276 dias)
  const mesesCalendario = useMemo(() => {
    if (!isNoveMeses || !novena) return [];
    
    // Mapeamento real dos dias nos meses do calendário com a data de início
    const defs = [
      { nome: 'Março', start: 0, end: 6, startDay: 25 },         // 7 dias (25 a 31)
      { nome: 'Abril', start: 7, end: 36, startDay: 1 },        // 30 dias
      { nome: 'Maio', start: 37, end: 67, startDay: 1 },        // 31 dias
      { nome: 'Junho', start: 68, end: 97, startDay: 1 },       // 30 dias
      { nome: 'Julho', start: 98, end: 128, startDay: 1 },      // 31 dias
      { nome: 'Agosto', start: 129, end: 159, startDay: 1 },    // 31 dias
      { nome: 'Setembro', start: 160, end: 189, startDay: 1 },  // 30 dias
      { nome: 'Outubro', start: 190, end: 220, startDay: 1 },   // 31 dias
      { nome: 'Novembro', start: 221, end: 250, startDay: 1 },  // 30 dias
      { nome: 'Dezembro', start: 251, end: 275, startDay: 1 }   // 25 dias (1 a 25)
    ];

    const totalDiasNoJson = novena.dias.length;

    return defs.map(m => {
      if (m.start >= totalDiasNoJson) {
        return { ...m, availableStart: -1, availableEnd: -1, totalAvailable: 0 };
      }
      const availableStart = m.start;
      const availableEnd = Math.min(m.end, totalDiasNoJson - 1);
      return { ...m, availableStart, availableEnd, totalAvailable: availableEnd - availableStart + 1 };
    });
  }, [isNoveMeses, novena]);

  // Função mágica para descobrir o dia exato do mês com base no index geral
  const getInfoDia = (index: number) => {
    if (!isNoveMeses) return { numero: index + 1, titulo: `${index + 1}º Dia` };
    
    const defs = [
      { nome: 'Março', start: 0, end: 6, startDay: 25 },
      { nome: 'Abril', start: 7, end: 36, startDay: 1 },
      { nome: 'Maio', start: 37, end: 67, startDay: 1 },
      { nome: 'Junho', start: 68, end: 97, startDay: 1 },
      { nome: 'Julho', start: 98, end: 128, startDay: 1 },
      { nome: 'Agosto', start: 129, end: 159, startDay: 1 },
      { nome: 'Setembro', start: 160, end: 189, startDay: 1 },
      { nome: 'Outubro', start: 190, end: 220, startDay: 1 },
      { nome: 'Novembro', start: 221, end: 250, startDay: 1 },
      { nome: 'Dezembro', start: 251, end: 275, startDay: 1 }
    ];
    
    const mes = defs.find(m => index >= m.start && index <= m.end);
    if (!mes) return { numero: index + 1, titulo: `${index + 1}º Dia da Gestação` };
    
    const diaNumero = mes.startDay + (index - mes.start);
    return { numero: diaNumero, titulo: `${diaNumero} de ${mes.nome}` };
  };

  if (!novena) return <div className="min-h-[100dvh] bg-background" />;

  const fontReading = tamanhoFonte === 'grande' ? 'text-xl leading-[2.2]' : 'text-base leading-[1.8]';

  const renderConteudoLeitura = () => {
    if (diaSelecionado === null) return null;
    const infoDia = getInfoDia(diaSelecionado);

    return (
      <div className="rounded-[2rem] p-6 sm:p-10 shadow-soft border animate-fade-in relative transition-colors duration-300 bg-card border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-extrabold font-serif text-foreground">Leitura do Dia</h2>
            {/* O Título agora mostra a data bonita! Ex: 25 de Março */}
            <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">{infoDia.titulo}</p>
          </div>
          
          <button 
            onClick={() => {
              toggleDiaNovena(slug, diaSelecionado);
              registrarAtividade(); 
            }} 
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${ progresso.includes(diaSelecionado) ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-primary text-white shadow-md shadow-primary/20"}`}
          >
            <span className="material-symbols-rounded text-[20px]">{ progresso.includes(diaSelecionado) ? "check_circle" : "task_alt"}</span>
            { progresso.includes(diaSelecionado) ? "Dia Concluído" : "Marcar como Concluído"}
          </button>
        </div>
        
        <div className={`space-y-10 font-serif ${fontReading} text-foreground`}>
          <section>
            <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-widest mb-4">Oração Inicial</h4>
            <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoInicial }} />
          </section>
          
          <div className="flex justify-center my-8"><span className="w-12 h-1 rounded-full bg-border"></span></div>
          
          <section className="p-6 md:p-8 rounded-[1.5rem] border transition-colors border-border bg-muted/5">
            <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-widest mb-4">Meditação</h4>
            <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.dias[diaSelecionado].texto }} />
          </section>

          <div className="flex justify-center my-8"><span className="w-12 h-1 rounded-full bg-border"></span></div>
          
          <section>
            <h4 className="font-sans text-xs font-bold text-primary uppercase tracking-widest mb-4">Oração Final</h4>
            <div className="text-justify" dangerouslySetInnerHTML={{ __html: novena.oracaoFinal }} />
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href="/novenas" className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight truncate max-w-[200px] sm:max-w-[400px] text-foreground ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>
          {novena.titulo}
        </h1>
        <div className="w-10 h-10"></div>
      </header>
      
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* ========================================= */}
        {/* LÓGICA PADRÃO (Para as outras Novenas)      */}
        {/* ========================================= */}
        {!isNoveMeses && (
          <>
            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pl-2 text-muted">A Sua Jornada</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 md:gap-3">
                {novena.dias.map((d: NovenaDia, index: number) => {
                  const isDone = progresso.includes(index);
                  const isSelected = diaSelecionado === index;
                  
                  return (
                    <button 
                      key={index} onClick={() => setDiaSelecionado(index)}
                      className={`aspect-square flex flex-col items-center justify-center rounded-2xl font-bold transition-all active:scale-90 relative border-2 ${
                        isSelected 
                          ? "bg-primary text-white shadow-[0_4px_0_var(--primary-light)] translate-y-[-2px] border-primary" 
                          : isDone 
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                            : "bg-card text-muted border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">Dia</span>
                      <span className="text-lg leading-none font-black">{index + 1}</span>
                      {isDone && <span className="material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 rounded-full text-base shadow-sm bg-card">check_circle</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {renderConteudoLeitura()}
          </>
        )}

        {/* ========================================= */}
        {/* LÓGICA EXCLUSIVA (9 Meses com Maria)        */}
        {/* ========================================= */}
        {isNoveMeses && (
          <>
            {/* TELA 1: SELEÇÃO DE MESES */}
            {mesSelecionado === null && diaSelecionado === null && (
              <div className="mb-10 animate-fade-in">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pl-2 text-muted text-center">Calendário da Gestação</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {mesesCalendario.map((m, idx) => {
                    const diasDoMes = Array.from({length: m.totalAvailable}, (_, i) => m.availableStart + i);
                    const completados = diasDoMes.filter(d => progresso.includes(d)).length;
                    const totalMes = m.totalAvailable;
                    const isDone = totalMes > 0 && completados === (m.end - m.start + 1);
                    const isStarted = completados > 0 && !isDone;

                    return (
                      <button 
                        key={idx} 
                        onClick={() => setMesSelecionado(idx)}
                        disabled={totalMes === 0} 
                        className={`py-8 px-2 flex flex-col items-center justify-center rounded-[1.5rem] font-bold transition-all active:scale-95 relative border-2 ${
                          totalMes === 0 ? "opacity-40 cursor-not-allowed bg-muted/10 border-border" :
                          isDone
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : isStarted
                              ? "bg-primary/5 text-primary border-primary/30"
                              : "bg-card text-muted border-border hover:border-primary/50 shadow-sm"
                        }`}
                      >
                        <span className="text-xl sm:text-2xl font-black">{m.nome}</span>
                        {totalMes > 0 && (
                          <span className="text-[10px] mt-2 font-bold uppercase tracking-widest text-muted">
                            {completados} / {m.end - m.start + 1} dias
                          </span>
                        )}
                        {isDone && <span className="material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 rounded-full text-base shadow-sm bg-card">check_circle</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TELA 2: SELEÇÃO DE DIAS (Dentro do Mês escolhido) */}
            {mesSelecionado !== null && diaSelecionado === null && (
              <div className="mb-10 animate-fade-in">
                <button 
                  onClick={() => setMesSelecionado(null)} 
                  className="mb-6 flex items-center gap-2 text-muted hover:text-foreground font-bold text-sm bg-card border border-border px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all w-fit"
                >
                  <span className="material-symbols-rounded text-[20px]">arrow_back</span>
                  Voltar ao Calendário
                </button>
                
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pl-2 text-muted text-center">Dias de {mesesCalendario[mesSelecionado].nome}</h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 md:gap-3">
                  {Array.from({length: mesesCalendario[mesSelecionado].totalAvailable}, (_, i) => mesesCalendario[mesSelecionado].availableStart + i).map((originalIndex) => {
                    const isDone = progresso.includes(originalIndex);
                    // Aqui pegamos o número exato do dia (ex: 25, 26, 1, 2...)
                    const infoDia = getInfoDia(originalIndex);
                    
                    return (
                      <button 
                        key={originalIndex} 
                        onClick={() => setDiaSelecionado(originalIndex)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-2xl font-bold transition-all active:scale-90 relative border-2 ${
                          isDone 
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" 
                            : "bg-card text-muted border-border hover:border-primary/50 shadow-sm"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-widest opacity-80 mb-0.5">Dia</span>
                        <span className="text-lg leading-none font-black">{infoDia.numero}</span>
                        {isDone && <span className="material-symbols-rounded absolute -top-2 -right-2 text-emerald-500 rounded-full text-[14px] shadow-sm bg-card">check_circle</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TELA 3: LEITURA EM TELA CHEIA (COM A CORREÇÃO DO TYPESCRIPT!) */}
            {diaSelecionado !== null && (
              <div className="animate-fade-in pb-10">
                <button 
                  onClick={() => setDiaSelecionado(null)} 
                  className="mb-6 flex items-center gap-2 text-muted hover:text-foreground font-bold text-sm bg-card border border-border px-4 py-2 rounded-full shadow-sm active:scale-95 transition-all w-fit"
                >
                  <span className="material-symbols-rounded text-[20px]">arrow_back</span>
                  {/* TypeScript feliz agora: Verificamos se mesSelecionado existe antes de buscar */}
                  Voltar para {mesSelecionado !== null && mesesCalendario[mesSelecionado] ? mesesCalendario[mesSelecionado].nome : 'os Dias'}
                </button>
                {renderConteudoLeitura()}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
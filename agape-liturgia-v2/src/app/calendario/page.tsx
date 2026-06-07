"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { eventos2026 } from "@/data/eventos-2026";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

const mesesNomes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const eventosIgreja = [
  { data: '2026-01-01', titulo: 'Santa Maria, Mãe de Deus', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-04', titulo: 'Epifania do Senhor', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-11', titulo: 'Batismo do Senhor', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-17', titulo: 'Santo Antão', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-24', titulo: 'São Francisco de Sales', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-28', titulo: 'Santo Tomás de Aquino', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-01-31', titulo: 'São João Bosco', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-02-02', titulo: 'Apresentação do Senhor', descricao: 'Festa (N. Sra. dos Navegantes).', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-02-03', titulo: 'São Brás', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-02-11', titulo: 'Nossa Senhora de Lourdes', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-02-18', titulo: 'Quarta-feira de Cinzas', descricao: 'Início da Quaresma. Jejum e abstinência.', cor: 'bg-purple-600 text-white border-purple-700' },
  
  { data: '2026-03-19', titulo: 'São José', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-03-25', titulo: 'Anunciação do Senhor', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-03-29', titulo: 'Domingo de Ramos', descricao: 'Solenidade da Paixão do Senhor.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-03-30', titulo: 'Segunda-feira Santa', descricao: 'Semana Santa.', cor: 'bg-purple-600 text-white border-purple-700' },
  { data: '2026-03-31', titulo: 'Terça-feira Santa', descricao: 'Semana Santa.', cor: 'bg-purple-600 text-white border-purple-700' },
  
  { data: '2026-04-01', titulo: 'Quarta-feira Santa', descricao: 'Semana Santa.', cor: 'bg-purple-600 text-white border-purple-700' },
  { data: '2026-04-02', titulo: 'Quinta-feira Santa', descricao: 'Tríduo Pascal.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-03', titulo: 'Sexta-feira Santa', descricao: 'Paixão do Senhor. Jejum e abstinência.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-04-04', titulo: 'Sábado Santo', descricao: 'Vigília Pascal.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-05', titulo: 'Páscoa da Ressurreição', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-11', titulo: 'Santa Gemma Galgani', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-12', titulo: 'Domingo da Divina Misericórdia', descricao: '2º Domingo da Páscoa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-28', titulo: 'Sta. Gianna e S. Luís Montfort', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-04-29', titulo: 'Santa Catarina de Siena', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-05-01', titulo: 'São José Operário', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-02', titulo: 'Santo Atanásio', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-13', titulo: 'Nossa Senhora de Fátima', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-14', titulo: 'Ascensão do Senhor', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-21', titulo: 'Santa Rita de Cássia', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-24', titulo: 'Pentecostes / Auxiliadora', descricao: 'Solenidade.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-05-26', titulo: 'São Filipe Néri', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-05-31', titulo: 'Santíssima Trindade / Visitação', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-06-12', titulo: 'Sagrado Coração de Jesus', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-06-13', titulo: 'Imaculado Coração de Maria', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-06-21', titulo: 'São Luís Gonzaga', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-06-22', titulo: 'São Thomas More', descricao: 'Memória.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-06-24', titulo: 'Natividade de São João Batista', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-06-27', titulo: 'N. Sra. do Perpétuo Socorro', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-06-29', titulo: 'São Pedro e São Paulo', descricao: 'Solenidade.', cor: 'bg-red-600 text-white border-red-700' },
  
  { data: '2026-07-11', titulo: 'São Bento', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-07-12', titulo: 'São Luís e Santa Zélia Martin', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-07-16', titulo: 'Nossa Senhora do Carmo', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-07-22', titulo: 'Santa Maria Madalena', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-07-25', titulo: 'São Joaquim e Santa Ana', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-07-31', titulo: 'Santo Inácio de Loyola', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-08-01', titulo: 'Santo Afonso Maria de Ligório', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-04', titulo: 'São João Maria Vianney', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-06', titulo: 'Transfiguração do Senhor', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-10', titulo: 'Santa Filomena', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-11', titulo: 'Santa Clara', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-14', titulo: 'São Maximiliano Maria Kolbe', descricao: 'Memória.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-08-15', titulo: 'Assunção de Nossa Senhora', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-20', titulo: 'São Bernardo', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-25', titulo: 'São Luís IX', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-27', titulo: 'Santa Mônica', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-08-28', titulo: 'Santo Agostinho', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-09-14', titulo: 'Exaltação da Santa Cruz', descricao: 'Festa.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-09-15', titulo: 'Nossa Senhora das Dores', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-09-17', titulo: 'Santa Hildegarda de Bingen', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-09-23', titulo: 'São Pio de Pietrelcina', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-09-27', titulo: 'São Vicente de Paulo', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-09-29', titulo: 'Santos Arcanjos', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-09-30', titulo: 'São Jerônimo', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-10-01', titulo: 'Santa Teresinha do Menino Jesus', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-02', titulo: 'Santos Anjos da Guarda', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-04', titulo: 'São Francisco de Assis', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-05', titulo: 'Santa Faustina Kowalska', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-07', titulo: 'Nossa Senhora do Rosário', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-12', titulo: 'Nossa Senhora Aparecida', descricao: 'Solenidade (São Carlo Acutis).', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-15', titulo: 'Santa Teresa de Jesus', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-16', titulo: 'Santa Margarida Maria Alacoque', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-17', titulo: 'Santo Inácio de Antioquia', descricao: 'Memória.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-10-19', titulo: 'São Pedro de Alcântara', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-22', titulo: 'São João Paulo II', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-10-25', titulo: 'Santo Antônio Galvão', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  
  { data: '2026-11-01', titulo: 'Todos os Santos', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-11-02', titulo: 'Comemoração dos Fiéis Defuntos', descricao: 'Finados.', cor: 'bg-purple-600 text-white border-purple-700' },
  { data: '2026-11-21', titulo: 'Apresentação de Nossa Senhora', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-11-22', titulo: 'Cristo Rei do Universo', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-11-25', titulo: 'Santa Catarina de Alexandria', descricao: 'Memória.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-11-29', titulo: '1º Domingo do Advento', descricao: 'Início do Ano Litúrgico.', cor: 'bg-purple-600 text-white border-purple-700' },
  
  { data: '2026-12-08', titulo: 'Imaculada Conceição', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-12-12', titulo: 'Nossa Senhora de Guadalupe', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-12-13', titulo: 'Santa Luzia', descricao: 'Memória.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-12-14', titulo: 'São João da Cruz', descricao: 'Memória.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-12-25', titulo: 'Natal do Senhor', descricao: 'Solenidade.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-12-26', titulo: 'São Estêvão', descricao: 'Festa do primeiro mártir.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-12-27', titulo: 'São João, Apóstolo', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
  { data: '2026-12-28', titulo: 'Santos Inocentes', descricao: 'Festa.', cor: 'bg-red-600 text-white border-red-700' },
  { data: '2026-12-30', titulo: 'Sagrada Família', descricao: 'Festa.', cor: 'bg-white text-slate-800 border-slate-200' },
];

export default function CalendarioPage() {
  // Mantemos o isMounted para o mês ativo sincronizar corretamente com o relógio do cliente, sem quebrar.
  const [mesAtivo, setMesAtivo] = useState(1); // Inicia sempre em Janeiro no servidor
  const { tamanhoFonte, isAgape } = useUserStore();
  const { playPop, playClick } = useSound();
  const { triggerHaptic } = useHaptics();
  
  // Se não for do Ágape, força liturgia
  const [abaAtiva, setAbaAtiva] = useState<'grupo' | 'liturgia'>('grupo');

  useEffect(() => {
    if (isAgape === false) {
      setAbaAtiva('liturgia');
    }
  }, [isAgape]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const mesAtual = new Date().getMonth() + 1;
      setMesAtivo(mesAtual);
      
      // Fazer scroll suave para o mês atual assim que for definido
      setTimeout(() => {
        const el = document.getElementById(`mes-${mesAtual}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 50);
    }, 0);

    trackEvent("page_view", { page_name: "calendario_v2" });

    return () => clearTimeout(timer);
  }, []);

  const eventosFormatados = useMemo(() => {
    const lista = [];
    for (const [chave, dados] of Object.entries(eventos2026)) {
      const [diaStr, mesStr] = chave.split('-');
      lista.push({ dia: parseInt(diaStr), mes: parseInt(mesStr), ...dados });
    }
    return lista.sort((a, b) => a.dia - b.dia);
  }, []);

  const eventosDoMes = eventosFormatados.filter(e => e.mes === mesAtivo);

  const eventosLiturgiaFormatados = useMemo(() => {
    return eventosIgreja.map(e => {
      const parts = e.data.split('-');
      return { ...e, dia: parseInt(parts[2]), mes: parseInt(parts[1]) };
    }).sort((a, b) => a.dia - b.dia);
  }, []);

  const eventosLiturgiaDoMes = eventosLiturgiaFormatados.filter(e => e.mes === mesAtivo);

  const fontClass =  tamanhoFonte === 'grande' ? 'text-readable' : 'text-base';

  const getBadgeStyle = (tipo: string) => {
    // Usando as cores padrão do Tailwind com opacidade na cor de fundo
    switch (tipo) {
      case 'formacao': case 'reuniao': 
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30';
      case 'oracao': case 'retiro': case 'vivencia': 
        return 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30';
      case 'missa': case 'solenidade': 
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30';
      case 'festivo': case 'social': 
        return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
      default: 
        return 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30';
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link 
          href="/jornada"
          onClick={() => { playPop(); triggerHaptic('light'); }}
          className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight text-foreground ${ tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>
          {isAgape === false ? 'Calendário Litúrgico' : 'Calendário'}
        </h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* SELETOR DE ABAS (Só para Ágape) - NOVO ESTILO FOOLPROOF */}
        {isAgape !== false && (
          <div className="grid grid-cols-2 gap-4 mb-10 max-w-[400px] mx-auto">
            <button 
              type="button"
              onClick={() => { playPop(); triggerHaptic('light'); setAbaAtiva('grupo'); }}
              className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all duration-300 active:scale-95 ${
                abaAtiva === 'grupo' 
                  ? 'border-primary bg-primary/10 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50 opacity-70'
              }`}
            >
              <div className={`mb-2 pointer-events-none w-8 h-8 relative rounded-lg overflow-hidden transition-all ${abaAtiva === 'grupo' ? 'opacity-100 scale-110 shadow-sm' : 'opacity-40 grayscale saturate-0'}`}>
                <Image src="/icon-192x192.png" alt="Ágape" fill className="object-cover" />
              </div>
              <span className={`font-extrabold text-sm pointer-events-none ${abaAtiva === 'grupo' ? 'text-primary' : 'text-foreground'}`}>Ágape</span>
            </button>

            <button 
              type="button"
              onClick={() => { playPop(); triggerHaptic('light'); setAbaAtiva('liturgia'); }}
              className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all duration-300 active:scale-95 ${
                abaAtiva === 'liturgia' 
                  ? 'border-primary bg-primary/10 shadow-sm' 
                  : 'border-border bg-card hover:border-primary/50 opacity-70'
              }`}
            >
              <span className={`material-symbols-rounded text-3xl mb-2 pointer-events-none ${abaAtiva === 'liturgia' ? 'text-primary' : 'text-muted'}`}>church</span>
              <span className={`font-extrabold text-sm pointer-events-none ${abaAtiva === 'liturgia' ? 'text-primary' : 'text-foreground'}`}>Litúrgico</span>
            </button>
          </div>
        )}
        
        {/* TÍTULO DA ABA */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-4 shadow-inner text-primary bg-primary/10">
            <span className="material-symbols-rounded text-[32px]">
              {abaAtiva === 'grupo' ? 'calendar_month' : 'church'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1 text-foreground">
            {abaAtiva === 'grupo' ? 'Nosso Grupo' : 'Calendário Litúrgico'}
          </h2>
          <p className="font-medium text-sm text-muted">
            {abaAtiva === 'grupo' ? 'Eventos e encontros pastorais.' : 'Solenidades, Festas e Memórias de 2026.'}
          </p>
        </div>

        {/* O CARROSSEL DE MESES */}
        <div className="mb-10 -mx-5 px-5 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2">
            {mesesNomes.map((nome, index) => {
              const numMes = index + 1;
              const isSelected = mesAtivo === numMes;

              return (
                <button 
                  key={numMes} 
                  id={`mes-${numMes}`}
                  onClick={() => { playClick(); triggerHaptic('light'); setMesAtivo(numMes); }}
                  className={`px-5 py-3 rounded-[1rem] font-extrabold text-sm whitespace-nowrap transition-all active:scale-95 ${
                    isSelected 
                      ? `bg-primary text-white shadow-md`
                      : `bg-card text-muted border border-border hover:brightness-95`
                  }`}
                >
                  {nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* LISTA DE EVENTOS */}
        <div className="w-full">
          {abaAtiva === 'grupo' && (
            eventosDoMes.length === 0 ? (
              <div className="text-center py-12 text-muted font-medium">
                <span className="material-symbols-rounded text-5xl mb-2 opacity-50 text-muted">event_busy</span>
                <p className="text-muted">Nenhum evento do grupo agendado para este mês.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {eventosDoMes.map((evento, i) => (
                  <li key={i} className="rounded-[1.5rem] p-5 shadow-soft border flex items-center gap-4 transition-all hover:shadow-md bg-card border-border">
                    <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 bg-primary/10 rounded-2xl shadow-inner">
                      <span className="text-2xl font-black text-primary leading-none">
                        {String(evento.dia).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-extrabold leading-tight mb-1.5 text-foreground ${fontClass}`}>
                        {evento.titulo}
                      </h3>
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${getBadgeStyle(evento.tipo)}`}>
                        {evento.tipo}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}

          {abaAtiva === 'liturgia' && (
            eventosLiturgiaDoMes.length === 0 ? (
              <div className="text-center py-12 text-muted font-medium">
                <span className="material-symbols-rounded text-5xl mb-2 opacity-50 text-muted">church</span>
                <p className="text-muted">Nenhuma celebração litúrgica em destaque neste mês.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {eventosLiturgiaDoMes.map((evento, i) => (
                  <li key={i} className="rounded-[1.5rem] p-5 shadow-soft border flex items-center gap-4 transition-all hover:shadow-md bg-card border-border">
                    {/* Data com Cor Litúrgica */}
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border-2 ${evento.cor}`}>
                      {String(evento.dia).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-extrabold leading-tight mb-1 text-foreground ${fontClass}`}>
                        {evento.titulo}
                      </h3>
                      <p className="text-sm font-serif italic text-muted">
                        {evento.descricao}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

      </main>
    </div>
  );
}
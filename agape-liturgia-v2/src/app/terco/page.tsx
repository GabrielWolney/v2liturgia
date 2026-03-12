"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obterMisterioDoDia, getDataIso } from "@/lib/date-utils";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

const misteriosRosario: Record<string, string[]> = {
  "Gozosos": ["A Anunciação do Anjo a Nossa Senhora", "A Visitação de Nossa Senhora a Santa Isabel", "O Nascimento de Jesus em Belém", "A Apresentação do Menino Jesus no Templo", "A Perda e o Encontro de Jesus no Templo"],
  "Luminosos": ["O Batismo de Jesus no Jordão", "A Auto-revelação de Jesus nas Bodas de Caná", "O Anúncio do Reino de Deus e o convite à conversão", "A Transfiguração de Jesus no Monte Tabor", "A Instituição da Eucaristia"],
  "Dolorosos": ["A Agonia de Jesus no Horto das Oliveiras", "A Flagelação de Jesus atado à coluna", "A Coroação de espinhos de Nosso Senhor", "Jesus carrega a pesada Cruz para o Calvário", "A Crucifixão e Morte de Nosso Senhor"],
  "Gloriosos": ["A Ressurreição de Nosso Senhor Jesus Cristo", "A Ascensão de Jesus ao Céu", "A descida do Espírito Santo sobre os Apóstolos", "A Assunção de Nossa Senhora ao Céu", "A Coroação de Nossa Senhora como Rainha do Céu e da Terra"]
};

export default function SantoTercoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const { marcarTercoConcluido, modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "santo_terco_tematizado" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  const misterioHoje = obterMisterioDoDia();
  const listaMisterios = misteriosRosario[misterioHoje.tipo] || misteriosRosario["Gloriosos"];

  // --- CLASSES DO TEMA ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";

  // Lógica de Fonte
  const fontMeditation = tamanhoFonte === 'grande' ? 'text-xl leading-relaxed' : 'text-base leading-relaxed';
  const fontStandard = tamanhoFonte === 'grande' ? 'text-lg' : 'text-sm';
  const fontHeader = tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg';

  const handleFinish = () => {
    marcarTercoConcluido(getDataIso());
    setIsFinished(true);
    trackEvent("terco_concluido", { misterio: misterioHoje.tipo });
  };

  if (isFinished) {
    return (
      <div className={`h-[100dvh] flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors duration-300 ${wrapperClass}`}>
        <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-100'}`}>
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
        </div>
        <h1 className={`text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}>Terço Concluído!</h1>
        <p className={`font-medium mb-12 ${textMuted}`}>A sua coroa de orações foi entregue a Nossa Senhora.</p>
        <button onClick={() => router.push('/jornada')} className="w-full max-w-[400px] bg-[#2F6BFF] text-white font-bold py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:translate-y-[8px] active:shadow-none transition-all hover:brightness-105">
          VOLTAR À JORNADA
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#2F6BFF]/30 ${wrapperClass}`}>
      
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <button onClick={() => router.back()} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${fontHeader}`}>Santo Terço</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-6 animate-fade-in">
        
        <section className="bg-gradient-to-br from-[#2F6BFF] to-[#1E4BCC] rounded-[2rem] p-8 shadow-lg mb-8 text-white relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-white/10 pointer-events-none">
            <span className="material-symbols-rounded text-[140px]">cruelty_free</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif mb-2 leading-tight drop-shadow-md">
              {misterioHoje.tipo}
            </h2>
            <p className="text-white/90 font-medium text-sm flex items-center gap-2">
              Foco: <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">{misterioHoje.foco}</span>
            </p>
          </div>
        </section>

        <div className="mb-10">
          <h3 className={`font-bold text-sm uppercase tracking-widest mb-4 pl-2 ${textMuted}`}>Orações Iniciais</h3>
          <div className={`rounded-[1.5rem] p-6 shadow-soft border flex flex-col gap-6 transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div>
              <h4 className={`font-bold mb-1 ${textMain} ${fontStandard}`}>1. Sinal da Cruz</h4>
              <p className={`font-serif ${fontStandard} ${textMuted}`}>Em nome do Pai, e do Filho, e do Espírito Santo. Amém.</p>
            </div>
            <div>
              <h4 className={`font-bold mb-1 ${textMain} ${fontStandard}`}>2. Oferecimento</h4>
              <p className={`font-serif ${fontStandard} ${textMuted}`}>Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção...</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className={`font-bold text-sm uppercase tracking-widest mb-4 pl-2 ${textMuted}`}>Contemplação</h3>
          <div className="flex flex-col gap-3">
            {listaMisterios.map((mist, idx) => (
              <details key={idx} className={`group rounded-[1.5rem] shadow-soft border overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-colors duration-300 ${cardBg} ${borderColor}`}>
                <summary className={`flex items-center justify-between p-5 cursor-pointer outline-none transition-colors ${isDark ? 'hover:bg-slate-800' : isSepia ? 'hover:bg-[#E8DEC1]/50' : 'hover:bg-background'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] font-black flex items-center justify-center text-sm shrink-0">{idx + 1}</div>
                    <span className={`font-extrabold pr-4 ${textMain} ${fontHeader}`}>{idx + 1}º Mistério</span>
                  </div>
                  <span className={`material-symbols-rounded group-open:rotate-180 transition-transform duration-300 rounded-full p-1 shrink-0 ${isDark ? 'bg-slate-800 text-slate-400' : isSepia ? 'bg-[#E8DEC1] text-[#8C7B65]' : 'bg-background text-muted'}`}>expand_more</span>
                </summary>
                
                <div className={`p-5 pt-2 border-t ${borderColor} ${isDark ? 'bg-slate-950/50' : isSepia ? 'bg-[#E8DEC1]/20' : 'bg-background/50'}`}>
                  <p className={`font-serif font-semibold mb-4 text-center ${fontMeditation} ${textMain}`}>
                    {mist}
                  </p>
                  <div className={`flex flex-col gap-2 p-4 rounded-xl border ${borderColor} ${fontStandard} ${textMuted} ${isDark ? 'bg-slate-950' : 'bg-background'}`}>
                    <p className={`flex justify-between border-b pb-2 ${borderColor}`}><span>1x</span> <span className="font-bold">Pai Nosso</span></p>
                    <p className={`flex justify-between border-b pb-2 ${borderColor}`}><span>10x</span> <span className="font-bold">Ave-Marias</span></p>
                    <p className="flex justify-between pb-1"><span>1x</span> <span className="font-bold">Glória ao Pai</span></p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        <button 
          onClick={handleFinish} 
          className={`w-full bg-[#2F6BFF] text-white font-bold py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:translate-y-[8px] active:shadow-none transition-all flex items-center justify-center gap-2 hover:brightness-105 ${fontHeader}`}
        >
          <span className="material-symbols-rounded">task_alt</span>
          CONCLUÍ O TERÇO
        </button>

      </main>
    </div>
  );
}
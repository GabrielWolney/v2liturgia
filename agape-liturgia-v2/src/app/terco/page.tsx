"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obterMisterioDoDia, getDataIso } from "@/lib/date-utils";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

const misteriosRosario: Record<string, string[]> = {
  "Gozosos": [
    "A Anunciação do Arcanjo São Gabriel a Nossa Senhora.",
    "A Visitação de Nossa Senhora à sua prima Santa Isabel.",
    "O Nascimento do Menino Jesus em Belém.",
    "A Apresentação do Menino Jesus no Templo e a Purificação de Maria.",
    "A Perda e o Encontro do Menino Jesus no Templo."
  ],
  "Luminosos": [
    "O Batismo de Jesus no rio Jordão.",
    "O primeiro milagre de Jesus nas Bodas de Caná.",
    "O Anúncio do Reino de Deus e o convite à conversão.",
    "A Transfiguração de Jesus no monte Tabor.",
    "A Instituição da Eucaristia na Última Ceia."
  ],
  "Dolorosos": [
    "A Agonia de Jesus no Horto das Oliveiras.",
    "A Flagelação de Jesus atado à coluna.",
    "A Coroação de espinhos de Jesus.",
    "Jesus carrega a pesada Cruz até o monte Calvário.",
    "A Crucifixão e Morte de Jesus."
  ],
  "Gloriosos": [
    "A Ressurreição de Jesus.",
    "A Ascensão de Jesus ao Céu.",
    "A descida do Espírito Santo sobre Nossa Senhora e os Apóstolos.",
    "A Assunção de Nossa Senhora ao Céu.",
    "A Coroação de Nossa Senhora como Rainha do Céu e da Terra."
  ]
};

export default function SantoTercoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // Estado da Tela de Sucesso
  const { marcarTercoConcluido } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "santo_terco" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  const misterioHoje = obterMisterioDoDia();
  const listaMisterios = misteriosRosario[misterioHoje.tipo] || misteriosRosario["Gloriosos"];

  let bannerColor = "from-[#2F6BFF] to-[#1E4BCC]";
  if (misterioHoje.tipo === "Dolorosos") bannerColor = "from-[#6E3AA5] to-[#4A2673]";
  if (misterioHoje.tipo === "Gloriosos") bannerColor = "from-amber-400 to-amber-600";
  if (misterioHoje.tipo === "Luminosos") bannerColor = "from-emerald-400 to-emerald-600";

  const handleFinish = () => {
    marcarTercoConcluido(getDataIso());
    setIsFinished(true);
    trackEvent("terco_concluido", { misterio: misterioHoje.tipo });
  };

  // TELA DE SUCESSO IDÊNTICA À LITURGIA
  if (isFinished) {
    return (
      <div className="h-[100dvh] bg-[#F5F7FA] flex flex-col items-center justify-center p-6 text-center animate-fade-in selection:bg-[#2F6BFF]/30">
        <div className="w-32 h-32 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner relative">
          <span className="material-symbols-rounded text-emerald-500 text-[80px]">task_alt</span>
          <div className="absolute -top-3 -right-3 bg-orange-100 border-2 border-white rounded-full p-2 flex items-center justify-center shadow-md">
            <span className="material-symbols-rounded text-orange-500 text-[24px]">local_fire_department</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-2">Terço Concluído!</h1>
        <p className="text-[#6B6B6B] font-medium mb-12">A sua coroa de orações foi entregue a Nossa Senhora.</p>

        <button 
          onClick={() => router.push('/jornada')}
          className="w-full max-w-[400px] bg-[#2F6BFF] text-white font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[8px] transition-all hover:brightness-105"
        >
          VOLTAR À JORNADA
        </button>
      </div>
    );
  }

  // TELA NORMAL DE ORAÇÃO
  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <button 
          onClick={() => router.back()}
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Santo Terço</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-6 animate-fade-in">
        
        <section className={`bg-gradient-to-br ${bannerColor} rounded-[2rem] p-8 shadow-lg mb-8 text-white relative overflow-hidden`}>
          <div className="absolute -right-4 -top-4 text-white/10 pointer-events-none">
            <span className="material-symbols-rounded text-[140px]">cruelty_free</span>
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 border border-white/30">
              <span className="material-symbols-rounded text-[14px]">today</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest">Mistérios de Hoje</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif mb-2 leading-tight drop-shadow-md">
              {misterioHoje.tipo}
            </h2>
            <p className="text-white/90 font-medium text-sm flex items-center gap-2">
              Foco: <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md">{misterioHoje.foco}</span>
            </p>
          </div>
        </section>

        <div className="mb-10">
          <h3 className="font-bold text-sm text-[#6B6B6B] uppercase tracking-widest mb-4 pl-2">Orações Iniciais</h3>
          <div className="bg-white rounded-[1.5rem] p-6 shadow-soft border border-slate-100 flex flex-col gap-6">
            <div>
              <h4 className="font-bold text-[#1F1F1F] mb-1">1. Sinal da Cruz</h4>
              <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed">Em nome do Pai, e do Filho, e do Espírito Santo. Amém.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1F1F1F] mb-1">2. Oferecimento</h4>
              <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed">Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da nossa Redenção...</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1F1F1F] mb-1">3. Credo</h4>
              <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed italic">Na cruz do terço, reza-se o Creio em Deus Pai...</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1F1F1F] mb-1">4. Pai Nosso e três Ave-Marias</h4>
              <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed">1 Pai Nosso, 3 Ave-Marias e 1 Glória ao Pai.</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-sm text-[#6B6B6B] uppercase tracking-widest mb-4 pl-2">Contemplação</h3>
          <div className="flex flex-col gap-3">
            {listaMisterios.map((mist, idx) => (
              <details key={idx} className="group bg-white rounded-[1.5rem] shadow-soft border border-slate-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer outline-none hover:bg-slate-50 transition-colors active:bg-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2F6BFF]/10 text-[#2F6BFF] font-black flex items-center justify-center text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <span className="font-extrabold text-[#1F1F1F] text-sm sm:text-base pr-4">{idx + 1}º Mistério</span>
                  </div>
                  <span className="material-symbols-rounded text-[#6B6B6B] group-open:rotate-180 transition-transform duration-300 bg-[#F5F7FA] rounded-full p-1 shrink-0">
                    expand_more
                  </span>
                </summary>
                
                <div className="p-5 pt-2 border-t border-slate-50 bg-slate-50/50">
                  <p className="font-serif text-[#1F1F1F] font-semibold text-lg leading-relaxed mb-4 text-center">
                    {mist}
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-[#6B6B6B] bg-white p-4 rounded-xl border border-slate-100">
                    <p className="flex justify-between border-b border-slate-50 pb-2"><span>1x</span> <span className="font-bold">Pai Nosso</span></p>
                    <p className="flex justify-between border-b border-slate-50 pb-2"><span>10x</span> <span className="font-bold">Ave-Marias</span></p>
                    <p className="flex justify-between pb-1"><span>1x</span> <span className="font-bold">Glória ao Pai</span></p>
                  </div>
                  <div className="mt-4 text-center text-xs font-bold text-[#6B6B6B] uppercase tracking-widest italic">
                    &quot;Ó meu Jesus, perdoai-nos...&quot;
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-bold text-sm text-[#6B6B6B] uppercase tracking-widest mb-4 pl-2">Finalização</h3>
          <div className="bg-white rounded-[1.5rem] p-6 shadow-soft border border-slate-100 flex flex-col gap-6 text-center">
            <span className="material-symbols-rounded text-rose-500 text-[40px] mb-2">favorite</span>
            <h4 className="font-extrabold text-[#1F1F1F] text-xl font-serif">Agradecimento</h4>
            <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed italic">
              Infinitas graças Vos damos, Soberana Rainha...
            </p>
            <div className="h-px w-16 bg-slate-200 mx-auto my-2"></div>
            <h4 className="font-extrabold text-[#1F1F1F] text-lg font-serif">Salve Rainha</h4>
            <p className="text-sm text-[#6B6B6B] font-serif leading-relaxed">
              Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa...
            </p>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          className="w-full bg-[#2F6BFF] text-white font-bold text-lg py-5 rounded-[1.5rem] shadow-[0_8px_0_#1E4BCC] active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[8px] transition-all hover:brightness-105 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded">task_alt</span>
          CONCLUÍ O TERÇO
        </button>

      </main>
    </div>
  );
}
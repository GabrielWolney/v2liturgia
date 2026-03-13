"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { getCorLiturgica, calcularProgressoTempo } from "@/lib/date-utils";
import { LiturgiaDiaria } from "@/types/liturgia";

interface ModuloJornada {
  id: string;
  titulo: string;
  icone: string;
  href: string;
  bgClass: string;
  shadowClass: string;
  activeShadowClass: string;
}

// AGORA COM 10 MÓDULOS NA TRILHA (ZIG-ZAG PERFEITO)
const modulos: ModuloJornada[] = [
  { id: "palavra", titulo: "Leitura do Dia", icone: "menu_book", href: "/liturgia", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "terco", titulo: "Santo Terço", icone: "cruelty_free", href: "/terco", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "confissao", titulo: "Confissão", icone: "clean_hands", href: "/confissao", bgClass: "bg-[#6E3AA5]", shadowClass: "shadow-[0_10px_0_#4A2673]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "propositos", titulo: "Propósitos", icone: "flag", href: "/propositos", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" }, // <--- O NOVO MÓDULO AQUI!
  { id: "biblia", titulo: "Bíblia", icone: "auto_stories", href: "/biblia", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "mural", titulo: "Mural de Intercessão", icone: "volunteer_activism", href: "/mural", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "novenas", titulo: "Novenas", icone: "event", href: "/novenas", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
 { id: "oracoes", titulo: "Orações", icone: "self_improvement", href: "/oracoes", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "diario", titulo: "Meu Diário espiritual", icone: "edit_note", href: "/anotacoes", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
  { id: "calendario", titulo: "Calendário", icone: "calendar_month", href: "/calendario", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC]", activeShadowClass: "active:shadow-none active:translate-y-[10px]" },
];

export default function JornadaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  
  const { leiturasConcluidas, tercosConcluidos, modoVisual, tamanhoFonte, streak, verificarStreak } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    verificarStreak();
    getLiturgiaDoDia().then(setLiturgia);
    trackEvent("page_view", { page_name: "jornada_v2_fiel" });
    return () => clearTimeout(mountTimer);
  }, [verificarStreak]);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/80" : isSepia ? "bg-[#FDF6E3]/80" : "bg-card/60";
  const ringBgColor = isDark ? "#1e293b" : isSepia ? "#e2d1b1" : "#F1F5F9";
  const flagBorderColor = isDark ? "#020617" : isSepia ? "#FDF6E3" : "#F5F7FA";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";

  const fontClass = tamanhoFonte === "grande" ? "text-lg" : "text-sm";
  const fontLabel = tamanhoFonte === "grande" ? "text-[12px]" : "text-[10px]";

  const getButtonPositionClass = (index: number) => {
    const mod = index % 4;
    if (mod === 1) return "right-0";
    if (mod === 3) return "left-0";
    return "left-1/2 -translate-x-1/2";
  };

  const renderConnector = (index: number) => {
    const mod = index % 4;
    let svgPath = "";
    if (index === modulos.length - 1) {
      if (mod === 0 || mod === 2) svgPath = "M 160 0 L 160 176";
      else if (mod === 1) svgPath = "M 264 0 L 264 64 A 24 24 0 0 1 240 88 L 184 88 A 24 24 0 0 0 160 112 L 160 176";
      else if (mod === 3) svgPath = "M 56 0 L 56 64 A 24 24 0 0 0 80 88 L 136 88 A 24 24 0 0 1 160 112 L 160 176";
      return (
        <div className="absolute top-[56px] left-1/2 w-[320px] h-[176px] -translate-x-1/2 -z-10 pointer-events-none overflow-visible">
          <svg viewBox="0 0 320 176" className="w-full h-full overflow-visible">
            <path d={svgPath} fill="none" stroke="#2F6BFF" strokeWidth="10" strokeLinecap="round" strokeDasharray="16 16" className="opacity-40" />
          </svg>
        </div>
      );
    }
    if (mod === 0) svgPath = "M 160 0 L 160 64 A 24 24 0 0 0 184 88 L 240 88 A 24 24 0 0 1 264 112 L 264 176";
    else if (mod === 1) svgPath = "M 264 0 L 264 64 A 24 24 0 0 1 240 88 L 184 88 A 24 24 0 0 0 160 112 L 160 176";
    else if (mod === 2) svgPath = "M 160 0 L 160 64 A 24 24 0 0 1 136 88 L 80 88 A 24 24 0 0 0 56 112 L 56 176";
    else if (mod === 3) svgPath = "M 56 0 L 56 64 A 24 24 0 0 0 80 88 L 136 88 A 24 24 0 0 1 160 112 L 160 176";
    return (
      <div className="absolute top-[56px] left-1/2 w-[320px] h-[176px] -translate-x-1/2 -z-10 pointer-events-none overflow-visible">
        <svg viewBox="0 0 320 176" className="w-full h-full overflow-visible">
          <path d={svgPath} fill="none" stroke="#2F6BFF" strokeWidth="10" strokeLinecap="round" className={isDark ? "opacity-60" : "opacity-100"} />
        </svg>
      </div>
    );
  };

  const dataHojeISO = new Date().toLocaleDateString("en-CA");
  const jaLeuPalavra = !!leiturasConcluidas[dataHojeISO];
  const jaRezouTerco = !!tercosConcluidos[dataHojeISO];
  const tempoInfo = calcularProgressoTempo(liturgia?.liturgia || "Tempo Comum");
  const corDia = liturgia ? getCorLiturgica(liturgia.liturgia, liturgia.cor) : "verde";
  const hexColor = corDia === "roxo" ? "#6E3AA5" : corDia === "vermelho" ? "#EF4444" : corDia === "rosa" ? "#F472B6" : corDia === "branco" ? "#F59E0B" : "#10B981";

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-32 transition-colors duration-300 ${wrapperClass} bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_3px,_transparent_3px)] bg-[length:28px_28px]`}>
      <header className={`flex items-center justify-between p-3 sm:p-5 max-w-[600px] mx-auto w-full backdrop-blur-xl border-b sticky top-0 z-50 transition-colors ${headerBg} ${borderColor}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${arrowHover}`}>
            <span className="material-symbols-rounded text-[26px]">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src="/icon-192x192.png" className={`w-11 h-11 rounded-xl border-2 shadow-sm ${borderColor}`} alt="Logo" />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-[#2F6BFF] leading-none">Liturgia</span>
              <span className={`text-[9px] font-black uppercase tracking-wider ${textMuted}`}>Ágape de jovens</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          {/* FOGUINHO AQUI COMO LINK CLICÁVEL */}
          <Link 
            href="/progresso" 
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm transition-colors active:scale-95 ${isDark ? "bg-orange-950/30 border-orange-900/50 hover:bg-orange-900/40" : "bg-orange-50 border-orange-100 hover:bg-orange-100"} ${streak > 0 ? '' : 'opacity-50 grayscale'}`}
          >
            <span className="material-symbols-rounded text-orange-500 text-[18px]">local_fire_department</span>
            <span className="text-orange-500 font-extrabold text-sm">{streak}</span>
          </Link>
          <Link href="/menu" className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${arrowHover}`}>
            <span className="material-symbols-rounded text-[26px]">settings</span>
          </Link>
        </div>
      </header>

      <div className="px-5 mt-6 mb-10 max-w-[600px] mx-auto w-full">
        <div className={`rounded-[1.5rem] p-6 flex items-center justify-between shadow-soft border transition-colors ${cardBg} ${borderColor}`}>
          <div>
            <h2 className={`font-bold flex items-center gap-2 ${textMain} ${fontClass}`}>Tempo Litúrgico</h2>
            <p className={`text-[#2F6BFF] font-extrabold ${fontClass}`}>{tempoInfo.nome}</p>
          </div>
          <div className="relative w-[75px] h-[75px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke={ringBgColor} strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="42" stroke={hexColor} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={tempoInfo.dasharray} strokeDashoffset={tempoInfo.dashoffset} className="transition-all duration-1000" />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${textMain}`}>
              <span className="text-sm font-black">{tempoInfo.diaAtual}</span>
              <span className="text-[10px] opacity-60">/{tempoInfo.totalDias}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-[320px] mx-auto pt-2 relative z-0">
        {modulos.map((modulo, index) => {
          const isConcluido = (modulo.id === "palavra" && jaLeuPalavra) || (modulo.id === "terco" && jaRezouTerco);
          return (
            <div key={modulo.id} className="relative w-full h-[112px] mb-[64px]">
              {renderConnector(index)}
              <div className={`absolute top-0 w-[112px] h-[112px] z-10 ${getButtonPositionClass(index)}`}>
                <Link href={modulo.href} className={`relative w-full h-full rounded-[2rem] flex flex-col items-center justify-center transition-all ${modulo.bgClass} ${modulo.shadowClass} ${modulo.activeShadowClass} hover:brightness-105 group`}>
                  {isConcluido && (
                    <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-4 z-20" style={{ borderColor: flagBorderColor }}>
                      <span className="material-symbols-rounded text-base font-black">check</span>
                    </div>
                  )}
                  <span className="material-symbols-rounded text-[40px] text-white drop-shadow-md mb-1 group-active:scale-95 transition-transform">{modulo.icone}</span>
                  <span className={`text-white font-extrabold leading-tight text-center px-2 opacity-90 ${fontLabel}`}>{modulo.titulo}</span>
                </Link>
              </div>
            </div>
          );
        })}
        <div className="relative w-full flex flex-col items-center z-10 pt-4">
          <div className={`w-16 h-16 rounded-full border-[6px] outline outline-4 outline-[#2F6BFF] flex items-center justify-center shadow-lg mb-4 ${cardBg}`} style={{ borderColor: flagBorderColor }}>
            <span className="material-symbols-rounded text-[32px] text-[#2F6BFF]">sports_score</span>
          </div>
          <div className={`${cardBg} p-6 rounded-2xl border ${borderColor} text-center w-[280px]`}>
            <p className={`font-serif italic mb-3 ${textMain} ${fontClass}`}>&quot;A santidade consiste em fazer as pequenas coisas com grande amor.&quot;</p>
            <p className="font-bold text-[#2F6BFF] text-[10px] uppercase tracking-widest">Santa Teresinha do Menino Jesus</p>
          </div>
        </div>
      </main>
    </div>
  );
}
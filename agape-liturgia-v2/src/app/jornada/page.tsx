"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";

// --- TIPAGEM DOS MÓDULOS ---
interface ModuloJornada {
  id: string;
  titulo: string;
  icone: string;
  href: string;
  bgClass: string;
  shadowClass: string;
  activeShadowClass: string;
}

// TRILHA COMPLETA COM AMBOS (9 Módulos)
const modulos: ModuloJornada[] = [
  { id: "palavra", titulo: "Palavra do Dia", icone: "menu_book", href: "/liturgia", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "terco", titulo: "Santo Terço", icone: "cruelty_free", href: "/terco", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "oracoes", titulo: "Orações", icone: "self_improvement", href: "/oracoes", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "confissao", titulo: "Confissão", icone: "clean_hands", href: "/confissao", bgClass: "bg-[#6E3AA5]", shadowClass: "shadow-[0_10px_0_#4A2673,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#4A2673] active:translate-y-[10px]" }, // Destaque Roxo
  { id: "biblia", titulo: "Bíblia", icone: "auto_stories", href: "/biblia", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "mural", titulo: "Mural", icone: "volunteer_activism", href: "/mural", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "diario", titulo: "Meu Diário", icone: "edit_note", href: "/anotacoes", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "calendario", titulo: "Calendário", icone: "calendar_month", href: "/calendario", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
  { id: "novenas", titulo: "Novenas", icone: "event", href: "/novenas", bgClass: "bg-[#2F6BFF]", shadowClass: "shadow-[0_10px_0_#1E4BCC,0_15px_15px_rgba(0,0,0,0.15)]", activeShadowClass: "active:shadow-[0_0px_0_#1E4BCC] active:translate-y-[10px]" },
];

export default function JornadaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { leiturasConcluidas, tercosConcluidos } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "jornada_v2_fiel" });
    return () => clearTimeout(mountTimer);
  }, []);

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
      if (mod === 0 || mod === 2) {
        svgPath = "M 160 0 L 160 176";
      } else if (mod === 1) {
        svgPath = "M 264 0 L 264 64 A 24 24 0 0 1 240 88 L 184 88 A 24 24 0 0 0 160 112 L 160 176"; 
      } else if (mod === 3) {
        svgPath = "M 56 0 L 56 64 A 24 24 0 0 0 80 88 L 136 88 A 24 24 0 0 1 160 112 L 160 176";
      }

      return (
        <div className="absolute top-[56px] left-1/2 w-[320px] h-[176px] -translate-x-1/2 -z-10 pointer-events-none overflow-visible">
          <svg viewBox="0 0 320 176" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <path 
              d={svgPath} fill="none" stroke="#2F6BFF" strokeWidth="10" strokeLinecap="round"
              strokeDasharray="16 16" 
              className="opacity-60" 
              style={{ filter: "drop-shadow(0px 1px 4px rgba(47,107,255,0.3))" }} 
            />
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
        <svg viewBox="0 0 320 176" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d={svgPath} fill="none" stroke="#2F6BFF" strokeWidth="10" strokeLinecap="round" className="opacity-100" style={{ filter: "drop-shadow(0px 1px 4px rgba(47,107,255,0.3))" }} />
        </svg>
      </div>
    );
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F5F7FA]" />;

  const dataHojeISO = new Date().toLocaleDateString("en-CA");
  const jaLeuPalavra = !!leiturasConcluidas[dataHojeISO];
  const jaRezouTerco = !!tercosConcluidos[dataHojeISO];

  return (
    <div className="min-h-screen bg-[#F5F7FA] bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_3px,_transparent_3px)] bg-[length:28px_28px] flex flex-col font-sans pb-32 overflow-x-hidden selection:bg-[#2F6BFF]/30">
      
      <header className="flex items-center justify-between p-3 sm:p-5 max-w-[600px] mx-auto w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] gap-1">
        <div className="flex items-center gap-1 sm:gap-2 overflow-hidden">
          <Link href="/" className="w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:text-[#2F6BFF] hover:bg-blue-50 transition-colors active:scale-95 rounded-full shrink-0">
            <span className="material-symbols-rounded text-[26px]">arrow_back</span>
          </Link>
          <img src="/icon-192x192.png" alt="Logo" className="w-7 h-7 rounded-md shadow-sm border border-slate-200 shrink-0" />
          <h1 className="text-sm sm:text-lg font-extrabold text-[#1F1F1F] tracking-tight truncate">Liturgia Ágape</h1>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-orange-50 px-2 sm:px-3 py-1.5 rounded-full border border-orange-100 shadow-sm cursor-pointer hover:bg-orange-100 transition-colors">
            <span className="material-symbols-rounded text-orange-500 text-[16px] sm:text-[18px]">local_fire_department</span>
            <span className="text-orange-600 font-extrabold text-xs sm:text-sm">12</span>
          </div>
          <Link href="/menu" className="w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:text-[#2F6BFF] hover:bg-blue-50 transition-colors active:scale-95 rounded-full shrink-0">
            <span className="material-symbols-rounded text-[24px] sm:text-[26px]">settings</span>
          </Link>
        </div>
      </header>

      <div className="px-5 mt-6 mb-10 max-w-[600px] mx-auto w-full">
        <div className="bg-white rounded-[1.5rem] p-6 flex items-center justify-between shadow-soft border border-slate-200">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[#1F1F1F] text-lg sm:text-xl font-bold flex items-center gap-2">
              Tempo Litúrgico <span className="text-slate-300">—</span>
            </h2>
            <p className="text-[#2F6BFF] text-xl sm:text-2xl font-extrabold tracking-tight">Quaresma</p>
          </div>
          <div className="relative w-[75px] h-[75px] shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="42" stroke="#6E3AA5" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="263.89" strokeDashoffset={263.89 - (263.89 * (24 / 40))} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1F1F1F]">
              <span className="text-sm font-extrabold leading-none">24<span className="text-[10px] text-[#6B6B6B]">/40</span></span>
              <span className="text-[10px] font-bold text-[#6B6B6B]">dias</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col w-[320px] mx-auto pt-2 relative z-0">
        {modulos.map((modulo, index) => {
          // LÓGICA DO SUCESSO: Verifica se a Palavra ou o Terço foram concluídos!
          const isConcluido = 
            (modulo.id === "palavra" && jaLeuPalavra) || 
            (modulo.id === "terco" && jaRezouTerco);

          return (
            <div key={modulo.id} className="relative w-full h-[112px] mb-[64px]">
              {renderConnector(index)}

              <div className={`absolute top-0 w-[112px] h-[112px] z-10 ${getButtonPositionClass(index)}`}>
                <Link 
                  href={modulo.href}
                  className={`relative w-full h-full rounded-[2rem] flex flex-col items-center justify-center transition-all duration-200 
                    border-t-2 border-white/40 
                    ${modulo.bgClass} ${modulo.shadowClass} ${modulo.activeShadowClass}
                    hover:brightness-105 group
                  `}
                >
                  <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_5px_12px_rgba(255,255,255,0.3)] pointer-events-none"></div>

                  {/* CHECK VERDE DA VITÓRIA */}
                  {isConcluido && (
                    <div className="absolute -top-3 -right-3 bg-[#10b981] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-4 border-[#F5F7FA] z-20">
                      <span className="material-symbols-rounded text-[18px] font-black">check</span>
                    </div>
                  )}
                  
                  <span className="material-symbols-rounded text-[40px] text-white drop-shadow-md mb-1 transition-transform group-active:scale-95">
                    {modulo.icone}
                  </span>
                  
                  <span className="text-white font-extrabold text-[10px] leading-tight text-center px-2 relative z-10 opacity-90">
                    {modulo.titulo}
                  </span>
                </Link>
              </div>
            </div>
          );
        })}

        <div className="relative w-full flex flex-col items-center z-10 pt-4">
          <div className="w-16 h-16 rounded-full bg-white border-[6px] border-[#F5F7FA] outline outline-4 outline-[#2F6BFF] flex items-center justify-center shadow-lg mb-4">
            <span className="material-symbols-rounded text-[32px] text-[#2F6BFF]">sports_score</span>
          </div>

          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 text-center w-[280px]">
            <p className="font-serif italic text-[#1F1F1F] text-sm leading-relaxed mb-3">
              &quot;Combati o bom combate, terminei a corrida, guardei a fé.&quot;
            </p>
            <p className="font-bold text-[#2F6BFF] text-[10px] uppercase tracking-widest">
              — São Paulo (2 Tm 4,7)
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
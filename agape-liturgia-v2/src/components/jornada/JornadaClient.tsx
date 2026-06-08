"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { getCorLiturgica, calcularProgressoTempo } from "@/lib/date-utils";
import { LiturgiaDiaria } from "@/types/liturgia";
import { modulosVia as modulos } from "@/config/modulosVia";

interface AgapeWindow extends Window {
  __IS_MOUNTED__?: boolean;
}

export function JornadaClient({ liturgiaServer }: { liturgiaServer: LiturgiaDiaria | null }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(() => {
    if (typeof window !== 'undefined') return (window as AgapeWindow).__IS_MOUNTED__ || false;
    return false;
  });
  
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  const { 
    leiturasConcluidas, 
    tercosConcluidos, 
    modoVisual, 
    tamanhoFonte, 
    streak, 
    ultimaAtividade, 
    verificarStreak,
    modulosOrdem,
    modulosInativos,
    isAgape,
    formatoVia
  } = useUserStore();
  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      const win = window as AgapeWindow;
      win.__IS_MOUNTED__ = true;
      setIsMounted(true);
      
      verificarStreak();
      
      if (liturgiaServer) {
          setLiturgia(liturgiaServer);
      } else {
          getLiturgiaDoDia().then(setLiturgia);
      }
    }, 0);
    
    trackEvent("page_view", { page_name: "jornada_v2_fiel" });
    
    return () => clearTimeout(mountTimer);
  }, [verificarStreak, liturgiaServer]);

  const modulosAtuais = React.useMemo(() => {
    let modulosOrdenados = [...modulos];
    const modulosExclusivosAgape = ['propositos', 'mural', 'comunidade'];
    const modulosObrigatoriosAgape = ['palavra', 'terco', 'biblia', 'propositos', 'mural', 'comunidade'];

    if (modulosOrdem && modulosOrdem.length > 0) {
      modulosOrdenados.sort((a, b) => {
        const indexA = modulosOrdem.indexOf(a.id);
        const indexB = modulosOrdem.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    if (isAgape === false) {
      modulosOrdenados = modulosOrdenados.filter(m => !modulosExclusivosAgape.includes(m.id));
    }

    return modulosOrdenados.filter(m => {
      const isObrigatorio = isAgape === true && modulosObrigatoriosAgape.includes(m.id);
      if (isObrigatorio) return true;
      return !(modulosInativos || []).includes(m.id);
    });
  }, [modulosOrdem, modulosInativos, isAgape]);

  if (!isMounted) return <div className="min-h-screen bg-background transition-colors duration-300" />;

  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

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

  const renderConnector = (index: number, totalModulos: number) => {
    const mod = index % 4;
    let svgPath = "";
    if (index === totalModulos - 1) {
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
  const isFoguinhoAcesoHoje = ultimaAtividade === dataHojeISO;
  
  const foguinhoClass = isFoguinhoAcesoHoje
    ? isDark ? 'bg-orange-950/30 border-orange-900/50 text-orange-500' : 'bg-orange-50 border-orange-100 text-orange-500'
    : isDark ? 'bg-slate-800/50 border-slate-700 text-slate-500 grayscale opacity-80' : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-80';

  const jaLeuPalavra = !!leiturasConcluidas[dataHojeISO];
  const jaRezouTerco = !!tercosConcluidos[dataHojeISO];

  let tempoInfo = null;
  let hexColor = "#10B981"; // verde padrão

  if (liturgia) {
    tempoInfo = calcularProgressoTempo();
    const corDia = getCorLiturgica(liturgia.liturgia, liturgia.cor);
    
    // CORREÇÃO: Blindagem da cor do círculo litúrgico
    if (!corDia) {
      hexColor = "#10B981";
    } else {
      switch(corDia.toLowerCase().trim()) {
        // Branco Prata (modo claro) para contraste no cartão branco / Branco Puro (modo escuro)
        case 'branco': hexColor = isDark ? "#F8FAFC" : "#CBD5E1"; break;
        case 'roxo': hexColor = "#6E3AA5"; break;
        case 'vermelho': hexColor = "#EF4444"; break;
        case 'rosa': hexColor = "#F472B6"; break;
        case 'preto': hexColor = isDark ? "#334155" : "#0F172A"; break;
        default: hexColor = "#10B981"; // verde
      }
    }
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-32 transition-colors duration-300 bg-background bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_3px,_transparent_3px)] bg-[length:28px_28px]`}>
      
      <header 
        className="flex items-center justify-between transition-colors duration-300 px-4 sm:px-5 pb-4 sm:pb-5 max-w-[600px] mx-auto w-full relative z-20"
      >
        <div className="flex items-center gap-3">
          <Link href="/" className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${arrowHover}`}>
            <span className="material-symbols-rounded text-[24px]">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <img src="/icon-192x192.png" className="w-10 h-10 rounded-xl border shadow-sm" alt="Logo" />
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-[#2F6BFF] leading-none">Liturgia</span>
              <span className={`text-[8px] font-black uppercase tracking-wider text-muted`}>Ágape de jovens</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 cursor-pointer">
          <button onClick={() => { playPop(); triggerHaptic('light'); router.push('/progresso'); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-colors active:scale-95 ${foguinhoClass}`}>
            <span className="material-symbols-rounded text-[18px]">local_fire_department</span>
            <span className="font-extrabold text-sm">{streak}</span>
          </button>
          <button onClick={() => { playPop(); triggerHaptic('light'); router.push('/menu'); }} className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${arrowHover}`}>
            <span className="material-symbols-rounded text-[24px]">settings</span>
          </button>
        </div>
      </header>

      <div className="px-5 mt-6 mb-10 max-w-[600px] mx-auto w-full">
        {!liturgia || !tempoInfo ? (
          <div className={`rounded-[1.5rem] p-6 flex items-center justify-between shadow-soft border transition-colors duration-300 bg-card border-border animate-pulse`}>
            <div className="flex flex-col gap-2">
              <div className={`h-4 w-28 rounded-full ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]' : 'bg-slate-200'}`}></div>
              <div className={`h-6 w-36 rounded-full ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]' : 'bg-slate-200'}`}></div>
            </div>
            <div className={`w-[75px] h-[75px] rounded-full border-[10px] ${isDark ? 'border-slate-800' : isSepia ? 'border-[#E8DEC1]' : 'border-slate-200'}`}></div>
          </div>
        ) : (
          <div className={`rounded-[1.5rem] p-6 flex items-center justify-between shadow-soft border transition-colors duration-300 bg-card border-border animate-fade-in`}>
            <div>
              <h2 className={`font-bold flex items-center gap-2 text-foreground ${fontClass}`}>Tempo Litúrgico</h2>
              <p className={`text-[#2F6BFF] font-extrabold ${fontClass}`}>{tempoInfo.nome}</p>
            </div>
            <div className="relative w-[75px] h-[75px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke={ringBgColor} strokeWidth="10" fill="none" />
                <circle cx="50" cy="50" r="42" stroke={hexColor} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={tempoInfo.dasharray} strokeDashoffset={tempoInfo.dashoffset} className="transition-all duration-1000" />
              </svg>
              <div className={`absolute inset-0 flex flex-col items-center justify-center text-foreground`}>
                <span className="text-sm font-black">{tempoInfo.diaAtual}</span>
                <span className="text-[10px] opacity-60">/{tempoInfo.totalDias}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <main className="flex-1 flex flex-col w-[320px] mx-auto pt-2 relative z-0">
        {typeof Notification !== 'undefined' && Notification.permission === 'default' && (
          <div className="w-full mb-8 bg-[#2F6BFF]/10 border border-[#2F6BFF]/20 rounded-2xl p-4 flex items-center justify-between shadow-sm relative z-20">
            <div className="flex items-center gap-3">
              <span className="material-symbols-rounded text-[#2F6BFF]">notifications_active</span>
              <p className="text-sm font-bold text-[#2F6BFF]">Ative as notificações para o Mural e avisos.</p>
            </div>
            <button 
              onClick={async () => {
                playPop();
                triggerHaptic('light');
                await Notification.requestPermission();
                window.location.reload();
              }}
              className="bg-[#2F6BFF] text-white text-xs font-black px-4 py-2 rounded-xl hover:brightness-105 active:scale-95 transition-all"
            >
              ATIVAR
            </button>
          </div>
        )}

        {formatoVia === 'rastreio' ? (
          <div className="w-full flex flex-col gap-6 relative px-4">
            <div className={`absolute top-4 bottom-4 left-[38px] w-1 border-l-2 border-dashed ${isDark ? 'border-slate-800' : 'border-slate-200'} z-0`}></div>
            {modulosAtuais.map((modulo, index) => {
              const isConcluido = (modulo.id === "palavra" && jaLeuPalavra) || (modulo.id === "terco" && jaRezouTerco);
              return (
                <Link key={modulo.id} href={modulo.href} onClick={() => { playPop(); triggerHaptic('light'); }} className="relative z-10 flex items-center gap-5 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md border-2 border-background transition-transform group-active:scale-95 ${isConcluido ? 'bg-emerald-500' : modulo.bgClass} text-white`}>
                    {isConcluido ? (
                      <span className="material-symbols-rounded text-[28px] font-black">check</span>
                    ) : !modulo.isSvg ? (
                      <span className="material-symbols-rounded text-[28px]">{modulo.icone}</span>
                    ) : (
                      <div className="scale-[0.7]">{modulo.icone}</div>
                    )}
                  </div>
                  <div className={`flex-1 p-4 rounded-[1.5rem] border shadow-sm transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : isSepia ? 'bg-[#F4ECD8] border-[#E8DEC1]' : 'bg-card border-border'} flex items-center justify-between group-hover:brightness-95 group-active:brightness-90`}>
                    <span className={`font-bold ${tamanhoFonte === "grande" ? "text-base" : "text-sm"} text-foreground`}>{modulo.titulo}</span>
                    <span className="material-symbols-rounded text-muted opacity-50">chevron_right</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          modulosAtuais.map((modulo, index) => {
            const isConcluido = (modulo.id === "palavra" && jaLeuPalavra) || (modulo.id === "terco" && jaRezouTerco);
            return (
              <div key={modulo.id} className="relative w-full h-[112px] mb-[64px]">
                {renderConnector(index, modulosAtuais.length)}
                <div className={`absolute top-0 w-[112px] h-[112px] z-10 ${getButtonPositionClass(index)}`}>
                  <Link href={modulo.href} onClick={() => { playPop(); triggerHaptic('light'); }} className={`relative w-full h-full rounded-[2rem] flex flex-col items-center justify-center transition-all ${modulo.bgClass} ${modulo.shadowClass} ${modulo.activeShadowClass} hover:brightness-105 group text-white`}>
                    {isConcluido && (
                      <div className="absolute -top-3 -right-3 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md border-4 z-20" style={{ borderColor: flagBorderColor }}>
                        <span className="material-symbols-rounded text-base font-black">check</span>
                      </div>
                    )}
                    
                    {!modulo.isSvg ? (
                      <span className="material-symbols-rounded text-[40px] drop-shadow-md mb-1 group-active:scale-95 transition-transform">{modulo.icone}</span>
                    ) : (
                      modulo.icone
                    )}

                    <span className={`font-extrabold leading-tight text-center px-2 opacity-90 ${fontLabel}`}>{modulo.titulo}</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
        <div className="relative w-full flex flex-col items-center z-10 pt-4">
          <div className={`w-16 h-16 rounded-full border-[6px] outline outline-4 outline-[#2F6BFF] flex items-center justify-center shadow-lg mb-4 bg-card`} style={{ borderColor: flagBorderColor }}>
            <span className="material-symbols-rounded text-[32px] text-[#2F6BFF]">sports_score</span>
          </div>
          <div className={`bg-card p-6 rounded-2xl border border-border text-center w-[280px]`}>
            <p className={`font-serif italic mb-3 text-foreground ${fontClass}`}>&quot;A santidade consiste em fazer as pequenas coisas com grande amor.&quot;</p>
            <p className="font-bold text-[#2F6BFF] text-[10px] uppercase tracking-widest">Santa Teresinha do Menino Jesus</p>
          </div>
        </div>
      </main>
    </div>
  );
}
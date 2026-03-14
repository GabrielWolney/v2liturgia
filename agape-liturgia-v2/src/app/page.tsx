"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { getCorLiturgica, getImagemPorCor } from "@/lib/date-utils";
import { LiturgiaDiaria } from "@/types/liturgia";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { subscribeToAvisos, Aviso } from "@/services/db-home";

interface AgapeWindow extends Window {
  __IS_MOUNTED__?: boolean;
}

const formatarNomeLiturgia = (texto: string) => {
  if (!texto) return "";
  let formatado = texto
    .replace(/2[aª]\s*-?\s*feira/gi, "Segunda-feira")
    .replace(/3[aª]\s*-?\s*feira/gi, "Terça-feira")
    .replace(/4[aª]\s*-?\s*feira/gi, "Quarta-feira")
    .replace(/5[aª]\s*-?\s*feira/gi, "Quinta-feira")
    .replace(/6[aª]\s*-?\s*feira/gi, "Sexta-feira");

  formatado = formatado
    .replace(/2[aª]\s+(da|do|de)\b/gi, "Segunda-feira $1")
    .replace(/3[aª]\s+(da|do|de)\b/gi, "Terça-feira $1")
    .replace(/4[aª]\s+(da|do|de)\b/gi, "Quarta-feira $1")
    .replace(/5[aª]\s+(da|do|de)\b/gi, "Quinta-feira $1")
    .replace(/6[aª]\s+(da|do|de)\b/gi, "Sexta-feira $1");

  return formatado;
};

export default function PortalInicialPage() {
  const [isMounted, setIsMounted] = useState(() => {
    if (typeof window !== 'undefined') return (window as AgapeWindow).__IS_MOUNTED__ || false;
    return false;
  });
  
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  const [saudacaoTempo, setSaudacaoTempo] = useState("Olá");
  const [dataAtual, setDataAtual] = useState("");
  const [avisoAtual, setAvisoAtual] = useState<Aviso | null>(null);
  
  const { nomeUsuario, modoVisual, tamanhoFonte, streak, ultimaAtividade, verificarStreak, avisosLidos, marcarAvisoLido } = useUserStore();
  const { isInstallable, installPWA } = usePWAInstall();

  const avisosLidosRef = useRef(avisosLidos);
  useEffect(() => { avisosLidosRef.current = avisosLidos; }, [avisosLidos]);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      const win = window as AgapeWindow;
      win.__IS_MOUNTED__ = true;
      setIsMounted(true);
      
      const hora = new Date().getHours();
      if (hora >= 5 && hora < 12) setSaudacaoTempo("Bom dia");
      else if (hora >= 12 && hora < 18) setSaudacaoTempo("Boa tarde");
      else setSaudacaoTempo("Boa noite");

      const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      const rawDate = formatter.format(new Date());
      setDataAtual(rawDate.charAt(0).toUpperCase() + rawDate.slice(1));
    }, 0);

    verificarStreak();
    getLiturgiaDoDia().then(res => setLiturgia(res));
    trackEvent("page_view", { page_name: "portal_v2_premium" });

    const unsubAvisos = subscribeToAvisos((avisos) => {
      const naoLidos = avisos.filter(a => !avisosLidosRef.current.includes(a.id));
      if (naoLidos.length > 0) setAvisoAtual(naoLidos[0]);
    });

    return () => {
      clearTimeout(mountTimer);
      unsubAvisos();
    };
  }, [verificarStreak]);

  const fecharAviso = () => {
    if (avisoAtual) {
      marcarAvisoLido(avisoAtual.id);
      setAvisoAtual(null);
    }
  };

  if (!isMounted) return <div className="h-[100dvh] bg-background" />;

  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  
  const radialGradient = isDark 
    ? "bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_3px,_transparent_3px)]" 
    : isSepia 
    ? "bg-[radial-gradient(circle_at_center,_rgba(180,83,9,0.05)_3px,_transparent_3px)]"
    : "bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_3px,_transparent_3px)]";

  const corDia = liturgia ? getCorLiturgica(liturgia.liturgia, liturgia.cor) : "verde";
  const imagemLiturgica = getImagemPorCor(corDia);

  const getBannerGradient = (cor: string) => {
    switch(cor) {
      case 'verde': return 'from-emerald-400 to-emerald-600';
      case 'roxo': return 'from-[#6E3AA5] to-[#4A2673]';
      case 'vermelho': return 'from-red-500 to-red-700';
      case 'rosa': return 'from-pink-400 to-pink-600';
      default: return 'from-amber-400 to-amber-600';
    }
  };

  const getDotColor = (cor: string) => {
    switch(cor) {
      case 'verde': return 'bg-emerald-500';
      case 'roxo': return 'bg-[#6E3AA5]';
      case 'vermelho': return 'bg-red-500';
      case 'rosa': return 'bg-pink-500';
      default: return 'bg-amber-500'; 
    }
  };

  const getBadgeTextColor = (cor: string) => {
    switch(cor) {
      case 'verde': return 'text-emerald-700 dark:text-emerald-400';
      case 'roxo': return 'text-purple-700 dark:text-purple-400';
      case 'vermelho': return 'text-red-700 dark:text-red-400';
      case 'rosa': return 'text-pink-700 dark:text-pink-400';
      default: return 'text-amber-700 dark:text-amber-400'; 
    }
  };

  const dataHojeISO = new Date().toLocaleDateString("en-CA");
  const isFoguinhoAcesoHoje = ultimaAtividade === dataHojeISO;
  
  const foguinhoClass = isFoguinhoAcesoHoje
    ? isDark ? 'bg-orange-950/30 border-orange-900/50 text-orange-500' : 'bg-orange-50 border-orange-100 text-orange-500'
    : isDark ? 'bg-slate-800/50 border-slate-700 text-slate-500 grayscale opacity-80' : 'bg-slate-100 border-slate-200 text-slate-400 grayscale opacity-80';

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans relative overflow-hidden pb-10 transition-colors duration-300 ${wrapperClass} ${radialGradient} bg-[length:24px_24px]`}>
      
      {avisoAtual && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-[400px] rounded-[2.5rem] p-8 shadow-2xl border flex flex-col items-center text-center ${cardBg} ${borderColor}`}>
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6 shadow-inner">
              <span className="material-symbols-rounded text-[40px]">campaign</span>
            </div>
            <h2 className={`text-2xl font-black tracking-tight mb-4 ${textMain}`}>Aviso Importante</h2>
            <p className={`font-medium text-base leading-relaxed mb-8 ${textMuted}`}>{avisoAtual.texto}</p>
            <button onClick={fecharAviso} className="w-full bg-[#2F6BFF] text-white font-bold py-4 rounded-[1.5rem] shadow-[0_6px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all hover:brightness-105">
              ENTENDIDO
            </button>
          </div>
        </div>
      )}

      {/* HEADER AJUSTADO PARA O DESIGN DE PÍLULA FLUTUANTE */}
      <header className="flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img src="/icon-192x192.png" alt="Logo" className="w-10 h-10 rounded-xl border shadow-sm" />
          <div className="flex flex-col justify-center">
            <span className="font-black text-base tracking-tighter text-[#2F6BFF] leading-none">Liturgia</span>
            <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-90 ${textMuted}`}>Ágape de jovens</span>
          </div>
        </div>
        <Link href="/progresso" className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm transition-colors active:scale-95 ${foguinhoClass}`}>
          <span className="material-symbols-rounded text-[18px]">local_fire_department</span>
          <span className="font-extrabold text-sm">{streak}</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-6 max-w-[600px] mx-auto w-full justify-center">
        
        {isInstallable && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-[#2F6BFF] to-[#1E4BCC] rounded-[1.5rem] p-4 flex items-center justify-between text-white border border-[#2F6BFF]/50 shadow-lg shadow-[#2F6BFF]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0"><span className="material-symbols-rounded">app_shortcut</span></div>
                <div>
                  <p className="font-extrabold text-sm leading-tight">Instalar App</p>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Acesso nativo</p>
                </div>
              </div>
              <button onClick={installPWA} className="bg-white text-[#2F6BFF] text-xs font-black px-4 py-2.5 rounded-xl active:scale-95 shadow-sm">INSTALAR</button>
            </div>
          </div>
        )}

        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className={`font-extrabold tracking-tight mb-1 truncate max-w-full ${textMain} ${tamanhoFonte === 'grande' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
            {saudacaoTempo}, {nomeUsuario}
          </h1>
          <p className={`font-medium ${textMuted} ${tamanhoFonte === 'grande' ? 'text-base' : 'text-sm'}`}>{dataAtual}</p>
        </div>

        {!liturgia ? (
          <div className={`rounded-[2.5rem] p-4 sm:p-5 shadow-soft border w-full mb-8 ${cardBg} ${borderColor} animate-pulse`}>
            <div className={`w-full h-44 sm:h-52 rounded-[2rem] mb-6 flex items-end justify-center ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]/50' : 'bg-slate-200'}`}></div>
            <div className="px-2 pb-2 space-y-4">
              <div className={`h-4 w-1/3 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <div className={`h-8 w-2/3 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            </div>
          </div>
        ) : (
          <div className={`rounded-[2.5rem] p-4 sm:p-5 shadow-soft border w-full mb-8 transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div className={`w-full h-44 sm:h-52 rounded-[2rem] mb-6 relative overflow-hidden bg-gradient-to-tr flex items-end justify-center shadow-inner ${getBannerGradient(corDia)}`}>
              <div className="relative w-full h-[90%] z-10 animate-float flex items-end justify-center">
                <Image src={imagemLiturgica} alt="Liturgia" width={165} height={220} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]" priority />
              </div>
              
              <div className={`absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border ${borderColor} shadow-sm z-20`}>
                <div className={`w-2 h-2 rounded-full ${getDotColor(corDia)} shadow-inner`}></div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${getBadgeTextColor(corDia)}`}>
                  {corDia === 'branco' ? 'Festivo' : corDia}
                </span>
              </div>
            </div>

            <div className="px-2 pb-2">
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${textMuted}`}>Tempo Litúrgico</p>
              
              <h2 className={`font-extrabold leading-tight mb-6 ${textMain} ${tamanhoFonte === 'grande' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                {formatarNomeLiturgia(liturgia.liturgia)}
              </h2>
              
              <div className={`pt-4 border-t flex items-center justify-between group ${borderColor}`}>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${textMuted}`}>Santo do Dia</p>
                  <p className={`font-bold ${textMain} ${tamanhoFonte === 'grande' ? 'text-base' : 'text-sm'}`}>Conhecer a História</p>
                </div>
                <a href="https://santo.cancaonova.com" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center text-[#2F6BFF] ${isDark ? 'bg-slate-800' : 'bg-background'}`}>
                  <span className="material-symbols-rounded text-[20px]">north_east</span>
                </a>
              </div>
            </div>
          </div>
        )}

        <Link href="/jornada" className="w-full bg-[#2F6BFF] text-white font-black text-lg py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_8px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all hover:brightness-105">
          ACESSAR PEQUENA VIA <span className="material-symbols-rounded">arrow_forward</span>
        </Link>
      </main>
    </div>
  );
}
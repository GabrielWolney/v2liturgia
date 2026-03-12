"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { getCorLiturgica, getImagemPorCor } from "@/lib/date-utils";
import { LiturgiaDiaria } from "@/types/liturgia";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function PortalInicialPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  const [saudacaoTempo, setSaudacaoTempo] = useState("Olá");
  const [dataAtual, setDataAtual] = useState("");
  
  const { nomeUsuario, modoVisual, tamanhoFonte } = useUserStore();
  const { isInstallable, installPWA } = usePWAInstall();

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      
      const hora = new Date().getHours();
      if (hora >= 5 && hora < 12) setSaudacaoTempo("Bom dia");
      else if (hora >= 12 && hora < 18) setSaudacaoTempo("Boa tarde");
      else setSaudacaoTempo("Boa noite");

      const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      const rawDate = formatter.format(new Date());
      setDataAtual(rawDate.charAt(0).toUpperCase() + rawDate.slice(1));
    }, 0);

    getLiturgiaDoDia().then(res => setLiturgia(res));
    trackEvent("page_view", { page_name: "portal_v2_premium" });

    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted || !liturgia) return <div className="h-[100dvh] bg-background transition-colors duration-300" />;

  const corDia = getCorLiturgica(liturgia.liturgia, liturgia.cor);
  const imagemLiturgica = getImagemPorCor(corDia);

  // --- CLASSES DINÂMICAS PARA TEMAS ---
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

  // Lógica de Fonte
  const fontGreeting = tamanhoFonte === 'grande' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl';
  const fontLiturgy = tamanhoFonte === 'grande' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl';
  const fontSmall = tamanhoFonte === 'grande' ? 'text-base' : 'text-sm';

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

  const bannerGradient = getBannerGradient(corDia);
  const dotColorClass = getDotColor(corDia);

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans relative overflow-hidden pb-10 transition-colors duration-300 ${wrapperClass} ${radialGradient} bg-[length:24px_24px]`}>
      
      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between p-6 md:pt-10 max-w-[600px] mx-auto w-full shrink-0">
        <div className="flex items-center gap-3">
          <img src="/icon-192x192.png" alt="Logo Ágape" className={`w-10 h-10 rounded-xl shadow-sm border ${borderColor}`} />
          <span className={`font-extrabold text-lg tracking-tight ${textMain}`}>Liturgia Ágape</span>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm transition-colors ${isDark ? 'bg-orange-950/30 border-orange-900/50' : 'bg-orange-50 border-orange-100'}`}>
          <span className="material-symbols-rounded text-orange-500 text-[18px]">local_fire_department</span>
          <span className="text-orange-500 font-extrabold text-sm">12</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-6 max-w-[600px] mx-auto w-full justify-center">
        
        {/* BANNER DE INSTALAÇÃO PWA */}
        {isInstallable && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-[#2F6BFF] to-[#1E4BCC] rounded-[1.5rem] p-4 flex items-center justify-between shadow-lg shadow-[#2F6BFF]/20 text-white border border-[#2F6BFF]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-rounded">app_shortcut</span>
                </div>
                <div>
                  <p className="font-extrabold text-sm leading-tight">Instalar App Ágape</p>
                  <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Acesso rápido e offline</p>
                </div>
              </div>
              <button 
                onClick={installPWA}
                className="bg-white text-[#2F6BFF] text-xs font-black px-4 py-2.5 rounded-xl active:scale-95 transition-transform shadow-sm"
              >
                INSTALAR
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className={`font-extrabold tracking-tight mb-1 truncate max-w-full ${textMain} ${fontGreeting}`}>
            {saudacaoTempo}, {nomeUsuario}
          </h1>
          <p className={`font-medium ${textMuted} ${fontSmall}`}>
            {dataAtual}
          </p>
        </div>

        {/* CARD DA LITURGIA PREMIUM */}
        <div className={`rounded-[2.5rem] p-4 sm:p-5 shadow-soft border w-full mb-8 transition-colors duration-300 ${cardBg} ${borderColor}`}>
          
          {/* BANNER COM IMAGEM DINÂMICA */}
          <div className={`w-full h-44 sm:h-52 rounded-[2rem] mb-6 relative overflow-hidden bg-gradient-to-tr ${bannerGradient} flex items-end justify-center shadow-inner transition-all duration-500`}>
            
            <div className="relative w-full h-[90%] z-10 animate-float flex items-end justify-center">
              <Image 
                src={imagemLiturgica} 
                alt={liturgia.liturgia}
                width={165}
                height={220}
                className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
                priority
              />
            </div>

            {/* Marca d'água no fundo */}
            <span className="absolute -bottom-6 -right-6 material-symbols-rounded text-white/15 text-[150px] rotate-12 pointer-events-none z-0">
              {corDia === 'verde' ? 'eco' : corDia === 'roxo' ? 'church' : 'local_fire_department'}
            </span>

            {/* Badge da Cor */}
            <div className={`absolute top-4 left-4 ${cardBg}/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border ${borderColor} shadow-sm z-20`}>
              <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass} shadow-inner`}></div>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${textMain}`}>
                {corDia === 'branco' ? 'Festivo' : corDia}
              </span>
            </div>
          </div>

          <div className="px-2 pb-2">
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${textMuted}`}>Tempo Litúrgico</p>
            <h2 className={`font-extrabold leading-tight mb-6 ${textMain} ${fontLiturgy}`}>{liturgia.liturgia}</h2>

            <div className={`pt-4 border-t flex items-center justify-between group ${borderColor}`}>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${textMuted}`}>Santo do Dia</p>
                <p className={`font-bold ${textMain} ${fontSmall}`}>Conhecer a História</p>
              </div>
              <a href="https://santo.cancaonova.com" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-full flex items-center justify-center text-[#2F6BFF] transition-colors active:scale-95 group-hover:bg-[#2F6BFF] group-hover:text-white ${isDark ? 'bg-slate-800' : isSepia ? 'bg-[#E8DEC1]/50' : 'bg-background'}`}>
                <span className="material-symbols-rounded text-[20px]">north_east</span>
              </a>
            </div>
          </div>
        </div>

        <Link href="/jornada" className="w-full bg-[#2F6BFF] text-white font-black text-lg py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_8px_0_#1E4BCC] active:translate-y-1 active:shadow-[0_0px_0_#1E4BCC] transition-all hover:brightness-105">
          ACESSAR JORNADA
          <span className="material-symbols-rounded">arrow_forward</span>
        </Link>
      </main>
    </div>
  );
}
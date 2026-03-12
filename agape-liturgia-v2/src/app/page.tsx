"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { getDataIso, getCorLiturgica } from "@/lib/date-utils";
import { LiturgiaDiaria } from "@/types/liturgia";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall"; // <-- HOOK PWA IMPORTADO

export default function PortalInicialPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [liturgia, setLiturgia] = useState<LiturgiaDiaria | null>(null);
  const [saudacaoTempo, setSaudacaoTempo] = useState("Olá");
  const [dataAtual, setDataAtual] = useState("");
  
  const { nomeUsuario } = useUserStore();
  const { isInstallable, installPWA } = usePWAInstall(); // <-- CONTROLO PWA

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
      
      const hora = new Date().getHours();
      if (hora >= 5 && hora < 12) setSaudacaoTempo("Bom dia");
      else if (hora >= 12 && hora < 18) setSaudacaoTempo("Boa tarde");
      else setSaudacaoTempo("Boa noite");

      const opcoesData: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      let dataFormatada = new Intl.DateTimeFormat('pt-BR', opcoesData).format(new Date());
      dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
      setDataAtual(dataFormatada);
    }, 0);

    getLiturgiaDoDia().then(res => setLiturgia(res));
    trackEvent("page_view", { page_name: "portal_v2" });

    return () => clearTimeout(mountTimer);
  }, []);

  const getBannerGradient = (cor: string) => {
    switch(cor) {
      case 'verde': return 'from-emerald-400 to-emerald-600';
      case 'roxo': return 'from-[#6E3AA5] to-[#4A2673]';
      case 'vermelho': return 'from-red-500 to-red-700';
      case 'rosa': return 'from-pink-400 to-pink-600';
      default: return 'from-slate-300 to-slate-400';
    }
  };

  const getDotColor = (cor: string) => {
    switch(cor) {
      case 'verde': return 'bg-emerald-500 text-emerald-800';
      case 'roxo': return 'bg-[#6E3AA5] text-[#3b1e5a]';
      case 'vermelho': return 'bg-red-500 text-red-900';
      case 'rosa': return 'bg-pink-500 text-pink-900';
      default: return 'bg-slate-500 text-slate-800';
    }
  };

  if (!isMounted || !liturgia) {
    return (
      <div className="h-[100dvh] bg-[#F5F7FA] bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_2px,_transparent_2px)] bg-[length:24px_24px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#2F6BFF]/20 animate-pulse flex items-center justify-center">
          <span className="material-symbols-rounded text-[#2F6BFF] text-2xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  const corDia = getCorLiturgica(liturgia.liturgia, liturgia.cor);
  const bannerGradient = getBannerGradient(corDia);
  const dotColor = getDotColor(corDia);

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_2px,_transparent_2px)] bg-[length:24px_24px] flex flex-col font-sans relative overflow-hidden pb-10">
      
      <header className="relative z-10 flex items-center justify-between p-6 md:pt-10 max-w-[600px] mx-auto w-full shrink-0">
        <div className="flex items-center gap-3">
          <img src="/icon-192x192.png" alt="Logo Ágape" className="w-10 h-10 rounded-xl shadow-sm border border-slate-200" />
          <span className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Liturgia Ágape</span>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
          <span className="material-symbols-rounded text-orange-500 text-[18px]">local_fire_department</span>
          <span className="text-orange-600 font-extrabold text-sm">12</span>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col px-6 max-w-[600px] mx-auto w-full">
        
        {/* BANNER DE INSTALAÇÃO PWA (Só aparece se for instalável) */}
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

        <div className="mb-8 text-center flex flex-col items-center mt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F1F1F] tracking-tight mb-1 truncate max-w-full">
            {saudacaoTempo}, {nomeUsuario}
          </h1>
          <p className="text-[#6B6B6B] font-medium text-sm">
            {dataAtual}
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-4 sm:p-5 shadow-soft border border-slate-100 w-full mb-8">
          <div className={`w-full h-40 sm:h-48 rounded-[1.25rem] mb-5 relative overflow-hidden bg-gradient-to-tr ${bannerGradient} flex items-end justify-center shadow-inner`}>
            <span className="material-symbols-rounded text-white/20 text-[100px] drop-shadow-md mb-[-10px]">
              {corDia === 'verde' ? 'eco' : corDia === 'roxo' ? 'church' : corDia === 'vermelho' ? 'local_fire_department' : corDia === 'rosa' ? 'favorite' : 'light_mode'}
            </span>
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColor.split(' ')[0]} shadow-inner`}></div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest capitalize ${dotColor.split(' ')[1]}`}>
                {corDia}
              </span>
            </div>
          </div>

          <div className="px-2">
            <p className="text-[#6B6B6B] text-xs font-bold uppercase tracking-widest mb-1">Tempo Litúrgico</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F] leading-tight mb-6">{liturgia.liturgia}</h2>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between group">
              <div>
                <p className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-widest mb-0.5">Santo do Dia</p>
                <p className="text-[#1F1F1F] font-bold text-sm">Conhecer a História</p>
              </div>
              <a href="https://santo.cancaonova.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#2F6BFF] group-hover:bg-[#2F6BFF] group-hover:text-white transition-colors active:scale-95">
                <span className="material-symbols-rounded text-[20px]">north_east</span>
              </a>
            </div>
          </div>
        </div>

        <Link href="/jornada" className="w-full bg-[#2F6BFF] text-white font-bold text-lg py-5 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-[0_6px_0_#1E4BCC] active:translate-y-1 active:shadow-[0_0px_0_#1E4BCC] transition-all hover:brightness-105">
          ACESSAR JORNADA
          <span className="material-symbols-rounded">arrow_forward</span>
        </Link>
      </main>
    </div>
  );
}
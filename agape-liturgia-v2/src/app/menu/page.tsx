"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function ConfigPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { nomeUsuario, setNomeUsuario, modoVisual, setModoVisual, tamanhoFonte, setTamanhoFonte } = useUserStore();
  const { isInstallable, installPWA } = usePWAInstall();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(mountTimer);
  }, []);

  const handleApagarDados = () => {
    if (window.confirm("Atenção: Deseja apagar TODOS os seus dados? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("agape-storage");
      window.location.reload();
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const inputBg = isDark ? "bg-slate-800" : isSepia ? "bg-[#F4ECD8]" : "bg-background";
  
  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-10 transition-colors duration-300 selection:bg-primary/30 ${wrapperClass}`}>
      
      <header className={`flex items-center p-4 sm:p-5 max-w-[600px] mx-auto w-full sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${headerBg} ${borderColor}`}>
        <button onClick={() => router.back()} className={`w-10 h-10 flex items-center justify-center active:scale-95 rounded-full shadow-sm border transition-colors ${cardBg} ${borderColor} ${textMuted} hover:text-primary`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`flex-1 text-center font-extrabold tracking-tight pr-10 ${textMain} ${fontClass}`}>Configurações</h1>
      </header>

      <main className="flex-1 px-5 pt-4 max-w-[600px] mx-auto w-full">
        
        {isInstallable && (
          <section className="mb-8 animate-fade-in">
            <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-2 ${textMuted}`}>Aplicativo</p>
            <div className="bg-gradient-to-br from-primary to-[#1E4BCC] rounded-[1.5rem] p-5 shadow-md border border-primary/50 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-rounded text-[32px] bg-white/20 p-2.5 rounded-2xl shadow-inner">get_app</span>
                <div>
                  <span className="font-extrabold block text-base mb-0.5">Instalar App</span>
                  <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest block leading-tight">Experiência nativa</span>
                </div>
              </div>
              <button onClick={installPWA} className="bg-white text-primary px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-transform shadow-sm">
                INSTALAR
              </button>
            </div>
          </section>
        )}

        <section className="mb-8">
          <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-2 ${textMuted}`}>Seu Perfil</p>
          <div className={`rounded-[1.5rem] p-5 shadow-sm border flex flex-col gap-4 transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className={`font-bold text-sm ${textMain}`}>Como prefere ser chamado?</label>
              <div className="relative">
                <span className={`material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}>person</span>
                <input 
                  id="nome" type="text" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} maxLength={15}
                  className={`w-full border-2 rounded-xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:border-primary transition-all ${inputBg} ${borderColor} ${textMain}`}
                  placeholder="Seu nome"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-2 ${textMuted}`}>Aparência da Leitura</p>
          <div className={`rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-6 transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <div>
              <p className={`font-bold text-sm mb-3 ${textMain}`}>Modo Visual</p>
              <div className={`flex p-1.5 rounded-2xl border ${wrapperClass} ${borderColor}`}>
                <button onClick={() => setModoVisual("claro")} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "claro" ? `${cardBg} shadow-sm text-primary` : `${textMuted} hover:brightness-95`}`}>
                  <span className="material-symbols-rounded text-[22px]">light_mode</span><span className="text-[10px] font-bold uppercase tracking-wide">Claro</span>
                </button>
                <button onClick={() => setModoVisual("escuro")} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "escuro" ? `${cardBg} shadow-sm text-primary` : `${textMuted} hover:brightness-95`}`}>
                  <span className="material-symbols-rounded text-[22px]">dark_mode</span><span className="text-[10px] font-bold uppercase tracking-wide">Escuro</span>
                </button>
                <button onClick={() => setModoVisual("leitura")} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "leitura" ? `${cardBg} shadow-sm text-primary` : `${textMuted} hover:brightness-95`}`}>
                  <span className="material-symbols-rounded text-[22px]">auto_stories</span><span className="text-[10px] font-bold uppercase tracking-wide">Leitura</span>
                </button>
              </div>
            </div>

            <div>
              <p className={`font-bold text-sm mb-3 ${textMain}`}>Tamanho do Texto Bíblico</p>
              <div className="flex gap-3">
                <button onClick={() => setTamanhoFonte("padrao")} className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${tamanhoFonte === "padrao" ? "border-primary bg-primary/5 text-primary" : `${borderColor} ${wrapperClass} ${textMuted}`}`}>
                  Aa Padrão
                </button>
                <button onClick={() => setTamanhoFonte("grande")} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${tamanhoFonte === "grande" ? "border-primary bg-primary/5 text-primary" : `${borderColor} ${wrapperClass} ${textMuted}`} ${tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>
                  Aa Grande
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* INVERTIDO: APAGAR DADOS VEM PRIMEIRO */}
        <section className="mb-8">
          <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-2 ${textMuted}`}>Privacidade e Dados</p>
          <div className={`rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <button onClick={handleApagarDados} className="w-full flex items-center gap-4 p-4 sm:p-5 active:bg-red-500/10 transition-colors text-left group">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <span className="material-symbols-rounded text-[24px]">delete_forever</span>
              </div>
              <div>
                <span className="font-extrabold text-red-500 block text-sm mb-0.5">Apagar Dados Locais</span>
                <span className={`text-[11px] font-medium leading-tight block ${textMuted}`}>Apaga diário, confissões e progresso.</span>
              </div>
            </button>
          </div>
        </section>

        {/* INVERTIDO: ADMIN / COORDENAÇÃO FICA NO FIM */}
        <section className="mb-8">
          <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-2 ${textMuted}`}>Coordenação</p>
          <div className={`rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 ${cardBg} ${borderColor}`}>
            <Link href="/admin" className="w-full flex items-center justify-between p-4 sm:p-5 hover:brightness-95 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <span className="material-symbols-rounded text-[24px]">admin_panel_settings</span>
                </div>
                <div>
                  <span className={`font-extrabold block text-sm mb-0.5 ${textMain}`}>Painel de Administração</span>
                  <span className={`text-[11px] font-medium leading-tight block ${textMuted}`}>Avisos e Propósitos</span>
                </div>
              </div>
              <span className={`material-symbols-rounded ${textMuted}`}>chevron_right</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
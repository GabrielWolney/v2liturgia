"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function ConfigPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const { 
    nomeUsuario, setNomeUsuario, 
    modoVisual, setModoVisual,
    tamanhoFonte, setTamanhoFonte 
  } = useUserStore();

  const { isInstallable, installPWA } = usePWAInstall();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-leitura');
    
    if (modoVisual === 'escuro') root.classList.add('dark');
    if (modoVisual === 'leitura') root.classList.add('theme-leitura');
  }, [modoVisual, isMounted]);

  // Função Nuclear: Apaga tudo e recarrega o app
  const handleApagarDados = () => {
    const confirmacao = window.confirm(
      "Atenção: Tem a certeza que deseja apagar TODOS os seus dados? \n\nIsto irá remover o seu Diário, Exame de Consciência, Progresso de Novenas e Liturgias lidas. Esta ação não pode ser desfeita."
    );
    
    if (confirmacao) {
      localStorage.removeItem("agape-storage"); // Remove a base de dados do Zustand
      window.location.reload(); // Recarrega a página do zero
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F5F7FA]" />;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans selection:bg-[#2F6BFF]/30 pb-10">
      
      <header className="flex items-center p-4 sm:p-5 max-w-[600px] mx-auto w-full sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center text-[#6B6B6B] hover:text-[#2F6BFF] hover:bg-white transition-colors active:scale-95 rounded-full shadow-sm bg-white border border-slate-200"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-xl font-extrabold text-[#1F1F1F] tracking-tight pr-10">
          Configurações
        </h1>
      </header>

      <main className="flex-1 px-5 pt-4 max-w-[600px] mx-auto w-full">
        
        {/* BLOCO PWA: INSTALAÇÃO */}
        {isInstallable && (
          <section className="mb-8 animate-fade-in">
            <p className="text-[#6B6B6B] font-bold text-xs uppercase tracking-widest mb-3 pl-2">Aplicativo</p>
            <div className="bg-gradient-to-br from-[#2F6BFF] to-[#1E4BCC] rounded-[1.5rem] p-5 shadow-md shadow-[#2F6BFF]/20 border border-[#2F6BFF]/50 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-rounded text-[32px] bg-white/20 p-2.5 rounded-2xl shadow-inner">get_app</span>
                <div>
                  <span className="font-extrabold block text-base mb-0.5">Instalar App</span>
                  <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest block leading-tight">Experiência rápida<br/>e sem navegador</span>
                </div>
              </div>
              <button 
                onClick={installPWA}
                className="bg-white text-[#2F6BFF] px-5 py-3 rounded-xl font-black text-sm active:scale-95 transition-transform shadow-sm"
              >
                INSTALAR
              </button>
            </div>
          </section>
        )}

        {/* BLOCO 1: NOME DO UTILIZADOR */}
        <section className="mb-8">
          <p className="text-[#6B6B6B] font-bold text-xs uppercase tracking-widest mb-3 pl-2">Seu Perfil</p>
          <div className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nome" className="text-[#1F1F1F] font-bold text-sm">Como prefere ser chamado?</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">person</span>
                <input 
                  id="nome"
                  type="text" 
                  value={nomeUsuario}
                  onChange={(e) => setNomeUsuario(e.target.value)}
                  maxLength={15}
                  className="w-full bg-[#F5F7FA] border-2 border-slate-100 rounded-xl py-3 pl-12 pr-4 text-[#1F1F1F] font-bold focus:outline-none focus:border-[#2F6BFF] focus:bg-white transition-all"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 2: APARÊNCIA */}
        <section className="mb-8">
          <p className="text-[#6B6B6B] font-bold text-xs uppercase tracking-widest mb-3 pl-2">Aparência da Leitura</p>
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-5 flex flex-col gap-6">
            
            <div>
              <p className="text-[#1F1F1F] font-bold text-sm mb-3">Modo Visual</p>
              <div className="flex bg-[#F5F7FA] p-1.5 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setModoVisual("claro")}
                  className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "claro" ? "bg-white shadow-sm text-[#2F6BFF]" : "text-[#6B6B6B] hover:bg-slate-100"}`}
                >
                  <span className="material-symbols-rounded text-[22px]">light_mode</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Claro</span>
                </button>
                <button 
                  onClick={() => setModoVisual("escuro")}
                  className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "escuro" ? "bg-[#1F1F1F] shadow-sm text-white" : "text-[#6B6B6B] hover:bg-slate-100"}`}
                >
                  <span className="material-symbols-rounded text-[22px]">dark_mode</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Escuro</span>
                </button>
                <button 
                  onClick={() => setModoVisual("leitura")}
                  className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${modoVisual === "leitura" ? "bg-[#e8f0fe] shadow-sm text-[#1E4BCC]" : "text-[#6B6B6B] hover:bg-slate-100"}`}
                >
                  <span className="material-symbols-rounded text-[22px]">auto_stories</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">Leitura</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-[#1F1F1F] font-bold text-sm mb-3">Tamanho do Texto Bíblico</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setTamanhoFonte("padrao")}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${tamanhoFonte === "padrao" ? "border-[#2F6BFF] bg-[#2F6BFF]/5 text-[#2F6BFF]" : "border-slate-100 bg-white text-[#6B6B6B]"}`}
                >
                  Aa Padrão
                </button>
                <button 
                  onClick={() => setTamanhoFonte("grande")}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-lg transition-all ${tamanhoFonte === "grande" ? "border-[#2F6BFF] bg-[#2F6BFF]/5 text-[#2F6BFF]" : "border-slate-100 bg-white text-[#6B6B6B]"}`}
                >
                  Aa Grande
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* BLOCO 3: ZONA DE PERIGO (APAGAR DADOS) */}
        <section className="mb-8">
          <p className="text-[#6B6B6B] font-bold text-xs uppercase tracking-widest mb-3 pl-2">Privacidade e Dados</p>
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            
            <button 
              onClick={handleApagarDados}
              className="w-full flex items-center gap-4 p-4 sm:p-5 active:bg-red-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                <span className="material-symbols-rounded text-[24px]">delete_forever</span>
              </div>
              <div>
                <span className="font-extrabold text-red-500 block text-sm mb-0.5">Apagar Dados Locais</span>
                <span className="text-[#6B6B6B] text-[11px] font-medium leading-tight block">
                  Irá apagar permanentemente o seu diário, confissões e progresso.
                </span>
              </div>
            </button>

          </div>
        </section>

      </main>
    </div>
  );
}
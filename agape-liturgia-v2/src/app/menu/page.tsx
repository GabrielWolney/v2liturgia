"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { NotificacoesCard } from "@/components/menu/NotificacoesCard";
import { useAlertStore } from "@/store/useAlertStore";
import { IOSInstallModal } from "@/components/ui/IOSInstallModal";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function ConfigPage() {
  const router = useRouter();
  
  const { 
    nomeUsuario, 
    modoVisual, 
    setModoVisual, 
    tamanhoFonte, 
    setTamanhoFonte,
    formatoVia,
    setFormatoVia,
    somAtivado,
    setSomAtivado,
    permissoes
  } = useUserStore();
  
  const { playPop, playClick, playSwitch } = useSound();
  const { triggerHaptic } = useHaptics();

  const { isInstallable, installPWA, showIOSPrompt, setShowIOSPrompt } = usePWAInstall();
  const { user, logout, deleteAccount, updateUserName } = useAuth();
  const { showAlert } = useAlertStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  const handleEditName = () => {
    setTempName(user?.displayName || nomeUsuario || "");
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (tempName.trim().length < 2) {
      showAlert("Nome muito curto", "O nome deve ter pelo menos 2 caracteres.", "error");
      return;
    }
    
    try {
      await updateUserName(tempName.trim());
      setIsEditingName(false);
      showAlert("Sucesso", "Nome atualizado com sucesso!", "success");
    } catch (error: any) {
      showAlert("Erro", error.message || "Não foi possível atualizar o nome.", "error");
    }
  };

  const handleApagarDados = () => {
    showAlert(
      "Sincronizar com a Nuvem", 
      "Esta ação forçará o aplicativo a recarregar todos os seus dados da nuvem, resolvendo possíveis travamentos ou conflitos. Nenhuma informação salva será perdida.", 
      "info", 
      () => {
        localStorage.removeItem("agape-storage");
        window.location.reload();
      },
      true // showCancel
    );
  };

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-10 transition-colors duration-300 selection:bg-primary/30 bg-background">
      
      {/* === NOSSO MODAL NATIVO PARA IOS === */}
      <IOSInstallModal 
        isOpen={showIOSPrompt} 
        onClose={() => setShowIOSPrompt(false)} 
      />
      {/* =================================== */}

      <header className="px-5 py-4 flex items-center justify-between border-b bg-background border-border">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center active:scale-95 rounded-full shadow-sm border transition-colors bg-card border-border text-muted hover:text-primary">
          <span className="material-symbols-rounded text-[26px]">close</span>
        </button>
        <h1 className={`flex-1 text-center font-extrabold tracking-tight pr-10 text-foreground ${fontClass}`}>Configurações</h1>
      </header>

      <main className="flex-1 px-5 pt-4 max-w-[600px] mx-auto w-full">
        
        {isInstallable && (
          <section className="mb-8 animate-fade-in">
            <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Aplicativo</p>
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
          <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Seu Perfil</p>
          <div className="rounded-[1.5rem] p-5 shadow-sm border flex flex-col gap-5 transition-colors duration-300 bg-card border-border">
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName || "Perfil"} width={60} height={60} className="rounded-full shadow-sm" />
                  ) : (
                    <div className="w-[60px] h-[60px] rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                      {nomeUsuario.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    {isEditingName ? (
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          className="font-extrabold text-foreground bg-background border border-border rounded-lg px-2 py-1 text-base w-full max-w-[150px] outline-none focus:border-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveName();
                            if (e.key === 'Escape') setIsEditingName(false);
                          }}
                        />
                        <button onClick={handleSaveName} className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg active:scale-95">
                          <span className="material-symbols-rounded text-[18px]">check</span>
                        </button>
                        <button onClick={() => setIsEditingName(false)} className="w-8 h-8 flex items-center justify-center bg-muted/10 text-muted rounded-lg active:scale-95">
                          <span className="material-symbols-rounded text-[18px]">close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-0.5 group">
                        <span className="font-extrabold text-foreground block text-lg">{user.displayName || nomeUsuario}</span>
                        <button onClick={handleEditName} className="opacity-70 hover:opacity-100 text-muted hover:text-primary transition-colors p-1 active:scale-95">
                          <span className="material-symbols-rounded text-[16px]">edit</span>
                        </button>
                      </div>
                    )}
                    <span className="text-muted font-medium text-xs block">{user.email}</span>
                  </div>
                </div>
                <button 
                  onClick={logout} 
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold mt-2 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-rounded text-[20px]">logout</span> Sair da Conta
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                  {nomeUsuario.charAt(0).toUpperCase()}
                </div>
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="font-extrabold text-foreground bg-background border border-border rounded-lg px-2 py-1 text-base w-full max-w-[150px] outline-none focus:border-primary"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') setIsEditingName(false);
                        }}
                      />
                      <button onClick={handleSaveName} className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg active:scale-95">
                        <span className="material-symbols-rounded text-[18px]">check</span>
                      </button>
                      <button onClick={() => setIsEditingName(false)} className="w-8 h-8 flex items-center justify-center bg-muted/10 text-muted rounded-lg active:scale-95">
                        <span className="material-symbols-rounded text-[18px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-0.5 group">
                      <span className="font-extrabold text-foreground block text-lg">{nomeUsuario}</span>
                      <button onClick={handleEditName} className="opacity-70 hover:opacity-100 text-muted hover:text-primary transition-colors p-1 active:scale-95">
                        <span className="material-symbols-rounded text-[16px]">edit</span>
                      </button>
                    </div>
                  )}
                  <span className="text-muted font-medium text-xs block">Visitante</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Sons e Alertas</p>
          <div className="rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 bg-card border-border flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <span className="material-symbols-rounded text-[24px]">{somAtivado ? 'volume_up' : 'volume_off'}</span>
                </div>
                <div>
                  <span className="font-extrabold text-foreground block text-sm mb-0.5">Efeitos Sonoros</span>
                  <span className="text-[11px] font-medium leading-tight block text-muted">Sons interativos no app</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={somAtivado} 
                  onChange={(e) => {
                    setSomAtivado(e.target.checked);
                    // Como não pode tocar som de imediato se o hook estiver desligado pelo switch antigo, force o som manualmente pra ligar.
                    if (e.target.checked) {
                      setTimeout(() => playSwitch(true), 10);
                    }
                  }} 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366] dark:bg-slate-700 dark:border-slate-600"></div>
              </label>
            </div>
            <Link href="/notificacoes" onClick={() => playClick()} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/10 transition-colors active:bg-muted/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/10 text-[#2F6BFF] flex items-center justify-center shrink-0">
                  <span className="material-symbols-rounded text-[24px]">notifications</span>
                </div>
                <div>
                  <span className="font-extrabold text-foreground block text-sm mb-0.5">Notificações</span>
                  <span className="text-[11px] font-medium leading-tight block text-muted">Gerenciar alertas no celular</span>
                </div>
              </div>
              <span className="material-symbols-rounded text-muted">chevron_right</span>
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Aparência da Leitura</p>
          <div className="rounded-[1.5rem] shadow-sm border p-5 flex flex-col gap-6 transition-colors duration-300 bg-card border-border">
            <div>
              <p className="font-bold text-sm mb-3 text-foreground">Modo Visual</p>
              <div className="flex p-1.5 rounded-2xl border bg-background border-border">
                <button onClick={() => { setModoVisual("claro"); playSwitch(true); }} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${ modoVisual === "claro" ? "bg-card shadow-sm text-primary" : "text-muted hover:brightness-95"}`}>
                  <span className="material-symbols-rounded text-[22px] pointer-events-none">light_mode</span><span className="text-[10px] font-bold uppercase tracking-wide pointer-events-none">Claro</span>
                </button>
                <button onClick={() => { setModoVisual("escuro"); playSwitch(true); }} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${ modoVisual === "escuro" ? "bg-card shadow-sm text-primary" : "text-muted hover:brightness-95"}`}>
                  <span className="material-symbols-rounded text-[22px] pointer-events-none">dark_mode</span><span className="text-[10px] font-bold uppercase tracking-wide pointer-events-none">Escuro</span>
                </button>
                <button onClick={() => { setModoVisual("leitura"); playSwitch(true); }} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl gap-1 transition-all ${ modoVisual === "leitura" ? "bg-card shadow-sm text-primary" : "text-muted hover:brightness-95"}`}>
                  <span className="material-symbols-rounded text-[22px] pointer-events-none">auto_stories</span><span className="text-[10px] font-bold uppercase tracking-wide pointer-events-none">Leitura</span>
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-3 text-foreground">Tamanho do Texto Bíblico</p>
              <div className="flex gap-3">
                <button onClick={() => { setTamanhoFonte("padrao"); playSwitch(false); }} className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all ${ tamanhoFonte === "padrao" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted"}`}>
                  Aa Padrão
                </button>
                <button onClick={() => { setTamanhoFonte("grande"); playSwitch(true); }} className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${ tamanhoFonte === "grande" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted"} ${ tamanhoFonte === 'grande' ? 'text-lg' : 'text-base'}`}>
                  Aa Grande
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm mb-3 text-foreground">Layout da Pequena Via</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setFormatoVia("curva"); playSwitch(false); }} className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${ formatoVia === "curva" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted"}`}>
                  <span className="material-symbols-rounded text-[24px] mb-1 pointer-events-none">route</span>
                  <span className="text-xs font-bold pointer-events-none">Via Curva</span>
                  <span className="text-[10px] font-medium opacity-70 pointer-events-none">Lúdica</span>
                </button>
                <button onClick={() => { setFormatoVia("rastreio"); playSwitch(true); }} className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${ formatoVia === "rastreio" ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted"}`}>
                  <span className="material-symbols-rounded text-[24px] mb-1 pointer-events-none">share_location</span>
                  <span className="text-xs font-bold pointer-events-none">Rastreio</span>
                  <span className="text-[10px] font-medium opacity-70 pointer-events-none">Lista Vertical</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Link href="/menu/personalizar-via" onClick={() => playClick()} className="flex items-center justify-between py-3 hover:opacity-80 transition-opacity active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-rounded text-[24px]">tune</span>
                  </div>
                  <div className="text-left">
                    <span className="font-extrabold text-foreground block text-sm mb-0.5">Personalizar Módulos</span>
                    <span className="text-[11px] font-medium leading-tight block text-muted">Escolha quais os nós visíveis</span>
                  </div>
                </div>
                <span className="material-symbols-rounded text-muted">chevron_right</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Privacidade e Dados</p>
          <div className="rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 bg-card border-border">
            <button onClick={handleApagarDados} className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-muted/10 transition-colors text-left group border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 transition-colors">
                <span className="material-symbols-rounded text-[24px]">cleaning_services</span>
              </div>
              <div>
                <span className="font-extrabold text-foreground block text-sm mb-0.5">Limpar Dados Locais</span>
                <span className="text-[11px] font-medium leading-tight block text-muted">Limpa cachê (mantém a conta).</span>
              </div>
            </button>
            <button 
              onClick={() => {
                showAlert(
                  "Atenção", 
                  "Sua conta e todos os dados salvos na nuvem serão excluídos permanentemente. Continuar?", 
                  "error", 
                  async () => {
                    try {
                      if (typeof deleteAccount === 'function') {
                        await deleteAccount();
                        window.location.reload();
                      } else {
                        throw new Error("Função de deletar conta não encontrada.");
                      }
                    } catch (e: any) {
                      showAlert("Erro", e.message, "error");
                    }
                  },
                  true // showCancel
                );
              }} 
              className="w-full flex items-center gap-4 p-4 sm:p-5 active:bg-red-500/10 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                <span className="material-symbols-rounded text-[24px]">delete_forever</span>
              </div>
              <div>
                <span className="font-extrabold text-red-500 block text-sm mb-0.5">Apagar Conta Definitivamente</span>
                <span className="text-[11px] font-medium leading-tight block text-muted">Exclui usuário e apaga progresso na nuvem.</span>
              </div>
            </button>
          </div>
        </section>

        <section className="mb-8">
          <p className="font-bold text-xs uppercase tracking-widest mb-3 pl-2 text-muted">Coordenação</p>
          <div className="rounded-[1.5rem] shadow-sm border overflow-hidden transition-colors duration-300 bg-card border-border">
            <Link href="/admin" className="w-full flex items-center justify-between p-4 sm:p-5 hover:brightness-95 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <span className="material-symbols-rounded text-[24px]">admin_panel_settings</span>
                </div>
                <div>
                  <span className="font-extrabold block text-sm mb-0.5 text-foreground">Painel de Administração</span>
                  <span className="text-[11px] font-medium leading-tight block text-muted">Avisos e Propósitos</span>
                </div>
              </div>
              <span className="material-symbols-rounded text-muted">chevron_right</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
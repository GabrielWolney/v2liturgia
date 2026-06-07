"use client";

import React from "react";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IOSInstallModal({ isOpen, onClose }: IOSInstallModalProps) {
  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  const handleClose = () => {
    playPop();
    triggerHaptic('light');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-[600px] bg-card border-t border-border rounded-t-[2rem] p-6 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-300 ease-out"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-foreground">Instalar no iPhone</h3>
          <button 
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/20 text-muted hover:text-foreground active:scale-95 transition-all"
          >
            <span className="material-symbols-rounded text-[20px]">close</span>
          </button>
        </div>

        <p className="text-sm text-muted font-medium mb-6">
          Instale o Ágape para ter uma experiência mais rápida, acesso offline e tela cheia.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded">ios_share</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              1. Toque em <strong className="text-blue-500">Compartilhar</strong> na barra inferior do Safari.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border">
            <div className="w-10 h-10 rounded-xl bg-foreground/5 text-foreground flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded">add_box</span>
            </div>
            <p className="text-sm font-bold text-foreground">
              2. Escolha <strong className="text-foreground">Adicionar à Tela de Início</strong> na lista.
            </p>
          </div>
        </div>

        <button 
          onClick={handleClose}
          className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl active:scale-95 transition-all shadow-[0_4px_0_var(--primary-light)] active:translate-y-[4px] active:shadow-none"
        >
          ENTENDIDO
        </button>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { modulosVia } from "@/config/modulosVia";
import { useHaptics } from "@/hooks/useHaptics";
import { useSound } from "@/hooks/useSound";

export function PersonalizarViaClient() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { modulosInativos, toggleModuloStatus, tamanhoFonte, modulosOrdem, reordenarModulos, isAgape } = useUserStore();
  const { triggerHaptic } = useHaptics();
  const { playPop, playSwitch } = useSound();
  const [modulosAtuais, setModulosAtuais] = useState(modulosVia);
  
  // Regras de negócio
  const modulosExclusivosAgape = ['propositos', 'mural', 'comunidade'];
  const modulosObrigatoriosAgape = ['palavra', 'terco', 'biblia', 'propositos', 'mural', 'comunidade'];

  useEffect(() => {
    // Inicializar a lista com a ordem atual guardada no Zustand
    let modulosOrdenados = [...modulosVia];
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

    // Filtrar os exclusivos caso não seja do Ágape
    if (isAgape === false) {
      modulosOrdenados = modulosOrdenados.filter(m => !modulosExclusivosAgape.includes(m.id));
    }

    setModulosAtuais(modulosOrdenados);
    setIsMounted(true);
  }, [modulosOrdem, isAgape]);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  const handleToggle = (id: string, isObrigatorio: boolean) => {
    if (isObrigatorio) return;
    
    triggerHaptic('light');
    playSwitch();
    toggleModuloStatus(id);
  };

  const moverModulo = (index: number, direcao: 'cima' | 'baixo') => {
    if (direcao === 'cima' && index === 0) return;
    if (direcao === 'baixo' && index === modulosAtuais.length - 1) return;

    triggerHaptic('medium');
    playPop();

    triggerHaptic('light');
    playSwitch(true);

    const novaLista = [...modulosAtuais];
    const item = novaLista[index];
    const indexAlvo = direcao === 'cima' ? index - 1 : index + 1;
    
    // Trocar as posições
    novaLista[index] = novaLista[indexAlvo];
    novaLista[indexAlvo] = item;
    
    setModulosAtuais(novaLista);
    reordenarModulos(novaLista.map(m => m.id));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-10 transition-colors duration-300 selection:bg-primary/30 bg-background text-foreground">
      
      <header className="sticky top-0 z-40 px-5 py-4 flex items-center justify-between border-b bg-background/90 backdrop-blur-md border-border shadow-sm">
        <button onClick={() => { playPop(); triggerHaptic('light'); router.back(); }} className="w-10 h-10 flex items-center justify-center active:scale-95 rounded-full shadow-sm border transition-colors bg-card border-border text-muted hover:text-primary">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`flex-1 text-center font-extrabold tracking-tight pr-10 ${fontClass}`}>Personalizar a Via</h1>
      </header>

      <main className="flex-1 px-5 pt-6 max-w-[600px] mx-auto w-full animate-fade-in">
        <p className="opacity-70 mb-8 font-medium text-center">
          Ligue, desligue ou mova os nós para cima e para baixo para criar a Jornada perfeita para o seu dia.
        </p>

        <div className="flex flex-col gap-3">
          {modulosAtuais.map((modulo, index) => {
            const isObrigatorio = isAgape === true && modulosObrigatoriosAgape.includes(modulo.id);
            // Se for obrigatório, forçamos o estado visual como ativo, independentemente do que está no store
            const isAtivo = isObrigatorio ? true : !(modulosInativos || []).includes(modulo.id);

            return (
              <div 
                key={modulo.id} 
                className={`flex items-center justify-between p-4 rounded-[1.25rem] border bg-card border-border shadow-sm transition-all ${isObrigatorio ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner transition-colors duration-300 ${isAtivo ? 'bg-primary text-white' : 'bg-muted/20 text-muted'}`}>
                    {modulo.isSvg ? (
                      <span className="scale-75 opacity-90">{modulo.icone}</span>
                    ) : (
                      <span className="material-symbols-rounded">{modulo.icone}</span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold transition-colors ${isAtivo ? 'text-foreground' : 'text-muted'}`}>
                      {modulo.titulo}
                    </h3>
                    {isObrigatorio ? (
                      <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          Obrigatório
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs font-medium uppercase tracking-wider text-muted mt-0.5">
                        {isAtivo ? 'Visível' : 'Oculto'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Reordenar e Toggle */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1 opacity-70">
                    <button 
                      onClick={() => moverModulo(index, 'cima')}
                      disabled={index === 0}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/10 active:bg-muted/30 disabled:opacity-30 disabled:active:bg-muted/10 transition-colors"
                      aria-label="Mover para cima"
                    >
                      <span className="material-symbols-rounded">expand_less</span>
                    </button>
                    <button 
                      onClick={() => moverModulo(index, 'baixo')}
                      disabled={index === modulosAtuais.length - 1}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/10 active:bg-muted/30 disabled:opacity-30 disabled:active:bg-muted/10 transition-colors"
                      aria-label="Mover para baixo"
                    >
                      <span className="material-symbols-rounded">expand_more</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggle(modulo.id, isObrigatorio)}
                    disabled={isObrigatorio}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative shrink-0 ${isAtivo ? 'bg-primary' : 'bg-muted/30'} ${isObrigatorio ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`Alternar visibilidade de ${modulo.titulo}`}
                  >
                    <div 
                      className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isAtivo ? 'translate-x-6' : 'translate-x-0'} ${isObrigatorio ? 'opacity-80' : ''}`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useTerco } from "./hooks/useTerco";
import { useUserStore } from "@/store/useUserStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

export default function TercoPage() {
  const { mounted, flux, isLatin, content, progresso, ui, MISTERIOS_INFO, actions } = useTerco();
  const { tamanhoFonte } = useUserStore();
  const { playClick, playPop, playSuccess } = useSound();
  const { triggerHaptic } = useHaptics();

  if (!mounted) return <div className="min-h-[100dvh] bg-background" />;

  const fontReading = tamanhoFonte === 'grande' ? 'text-2xl leading-relaxed' : 'text-lg leading-relaxed';

  return (
    <main className="fixed inset-0 w-full bg-background text-foreground flex flex-col select-none overflow-hidden font-sans transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--tw-gradient-stops))",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.05)_2px,_transparent_2px)] bg-[length:24px_24px] pointer-events-none"></div>

      <header 
        className="sticky top-0 z-50 backdrop-blur-md border-b px-3 sm:px-6 pb-3 sm:pb-4 flex items-center justify-between w-full transition-colors duration-300 bg-background/90 border-border gap-2"
        style={{ paddingTop: 'calc(max(env(safe-area-inset-top), 47px) + 8px)' }}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/jornada"
            onClick={() => playClick()}
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-2xl bg-card border border-border text-muted hover:text-foreground transition-colors active:scale-95"
          >
            <span className="material-symbols-rounded text-lg sm:text-xl">chevron_left</span>
          </Link>
          <div className="flex flex-col min-w-0">
            <h1 className="font-extrabold tracking-tight text-foreground text-base sm:text-lg truncate">
              Santo Terço
            </h1>
            <p className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase text-muted truncate">
              {ui.misterio}s {ui[MISTERIOS_INFO.nomeKey]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {flux < 11 && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => { e.preventDefault(); playPop(); triggerHaptic('light'); actions.handleSkip(); }}
              className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-rounded text-base sm:text-lg pointer-events-none">check_circle</span>
            </div>
          )}
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => { e.preventDefault(); playPop(); triggerHaptic('light'); actions.resetTerco(); }}
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-2xl bg-card border border-border text-muted hover:text-foreground transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-rounded text-base sm:text-lg pointer-events-none">refresh</span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => { playClick(); actions.setIsLatin(!isLatin); }}
            className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-2xl border transition-colors active:scale-95 shrink-0 cursor-pointer ${
              isLatin
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                : "bg-card border-border text-muted"
            }`}
          >
            <span className="pointer-events-none text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{isLatin ? "LATIN" : "PT-BR"}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 pb-4">
        <div className="px-6 flex flex-col items-center justify-start pb-8">
          <div
            key={`${flux}-${content.title}-${isLatin}-${content.count}`}
            className="w-full max-w-[400px] space-y-6 text-center animate-in slide-in-from-bottom-4 fade-in duration-500"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase opacity-80">
                {content.label}
              </span>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-tight text-foreground drop-shadow-sm">
                {content.title}
              </h2>
            </div>
            
            <div className="relative py-8 px-4 bg-card border border-border/50 shadow-soft rounded-[2rem]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full" />
              <p
                className={`text-foreground/90 whitespace-pre-wrap ${content.style || `font-serif font-medium ${fontReading}`}`}
              >
                {content.text}
              </p>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full" />
            </div>

            {content.count !== undefined && (
              <div className="inline-block px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full shadow-inner mt-4">
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                  {typeof content.count === "number"
                    ? `${ui.aveMaria} ${content.count} / 10`
                    : content.count}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="shrink-0 bg-background/90 backdrop-blur-xl border-t border-border pt-5 pb-6 px-6 flex flex-col items-center gap-6 z-50">
        
        {/* Contas do Terço Visuais */}
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const etapaAtual =
              flux === 0 ? 0
                : flux >= 1 && flux <= 4 ? 0
                : flux === 10 ? 6
                : flux === 11 ? 6
                : flux - 4;
            
            return (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                  i < etapaAtual
                    ? "bg-primary shadow-[0_0_8px_rgba(47,107,255,0.5)] scale-110"
                    : i === etapaAtual
                    ? "bg-primary animate-pulse scale-125"
                    : "bg-muted/30 border border-border"
                }`}
              />
            );
          })}
        </div>

        {/* Controles Principais */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => { playClick(); triggerHaptic('light'); actions.handlePrevMystery(); }}
            className="w-10 h-10 rounded-full bg-card/50 flex items-center justify-center text-muted/60 active:scale-90 active:text-primary transition-all"
          >
            <span className="material-symbols-rounded text-xl">keyboard_double_arrow_left</span>
          </button>

          <button
            onClick={() => { playClick(); triggerHaptic('light'); actions.handlePrev(); }}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted active:scale-90 active:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-rounded text-2xl">chevron_left</span>
          </button>

          <button
            onClick={() => { playClick(); triggerHaptic('light'); actions.handleNext(); }}
            className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95
              ${
                flux === 11
                  ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] border-4 border-emerald-400"
                  : "bg-primary text-white shadow-[0_8px_0_#1E4BCC] active:translate-y-2 active:shadow-none"
              }
            `}
          >
            {flux === 11 ? (
              <span className="material-symbols-rounded text-4xl font-black">check</span>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-3xl font-black italic tracking-tighter">
                  {content.type === "aveMaria" && typeof content.count === "number" ? (
                    content.count
                  ) : (
                    <span className="material-symbols-rounded text-3xl">add</span>
                  )}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => { playClick(); triggerHaptic('light'); actions.handleNext(); }}
            className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted active:scale-90 active:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-rounded text-2xl">chevron_right</span>
          </button>

          <button
            onClick={() => { playClick(); triggerHaptic('light'); actions.handleNextMystery(); }}
            className="w-10 h-10 rounded-full bg-card/50 flex items-center justify-center text-muted/60 active:scale-90 active:text-primary transition-all"
          >
            <span className="material-symbols-rounded text-xl">keyboard_double_arrow_right</span>
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full space-y-2 max-w-sm">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted">
            <span>Oração</span>
            <span className="text-primary font-mono">{progresso}%</span>
          </div>
          <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Botão Finalizar */}
        {flux === 11 && (
          <button
            onClick={() => { playSuccess(); triggerHaptic('success'); actions.handleRegistrar(); }}
            className="w-full max-w-sm h-14 rounded-[1.5rem] bg-emerald-500 text-white font-black uppercase tracking-widest shadow-[0_6px_0_#059669] active:translate-y-1.5 active:shadow-none transition-all text-sm animate-in slide-in-from-bottom-4 duration-500 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-rounded text-xl">bookmark_add</span>
            REGISTRAR
          </button>
        )}
      </footer>
    </main>
  );
}
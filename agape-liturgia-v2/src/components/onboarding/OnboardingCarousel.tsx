"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { m, LazyMotion, domMax, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { modulosVia } from "@/config/modulosVia";

interface OnboardingCarouselProps {
  onComplete: () => void;
  initialStep?: number;
}

export function OnboardingCarousel({ onComplete, initialStep = 0 }: OnboardingCarouselProps) {
  const [step, setStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [isStandalone, setIsStandalone] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    modoVisual, setModoVisual,
    formatoVia, setFormatoVia,
    modulosInativos, toggleModuloStatus
  } = useUserStore();

  const { playPop, playSwitch } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const isPwa = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isPwa);
    if (isPwa && initialStep === 0) {
      setStep(1);
    }
    setIsInitialized(true);
  }, []);

  const nextStep = () => {
    triggerHaptic('light');
    playPop();
    setDirection(1);
    if (step === 5) {
      onComplete();
    } else {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    triggerHaptic('light');
    playPop();
    setDirection(-1);
    setStep((prev) => {
      const target = prev - 1;
      if (isStandalone && target === 0) return 1;
      return Math.max(target, 0);
    });
  };

  if (!isInitialized) return null;

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50) {
      nextStep();
    } else if (swipe > 50) {
      prevStep();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
  };

  // Backgrounds that change per step
  // O utilizador pediu para usar o modo escuro padrão do Tailwind
  const backgrounds = [
    "bg-slate-950",
    "bg-slate-950",
    "bg-slate-950",
    "bg-slate-950",
    "bg-slate-950",
    "bg-slate-950",
  ];
  return (
    <LazyMotion features={domMax}>
      <div className="fixed inset-0 z-50 bg-background text-foreground bg-[radial-gradient(circle_at_center,_rgba(47,107,255,0.08)_3px,_transparent_3px)] bg-[length:28px_28px] flex flex-col font-sans overflow-hidden transition-colors duration-300">

        {/* Background Ambience effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <m.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary/10 blur-[100px]"
          />
        </div>

      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between absolute top-safe pt-6 px-6 z-20">
        {step > 0 ? (
          <button onClick={prevStep} className="w-12 h-12 flex items-center justify-center rounded-full bg-card backdrop-blur-md active:scale-95 transition-all text-muted hover:text-foreground border border-border shadow-sm z-30">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
        ) : (
          <div className="w-12 h-12"></div>
        )}

        {/* Progress Indicator Dots */}
        <div className="flex gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 ${step === i ? 'w-8 bg-white' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>

        {step < 5 ? (
          <button onClick={() => { playPop(); triggerHaptic('light'); onComplete(); }} className="text-muted text-sm font-bold active:scale-95 transition-transform hover:text-foreground">Pular</button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <m.div
              key="step0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 cursor-grab active:cursor-grabbing"
            >
              <m.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-40 h-40 mb-8 relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <span className="material-symbols-rounded text-[80px] text-primary drop-shadow-[0_0_15px_rgba(47,107,255,0.5)] z-10">install_mobile</span>
              </m.div>

              <h2 className="text-4xl font-light mb-4 text-center tracking-tight text-foreground">
                Instale o <br /><span className="font-serif italic font-bold">App</span>
              </h2>
              <p className="text-muted text-center text-lg max-w-sm font-medium leading-relaxed">
                Para uma experiência mais rápida e offline, instale o Ágape no seu celular.
              </p>

              <div className="mt-8 flex flex-col gap-3 text-sm text-muted bg-card border border-border p-4 rounded-2xl w-full max-w-sm shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-xl">ios_share</span>
                  <span>iOS: Toque em Compartilhar e <strong>Tela Inicial</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-xl">more_vert</span>
                  <span>Android: Menu e <strong>Instalar Aplicativo</strong></span>
                </div>
              </div>
            </m.div>
          )}

          {step === 1 && (
            <m.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 cursor-grab active:cursor-grabbing"
            >
              <m.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-40 h-40 mb-12 relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <span className="material-symbols-rounded text-[100px] text-primary drop-shadow-[0_0_15px_rgba(47,107,255,0.5)] z-10 font-light">route</span>
              </m.div>

              <h2 className="text-4xl font-light mb-4 text-center tracking-tight text-foreground">
                A Sua <br /><span className="font-serif italic font-bold">Pequena Via</span>
              </h2>
              <p className="text-muted text-center text-lg max-w-sm font-medium leading-relaxed">
                Um caminho diário de santidade. Liturgia, Terço e Oração, sempre com você.
              </p>
            </m.div>
          )}

          {step === 2 && (
            <m.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 cursor-grab active:cursor-grabbing"
            >
              <m.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                className="w-40 h-40 mb-12 relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                <span className="material-symbols-rounded text-[100px] text-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)] z-10">local_fire_department</span>
              </m.div>

              <h2 className="text-4xl font-light mb-4 text-center tracking-tight text-foreground">
                Cultive a <br /><span className="font-serif italic font-bold">Constância</span>
              </h2>
              <p className="text-muted text-center text-lg max-w-sm font-medium leading-relaxed">
                A cada dia que reza, a chama da sua fé aumenta.
              </p>
            </m.div>
          )}

          {step === 3 && (
            <m.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col justify-center px-6 cursor-grab active:cursor-grabbing"
            >
              <h2 className="text-3xl font-light mb-2 text-center text-foreground">A Sua Luz</h2>
              <p className="text-muted text-center mb-10 text-sm font-medium">Como prefere ler e rezar?</p>

              <div className="w-full flex flex-col gap-4">
                {[
                  { id: 'claro', titulo: 'Luz do Dia', desc: 'Claro e legível', icon: 'light_mode', cor: 'text-amber-500' },
                  { id: 'escuro', titulo: 'Repouso', desc: 'Suave para os olhos', icon: 'dark_mode', cor: 'text-blue-400' },
                  { id: 'leitura', titulo: 'Pergaminho', desc: 'Foco e tradição', icon: 'history_edu', cor: 'text-[#8C7B65]' }
                ].map((modo) => (
                  <button
                    key={modo.id}
                    onClick={() => { setModoVisual(modo.id as any); playSwitch(true); triggerHaptic('light'); }}
                    className={`relative w-full rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 border shadow-sm ${modoVisual === modo.id ? 'bg-primary/10 border-primary scale-[1.02] shadow-[0_0_20px_rgba(47,107,255,0.15)]' : 'bg-card border-border hover:border-primary/50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-background border border-border shadow-inner ${modoVisual === modo.id ? modo.cor : 'text-muted'}`}>
                      <span className="material-symbols-rounded text-2xl">{modo.icon}</span>
                    </div>
                    <div className="text-left flex-1">
                      <h3 className={`font-bold text-lg ${modoVisual === modo.id ? 'text-primary' : 'text-foreground'}`}>{modo.titulo}</h3>
                      <p className="text-sm font-medium text-muted">{modo.desc}</p>
                    </div>
                    {modoVisual === modo.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                        <span className="material-symbols-rounded text-sm font-black">check</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </m.div>
          )}

          {step === 4 && (
            <m.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col justify-start pt-32 px-6 overflow-y-auto pb-32 cursor-grab active:cursor-grabbing"
            >
              <h2 className="text-3xl font-light mb-2 text-center text-foreground">Os Seus Focos</h2>
              <p className="text-muted text-center mb-8 text-sm max-w-sm mx-auto font-medium">
                Ligue os módulos que vão compor a sua "Pequena Via" diária. O que selecionar aqui será a base do seu caminho principal.
              </p>

              <div className="w-full flex flex-col gap-3">
                {modulosVia.filter(m => !['mural', 'comunidade', 'propositos'].includes(m.id)).map((modulo) => {
                  const isAtivo = !(modulosInativos || []).includes(modulo.id);
                  return (
                    <button
                      key={modulo.id}
                      onClick={() => { toggleModuloStatus(modulo.id); playSwitch(isAtivo); triggerHaptic('light'); }}
                      className={`w-full bg-card rounded-2xl p-4 flex items-center justify-between transition-all duration-300 border shadow-sm active:scale-[0.98] ${isAtivo ? 'border-border' : 'border-border/50 opacity-70'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${isAtivo ? modulo.bgClass : 'bg-muted saturate-0'}`}>
                          {!modulo.isSvg ? (
                            <span className="material-symbols-rounded">{modulo.icone}</span>
                          ) : (
                            <div className="scale-75 flex items-center justify-center">{modulo.icone}</div>
                          )}
                        </div>
                        <span className={`font-bold text-base ${isAtivo ? 'text-foreground' : 'text-muted'}`}>{modulo.titulo}</span>
                      </div>

                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isAtivo ? 'bg-primary' : 'bg-muted/30'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${isAtivo ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </m.div>
          )}

          {step === 5 && (
            <m.div
              key="step5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="absolute inset-0 flex flex-col items-center justify-center px-6 cursor-grab active:cursor-grabbing pt-8"
            >
              <h2 className="text-3xl font-light mb-1 text-center text-foreground">O Seu Caminho</h2>
              <p className="text-muted text-center mb-6 text-sm font-medium">Como visualiza a sua jornada?</p>

              <div className="w-full max-w-[400px] grid grid-cols-2 gap-4 pb-20 items-stretch h-[340px]">
                <button
                  onClick={() => { setFormatoVia('curva'); playSwitch(true); triggerHaptic('light'); }}
                  className={`relative w-full rounded-[2rem] p-5 transition-all duration-300 border-2 overflow-hidden flex flex-col items-center bg-card shadow-sm ${formatoVia === 'curva' ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(47,107,255,0.15)] scale-[1.02]' : 'border-border hover:border-primary/50'}`}
                >
                  <div className="flex flex-col items-center gap-2 mb-3 relative z-10 w-full shrink-0">
                    <div className="text-center">
                      <h3 className={`font-bold text-sm ${formatoVia === 'curva' ? 'text-primary' : 'text-foreground'}`}>Pequena Via</h3>
                      <p className="text-[10px] font-medium opacity-60 leading-tight text-muted">Imersiva</p>
                    </div>
                  </div>

                  <div className="w-full flex-1 relative flex flex-col items-center justify-start opacity-80 group-hover:opacity-100 transition-opacity bg-background rounded-2xl overflow-hidden border border-border">
                    <svg viewBox="0 0 100 200" className="absolute top-0 w-full h-[180px] stroke-primary fill-none" preserveAspectRatio="none">
                      <m.path
                        d="M 50,0 L 50,40 A 10 10 0 0 0 60,50 L 75,50 A 10 10 0 0 1 85,60 L 85,110 A 10 10 0 0 1 75,120 L 60,120 A 10 10 0 0 0 50,130 L 50,200"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        initial={{ pathLength: 0 }}
                        animate={formatoVia === 'curva' ? { pathLength: 1 } : { pathLength: 0 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </svg>

                    <div className="absolute top-[10%] left-[50%] flex flex-col items-center transform -translate-x-1/2">
                      <div className={`w-10 h-10 rounded-[0.8rem] bg-primary flex items-center justify-center shadow-lg border-2 ${formatoVia === 'curva' ? 'border-background text-white' : 'border-border text-white/80'}`}>
                        <span className="material-symbols-rounded text-sm">book</span>
                      </div>
                    </div>

                    <div className="absolute top-[42.5%] left-[85%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
                      <div className={`w-10 h-10 rounded-[0.8rem] bg-primary flex items-center justify-center shadow-lg border-2 ${formatoVia === 'curva' ? 'border-background text-white' : 'border-border text-white/80'}`}>
                        <span className="material-symbols-rounded text-sm">church</span>
                      </div>
                    </div>

                    <div className="absolute top-[80%] left-[50%] flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
                      <div className={`w-10 h-10 rounded-[0.8rem] bg-primary flex items-center justify-center shadow-lg border-2 ${formatoVia === 'curva' ? 'border-background text-white' : 'border-border text-white/80'}`}>
                        <span className="scale-[0.7]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-15.536-7.536l2.828 2.828m8.486 8.486l2.828 2.828M4.464 19.536l2.828-2.828m8.486-8.486l2.828-2.828" /></svg></span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { setFormatoVia('rastreio'); playSwitch(true); triggerHaptic('light'); }}
                  className={`relative w-full rounded-[2rem] p-5 transition-all duration-300 border-2 overflow-hidden flex flex-col items-center bg-card shadow-sm ${formatoVia === 'rastreio' ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(47,107,255,0.15)] scale-[1.02]' : 'border-border hover:border-primary/50'}`}
                >
                  <div className="flex flex-col items-center gap-2 mb-3 relative z-10 w-full shrink-0">
                    <div className="text-center">
                      <h3 className={`font-bold text-sm ${formatoVia === 'rastreio' ? 'text-primary' : 'text-foreground'}`}>Em Foco</h3>
                      <p className="text-[10px] font-medium opacity-60 leading-tight text-muted">Lista direta</p>
                    </div>
                  </div>

                  <div className="w-full flex-1 relative flex flex-col gap-2 justify-center opacity-80 group-hover:opacity-100 transition-opacity px-3 py-4 bg-background rounded-2xl border border-border">
                    <div className="absolute top-4 bottom-4 left-[28px] w-[2px] border-l-2 border-dashed border-primary/40 z-0" />

                    {[
                      { icon: 'book', delay: 0.2, color: 'bg-primary' },
                      { icon: 'church', delay: 0.4, color: 'bg-primary' },
                      { icon: 'rosary', delay: 0.6, color: 'bg-primary' }
                    ].map((item, i) => (
                      <m.div
                        key={i}
                        animate={formatoVia === 'rastreio' ? { x: [0, 4, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 3, delay: item.delay }}
                        className="flex items-center gap-2 w-full z-10"
                      >
                        <div className={`w-8 h-8 rounded-[0.6rem] shadow-md flex items-center justify-center shrink-0 ${item.color} ${formatoVia === 'rastreio' ? 'text-white' : 'text-white/80 saturate-50'}`}>
                          {item.icon === 'rosary' ? (
                            <span className="scale-[0.5]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4m-15.536-7.536l2.828 2.828m8.486 8.486l2.828 2.828M4.464 19.536l2.828-2.828m8.486-8.486l2.828-2.828" /></svg></span>
                          ) : (
                            <span className="material-symbols-rounded text-[14px]">{item.icon}</span>
                          )}
                        </div>
                        <div className={`flex-1 h-7 rounded-lg px-2 flex items-center shadow-sm ${formatoVia === 'rastreio' ? 'bg-card border border-border' : 'bg-card/50 border border-border/50'}`}>
                          <div className={`h-1.5 w-8 rounded-full ${formatoVia === 'rastreio' ? 'bg-foreground/20' : 'bg-muted/20'}`} />
                        </div>
                      </m.div>
                    ))}
                  </div>
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Continue Button */}
      <AnimatePresence>
        <m.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-8 left-0 right-0 px-6 z-20"
        >
          <button
            onClick={nextStep}
            className="w-full h-14 rounded-[2rem] bg-primary text-white font-bold text-lg shadow-[0_8px_0_#1d4ed8] active:shadow-none active:translate-y-[8px] transition-all flex items-center justify-center gap-2"
          >
            {step === 5 ? "Começar minha Jornada" : "Continuar"}
            <span className="material-symbols-rounded">
              {step === 5 ? "check" : "arrow_forward"}
            </span>
          </button>
        </m.div>
      </AnimatePresence>

    </div>
    </LazyMotion>  );
}

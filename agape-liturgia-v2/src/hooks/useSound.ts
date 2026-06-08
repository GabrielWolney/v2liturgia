"use client";

import { useCallback, useRef } from "react";
import { useUserStore } from "@/store/useUserStore";

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      return audioCtxRef.current;
    } catch (e) {
      console.warn("AudioContext bloqueado:", e);
      return null;
    }
  };

  const checkEnabled = () => {
    try {
      const { somAtivado } = useUserStore.getState();
      if (!somAtivado) return false;
      const ctx = getAudioContext();
      if (!ctx) return false;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      return ctx;
    } catch (e) {
      return false;
    }
  };

  // Cria um nó de som básico com envelope ADSR suave
  const playTone = (ctx: AudioContext, type: OscillatorType, freq: number, startTime: number, duration: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    // Ataque super rápido
    gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    // Decay exponencial
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.start(startTime);
    osc.stop(startTime + duration);
    return osc;
  };

  // 1. Som de "Bolha" orgânica e macia (Facebook Like)
  const playPop = useCallback(() => {
    try {
      const ctx = checkEnabled();
      if (!ctx) return;
      const t = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.1);
      
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.5, t + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      
      osc.start(t);
      osc.stop(t + 0.1);
    } catch (e) {
      console.warn("AudioPlayback falhou", e);
    }
  }, []);

  // 2. Som de "Vidro/Madeira" muito curto (Apple UI)
  const playClick = useCallback(() => {
    try {
      const ctx = checkEnabled();
      if (!ctx) return;
      const t = ctx.currentTime;
      
      playTone(ctx, "sine", 1200, t, 0.03, 0.1);
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      
      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(400, t);
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.1, t + 0.005);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      
      osc2.start(t);
      osc2.stop(t + 0.03);
    } catch (e) {
      console.warn("AudioPlayback falhou", e);
    }
  }, []);

  // 3. Som de Switch Mecânico Bifásico (Ligar/Desligar)
  const playSwitch = useCallback((isOn: boolean = true) => {
    try {
      const ctx = checkEnabled();
      if (!ctx) return;
      const t = ctx.currentTime;
      
      if (isOn) {
        playTone(ctx, "sine", 500, t, 0.04, 0.1);
        playTone(ctx, "sine", 750, t + 0.04, 0.05, 0.15);
      } else {
        playTone(ctx, "sine", 600, t, 0.04, 0.1);
        playTone(ctx, "sine", 400, t + 0.04, 0.05, 0.1);
      }
    } catch (e) {
      console.warn("AudioPlayback falhou", e);
    }
  }, []);

  // 4. Som de Sucesso Brilhante (Duolingo style)
  const playSuccess = useCallback(() => {
    try {
      const ctx = checkEnabled();
      if (!ctx) return;
      const t = ctx.currentTime;
      
      const delay = 0.08;
      const vol = 0.15;
      
      playTone(ctx, "sine", 523.25, t, 0.3, vol); // C5
      playTone(ctx, "sine", 659.25, t + delay, 0.3, vol); // E5
      playTone(ctx, "sine", 783.99, t + delay * 2, 0.3, vol); // G5
      playTone(ctx, "sine", 1046.50, t + delay * 3, 0.6, 0.2); // C6
    } catch (e) {
      console.warn("AudioPlayback falhou", e);
    }
  }, []);

  // 5. Som de Erro Orgânico (Maciço e suave)
  const playError = useCallback(() => {
    try {
      const ctx = checkEnabled();
      if (!ctx) return;
      const t = ctx.currentTime;
      
      playTone(ctx, "sine", 200, t, 0.2, 0.2); 
      playTone(ctx, "sine", 180, t + 0.1, 0.25, 0.2);
    } catch (e) {
      console.warn("AudioPlayback falhou", e);
    }
  }, []);

  return { playPop, playClick, playSwitch, playSuccess, playError };
}

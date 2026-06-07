"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { getMisteriosInfo, ORACOES, UI_TEXTS } from "../domain/terco.domain";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { getDataIso } from "@/lib/date-utils";
import { atualizarContador } from "@/services/db-home";
import { trackEvent } from "@/lib/analytics";

export type Lang = "pt" | "la";

export interface RenderContent {
  label: string;
  title: string;
  text: string;
  count?: number | string;
  style?: string;
  type?: "sinal" | "credo" | "paiNosso" | "aveMaria" | "gloria" | "fatima" | "salveRainha" | "misterio" | "final";
}

export function useTerco() {
  const router = useRouter();
  const store = useUserStore();
  const { playClick, playPop, playSuccess } = useSound();
  const { triggerHaptic } = useHaptics();

  const [isLatin, setIsLatin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [flux, setFlux] = useState(0);
  const [subFlux, setSubFlux] = useState(0);

  const dataHoje = getDataIso();

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const MISTERIOS_INFO = useMemo(() => getMisteriosInfo(), []);

  const lang: Lang = isLatin ? "la" : "pt";
  const ui = UI_TEXTS[lang];

  const handleNext = useCallback(() => {
    if (flux < 5) setFlux((f) => f + 1);
    else if (flux >= 5 && flux <= 9) {
      if (subFlux < 12) setSubFlux((s) => s + 1);
      else {
        if (flux < 9) {
          setFlux((f) => f + 1);
          setSubFlux(0);
        } else setFlux(10);
      }
    } else if (flux === 10) setFlux(11);
    
    if (flux === 10) {
      playSuccess();
      triggerHaptic("success");
    } else {
      playPop();
      triggerHaptic("light");
    }
  }, [flux, subFlux, playPop, playSuccess, triggerHaptic]);

  const handlePrev = useCallback(() => {
    if (subFlux > 0) setSubFlux((s) => s - 1);
    else if (flux > 0) {
      const prevFlux = flux - 1;
      setFlux(prevFlux);
      if (prevFlux >= 5 && prevFlux <= 9) setSubFlux(12);
    }
    playClick();
    triggerHaptic("light");
  }, [flux, subFlux, playClick, triggerHaptic]);

  const handleSkip = useCallback(() => {
    setFlux(11);
    setSubFlux(0);
    playSuccess();
    triggerHaptic("medium");
  }, [playSuccess, triggerHaptic]);

  const resetTerco = useCallback(() => {
    setFlux(0);
    setSubFlux(0);
    playClick();
    triggerHaptic("light");
  }, [playClick, triggerHaptic]);

  const handleNextMystery = useCallback(() => {
    if (flux >= 5 && flux < 9) {
      setFlux((f) => f + 1);
      setSubFlux(0);
      playClick();
      triggerHaptic("light");
    } else if (flux < 5) {
      setFlux(5);
      setSubFlux(0);
      playClick();
      triggerHaptic("light");
    } else if (flux === 9) {
      setFlux(10);
      setSubFlux(0);
      playSuccess();
      triggerHaptic("medium");
    }
  }, [flux, playClick, playSuccess, triggerHaptic]);

  const handlePrevMystery = useCallback(() => {
    if (flux > 5 && flux <= 10) {
      setFlux((f) => f - 1);
      setSubFlux(0);
      playClick();
      triggerHaptic("light");
    } else if (flux === 5) {
      setFlux(4);
      setSubFlux(0);
      playClick();
      triggerHaptic("light");
    }
  }, [flux, playClick, triggerHaptic]);

  const progresso = useMemo(
    () => Math.round(((flux * 13 + subFlux) / 144) * 100),
    [flux, subFlux]
  );

  const handleRegistrar = useCallback(() => {
    playSuccess();
    triggerHaptic("success");
    
    if (!store.tercosConcluidos[dataHoje]) {
      atualizarContador(dataHoje, 'terco', true);
    }

    store.marcarTercoConcluido(dataHoje);
    store.registrarAtividade();
    trackEvent("terco_concluido", { misterio: MISTERIOS_INFO.nomeKey });

    router.push("/jornada");
  }, [store, dataHoje, router, playSuccess, triggerHaptic, MISTERIOS_INFO]);

  const renderContent = useCallback((): RenderContent => {
    if (flux === 0)
      return { label: ui.inicio, title: ui.tSinal, text: ORACOES.SINAL_CRUZ[lang], type: "sinal" };
    if (flux === 1)
      return { label: ui.profissao, title: ui.tCredo, text: ORACOES.CREDO[lang], type: "credo" };
    if (flux === 2)
      return { label: ui.intencoes, title: ui.tPaiNosso, text: ORACOES.PAI_NOSSO[lang], type: "paiNosso" };
    if (flux === 3)
      return {
        label: ui.virtudes, title: ui.aveMaria, text: ORACOES.AVE_MARIA[lang],
        count: isLatin ? "Per Fidem, Spem et Caritátem" : "Pela Fé, Esperança e Caridade",
        type: "aveMaria",
      };
    if (flux === 4)
      return { label: ui.louvor, title: ui.tGloria, text: ORACOES.GLORIA[lang], type: "gloria" };
    if (flux === 10)
      return { label: ui.encerramento, title: ui.tSalveRainha, text: ORACOES.SALVE_RAINHA[lang], type: "salveRainha" };
    if (flux === 11)
      return {
        label: ui.concluido, title: ui.tDeoGratias,
        text: isLatin
          ? "Rosarium in Agápe rite relatum est."
          : "Sua coroa de orações foi entregue a Nossa Senhora.",
        type: "final",
      };

    const mIdx = flux - 5;
    const m = MISTERIOS_INFO.lista[mIdx];

    if (subFlux === 0)
      return { label: `${mIdx + 1}º ${ui.misterio}`, title: m.t, text: m.p, style: "font-serif italic text-xl", type: "misterio" };
    if (subFlux === 1)
      return { label: ui.oracaoSenhor, title: ui.tPaiNosso, text: ORACOES.PAI_NOSSO[lang], type: "paiNosso" };
    if (subFlux >= 2 && subFlux <= 11)
      return { label: `${mIdx + 1}º ${ui.misterio}`, title: ui.aveMaria, text: ORACOES.AVE_MARIA[lang], count: subFlux - 1, type: "aveMaria" };
    if (subFlux === 12)
      return { label: ui.doxologia, title: ui.tGloriaFatima, text: `${ORACOES.GLORIA[lang]}\n\n${ORACOES.FATIMA[lang]}`, type: "fatima" };

    return { label: "", title: "", text: "" };
  }, [flux, subFlux, lang, ui, isLatin, MISTERIOS_INFO]);

  const content = renderContent();

  return {
    mounted,
    flux,
    subFlux,
    isLatin,
    content,
    progresso,
    ui,
    MISTERIOS_INFO,
    actions: {
      setIsLatin,
      handleNext,
      handlePrev,
      handleNextMystery,
      handlePrevMystery,
      handleSkip,
      resetTerco,
      handleRegistrar,
    },
  };
}

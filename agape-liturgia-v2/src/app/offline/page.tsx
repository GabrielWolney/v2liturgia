"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function OfflinePage() {
  const router = useRouter();
  const { modoVisual, tamanhoFonte } = useUserStore();

  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

  const bgClass = isDark
    ? "bg-slate-950"
    : isSepia
    ? "bg-[#FDF6E3]"
    : "bg-background";
  const cardBg = isDark
    ? "bg-slate-900"
    : isSepia
    ? "bg-[#F4ECD8]"
    : "bg-card";
  const borderColor = isDark
    ? "border-slate-800"
    : isSepia
    ? "border-[#E8DEC1]"
    : "border-border";
  const textMain = isDark
    ? "text-slate-100"
    : isSepia
    ? "text-[#4A3C31]"
    : "text-foreground";
  const textMuted = isDark
    ? "text-slate-400"
    : isSepia
    ? "text-[#8C7B65]"
    : "text-muted";
  const fontClass = tamanhoFonte === "grande" ? "text-lg" : "text-base";

  return (
    <div
      className={`min-h-dvh flex flex-col items-center justify-center px-6 text-center transition-colors duration-300 ${bgClass}`}
    >
      <div
        className={`w-full max-w-[400px] rounded-[2.5rem] p-8 shadow-soft border transition-colors duration-300 ${cardBg} ${borderColor}`}
      >
        {/* Ícone */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-inner bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <span className="material-symbols-rounded text-[48px]">wifi_off</span>
          </div>
        </div>

        <h1
          className={`font-extrabold tracking-tight mb-3 ${textMain} ${
            tamanhoFonte === "grande" ? "text-3xl" : "text-2xl"
          }`}
        >
          Sem conexão
        </h1>
        <p className={`mb-8 leading-relaxed ${textMuted} ${fontClass}`}>
          Esta página não está disponível offline. Mas você pode acessar a
          Liturgia, a Bíblia, o Terço e as suas anotações — tudo já está salvo
          no seu dispositivo.
        </p>

        <button
          onClick={() => router.push("/jornada")}
          className="w-full bg-[#2F6BFF] text-white font-bold py-4 rounded-[1.5rem] shadow-[0_6px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all hover:brightness-105 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-rounded text-xl">arrow_forward</span>
          Ir para a Pequena Via
        </button>
      </div>
    </div>
  );
}
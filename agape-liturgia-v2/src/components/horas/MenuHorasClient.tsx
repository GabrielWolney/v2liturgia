"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

export function MenuHorasClient() {
  const [isMounted, setIsMounted] = useState(false);
  const { modoVisual } = useUserStore();

  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  const horas = [
    { id: "oficio-das-leituras", titulo: "Ofício das Leituras", desc: "A qualquer hora do dia", icone: "menu_book" },
    { id: "laudes", titulo: "Laudes", desc: "Oração da manhã", icone: "wb_twilight" },
    { id: "hora-media", titulo: "Hora Média", desc: "Terça, Sexta ou Nona", icone: "light_mode" },
    { id: "vesperas", titulo: "Vésperas", desc: "Oração da tarde", icone: "wb_sunny" },
    { id: "completas", titulo: "Completas", desc: "Oração da noite", icone: "nights_stay" },
  ];

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 bg-background text-foreground`}>
      <header className={`sticky top-0 z-40 px-5 py-4 flex items-center justify-between backdrop-blur-md transition-colors duration-300 border-b bg-background/90 border-border shadow-sm`}>
        <Link href="/jornada" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
          <span className="material-symbols-rounded">arrow_back</span>
        </Link>
        <h1 className="font-bold text-lg">Liturgia das Horas</h1>
        <div className="w-10" /> 
      </header>

      <main className="px-5 mt-8 max-w-[500px] mx-auto animate-fade-in">
        <h2 className={`font-black text-2xl mb-2 text-center text-foreground`}>Ofício Divino</h2>
        <p className="text-center opacity-70 mb-8 font-medium">A oração pública e comunitária da Igreja.</p>

        <div className="flex flex-col gap-4">
          {horas.map((hora) => (
            <Link 
              key={hora.id}
              href={`/horas/${hora.id}`}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-[0.98] bg-card border-border hover:brightness-95 shadow-sm`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-rounded text-[26px]">{hora.icone}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{hora.titulo}</h3>
                  <p className="text-xs opacity-60 font-medium">{hora.desc}</p>
                </div>
              </div>
              <span className="material-symbols-rounded opacity-40">chevron_right</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

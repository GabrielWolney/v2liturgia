"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { bibliaCatolica, Testament } from "@/lib/bible-index";
import { trackEvent } from "@/lib/analytics";
import { useUserStore } from "@/store/useUserStore";

const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function BibliaPage() {
  const router = useRouter();
  const [testamentoAtivo, setTestamentoAtivo] = useState<Testament>('novo');
  const [busca, setBusca] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "biblia_index" });
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";
  
  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  const livrosExibidos = bibliaCatolica[testamentoAtivo];
  const livrosFiltrados = livrosExibidos.filter(l => removerAcentos(l.nome).includes(removerAcentos(busca)));

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30 transition-colors duration-300 ${wrapperClass}`}>
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1000px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <button onClick={() => router.push('/jornada')} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight ${textMain} ${fontClass}`}>Bíblia Sagrada</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="mb-8 max-w-[600px] mx-auto w-full relative">
          <span className={`material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`}>search</span>
          <input 
            type="text" 
            placeholder="Qual livro procura?" 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            className={`w-full border rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#2F6BFF] focus:ring-4 focus:ring-[#2F6BFF]/10 transition-all font-bold shadow-sm placeholder:opacity-60 ${cardBg} ${borderColor} ${textMain}`}
          />
        </div>

        <div className="flex justify-center mb-10">
          <div className={`p-1.5 rounded-2xl inline-flex shadow-inner border ${borderColor} ${isDark ? 'bg-slate-950/50' : isSepia ? 'bg-[#E8DEC1]/30' : 'bg-slate-200/50'}`}>
            <button 
              onClick={() => setTestamentoAtivo('antigo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${testamentoAtivo === 'antigo' ? `shadow-sm text-[#2F6BFF] ${cardBg}` : `${textMuted} hover:brightness-90`}`}
            >
              Antigo
            </button>
            <button 
              onClick={() => setTestamentoAtivo('novo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${testamentoAtivo === 'novo' ? `shadow-sm text-[#2F6BFF] ${cardBg}` : `${textMuted} hover:brightness-90`}`}
            >
              Novo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {livrosFiltrados.map((livro) => (
            <Link 
              key={livro.slug} 
              href={`/biblia/${livro.slug}`} 
              className={`border flex items-center justify-center text-center p-4 min-h-[80px] rounded-[1.5rem] font-bold text-sm hover:border-[#2F6BFF]/50 hover:text-[#2F6BFF] shadow-sm hover:shadow-md transition-all active:scale-95 group ${cardBg} ${borderColor} ${textMain}`}
            >
              <span className="group-hover:-translate-y-0.5 transition-transform duration-200">{livro.nome}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
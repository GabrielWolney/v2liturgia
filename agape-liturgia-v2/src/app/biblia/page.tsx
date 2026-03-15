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
  
  // O modoVisual foi removido, o CSS faz tudo agora!
  const { tamanhoFonte } = useUserStore();

  useEffect(() => {
    trackEvent("page_view", { page_name: "biblia_index" });
  }, []);

  // Previne o erro de hidratação na troca de fontes, sem bloquear a tela toda
  const fontClass =  tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  const livrosExibidos = bibliaCatolica[testamentoAtivo];
  const livrosFiltrados = livrosExibidos.filter(l => removerAcentos(l.nome).includes(removerAcentos(busca)));

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 selection:bg-primary/30 transition-colors duration-300 bg-background">
      
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1000px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <button onClick={() => router.push('/jornada')} className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight text-foreground ${fontClass}`}>Bíblia Sagrada</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="mb-8 max-w-[600px] mx-auto w-full relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-muted">search</span>
          <input 
            type="text" 
            placeholder="Qual livro procura?" 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold shadow-sm placeholder:opacity-60 bg-card border-border text-foreground"
          />
        </div>

        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl inline-flex shadow-inner border border-border bg-muted/10">
            <button 
              onClick={() => setTestamentoAtivo('antigo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${testamentoAtivo === 'antigo' ? 'shadow-sm text-primary bg-card' : 'text-muted hover:text-foreground'}`}
            >
              Antigo
            </button>
            <button 
              onClick={() => setTestamentoAtivo('novo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${testamentoAtivo === 'novo' ? 'shadow-sm text-primary bg-card' : 'text-muted hover:text-foreground'}`}
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
              className="border flex items-center justify-center text-center p-4 min-h-[80px] rounded-[1.5rem] font-bold text-sm hover:border-primary/50 hover:text-primary shadow-sm hover:shadow-md transition-all active:scale-95 group bg-card border-border text-foreground"
            >
              <span className="group-hover:-translate-y-0.5 transition-transform duration-200">{livro.nome}</span>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
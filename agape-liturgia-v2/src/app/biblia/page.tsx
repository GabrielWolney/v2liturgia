"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bibliaCatolica, Testament } from "@/lib/bible-index";
import { trackEvent } from "@/lib/analytics";

const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function BibliaPage() {
  const router = useRouter();
  const [testamentoAtivo, setTestamentoAtivo] = useState<Testament>('novo');
  const [busca, setBusca] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "biblia_index" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  const livrosExibidos = bibliaCatolica[testamentoAtivo];
  const livrosFiltrados = livrosExibidos.filter(livro => 
    removerAcentos(livro.nome).includes(removerAcentos(busca))
  );

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* HEADER NAVEGAÇÃO FIXA */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1000px] mx-auto w-full">
        <button 
          onClick={() => router.push('/jornada')}
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Bíblia Sagrada</h1>
        <div className="w-10 h-10"></div> {/* Espaçador */}
      </header>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* PESQUISA DE LIVROS */}
        <div className="mb-8 max-w-[600px] mx-auto w-full relative">
          <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]">search</span>
          <input 
            type="text" 
            placeholder="Qual livro procura?" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.5rem] pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-[#2F6BFF] focus:ring-4 focus:ring-[#2F6BFF]/10 transition-all font-bold text-[#1F1F1F] placeholder:text-[#6B6B6B] shadow-sm"
          />
        </div>

        {/* SELETOR DE TESTAMENTOS (Segmented Control) */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex shadow-inner">
            <button 
              onClick={() => setTestamentoAtivo('antigo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                testamentoAtivo === 'antigo' 
                  ? 'bg-white text-[#2F6BFF] shadow-sm' 
                  : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
              }`}
            >
              Antigo Testamento
            </button>
            <button 
              onClick={() => setTestamentoAtivo('novo')} 
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                testamentoAtivo === 'novo' 
                  ? 'bg-white text-[#2F6BFF] shadow-sm' 
                  : 'text-[#6B6B6B] hover:text-[#1F1F1F]'
              }`}
            >
              Novo Testamento
            </button>
          </div>
        </div>

        {/* GRID DE LIVROS */}
        {livrosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-[#6B6B6B] font-medium">
            <p>Nenhum livro encontrado com esse nome.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {livrosFiltrados.map((livro) => (
              <Link 
                key={livro.slug} 
                href={`/biblia/${livro.slug}`}
                className="bg-white border border-slate-100 flex items-center justify-center text-center p-4 min-h-[80px] rounded-[1.5rem] font-bold text-sm text-[#1F1F1F] hover:bg-[#2F6BFF]/5 hover:border-[#2F6BFF]/30 hover:text-[#2F6BFF] shadow-sm hover:shadow-md transition-all active:scale-95 group"
              >
                <span className="group-hover:-translate-y-0.5 transition-transform duration-200">
                  {livro.nome}
                </span>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
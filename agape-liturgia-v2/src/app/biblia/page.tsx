"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { bibliaCatolica, Testament } from "@/lib/bible-index";
import { trackEvent } from "@/lib/analytics";

const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function BibliaPage() {
  const [testamentoAtivo, setTestamentoAtivo] = useState<Testament>('novo');
  const [busca, setBusca] = useState("");

  useEffect(() => {
    trackEvent("page_view", { page_name: "biblia_index" });
  }, []);

  const livrosExibidos = bibliaCatolica[testamentoAtivo];
  
  const livrosFiltrados = livrosExibidos.filter(livro => 
    removerAcentos(livro.nome).includes(removerAcentos(busca))
  );

  return (
    <div className="max-w-[1000px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER */}
      <header className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">menu_book</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Bíblia Sagrada
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Tradução Católica Ave Maria
        </p>
      </header>

      {/* PESQUISA */}
      <div className="mb-8 max-w-[500px] mx-auto w-full relative">
        <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text" 
          placeholder="Pesquisar livro..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* SELETOR DE TESTAMENTOS (Segmented Control) */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button 
            onClick={() => setTestamentoAtivo('novo')} 
            className={`px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              testamentoAtivo === 'novo' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Novo Testamento
          </button>
          <button 
            onClick={() => setTestamentoAtivo('antigo')} 
            className={`px-6 sm:px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              testamentoAtivo === 'antigo' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Antigo Testamento
          </button>
        </div>
      </div>

      {/* GRID DE LIVROS */}
      {livrosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-medium">
          <p>Nenhum livro encontrado com esse nome.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {livrosFiltrados.map((livro) => (
            <Link 
              key={livro.slug} 
              href={`/biblia/${livro.slug}`}
              className="bg-white border border-slate-200 flex items-center justify-center text-center p-4 min-h-[75px] rounded-2xl font-bold text-sm text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 hover:shadow-md transition-all active:scale-95 group"
            >
              <span className="group-hover:-translate-y-0.5 transition-transform duration-200">
                {livro.nome}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
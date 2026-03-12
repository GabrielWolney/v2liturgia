"use client";

import { useEffect, useState } from "react";
import { subscribeToPedidos, adicionarPedido, registrarOracaoFeita, deletarPedido, PedidoOracao } from "@/services/db-mural";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

type FiltroMural = '24h' | 'todas';

export default function MuralPage() {
  // ESCUDO ANTI-HIDRATAÇÃO
  const [isMounted, setIsMounted] = useState(false);

  const [pedidos, setPedidos] = useState<PedidoOracao[]>([]);
  const [filtro, setFiltro] = useState<FiltroMural>('24h');
  
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    meusPedidosMural, addMeuPedido, removeMeuPedido, 
    oracoesFeitas, toggleOracaoFeita 
  } = useUserStore();

  useEffect(() => {
    // Evita o erro do linter de cascading render
    const mountTimer = setTimeout(() => setIsMounted(true), 0);

    const unsubscribe = subscribeToPedidos(filtro, setPedidos);
    trackEvent("page_view", { page_name: "mural", filtro_ativo: filtro });
    
    return () => { 
      clearTimeout(mountTimer);
      unsubscribe(); 
    };
  }, [filtro]);

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    
    setIsSubmitting(true);
    const id = await adicionarPedido(nome, texto);
    
    if (id) {
      addMeuPedido(id);
      setTexto("");
      trackEvent("publish_prayer", { has_name: !!nome });
    }
    setIsSubmitting(false);
  };

  const handleRezar = async (id: string) => {
    const jaRezei = oracoesFeitas.includes(id);
    toggleOracaoFeita(id);
    await registrarOracaoFeita(id, jaRezei ? -1 : 1);
    if (!jaRezei) trackEvent("pray_for_someone");
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar o seu pedido?")) {
      await deletarPedido(id);
      removeMeuPedido(id);
    }
  };

  // TELA DE CARREGAMENTO (SKELETON ELEGANTE)
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center text-blue-500">
          <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-48 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded-full w-32"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER */}
      <header className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">volunteer_activism</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Mural de Intercessão
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          &quot;Orai uns pelos outros para serdes curados&quot; (Tg 5,16)
        </p>
      </header>

      {/* FORMULÁRIO DE PUBLICAÇÃO */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-slate-100 mb-8">
        <h2 className="font-bold text-lg text-slate-900 mb-4">Deixe o seu pedido</h2>
        
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Seu nome (opcional)" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
          />
          <textarea 
            placeholder="Escreva aqui pelo que devemos rezar..." 
            value={texto} 
            onChange={e => setTexto(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none h-24"
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleEnviar} 
              disabled={isSubmitting || !texto.trim()}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              {isSubmitting ? (
                <span className="material-symbols-rounded animate-spin">autorenew</span>
              ) : (
                <span className="material-symbols-rounded text-[20px]">send</span>
              )}
              Publicar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* FILTROS (Segmented Control) */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex shadow-inner">
          <button 
            onClick={() => setFiltro('24h')} 
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              filtro === '24h' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Últimas 24h
          </button>
          <button 
            onClick={() => setFiltro('todas')} 
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              filtro === 'todas' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Todas
          </button>
        </div>
      </div>

      {/* FEED DE PEDIDOS */}
      <ul className="flex flex-col gap-4">
        {pedidos.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium">
            <span className="material-symbols-rounded text-5xl mb-2 opacity-50">forum</span>
            <p>Nenhum pedido encontrado nesta aba.</p>
          </div>
        )}

        {pedidos.map(p => {
          const isMeu = meusPedidosMural.includes(p.id);
          const jaRezei = oracoesFeitas.includes(p.id);

          return (
            <li key={p.id} className="bg-white border border-slate-100 shadow-sm rounded-3xl p-5 sm:p-6 transition-all hover:shadow-md relative overflow-hidden group">
              
              {isMeu && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>}

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <span className="material-symbols-rounded text-[18px]">person</span>
                  </div>
                  <strong className="text-slate-900 font-bold">{p.nome}</strong>
                </div>
                
                {isMeu && (
                  <button 
                    onClick={() => handleExcluir(p.id)} 
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex items-center justify-center"
                    title="Apagar meu pedido"
                  >
                    <span className="material-symbols-rounded text-[20px]">delete</span>
                  </button>
                )}
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6 pl-10">
                {p.texto}
              </p>
              
              <div className="flex justify-between items-center pl-10 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <span className="material-symbols-rounded text-[16px]">folded_hands</span>
                  {p.contagemOracoes} {p.contagemOracoes === 1 ? 'intercessor' : 'intercessores'}
                </div>
                
                <button 
                  onClick={() => handleRezar(p.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95 ${
                    jaRezei 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                      : "bg-blue-50 text-blue-600 border border-transparent hover:bg-blue-100"
                  }`}
                >
                  <span className="material-symbols-rounded text-[18px]">
                    {jaRezei ? "check_circle" : "favorite"}
                  </span>
                  {jaRezei ? "Em oração" : "Rezar"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
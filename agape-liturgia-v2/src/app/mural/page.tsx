"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToPedidos, adicionarPedido, registrarOracaoFeita, deletarPedido, PedidoOracao } from "@/services/db-mural";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

type FiltroMural = '24h' | 'todas';

export default function MuralPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([]);
  const [filtro, setFiltro] = useState<FiltroMural>('24h');
  
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { meusPedidosMural, addMeuPedido, removeMeuPedido, oracoesFeitas, toggleOracaoFeita } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    const unsubscribe = subscribeToPedidos(filtro, setPedidos);
    trackEvent("page_view", { page_name: "mural_v2", filtro_ativo: filtro });
    
    return () => { clearTimeout(mountTimer); unsubscribe(); };
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

  if (!isMounted) return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/jornada"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Intercessão</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-[#2F6BFF]/10 rounded-[1.25rem] flex items-center justify-center text-[#2F6BFF] mb-4 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">volunteer_activism</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-1">Mural de Oração</h2>
          <p className="text-[#6B6B6B] font-medium text-sm">&quot;Orai uns pelos outros&quot; (Tg 5,16)</p>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-white rounded-[2rem] p-6 shadow-soft border border-slate-100 mb-10">
          <h3 className="font-bold text-[#1F1F1F] mb-4">Deixe o seu pedido</h3>
          <div className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Seu nome (opcional)" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2F6BFF] transition-all font-bold text-[#1F1F1F]"
            />
            <textarea 
              placeholder="Escreva pelo que devemos rezar..." 
              value={texto} 
              onChange={e => setTexto(e.target.value)} 
              className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2F6BFF] transition-all font-medium text-[#1F1F1F] resize-none h-24"
            />
            <button 
              onClick={handleEnviar} 
              disabled={isSubmitting || !texto.trim()}
              className="mt-2 bg-[#2F6BFF] text-white font-bold py-3 px-6 rounded-xl hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span className="material-symbols-rounded animate-spin">autorenew</span> : <span className="material-symbols-rounded">send</span>}
              Publicar Pedido
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl inline-flex shadow-inner">
            <button 
              onClick={() => setFiltro('24h')} 
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${filtro === '24h' ? 'bg-white text-[#2F6BFF] shadow-sm' : 'text-[#6B6B6B]'}`}
            >
              Últimas 24h
            </button>
            <button 
              onClick={() => setFiltro('todas')} 
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${filtro === 'todas' ? 'bg-white text-[#2F6BFF] shadow-sm' : 'text-[#6B6B6B]'}`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* FEED */}
        <ul className="flex flex-col gap-4">
          {pedidos.length === 0 && (
            <div className="text-center py-10 text-[#6B6B6B] font-medium">Nenhum pedido recente.</div>
          )}
          {pedidos.map(p => {
            const isMeu = meusPedidosMural.includes(p.id);
            const jaRezei = oracoesFeitas.includes(p.id);

            return (
              <li key={p.id} className="bg-white border border-slate-100 shadow-sm rounded-[1.5rem] p-5 relative overflow-hidden">
                {isMeu && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2F6BFF]"></div>}
                <div className="flex justify-between items-center mb-3">
                  <strong className="text-[#1F1F1F] font-extrabold">{p.nome}</strong>
                  {isMeu && (
                    <button onClick={() => handleExcluir(p.id)} className="text-[#6B6B6B] hover:text-red-500">
                      <span className="material-symbols-rounded text-[20px]">delete</span>
                    </button>
                  )}
                </div>
                <p className="text-[#6B6B6B] leading-relaxed mb-4 text-sm">{p.texto}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wide">
                    {p.contagemOracoes} orações
                  </span>
                  <button 
                    onClick={() => handleRezar(p.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-95 ${
                      jaRezei ? "bg-emerald-100 text-emerald-700" : "bg-[#2F6BFF]/10 text-[#2F6BFF]"
                    }`}
                  >
                    <span className="material-symbols-rounded text-[16px]">{jaRezei ? "check_circle" : "favorite"}</span>
                    {jaRezei ? "Rezei" : "Rezar"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
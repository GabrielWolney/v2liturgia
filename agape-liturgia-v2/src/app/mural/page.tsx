"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToPedidos, adicionarPedido, registrarOracaoFeita, deletarPedido, PedidoOracao } from "@/services/db-mural";
import { useUserStore } from "@/store/useUserStore";

type FiltroMural = '24h' | 'todas';

export default function MuralPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([]);
  const [filtro, setFiltro] = useState<FiltroMural>('24h');
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { meusPedidosMural, addMeuPedido, removeMeuPedido, oracoesFeitas, toggleOracaoFeita, tamanhoFonte } = useUserStore();

  useEffect(() => {
    // isMounted aqui serve apenas para garantir hidratação segura em componentes dinâmicos (tamanho da fonte/likes).
    const timer = setTimeout(() => setIsMounted(true), 0);
    const unsubPedidos = subscribeToPedidos(filtro, setPedidos);
    return () => { clearTimeout(timer); unsubPedidos(); };
  }, [filtro]);

  const handleEnviar = async () => { 
    if (!texto.trim()) return; 
    setIsSubmitting(true);
    const id = await adicionarPedido(nome, texto);
    if (id) { addMeuPedido(id); setTexto(""); setNome(""); }
    setIsSubmitting(false);
  };

  const handleRezar = async (id: string) => { 
    const jaRezei = oracoesFeitas.includes(id); 
    toggleOracaoFeita(id); 
    await registrarOracaoFeita(id, jaRezei ? -1 : 1);
  };

  const handleExcluir = async (id: string) => { 
    if (confirm("Tem certeza que deseja apagar o seu pedido?")) { await deletarPedido(id); removeMeuPedido(id); }
  };

  // Prevenção segura contra flash de hidratação na troca da fonte
  const fontClass = isMounted && tamanhoFonte === 'grande' ? 'text-lg' : 'text-sm';

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href="/jornada" className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight text-foreground ${isMounted && tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>Intercessão</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="rounded-[2rem] p-6 shadow-soft border mb-10 transition-colors duration-300 bg-card border-border">
          <h3 className="font-bold mb-4 text-foreground">Deixe o seu pedido</h3>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Seu nome (opcional)" value={nome} onChange={e => setNome(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:opacity-50 bg-background border-border text-foreground" />
            <textarea placeholder="Escreva pelo que devemos rezar..." value={texto} onChange={e => setTexto(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium resize-none h-24 placeholder:opacity-50 bg-background border-border text-foreground" />
            <button onClick={handleEnviar} disabled={isSubmitting || !texto.trim()} className="mt-2 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {isSubmitting ? <span className="material-symbols-rounded animate-spin">autorenew</span> : <span className="material-symbols-rounded">send</span>} Publicar Pedido
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="border p-1.5 rounded-2xl inline-flex shadow-inner bg-card border-border">
            <button onClick={() => setFiltro('24h')} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filtro === '24h' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}>Últimas 24h</button>
            <button onClick={() => setFiltro('todas')} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filtro === 'todas' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}>Todas</button>
          </div>
        </div>

        <ul className="flex flex-col gap-4">
          {pedidos.map(p => {
            const isMeu = isMounted && meusPedidosMural.includes(p.id);
            const jaRezei = isMounted && oracoesFeitas.includes(p.id);
            
            return (
              <li key={p.id} className="border shadow-sm rounded-[1.5rem] p-5 relative overflow-hidden transition-colors duration-300 bg-card border-border">
                {isMeu && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                <div className="flex justify-between items-center mb-3">
                  <strong className="font-extrabold text-foreground">{p.nome}</strong>
                  {isMeu && <button onClick={() => handleExcluir(p.id)} className="text-muted hover:text-red-500 transition-colors"><span className="material-symbols-rounded text-[20px]">delete</span></button>}
                </div>
                <p className={`leading-relaxed mb-4 text-muted ${fontClass}`}>{p.texto}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted">{p.contagemOracoes} orações</span>
                  <button onClick={() => handleRezar(p.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-95 ${jaRezei ? "bg-emerald-500/20 text-emerald-600" : "bg-primary/10 text-primary"}`}>
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
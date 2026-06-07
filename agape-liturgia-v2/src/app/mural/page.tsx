"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToPedidos, adicionarPedido, registrarOracaoFeita, deletarPedido, PedidoOracao } from "@/services/db-mural";
import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/hooks/useAuth";
import { useAlertStore } from "@/store/useAlertStore";
import { useNetwork } from "@/hooks/useNetwork";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

type FiltroMural = '24h' | 'todas';

export default function MuralPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([]);
  const [filtro, setFiltro] = useState<FiltroMural>('24h');
  const [limiteMural, setLimiteMural] = useState<number>(15);
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null);
  
  const isOnline = useNetwork();
  const { meusPedidosMural, addMeuPedido, removeMeuPedido, oracoesFeitas, toggleOracaoFeita, tamanhoFonte } = useUserStore();
  const { showAlert } = useAlertStore();
  const { user } = useAuth();
  const { playPop, playClick } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    // isMounted aqui serve apenas para garantir hidratação segura em componentes dinâmicos (tamanho da fonte/likes).
    const timer = setTimeout(() => setIsMounted(true), 0);
    const unsubPedidos = subscribeToPedidos(filtro, limiteMural, setPedidos);
    return () => { clearTimeout(timer); unsubPedidos(); };
  }, [filtro, limiteMural]);

  const handleEnviar = async () => { 
    if (!texto.trim()) return; 
    
    playPop();
    triggerHaptic('success');

    // UI Otimista: cria o card na hora (0ms)
    const fakeId = "temp-" + Date.now();
    const novoPedidoOtimista: PedidoOracao = {
      id: fakeId,
      nome: nome || "Anônimo",
      texto: texto,
      contagemOracoes: 0,
      data: new Date(),
    };
    
    setPedidos(prev => [novoPedidoOtimista, ...prev]);
    addMeuPedido(fakeId);
    
    const textoSalvo = texto;
    const nomeSalvo = nome;
    
    setTexto(""); 
    setNome(""); 
    
    const id = await adicionarPedido(nomeSalvo, textoSalvo);
    
    if (id) { 
      removeMeuPedido(fakeId);
      addMeuPedido(id); 
      
      if (!isOnline) {
        showAlert("Aviso Offline", "Você está sem internet. O seu pedido de oração foi salvo no celular e será compartilhado com a comunidade assim que a conexão voltar.", "info");
      } else {
        try {
          const nomeNotificacao = nomeSalvo ? nomeSalvo.trim() : "Um jovem";
          await fetch('/api/notificacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              titulo: "🙏 Novo Pedido de Oração",
              mensagem: `${nomeNotificacao} acabou de deixar um pedido no Mural. Venha interceder!`,
              paginaDestino: "/mural",
              tipo: "oracao",
              targetAgapeOnly: true 
            })
          });
        } catch (err) {
          console.error("Falha ao notificar mural:", err);
        }
      }
    } else {
      // Reverte se falhar
      setPedidos(prev => prev.filter(p => p.id !== fakeId));
      removeMeuPedido(fakeId);
      showAlert("Erro", "Não foi possível publicar seu pedido.", "error");
    }
  };

  const handleRezar = async (id: string) => { 
    if (!user) {
      showAlert("Faça Login", "Você precisa estar logado para interceder no mural.", "info");
      return;
    }
    
    playPop();
    triggerHaptic('light');

    const jaRezei = oracoesFeitas.includes(id); 
    toggleOracaoFeita(id); 
    
    // UI Otimista: Incrementa o contador da tela instantaneamente
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, contagemOracoes: p.contagemOracoes + (jaRezei ? -1 : 1) };
      }
      return p;
    }));

    await registrarOracaoFeita(id, jaRezei ? -1 : 1);
  };

  const handleExcluir = async (id: string) => { 
    playClick();
    triggerHaptic('medium');
    showAlert(
      "Apagar Pedido",
      "Tem certeza que deseja apagar o seu pedido de oração?",
      "error",
      async () => {
        await deletarPedido(id);
        removeMeuPedido(id);
      },
      true // showCancel
    );
  };

  // Prevenção segura contra flash de hidratação na troca da fonte
  const fontClass =  tamanhoFonte === 'grande' ? 'text-lg' : 'text-sm';

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background">
        <header className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border">
        <Link href="/jornada" onClick={() => { playPop(); triggerHaptic('light'); }} className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className={`font-extrabold tracking-tight text-foreground ${ tamanhoFonte === 'grande' ? 'text-xl' : 'text-lg'}`}>Intercessão</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="rounded-[2rem] p-6 shadow-soft border mb-10 transition-colors duration-300 bg-card border-border">
          {user ? (
            <>
              <h3 className="font-bold mb-4 text-foreground">Deixe o seu pedido</h3>
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Seu nome (opcional)" value={nome} onChange={e => setNome(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-bold placeholder:opacity-50 bg-background border-border text-foreground" />
                <textarea placeholder="Escreva pelo que devemos rezar..." value={texto} onChange={e => setTexto(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-all font-medium resize-none h-24 placeholder:opacity-50 bg-background border-border text-foreground" />
                <button onClick={handleEnviar} disabled={!texto.trim()} className="mt-2 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  <span className="material-symbols-rounded">send</span> Publicar Pedido
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-4 flex flex-col items-center justify-center">
              <span className="material-symbols-rounded text-[40px] mb-2 text-primary opacity-80">account_circle</span>
              <h3 className="font-bold mb-2 text-foreground">Faça parte da nossa comunidade</h3>
              <p className="text-sm text-muted mb-4 px-4">Para deixar um pedido de oração ou interceder pelos jovens, você precisa estar logado.</p>
              <Link href="/login" className="bg-primary text-white font-bold py-2 px-6 rounded-xl hover:brightness-105 transition-all active:scale-95">
                Entrar ou Cadastrar
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-8">
          <div className="border p-1.5 rounded-2xl inline-flex shadow-inner bg-card border-border">
            <button onClick={() => { playPop(); triggerHaptic('light'); setFiltro('24h'); }} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filtro === '24h' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}>Últimas 24h</button>
            <button onClick={() => { playPop(); triggerHaptic('light'); setFiltro('todas'); }} className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${filtro === 'todas' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-foreground'}`}>Todas</button>
          </div>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center border-border bg-card">
            <span className="material-symbols-rounded text-[48px] mb-3 opacity-20 text-foreground">volunteer_activism</span>
            <p className="font-medium text-muted">
              {filtro === '24h' ? "Nenhum pedido de oração nas últimas 24h." : "Nenhum pedido de oração encontrado."}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {pedidos.map(p => {
              const isMeu =  meusPedidosMural.includes(p.id);
              const jaRezei =  oracoesFeitas.includes(p.id);
              
              return (
                <m.li 
                  layoutId={p.id}
                  key={p.id} 
                  onClick={() => { playPop(); triggerHaptic('light'); setSelectedPedidoId(p.id); }}
                  className="border shadow-sm rounded-[1.5rem] p-5 relative overflow-hidden transition-colors duration-300 bg-card border-border cursor-pointer active:scale-[0.98]"
                >
                  {isMeu && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                  <div className="flex justify-between items-center mb-3">
                    <strong className="font-extrabold text-foreground">{p.nome}</strong>
                    {isMeu && <button onClick={(e) => { e.stopPropagation(); handleExcluir(p.id); }} className="text-muted hover:text-red-500 transition-colors"><span className="material-symbols-rounded text-[20px]">delete</span></button>}
                  </div>
                  <p className={`leading-relaxed mb-4 text-muted line-clamp-3 ${fontClass}`}>{p.texto}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted">{p.contagemOracoes} orações</span>
                    <button onClick={(e) => { e.stopPropagation(); handleRezar(p.id); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-95 ${jaRezei ? "bg-emerald-500/20 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                      <span className="material-symbols-rounded text-[16px]">{jaRezei ? "check_circle" : "favorite"}</span>
                      {jaRezei ? "Rezei" : "Rezar"}
                    </button>
                  </div>
                </m.li>
              );
            })}
          </ul>
        )}

        {pedidos.length >= limiteMural && (
          <div className="mt-8 mb-4 flex justify-center">
            <button 
              onClick={() => { playPop(); triggerHaptic('light'); setLimiteMural(prev => prev + 15); }}
              className="bg-card border border-border text-primary font-bold py-3 px-8 rounded-full shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              Carregar Mais Antigos
            </button>
          </div>
        )}
      </main>

      {/* Expanded Modal Layer */}
      <AnimatePresence>
        {selectedPedidoId && (
          <>
            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => { playClick(); triggerHaptic('light'); setSelectedPedidoId(null); }}
            />
            
            {(() => {
              const selectedPedido = pedidos.find(p => p.id === selectedPedidoId);
              if (!selectedPedido) return null;
              
              const isMeu = meusPedidosMural.includes(selectedPedido.id);
              const jaRezei = oracoesFeitas.includes(selectedPedido.id);

              return (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                  <m.div 
                    layoutId={selectedPedidoId}
                    className="w-full max-w-[500px] bg-card border border-border shadow-2xl rounded-[2.5rem] p-8 relative overflow-hidden pointer-events-auto"
                  >
                    {isMeu && <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary"></div>}
                    
                    <button 
                      onClick={() => { playClick(); triggerHaptic('light'); setSelectedPedidoId(null); }}
                      className="absolute top-5 right-5 w-10 h-10 bg-muted/10 text-muted rounded-full flex items-center justify-center hover:bg-muted/20 hover:text-foreground transition-colors active:scale-95"
                    >
                      <span className="material-symbols-rounded">close</span>
                    </button>

                    <div className="pr-12 mb-6">
                      <strong className="font-extrabold text-xl text-foreground">{selectedPedido.nome}</strong>
                      <p className="text-xs uppercase tracking-widest text-muted font-bold mt-1">Pedido de Oração</p>
                    </div>

                    <p className={`leading-relaxed mb-8 text-foreground ${fontClass}`}>
                      {selectedPedido.texto}
                    </p>

                    <div className="flex justify-between items-center pt-6 border-t border-border">
                      <div className="flex flex-col">
                        <span className="text-[28px] font-black text-foreground leading-none">{selectedPedido.contagemOracoes}</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-muted">Orações Realizadas</span>
                      </div>
                      
                      <button 
                        onClick={() => handleRezar(selectedPedido.id)} 
                        className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-sm ${jaRezei ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30" : "bg-primary text-white shadow-[0_4px_0_#1E4BCC]"}`}
                      >
                        <span className="material-symbols-rounded text-[20px]">{jaRezei ? "check_circle" : "favorite"}</span>
                        {jaRezei ? "JÁ REZOU" : "REZAR POR ELE(A)"}
                      </button>
                    </div>
                    </m.div>
                </div>
              );
            })()}
          </>
        )}
      </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
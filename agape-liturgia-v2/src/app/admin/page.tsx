"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeToAvisos, Aviso } from "@/services/db-home";
import { adicionarAviso, deletarAviso, getProposito, updateProposito, Proposito } from "@/services/db-admin";
import { useUserStore } from "@/store/useUserStore";

export default function AdminPageCrua() {
  const router = useRouter(); 
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [novoAvisoData, setNovoAvisoData] = useState("");

  
  const [propAtivo, setPropAtivo] = useState(false);
  const [propTema, setPropTema] = useState("");
  const [propTexto, setPropTexto] = useState("");

  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        getProposito().then((p: Proposito | null) => {
          if (p) {
            setPropAtivo(p.ativo === true || String(p.ativo) === "true");
            setPropTema(p.tema || "");
            setPropTexto(p.texto || "");
          }
        });
      }
    });

    const unsubAvisos = subscribeToAvisos(setAvisos);

    return () => {
      clearTimeout(mountTimer);
      unsubAuth();
      unsubAvisos();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { 
      await signInWithEmailAndPassword(auth, email, password); 
    } catch { 
      alert("Acesso negado"); 
    }
  };

  const handleSalvarAviso = async () => {
    if (!novoAvisoTexto || !novoAvisoData) return alert("Preencha texto e data!");
    await adicionarAviso(novoAvisoTexto, novoAvisoData);
    setNovoAvisoTexto(""); 
    setNovoAvisoData("");
    alert("Aviso salvo!");
  };

  const handleSalvarPropositos = async () => {
    await updateProposito({ 
      ativo: propAtivo, tema: propTema, texto: propTexto
    });
    alert("Propósito atualizado com sucesso!");
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const inputBg = isDark ? "bg-slate-800" : isSepia ? "bg-[#F4ECD8]" : "bg-white";
  const headerBg = isDark ? "bg-slate-950/90" : isSepia ? "bg-[#FDF6E3]/90" : "bg-background/90";
  const arrowHover = isDark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : isSepia ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]" : "hover:bg-slate-200 text-muted hover:text-foreground";
  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  
  
  
  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors duration-300 ${wrapperClass} ${textMain} ${fontClass}`}>
        
        {/* CABEÇALHO COM SETA DE VOLTAR */}
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
          <button onClick={() => router.back()} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
            <span className="material-symbols-rounded text-[26px]">arrow_back</span>
          </button>
          <h1 className={`font-extrabold tracking-tight ${textMain}`}>Área Restrita</h1>
          <div className="w-10 h-10"></div>
        </header>

        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className={`w-full max-w-[400px] p-8 rounded-[2rem] border shadow-soft ${cardBg} ${borderColor}`}>
            <h2 className="text-2xl font-black mb-6 text-center">Login da Coordenação</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input 
                type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required 
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#2F6BFF] transition-all ${inputBg} ${borderColor} ${textMain}`}
              />
              <input 
                type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required 
                className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#2F6BFF] transition-all ${inputBg} ${borderColor} ${textMain}`}
              />
              <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-md active:scale-95 transition-transform hover:brightness-105">
                ENTRAR
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  
  
  
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${wrapperClass} ${textMain} ${fontClass}`}>
      
      {/* CABEÇALHO ADMIN COM SETA DE VOLTAR E BOTÃO SAIR */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}>
        <button onClick={() => router.back()} className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}>
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight ${textMain}`}>Painel de Controle</h1>
        <button onClick={() => signOut(auth)} className="text-red-500 font-bold px-4 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs uppercase tracking-widest">
          Sair
        </button>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 pb-32 animate-fade-in">
        <div className="grid grid-cols-1 gap-8">
          
          {/* AVISOS */}
          <section className={`border-2 p-6 rounded-[2rem] transition-colors ${cardBg} ${borderColor}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-rounded text-amber-500">campaign</span> Adicionar Novo Aviso
            </h3>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="Texto do aviso (Aparece no Pop-up)..." value={novoAvisoTexto} onChange={e => setNovoAvisoTexto(e.target.value)} className={`w-full border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`} />
              <input type="date" value={novoAvisoData} onChange={e => setNovoAvisoData(e.target.value)} className={`w-fit border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`} />
              <button onClick={handleSalvarAviso} className="w-fit mt-2 px-8 py-3 bg-amber-500 text-white font-bold rounded-xl hover:brightness-105 transition-all active:scale-95">Salvar Aviso</button>
            </div>
            <h4 className={`mt-10 mb-4 font-black uppercase text-xs tracking-widest ${textMuted}`}>Avisos Ativos:</h4>
            <ul className="space-y-3">
              {avisos.length === 0 && <p className={`italic text-sm ${textMuted}`}>Nenhum aviso no momento.</p>}
              {avisos.map(a => (
                <li key={a.id} className={`flex justify-between items-center p-4 rounded-2xl border ${borderColor} ${isDark ? 'bg-slate-950/50' : 'bg-background/50'}`}>
                  <span className="text-sm"><strong className="text-amber-500">[{a.dataExpiracao}]</strong> {a.texto}</span>
                  <button onClick={() => deletarAviso(a.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"><span className="material-symbols-rounded">delete</span></button>
                </li>
              ))}
            </ul>
          </section>

          {/* PROPÓSITO ÚNICO (MENSAL/COMUNIDADE) */}
          <section className={`border-2 p-6 rounded-[2rem] border-primary/30 transition-colors ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
              <span className="material-symbols-rounded">flag</span> Propósito da Comunidade
            </h3>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input type="checkbox" checked={propAtivo} onChange={e => setPropAtivo(e.target.checked)} className="w-5 h-5 accent-primary" />
              <span className="font-bold">Ativar Propósito no App</span>
            </label>
            <div className="flex flex-col gap-4 mb-4">
              <input type="text" placeholder="Tema (ex: Mês das Vocações)" value={propTema} onChange={e => setPropTema(e.target.value)} className={`w-full border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`} />
              <textarea placeholder="Texto do propósito..." value={propTexto} onChange={e => setPropTexto(e.target.value)} className={`w-full h-32 border rounded-xl px-4 py-3 resize-none ${inputBg} ${borderColor} ${textMain}`} />
            </div>

            <button onClick={handleSalvarPropositos} className="w-full mt-6 py-4 bg-primary text-white font-black rounded-xl shadow-lg active:scale-95 transition-transform hover:brightness-105">
              GUARDAR PROPÓSITO
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
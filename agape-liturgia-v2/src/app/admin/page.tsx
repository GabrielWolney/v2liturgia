"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeToAvisos, Aviso } from "@/services/db-home";
import { adicionarAviso, deletarAviso, getProposito, updateProposito, Proposito } from "@/services/db-admin";
import { useUserStore } from "@/store/useUserStore";

export default function AdminPageCrua() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Estados Avisos
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [novoAvisoData, setNovoAvisoData] = useState("");

  // Estados Propósito
  const [propAtivo, setPropAtivo] = useState(false);
  const [propTema, setPropTema] = useState("");
  const [propTexto, setPropTexto] = useState("");

  const { modoVisual, tamanhoFonte } = useUserStore();

  useEffect(() => {
    // CORREÇÃO: setTimeout evita o erro de "cascading renders" do ESLint
    const mountTimer = setTimeout(() => setIsMounted(true), 0);

    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        getProposito().then((p: Proposito | null) => {
          if (p) {
            setPropAtivo(p.ativo === true || p.ativo === "true");
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

  // --- FUNÇÕES DE LÓGICA (RESTAURADAS) ---
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

  const handleSalvarProposito = async () => {
    await updateProposito({ ativo: propAtivo, tema: propTema, texto: propTexto });
    alert("Propósito atualizado!");
  };

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- CLASSES DINÂMICAS PARA TEMAS ---
  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';

  const wrapperClass = isDark ? "bg-slate-950" : isSepia ? "bg-[#FDF6E3]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const inputBg = isDark ? "bg-slate-800" : isSepia ? "bg-[#F4ECD8]" : "bg-white";
  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  if (!user) {
    return (
      <div className={`min-h-screen p-10 flex flex-col items-center justify-center transition-colors duration-300 ${wrapperClass} ${textMain} ${fontClass}`}>
        <div className={`w-full max-w-[400px] p-8 rounded-[2rem] border shadow-soft ${cardBg} ${borderColor}`}>
          <h2 className="text-2xl font-black mb-6">Login da Coordenação</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#2F6BFF] transition-all ${inputBg} ${borderColor} ${textMain}`}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-[#2F6BFF] transition-all ${inputBg} ${borderColor} ${textMain}`}
            />
            <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-md active:scale-95 transition-transform">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 pb-32 transition-colors duration-300 ${wrapperClass} ${textMain} ${fontClass}`}>
      <div className="max-w-[800px] mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tight">Painel de Controle</h1>
          <button onClick={() => signOut(auth)} className="text-red-500 font-bold px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors">
            Sair da conta
          </button>
        </header>

        <hr className={`mb-10 opacity-50 ${borderColor}`} />

        <div className="grid grid-cols-1 gap-8">
          <section className={`border-2 p-6 rounded-[2rem] transition-colors ${cardBg} ${borderColor}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-rounded">campaign</span> Adicionar Novo Aviso
            </h3>
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Texto do aviso..." 
                value={novoAvisoTexto} 
                onChange={e => setNovoAvisoTexto(e.target.value)} 
                className={`w-full border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`}
              />
              <input 
                type="date" 
                value={novoAvisoData} 
                onChange={e => setNovoAvisoData(e.target.value)} 
                className={`w-fit border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`}
              />
              <button onClick={handleSalvarAviso} className="w-fit mt-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:brightness-105 transition-all active:scale-95">
                Salvar Aviso
              </button>
            </div>

            <h4 className={`mt-10 mb-4 font-black uppercase text-xs tracking-widest ${textMuted}`}>Avisos Ativos:</h4>
            <ul className="space-y-3">
              {avisos.length === 0 && <p className={`italic text-sm ${textMuted}`}>Nenhum aviso no momento.</p>}
              {avisos.map(a => (
                <li key={a.id} className={`flex justify-between items-center p-4 rounded-2xl border ${borderColor} ${isDark ? 'bg-slate-950/50' : 'bg-background/50'}`}>
                  <span className="text-sm">
                    <strong className="text-primary">[{a.dataExpiracao}]</strong> {a.texto}
                  </span>
                  <button onClick={() => deletarAviso(a.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={`border-2 p-6 rounded-[2rem] border-purple-500/30 transition-colors ${cardBg}`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-500">
              <span className="material-symbols-rounded">stars</span> Propósito Mensal
            </h3>
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input 
                type="checkbox" 
                checked={propAtivo} 
                onChange={e => setPropAtivo(e.target.checked)} 
                className="w-5 h-5 accent-purple-600"
              />
              <span className="font-bold">Mostrar Propósito no App?</span>
            </label>
            
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Tema (ex: Mês das Vocações)" 
                value={propTema} 
                onChange={e => setPropTema(e.target.value)} 
                className={`w-full border rounded-xl px-4 py-3 ${inputBg} ${borderColor} ${textMain}`}
              />
              <textarea 
                placeholder="Texto do propósito..." 
                value={propTexto} 
                onChange={e => setPropTexto(e.target.value)} 
                className={`w-full h-32 border rounded-xl px-4 py-3 resize-none ${inputBg} ${borderColor} ${textMain}`}
              />
              <button onClick={handleSalvarProposito} className="w-full py-4 bg-purple-600 text-white font-black rounded-xl shadow-lg active:scale-95 transition-transform">
                ATUALIZAR PROPÓSITO
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
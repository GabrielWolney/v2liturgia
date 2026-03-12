"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { subscribeToAvisos, Aviso } from "@/services/db-home";
import { adicionarAviso, deletarAviso, getProposito, updateProposito, Proposito } from "@/services/db-admin";

export default function AdminPageCrua() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados Avisos
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [novoAvisoTexto, setNovoAvisoTexto] = useState("");
  const [novoAvisoData, setNovoAvisoData] = useState("");

  // Estados Propósito
  const [propAtivo, setPropAtivo] = useState(false);
  const [propTema, setPropTema] = useState("");
  const [propTexto, setPropTexto] = useState("");

  useEffect(() => {
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
    return () => { unsubAuth(); unsubAvisos(); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch { alert("Acesso negado"); }
  };

  const handleSalvarAviso = async () => {
    if (!novoAvisoTexto || !novoAvisoData) return alert("Preencha texto e data!");
    await adicionarAviso(novoAvisoTexto, novoAvisoData);
    setNovoAvisoTexto(""); setNovoAvisoData("");
    alert("Aviso salvo!");
  };

  const handleSalvarProposito = async () => {
    await updateProposito({ ativo: propAtivo, tema: propTema, texto: propTexto });
    alert("Propósito atualizado!");
  };

  if (!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Login da Coordenação</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" style={{ padding: "10px", background: "black", color: "white" }}>Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      <h1>Painel de Controle</h1>
      <button onClick={() => signOut(auth)} style={{ color: "red" }}>Sair da conta</button>
      <hr style={{ margin: "20px 0" }}/>

      <section style={{ border: "2px solid black", padding: "15px", marginBottom: "20px" }}>
        <h3>Adicionar Novo Aviso</h3>
        <input type="text" placeholder="Texto do aviso..." value={novoAvisoTexto} onChange={e => setNovoAvisoTexto(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
        <input type="date" value={novoAvisoData} onChange={e => setNovoAvisoData(e.target.value)} style={{ marginBottom: "10px" }} />
        <br/>
        <button onClick={handleSalvarAviso} style={{ padding: "8px 15px", background: "lightgray" }}>Salvar Aviso</button>

        <h4 style={{ marginTop: "20px" }}>Avisos Ativos:</h4>
        <ul>
          {avisos.map(a => (
            <li key={a.id} style={{ marginBottom: "10px" }}>
              [{a.dataExpiracao}] {a.texto} 
              <button onClick={() => deletarAviso(a.id)} style={{ color: "red", marginLeft: "10px" }}>Apagar</button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ border: "2px solid purple", padding: "15px" }}>
        <h3>Propósito / Intercessão Mensal</h3>
        <label style={{ display: "block", marginBottom: "10px" }}>
          <input type="checkbox" checked={propAtivo} onChange={e => setPropAtivo(e.target.checked)} />
          Mostrar Propósito no App?
        </label>
        <input type="text" placeholder="Tema (ex: Mês das Vocações)" value={propTema} onChange={e => setPropTema(e.target.value)} style={{ width: "100%", marginBottom: "10px", padding: "5px" }} />
        <textarea placeholder="Texto do propósito..." value={propTexto} onChange={e => setPropTexto(e.target.value)} style={{ width: "100%", height: "80px", marginBottom: "10px", padding: "5px" }} />
        <button onClick={handleSalvarProposito} style={{ padding: "8px 15px", background: "purple", color: "white" }}>Atualizar Propósito</button>
      </section>
    </div>
  );
}
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, increment } from "firebase/firestore";
import { Proposito, ConfigComunidade } from "./db-admin"; 

export interface Aviso {
  id: string;
  texto: string;
  dataExpiracao: string;
}

export function subscribeToConfigComunidade(comunidade: string, callback: (config: ConfigComunidade | null) => void) {
  if (!comunidade) return () => {};
  return onSnapshot(doc(db, `comunidades/${comunidade}/configuracoes`, "geral"), (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as ConfigComunidade) : null);
  }, (error) => {
    console.warn("Sem permissão para ler configs da comunidade:", error);
    callback(null);
  });
}


export function subscribeToAvisos(comunidade: string, callback: (avisos: Aviso[]) => void) {
  if (!comunidade) return () => {};
  const hoje = new Date().toLocaleDateString("en-CA");
  const q = query(collection(db, `comunidades/${comunidade}/avisos`), where("dataExpiracao", ">=", hoje), orderBy("dataExpiracao", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const avisos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Aviso));
    callback(avisos);
  }, (error) => {
    console.warn("Sem permissão para ler avisos da comunidade:", error);
    callback([]);
  });
}

export function subscribeToAvisosGerais(callback: (avisos: Aviso[]) => void) {
  const hoje = new Date().toLocaleDateString("en-CA");
  const q = query(collection(db, "avisos_gerais"), where("dataExpiracao", ">=", hoje), orderBy("dataExpiracao", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const avisos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Aviso));
    callback(avisos);
  }, (error) => {
    console.warn("Sem permissão para ler avisos gerais:", error);
    callback([]);
  });
}

export function subscribeToProposito(callback: (proposito: Proposito | null) => void) {
  return onSnapshot(doc(db, "config_geral", "proposito_mensal"), (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as Proposito) : null);
  }, (error) => {
    console.warn("Aviso (proposito):", error.message);
  });
}


export function subscribeToContador(dataIso: string, tipo: 'leitura' | 'terco' | 'oficio', callback: (total: number) => void) {
  return onSnapshot(doc(db, "estatisticas", `${tipo}_${dataIso}`), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data().contador || 0 : 0);
  }, (error) => {
    console.warn("Aviso (contador):", error.message);
  });
}


export async function atualizarContador(dataIso: string, tipo: 'leitura' | 'terco' | 'oficio', somar: boolean) {
  const docRef = doc(db, "estatisticas", `${tipo}_${dataIso}`);
  await setDoc(docRef, { contador: increment(somar ? 1 : -1), ultimaAtualizacao: new Date() }, { merge: true });
}

export async function salvarTokenNotificacao(token: string, nomeUsuario: string, comunidade: string | null = null, isAgape: boolean | null = null) {
  try {
    
    const docRef = doc(db, "tokens_notificacao", token);
    await setDoc(docRef, {
      token,
      nomeUsuario: nomeUsuario || "Jovem Anônimo",
      comunidade,
      isAgape: isAgape === true,
      ultimoAcesso: new Date().toISOString(), 
      ativo: true
    }, { merge: true });
    
    console.log("Token salvo no cofre com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar token de notificação:", error);
  }
}
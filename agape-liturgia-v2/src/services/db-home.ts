import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, increment } from "firebase/firestore";
import { Proposito } from "./db-admin"; 

export interface Aviso {
  id: string;
  texto: string;
  dataExpiracao: string;
}


export function subscribeToAvisos(callback: (avisos: Aviso[]) => void) {
  const hoje = new Date().toLocaleDateString("en-CA");
  const q = query(collection(db, "avisos"), where("dataExpiracao", ">=", hoje), orderBy("dataExpiracao", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const avisos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Aviso));
    callback(avisos);
  });
}


export function subscribeToProposito(callback: (proposito: Proposito | null) => void) {
  return onSnapshot(doc(db, "config_geral", "proposito_mensal"), (docSnap) => {
    callback(docSnap.exists() ? (docSnap.data() as Proposito) : null);
  });
}


export function subscribeToContador(dataIso: string, tipo: 'leitura' | 'terco', callback: (total: number) => void) {
  return onSnapshot(doc(db, "estatisticas", `${tipo}_${dataIso}`), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data().contador || 0 : 0);
  });
}


export async function atualizarContador(dataIso: string, tipo: 'leitura' | 'terco', somar: boolean) {
  const docRef = doc(db, "estatisticas", `${tipo}_${dataIso}`);
  await setDoc(docRef, { contador: increment(somar ? 1 : -1), ultimaAtualizacao: new Date() }, { merge: true });
}

export async function salvarTokenNotificacao(token: string, nomeUsuario: string) {
  try {
    
    const docRef = doc(db, "tokens_notificacao", token);
    await setDoc(docRef, {
      token,
      nomeUsuario: nomeUsuario || "Jovem Anônimo",
      ultimoAcesso: new Date().toISOString(), 
      ativo: true
    }, { merge: true });
    
    console.log("Token salvo no cofre com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar token de notificação:", error);
  }
}
import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

// TIPAGEM PARA ELIMINAR O USO DE "any"
export interface Proposito {
  ativo: boolean | string;
  tema: string;
  texto: string;
  data_atualizacao?: string;
}

// --- AVISOS ---
export async function adicionarAviso(texto: string, dataExpiracao: string) {
  await addDoc(collection(db, "avisos"), { texto, dataExpiracao, dataCriacao: new Date() });
}

export async function deletarAviso(id: string) {
  await deleteDoc(doc(db, "avisos", id));
}

// --- PROPÓSITO / INTERCESSÃO ---
export async function getProposito(): Promise<Proposito | null> {
  const snap = await getDoc(doc(db, "config_geral", "proposito_mensal"));
  if (snap.exists()) {
    return snap.data() as Proposito;
  }
  return null;
}

export async function updateProposito(dados: { ativo: boolean; tema: string; texto: string }) {
  await setDoc(doc(db, "config_geral", "proposito_mensal"), { 
    ...dados, 
    data_atualizacao: new Date().toISOString() 
  }, { merge: true });
}
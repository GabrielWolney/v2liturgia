import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, setDoc, increment } from "firebase/firestore";

export interface Aviso {
  id: string;
  texto: string;
  dataExpiracao: string;
}

// 1. Ouvir Avisos Ativos
export function subscribeToAvisos(callback: (avisos: Aviso[]) => void) {
  const hoje = new Date().toLocaleDateString("en-CA");
  const q = query(collection(db, "avisos"), where("dataExpiracao", ">=", hoje), orderBy("dataExpiracao", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const avisos = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Aviso));
    callback(avisos);
  });
}

// 2. Ouvir Contador de Comunidade (Liturgia ou Terço)
export function subscribeToContador(dataIso: string, tipo: 'leitura' | 'terco', callback: (total: number) => void) {
  return onSnapshot(doc(db, "estatisticas", `${tipo}_${dataIso}`), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data().contador || 0 : 0);
  });
}

// 3. Atualizar Contador de Comunidade
export async function atualizarContador(dataIso: string, tipo: 'leitura' | 'terco', somar: boolean) {
  const docRef = doc(db, "estatisticas", `${tipo}_${dataIso}`);
  await setDoc(docRef, { contador: increment(somar ? 1 : -1), ultimaAtualizacao: new Date() }, { merge: true });
}
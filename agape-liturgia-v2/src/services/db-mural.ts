import { db, auth } from "@/lib/firebase";
import { 
  collection, addDoc, query, orderBy, limit, 
  serverTimestamp, updateDoc, doc, increment, 
  onSnapshot, where, deleteDoc 
} from "firebase/firestore";

export interface PedidoOracao {
  id: string;
  nome: string;
  texto: string;
  contagemOracoes: number;
  data: Date | null;
  uid?: string;
}

const COLLECTION_NAME = "mural_oracoes";


export function subscribeToPedidos(tipo: '24h' | 'todas', limite: number = 15, callback: (pedidos: PedidoOracao[]) => void) {
  let q;

  if (tipo === '24h') {
    const ontem = new Date();
    ontem.setHours(ontem.getHours() - 24);
    q = query(
      collection(db, COLLECTION_NAME), 
      where("data", ">=", ontem), 
      orderBy("data", "desc"),
      limit(limite)
    );
  } else {
    q = query(collection(db, COLLECTION_NAME), orderBy("data", "desc"), limit(limite));
  }

  
  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome || "Anônimo",
        texto: data.texto || "",
        
        contagemOracoes: Math.max(data.rezaram || 0, data.contagemOracoes || 0),
        data: data.data?.toDate ? data.data.toDate() : null,
      };
    });
    callback(pedidos);
  }, (error) => {
    console.warn("Aviso (Mural):", error.message);
    callback([]);
  });
}


export async function adicionarPedido(nome: string, texto: string): Promise<string | null> {
  try {
    const user = auth.currentUser;
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      nome: nome || "Anônimo",
      texto,
      data: serverTimestamp(),
      rezaram: 0,
      contagemOracoes: 0,
      uid: user ? user.uid : null
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar pedido:", error);
    return null;
  }
}


export async function registrarOracaoFeita(id: string, valor: number = 1): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(docRef, {
      rezaram: increment(valor),
      contagemOracoes: increment(valor)
    });
  } catch (error) {
    console.error("Erro ao registrar oração:", error);
  }
}


export async function deletarPedido(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
    }
}
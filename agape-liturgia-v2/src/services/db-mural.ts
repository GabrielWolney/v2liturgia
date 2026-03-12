import { db } from "@/lib/firebase";
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
}

const COLLECTION_NAME = "mural_oracoes";

// 1. OUVINTE EM TEMPO REAL (REAL-TIME) COM FILTROS
export function subscribeToPedidos(tipo: '24h' | 'todas', callback: (pedidos: PedidoOracao[]) => void) {
  let q;

  if (tipo === '24h') {
    const ontem = new Date();
    ontem.setHours(ontem.getHours() - 24);
    q = query(
      collection(db, COLLECTION_NAME), 
      where("data", ">=", ontem), 
      orderBy("data", "desc")
    );
  } else {
    // Traz os últimos 100 para não sobrecarregar o telemóvel
    q = query(collection(db, COLLECTION_NAME), orderBy("data", "desc"), limit(100));
  }

  // onSnapshot escuta o banco de dados 24h por dia. Qualquer alteração aciona o callback.
  return onSnapshot(q, (snapshot) => {
    const pedidos = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nome: data.nome || "Anônimo",
        texto: data.texto || "",
        // Retrocompatibilidade com a V1 que usava 'rezaram' e 'contagemOracoes'
        contagemOracoes: Math.max(data.rezaram || 0, data.contagemOracoes || 0),
        data: data.data?.toDate ? data.data.toDate() : null,
      };
    });
    callback(pedidos);
  }, (error) => {
    console.error("Erro ao ouvir o Mural:", error);
    callback([]);
  });
}

// 2. ADICIONAR PEDIDO
export async function adicionarPedido(nome: string, texto: string): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      nome: nome || "Anônimo",
      texto,
      data: serverTimestamp(),
      rezaram: 0,
      contagemOracoes: 0
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar pedido:", error);
    return null;
  }
}

// 3. REGISTRAR ORAÇÃO (Soma ou Subtrai)
export async function registrarOracaoFeita(id: string, valor: number = 1): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Atualizamos os dois campos para não quebrar a base antiga da V1
    await updateDoc(docRef, {
      rezaram: increment(valor),
      contagemOracoes: increment(valor)
    });
  } catch (error) {
    console.error("Erro ao registrar oração:", error);
  }
}

// 4. DELETAR MEU PRÓPRIO PEDIDO
export async function deletarPedido(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Erro ao deletar pedido:", error);
    }
}
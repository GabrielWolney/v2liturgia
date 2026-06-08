import { db } from "@/lib/firebase";
import { collection, addDoc, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

export interface Proposito {
  ativo: boolean;
  tema: string;
  texto: string;
  data_atualizacao?: string;
}

export interface ConfigComunidade {
  propositoLocal?: string;
  dataVivencia?: string;
  localVivencia?: string;
}

export async function getConfigComunidade(comunidade: string): Promise<ConfigComunidade | null> {
  const snap = await getDoc(doc(db, `comunidades/${comunidade}/configuracoes`, "geral"));
  if (snap.exists()) {
    return snap.data() as ConfigComunidade;
  }
  return null;
}

export async function updateConfigComunidade(comunidade: string, config: ConfigComunidade) {
  await setDoc(doc(db, `comunidades/${comunidade}/configuracoes`, "geral"), {
    ...config,
    data_atualizacao: new Date().toISOString()
  }, { merge: true });
}


export async function adicionarAviso(comunidade: string, texto: string, dataExpiracao: string) {
  if (!comunidade) throw new Error("Comunidade não definida");
  await addDoc(collection(db, `comunidades/${comunidade}/avisos`), { texto, dataExpiracao, dataCriacao: new Date() });

  try {
    await fetch('/api/notificacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: "📢 Aviso da Comunidade",
        mensagem: texto,
        paginaDestino: "/comunidade",
        tipo: "aviso",
        comunidadeTarget: comunidade,
        targetAgapeOnly: true
      })
    });
  } catch (err) {
    console.error("Erro ao enviar notificação de aviso", err);
  }
}

export async function deletarAviso(comunidade: string, id: string) {
  if (!comunidade) return;
  await deleteDoc(doc(db, `comunidades/${comunidade}/avisos`, id));
}

export async function adicionarAvisoGeral(texto: string, dataExpiracao: string) {
  await addDoc(collection(db, "avisos_gerais"), { texto, dataExpiracao, dataCriacao: new Date() });

  try {
    await fetch('/api/notificacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: "📢 Aviso Geral",
        mensagem: texto,
        paginaDestino: "/",
        tipo: "aviso",
        targetAgapeOnly: true
      })
    });
  } catch (err) {
    console.error("Erro ao enviar notificação de aviso geral", err);
  }
}

export async function deletarAvisoGeral(id: string) {
  await deleteDoc(doc(db, "avisos_gerais", id));
}

export async function getProposito(): Promise<Proposito | null> {
  const snap = await getDoc(doc(db, "config_geral", "proposito_mensal"));
  if (snap.exists()) {
    return snap.data() as Proposito;
  }
  return null;
}

export async function updateProposito(dados: Partial<Proposito>) {
  await setDoc(doc(db, "config_geral", "proposito_mensal"), { 
    ...dados, 
    data_atualizacao: new Date().toISOString() 
  }, { merge: true });
}

export async function promoverUsuario(
  email: string, 
  novaPermissao: { isMasterAdmin?: boolean; isCoordenadorIntercessao?: boolean; isCoordenadorLiturgia?: boolean; coordenadorComunidade?: string | null }
): Promise<boolean> {
  const { getDocs, query, where, updateDoc, collection } = await import("firebase/firestore");
  
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return false; 

  const userDoc = snapshot.docs[0];
  const dadosAtuais = userDoc.data();
  const permissoesAtuais = dadosAtuais.permissoes || { isMasterAdmin: false, isCoordenadorIntercessao: false, isCoordenadorLiturgia: false, coordenadorComunidade: null };

  // Verifica se estamos a tentar retirar privilégios de Master Admin
  if (permissoesAtuais.isMasterAdmin && novaPermissao.isMasterAdmin === false) {
    const adminQuery = query(collection(db, "users"), where("permissoes.isMasterAdmin", "==", true));
    const adminSnap = await getDocs(adminQuery);
    if (adminSnap.size <= 1) {
      throw new Error("Não é possível remover o último Master Admin do sistema.");
    }
  }

  const permissoesAtualizadas = { ...permissoesAtuais, ...novaPermissao };

  // Se estou definindo alguém como coordenador de comunidade, automaticamente vinculo a comunidade a ele também.
  const updatePayload: Record<string, unknown> = { permissoes: permissoesAtualizadas };
  if (novaPermissao.coordenadorComunidade) {
    updatePayload.comunidade = novaPermissao.coordenadorComunidade;
    updatePayload.statusComunidade = "aprovado";
  }

  await updateDoc(userDoc.ref, updatePayload);
  return true;
}

export interface JovemPendente {
  id: string;
  nomeUsuario?: string;
  email?: string;
  comunidade?: string;
  statusComunidade?: string;
  [key: string]: unknown;
}

export async function getJovensPendentes(comunidade: string): Promise<JovemPendente[]> {
  const { getDocs, query, where } = await import("firebase/firestore");
  const q = query(collection(db, "users"), where("comunidade", "==", comunidade), where("statusComunidade", "==", "pendente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JovemPendente));
}

export async function atualizarStatusJovem(uid: string, status: "aprovado" | "recusado") {
  const { updateDoc } = await import("firebase/firestore");
  const updatePayload: Record<string, unknown> = { statusComunidade: status };
  if (status === "recusado") {
    updatePayload.comunidade = null;
  }
  await updateDoc(doc(db, "users", uid), updatePayload);
}

export interface EstatisticasComunidade {
  totalJovens: number;
  jovensAtivos: number; // Ativos nos últimos 7 dias
  totalTercosRezados: number;
  totalLeiturasFeitas: number;
  totalOficiosRezados: number;
}

export async function getEstatisticasComunidade(comunidade: string): Promise<EstatisticasComunidade> {
  const { getDocs, query, where, collection } = await import("firebase/firestore");
  const q = query(collection(db, "users"), where("comunidade", "==", comunidade), where("statusComunidade", "==", "aprovado"));
  const snapshot = await getDocs(q);
  
  let totalTercos = 0;
  let totalLeituras = 0;
  let totalOficios = 0;
  let ativos = 0;
  
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  const dataLimiteStr = seteDiasAtras.toISOString().split('T')[0];

  // Obtém a data de hoje no formato YYYY-MM-DD para comparar
  const hoje = new Date().toLocaleDateString("en-CA");

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    // Contagem de Terços (Pessoas que rezaram hoje)
    if (data.tercosConcluidos && data.tercosConcluidos[hoje]) {
      totalTercos++;
    }
    
    // Contagem de Leituras (Pessoas que leram hoje)
    if (data.leiturasConcluidas && data.leiturasConcluidas[hoje]) {
      totalLeituras++;
    }

    // Contagem de Ofícios (Pessoas que rezaram o ofício hoje)
    if (data.oficiosConcluidos && data.oficiosConcluidos[hoje]) {
      totalOficios++;
    }
    
    // Contagem de Ativos
    if (data.ultimaAtividade && data.ultimaAtividade >= dataLimiteStr) {
      ativos++;
    }
  });

  return {
    totalJovens: snapshot.size,
    jovensAtivos: ativos,
    totalTercosRezados: totalTercos,
    totalLeiturasFeitas: totalLeituras,
    totalOficiosRezados: totalOficios
  };
}
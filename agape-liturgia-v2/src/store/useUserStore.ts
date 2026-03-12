import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  nomeUsuario: string;
  setNomeUsuario: (nome: string) => void;
  modoVisual: "claro" | "escuro" | "leitura";
  setModoVisual: (modo: "claro" | "escuro" | "leitura") => void;
  tamanhoFonte: "padrao" | "grande";
  setTamanhoFonte: (tamanho: "padrao" | "grande") => void;
  
  // --- FOGUINHO (STREAK) ---
  streak: number;
  ultimaAtividade: string | null;
  registrarAtividade: () => void;
  verificarStreak: () => void;

  // Liturgia Diária
  leiturasConcluidas: Record<string, boolean>;
  marcarLeituraConcluida: (dataIso: string) => void;

  // Santo Terço
  tercosConcluidos: Record<string, boolean>;
  marcarTercoConcluido: (dataIso: string) => void;

  // Mural de Intercessão
  meusPedidosMural: string[];
  addMeuPedido: (id: string) => void;
  removeMeuPedido: (id: string) => void;
  oracoesFeitas: string[];
  toggleOracaoFeita: (id: string) => void;

  // Confissão (Exame de Consciência)
  exameConsciencia: Record<string, boolean>;
  togglePecado: (id: string) => void;
  limparExame: () => void;

  // Diário Espiritual (Anotações)
  minhasNotas: string;
  setNotas: (notas: string) => void;

  // Novenas
  novenasProgresso: Record<string, number[]>;
  toggleDiaNovena: (slug: string, dia: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      nomeUsuario: "Jovem",
      setNomeUsuario: (nome) => set({ nomeUsuario: nome }),
      modoVisual: "claro",
      setModoVisual: (modo) => set({ modoVisual: modo }),
      tamanhoFonte: "padrao",
      setTamanhoFonte: (tamanho) => set({ tamanhoFonte: tamanho }),
      
      // --- LÓGICA DO FOGUINHO ---
      streak: 0,
      ultimaAtividade: null,
      
      registrarAtividade: () => set((state) => {
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        
        // Se já fez algo hoje, não soma de novo. Mantém igual.
        if (state.ultimaAtividade === hojeIso) return {};

        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        // Se a última atividade foi ontem, a ofensiva cresce!
        if (state.ultimaAtividade === ontemIso) {
          return { streak: state.streak + 1, ultimaAtividade: hojeIso };
        } 
        // Se ficou dias sem vir, o foguinho recomeça no 1
        else {
          return { streak: 1, ultimaAtividade: hojeIso };
        }
      }),

      verificarStreak: () => set((state) => {
        if (!state.ultimaAtividade) return {};
        
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        // Se a última atividade não foi nem hoje nem ontem, o foguinho apagou (perdeu a ofensiva)
        if (state.ultimaAtividade !== hojeIso && state.ultimaAtividade !== ontemIso) {
          return { streak: 0 };
        }
        return {};
      }),

      // --- OUTRAS AÇÕES ---
      leiturasConcluidas: {},
      marcarLeituraConcluida: (dataIso) => set((state) => ({
        leiturasConcluidas: { ...state.leiturasConcluidas, [dataIso]: true }
      })),

      tercosConcluidos: {},
      marcarTercoConcluido: (dataIso) => set((state) => ({
        tercosConcluidos: { ...state.tercosConcluidos, [dataIso]: true }
      })),

      meusPedidosMural: [],
      addMeuPedido: (id) => set((state) => ({ meusPedidosMural: [...state.meusPedidosMural, id] })),
      removeMeuPedido: (id) => set((state) => ({ meusPedidosMural: state.meusPedidosMural.filter(pId => pId !== id) })),
      oracoesFeitas: [],
      toggleOracaoFeita: (id) => set((state) => {
        const jaRezou = state.oracoesFeitas.includes(id);
        return {
          oracoesFeitas: jaRezou 
            ? state.oracoesFeitas.filter(oId => oId !== id)
            : [...state.oracoesFeitas, id]
        };
      }),

      exameConsciencia: {},
      togglePecado: (id) => set((state) => {
        const novoExame = { ...state.exameConsciencia };
        if (novoExame[id]) delete novoExame[id];
        else novoExame[id] = true;
        return { exameConsciencia: novoExame };
      }),
      limparExame: () => set({ exameConsciencia: {} }),

      minhasNotas: "",
      setNotas: (notas) => set({ minhasNotas: notas }),

      novenasProgresso: {},
      toggleDiaNovena: (slug, dia) => set((state) => {
        const progresso = state.novenasProgresso[slug] || [];
        const novoProgresso = progresso.includes(dia)
          ? progresso.filter(d => d !== dia)
          : [...progresso, dia];
        return {
          novenasProgresso: { ...state.novenasProgresso, [slug]: novoProgresso }
        };
      }),
    }),
    { name: 'agape-storage' }
  )
);
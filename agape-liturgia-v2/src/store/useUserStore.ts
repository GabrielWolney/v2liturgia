import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  nomeUsuario: string;
  setNomeUsuario: (nome: string) => void;
  modoVisual: "claro" | "escuro" | "leitura";
  setModoVisual: (modo: "claro" | "escuro" | "leitura") => void;
  tamanhoFonte: "padrao" | "grande";
  setTamanhoFonte: (tamanho: "padrao" | "grande") => void;
  
  
  streak: number;
  ultimaAtividade: string | null;
  registrarAtividade: () => void;
  verificarStreak: () => void;

  
  avisosLidos: string[];
  marcarAvisoLido: (id: string) => void;

  
  leiturasConcluidas: Record<string, boolean>;
  marcarLeituraConcluida: (dataIso: string) => void;

  
  tercosConcluidos: Record<string, boolean>;
  marcarTercoConcluido: (dataIso: string) => void;

  
  meusPedidosMural: string[];
  addMeuPedido: (id: string) => void;
  removeMeuPedido: (id: string) => void;
  oracoesFeitas: string[];
  toggleOracaoFeita: (id: string) => void;

  
  exameConsciencia: Record<string, boolean>;
  togglePecado: (id: string) => void;
  limparExame: () => void;

  
  minhasNotas: string;
  setNotas: (notas: string) => void;

  
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
      
      
      streak: 0,
      ultimaAtividade: null,
      registrarAtividade: () => set((state) => {
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        if (state.ultimaAtividade === hojeIso) return {};
        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        if (state.ultimaAtividade === ontemIso) return { streak: state.streak + 1, ultimaAtividade: hojeIso };
        else return { streak: 1, ultimaAtividade: hojeIso };
      }),
      verificarStreak: () => set((state) => {
        if (!state.ultimaAtividade) return {};
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        if (state.ultimaAtividade !== hojeIso && state.ultimaAtividade !== ontemIso) return { streak: 0 };
        return {};
      }),

      
      avisosLidos: [],
      marcarAvisoLido: (id) => set((state) => ({ avisosLidos: [...state.avisosLidos, id] })),

      
      leiturasConcluidas: {},
      marcarLeituraConcluida: (dataIso) => set((state) => ({ leiturasConcluidas: { ...state.leiturasConcluidas, [dataIso]: true } })),

      tercosConcluidos: {},
      marcarTercoConcluido: (dataIso) => set((state) => ({ tercosConcluidos: { ...state.tercosConcluidos, [dataIso]: true } })),

      meusPedidosMural: [],
      addMeuPedido: (id) => set((state) => ({ meusPedidosMural: [...state.meusPedidosMural, id] })),
      removeMeuPedido: (id) => set((state) => ({ meusPedidosMural: state.meusPedidosMural.filter(pId => pId !== id) })),
      oracoesFeitas: [],
      toggleOracaoFeita: (id) => set((state) => {
        const jaRezou = state.oracoesFeitas.includes(id);
        return { oracoesFeitas: jaRezou ? state.oracoesFeitas.filter(oId => oId !== id) : [...state.oracoesFeitas, id] };
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
        const novoProgresso = progresso.includes(dia) ? progresso.filter(d => d !== dia) : [...progresso, dia];
        return { novenasProgresso: { ...state.novenasProgresso, [slug]: novoProgresso } };
      }),
    }),
    { name: 'agape-storage' }
  )
);
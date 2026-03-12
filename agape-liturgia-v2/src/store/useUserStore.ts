import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  nomeUsuario: string;
  setNomeUsuario: (nome: string) => void;
  modoVisual: "claro" | "escuro" | "leitura";
  setModoVisual: (modo: "claro" | "escuro" | "leitura") => void;
  tamanhoFonte: "padrao" | "grande";
  setTamanhoFonte: (tamanho: "padrao" | "grande") => void;
  
  // Liturgia Diária
  leiturasConcluidas: Record<string, boolean>;
  marcarLeituraConcluida: (dataIso: string) => void;

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
    (set) => ({
      nomeUsuario: "Jovem",
      setNomeUsuario: (nome) => set({ nomeUsuario: nome }),
      
      modoVisual: "claro",
      setModoVisual: (modo) => set({ modoVisual: modo }),
      
      tamanhoFonte: "padrao",
      setTamanhoFonte: (tamanho) => set({ tamanhoFonte: tamanho }),
      
      leiturasConcluidas: {},
      marcarLeituraConcluida: (dataIso) => set((state) => ({
        leiturasConcluidas: { ...state.leiturasConcluidas, [dataIso]: true }
      })),

      // Ações do Mural
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

      // Ações da Confissão
      exameConsciencia: {},
      togglePecado: (id) => set((state) => {
        const novoExame = { ...state.exameConsciencia };
        if (novoExame[id]) {
          delete novoExame[id];
        } else {
          novoExame[id] = true;
        }
        return { exameConsciencia: novoExame };
      }),
      limparExame: () => set({ exameConsciencia: {} }),

      // Ações do Diário
      minhasNotas: "",
      setNotas: (notas) => set({ minhasNotas: notas }),

      // Ações das Novenas
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
    {
      name: 'agape-storage', // Nome do banco de dados no LocalStorage
    }
  )
);
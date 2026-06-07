import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string;
  firebaseUid: string | null;
  unsubscribeSnapshot: (() => void) | null;
  
  nomeUsuario: string;
  setNomeUsuario: (nome: string) => void;
  email: string | null;
  setEmail: (email: string) => void;
  comunidade: string | null;
  setComunidade: (comunidade: string) => void;
  statusComunidade: "pendente" | "aprovado" | "recusado";
  setStatusComunidade: (status: "pendente" | "aprovado" | "recusado") => void;
  isAgape: boolean | null;
  setIsAgape: (isAgape: boolean | null) => void;
  somAtivado: boolean;
  setSomAtivado: (ativo: boolean) => void;
  permissoes: {
    isMasterAdmin: boolean;
    isCoordenadorIntercessao: boolean;
    isCoordenadorLiturgia?: boolean;
    coordenadorComunidade: string | null;
  };
  setPermissoes: (permissoes: Partial<{ isMasterAdmin: boolean; isCoordenadorIntercessao: boolean; isCoordenadorLiturgia?: boolean; coordenadorComunidade: string | null }>) => void;
  modoVisual: "claro" | "escuro" | "leitura";
  setModoVisual: (modo: "claro" | "escuro" | "leitura") => void;
  tamanhoFonte: "padrao" | "grande";
  setTamanhoFonte: (tamanho: "padrao" | "grande") => void;
  formatoVia: "curva" | "rastreio";
  setFormatoVia: (formato: "curva" | "rastreio") => void;
  
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

  oficiosConcluidos: Record<string, boolean>;
  marcarOficioConcluido: (dataIso: string) => void;

  meusPedidosMural: string[];
  addMeuPedido: (id: string) => void;
  removeMeuPedido: (id: string) => void;
  oracoesFeitas: string[];
  toggleOracaoFeita: (id: string) => void;

  modulosInativos: string[];
  toggleModuloStatus: (id: string) => void;
  
  modulosOrdem: string[];
  reordenarModulos: (novaOrdem: string[]) => void;
  
  onboardingCompleto: boolean;
  setOnboardingCompleto: (completo: boolean) => void;

  exameConsciencia: Record<string, boolean>;
  togglePecado: (id: string) => void;
  limparExame: () => void;

  minhasNotas: string;
  setNotas: (notas: string) => void;

  novenasProgresso: Record<string, number[]>;
  toggleDiaNovena: (slug: string, dia: number) => void;

  setupRealtimeSync: (uid: string) => void;
  hasSynced: boolean;
  setHasSynced: (val: boolean) => void;
  clearStore: () => void;
  
  // Retrocompatibilidade
  syncComFirestore: (uid: string) => Promise<void>;
}

const generateUserId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const initialUserState = {
  nomeUsuario: "Jovem",
  email: null,
  comunidade: null,
  statusComunidade: "pendente" as const,
  isAgape: null,
  somAtivado: true,
  permissoes: { 
    isMasterAdmin: false, 
    isCoordenadorIntercessao: false, 
    isCoordenadorLiturgia: false,
    coordenadorComunidade: null 
  },
  modoVisual: "claro" as const,
  tamanhoFonte: "padrao" as const,
  formatoVia: "curva" as const,
  streak: 0,
  ultimaAtividade: null,
  avisosLidos: [],
  leiturasConcluidas: {},
  tercosConcluidos: {},
  oficiosConcluidos: {},
  meusPedidosMural: [],
  oracoesFeitas: [],
  modulosInativos: [],
  modulosOrdem: [],
  onboardingCompleto: false,
  exameConsciencia: {},
  minhasNotas: "",
  novenasProgresso: {},
  hasSynced: false,
  firebaseUid: null,
  unsubscribeSnapshot: null,
};

// Utilitário para salvar diretamente no Firebase de forma otimista
const syncToFirebase = (uid: string | null, data: Record<string, any>) => {
  if (!uid) return;
  import('firebase/firestore').then(({ doc, updateDoc }) => {
    import('@/lib/firebase').then(({ db }) => {
      updateDoc(doc(db, "users", uid), data).catch(console.error);
    });
  });
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userId: generateUserId(),
      ...initialUserState,
      
      setNomeUsuario: (nome) => {
        set({ nomeUsuario: nome });
        syncToFirebase(get().firebaseUid, { nomeUsuario: nome });
      },
      setEmail: (email) => {
        set({ email });
        syncToFirebase(get().firebaseUid, { email });
      },
      setComunidade: (comunidade) => {
        set({ comunidade });
        syncToFirebase(get().firebaseUid, { comunidade });
      },
      setStatusComunidade: (status) => {
        set({ statusComunidade: status });
        syncToFirebase(get().firebaseUid, { statusComunidade: status });
      },
      setIsAgape: (isAgape) => {
        set({ isAgape });
        syncToFirebase(get().firebaseUid, { isAgape });
      },
      setSomAtivado: (ativo) => {
        set({ somAtivado: ativo });
        syncToFirebase(get().firebaseUid, { somAtivado: ativo });
      },
      setPermissoes: (novasPermissoes) => {
        set((state) => {
          const novas = { permissoes: { ...state.permissoes, ...novasPermissoes } };
          syncToFirebase(get().firebaseUid, novas);
          return novas;
        });
      },
      setModoVisual: (modo) => {
        set({ modoVisual: modo });
        syncToFirebase(get().firebaseUid, { modoVisual: modo });
      },
      setTamanhoFonte: (tamanho) => {
        set({ tamanhoFonte: tamanho });
        syncToFirebase(get().firebaseUid, { tamanhoFonte: tamanho });
      },
      setFormatoVia: (formato) => {
        set({ formatoVia: formato });
        syncToFirebase(get().firebaseUid, { formatoVia: formato });
      },
      registrarAtividade: () => set((state) => {
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        if (state.ultimaAtividade === hojeIso) return {};
        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        const newStreak = state.ultimaAtividade === ontemIso ? state.streak + 1 : 1;
        const updates = { streak: newStreak, ultimaAtividade: hojeIso };
        syncToFirebase(state.firebaseUid, updates);
        return updates;
      }),
      verificarStreak: () => set((state) => {
        if (!state.ultimaAtividade) return {};
        const hojeObj = new Date();
        const hojeIso = hojeObj.toLocaleDateString("en-CA");
        const ontemObj = new Date();
        ontemObj.setDate(ontemObj.getDate() - 1);
        const ontemIso = ontemObj.toLocaleDateString("en-CA");

        if (state.ultimaAtividade !== hojeIso && state.ultimaAtividade !== ontemIso) {
          syncToFirebase(state.firebaseUid, { streak: 0 });
          return { streak: 0 };
        }
        return {};
      }),

      marcarAvisoLido: (id) => set((state) => {
        const novos = [...state.avisosLidos, id];
        syncToFirebase(state.firebaseUid, { avisosLidos: novos });
        return { avisosLidos: novos };
      }),

      marcarLeituraConcluida: (dataIso) => set((state) => {
        const nova = { ...state.leiturasConcluidas, [dataIso]: true };
        import('firebase/firestore').then(({ doc, updateDoc }) => {
          if (state.firebaseUid) {
            import('@/lib/firebase').then(({ db }) => {
              updateDoc(doc(db, "users", state.firebaseUid as string), {
                [`leiturasConcluidas.${dataIso}`]: true
              }).catch(console.error);
            });
          }
        });
        return { leiturasConcluidas: nova };
      }),

      marcarTercoConcluido: (dataIso) => set((state) => {
        const nova = { ...state.tercosConcluidos, [dataIso]: true };
        import('firebase/firestore').then(({ doc, updateDoc }) => {
          if (state.firebaseUid) {
            import('@/lib/firebase').then(({ db }) => {
              updateDoc(doc(db, "users", state.firebaseUid as string), {
                [`tercosConcluidos.${dataIso}`]: true
              }).catch(console.error);
            });
          }
        });
        return { tercosConcluidos: nova };
      }),

      marcarOficioConcluido: (dataIso) => set((state) => {
        const nova = { ...state.oficiosConcluidos, [dataIso]: true };
        import('firebase/firestore').then(({ doc, updateDoc }) => {
          if (state.firebaseUid) {
            import('@/lib/firebase').then(({ db }) => {
              updateDoc(doc(db, "users", state.firebaseUid as string), {
                [`oficiosConcluidos.${dataIso}`]: true
              }).catch(console.error);
            });
          }
        });
        return { oficiosConcluidos: nova };
      }),

      addMeuPedido: (id) => set((state) => {
        const novos = [...state.meusPedidosMural, id];
        syncToFirebase(state.firebaseUid, { meusPedidosMural: novos });
        return { meusPedidosMural: novos };
      }),
      removeMeuPedido: (id) => set((state) => {
        const novos = state.meusPedidosMural.filter(pId => pId !== id);
        syncToFirebase(state.firebaseUid, { meusPedidosMural: novos });
        return { meusPedidosMural: novos };
      }),
      toggleOracaoFeita: (id) => set((state) => {
        const jaRezou = state.oracoesFeitas.includes(id);
        const novos = jaRezou ? state.oracoesFeitas.filter(oId => oId !== id) : [...state.oracoesFeitas, id];
        syncToFirebase(state.firebaseUid, { oracoesFeitas: novos });
        return { oracoesFeitas: novos };
      }),

      toggleModuloStatus: (id) => set((state) => {
        const inativos = state.modulosInativos || [];
        const novos = inativos.includes(id) ? inativos.filter(mId => mId !== id) : [...inativos, id];
        syncToFirebase(state.firebaseUid, { modulosInativos: novos });
        return { modulosInativos: novos };
      }),

      reordenarModulos: (novaOrdem) => {
        set({ modulosOrdem: novaOrdem });
        syncToFirebase(get().firebaseUid, { modulosOrdem: novaOrdem });
      },

      setOnboardingCompleto: (completo) => {
        set({ onboardingCompleto: completo });
        syncToFirebase(get().firebaseUid, { onboardingCompleto: completo });
      },

      togglePecado: (id) => set((state) => {
        const novoExame = { ...state.exameConsciencia };
        if (novoExame[id]) delete novoExame[id];
        else novoExame[id] = true;
        syncToFirebase(state.firebaseUid, { exameConsciencia: novoExame });
        return { exameConsciencia: novoExame };
      }),
      limparExame: () => {
        set({ exameConsciencia: {} });
        syncToFirebase(get().firebaseUid, { exameConsciencia: {} });
      },

      setNotas: (notas) => {
        set({ minhasNotas: notas });
        syncToFirebase(get().firebaseUid, { minhasNotas: notas });
      },

      toggleDiaNovena: (slug, dia) => set((state) => {
        const progresso = state.novenasProgresso[slug] || [];
        const novoProgresso = progresso.includes(dia) ? progresso.filter(d => d !== dia) : [...progresso, dia];
        const completo = { ...state.novenasProgresso, [slug]: novoProgresso };
        syncToFirebase(state.firebaseUid, { novenasProgresso: completo });
        return { novenasProgresso: completo };
      }),

      setupRealtimeSync: (uid: string) => {
        const state = get();
        if (state.unsubscribeSnapshot) {
          state.unsubscribeSnapshot();
        }

        set({ firebaseUid: uid });

        import('firebase/firestore').then(({ doc, onSnapshot, setDoc }) => {
          import('@/lib/firebase').then(({ db }) => {
            const docRef = doc(db, "users", uid);
            
            const unsub = onSnapshot(docRef, async (docSnap) => {
              if (docSnap.exists()) {
                const serverData = docSnap.data();
                set({ ...serverData, hasSynced: true });
              } else {
                // Usuário recém-criado, injeta a estrutura padrão
                const defaultData = {
                  nomeUsuario: get().nomeUsuario || "Jovem",
                  email: get().email,
                  isAgape: get().isAgape ?? null,
                  comunidade: get().comunidade || "",
                  statusComunidade: get().statusComunidade || "pendente",
                  permissoes: { isMasterAdmin: false, isCoordenadorIntercessao: false, isCoordenadorLiturgia: false, coordenadorComunidade: null },
                  streak: get().streak || 0,
                  ultimaAtividade: get().ultimaAtividade || null,
                  avisosLidos: get().avisosLidos || [],
                  leiturasConcluidas: get().leiturasConcluidas || {},
                  tercosConcluidos: get().tercosConcluidos || {},
                  oficiosConcluidos: get().oficiosConcluidos || {},
                  meusPedidosMural: get().meusPedidosMural || [],
                  oracoesFeitas: get().oracoesFeitas || [],
                  exameConsciencia: get().exameConsciencia || {},
                  minhasNotas: get().minhasNotas || "",
                  novenasProgresso: get().novenasProgresso || {},
                  somAtivado: get().somAtivado ?? true,
                  modoVisual: get().modoVisual || "claro",
                  tamanhoFonte: get().tamanhoFonte || "padrao",
                  formatoVia: get().formatoVia || "curva",
                  modulosInativos: get().modulosInativos || [],
                  modulosOrdem: get().modulosOrdem || [],
                  onboardingCompleto: get().onboardingCompleto || false,
                  createdAt: new Date().toISOString()
                };
                await setDoc(docRef, defaultData);
              }
            }, (error) => {
               console.error("Erro no onSnapshot do usuário:", error);
            });

            set({ unsubscribeSnapshot: unsub });
          });
        });
      },
      
      syncComFirestore: async (uid: string) => {
        // Fallback pra evitar quebras no código legado. Agora chama o realtime sync.
        get().setupRealtimeSync(uid);
      },

      setHasSynced: (val) => set({ hasSynced: val }),
      
      clearStore: () => {
        const unsub = get().unsubscribeSnapshot;
        if (unsub) unsub();
        
        // Limpa o cache persistido (exceto as preferências partialize se aplicável, mas o clearStorage limpa tudo)
        useUserStore.persist.clearStorage();
        
        // Reseta tudo para evitar vazamento de dados de domínio entre contas
        set({ ...initialUserState, userId: generateUserId() });
      }
    }),
    { 
      name: 'agape-storage',
      // Salva apenas as preferências de UI localmente (o Firebase cuida do resto)
      partialize: (state) => ({ 
        modoVisual: state.modoVisual, 
        tamanhoFonte: state.tamanhoFonte, 
        somAtivado: state.somAtivado, 
        formatoVia: state.formatoVia 
      }),
    }
  )
);
import { useEffect, useState } from "react";
import { 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/store/useUserStore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const store = useUserStore.getState();
      
      if (currentUser) {
        // Trava anti-mistura de dados:
        // Se o usuário atual for diferente do logado na memória E havia um usuário logado antes, limpamos tudo.
        if (store.firebaseUid && store.firebaseUid !== currentUser.uid) {
          store.clearStore();
        }
        
        setUser(currentUser);
        
        if (currentUser.displayName) {
          store.setNomeUsuario(currentUser.displayName.split(" ")[0]); 
        }
        if (currentUser.email) {
          store.setEmail(currentUser.email);
        }
        
        // Liga o motor de sincronização em tempo real nativo do Firebase
        store.setupRealtimeSync(currentUser.uid);
      } else {
        // Quando for deslogado silenciosamente (ex: limpar cookies), limpa os dados locais
        if (store.firebaseUid) {
          store.clearStore();
        }
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Sucesso: onAuthStateChanged vai cuidar de remover o loading após sincronizar o banco
    } catch (error) {
      console.error("Erro no login com Google", error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, pass);
      // Sucesso: onAuthStateChanged vai cuidar de remover o loading
    } catch (error: any) {
      console.error("Erro no login com email", error);
      let msg = "Erro ao fazer login. Verifique seus dados.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        msg = "E-mail ou senha incorretos.";
      } else if (error.code === "auth/too-many-requests") {
        msg = "Muitas tentativas falhas. Tente novamente mais tarde.";
      }
      setLoading(false);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    try {
      setLoading(true);
      const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import("firebase/auth");
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(credential.user, { displayName: name });
      
      // Limpa dados residuais locais (como se o usuário estivesse reaproveitando o navegador)
      useUserStore.setState({ isAgape: null, comunidade: "", statusComunidade: "pendente" });

      // Envia o e-mail mas não bloqueia o login
      sendEmailVerification(credential.user).catch(console.error);
      
      // Sucesso: onAuthStateChanged remove o loading
    } catch (error: any) {
      console.error("Erro no cadastro com email", error);
      let msg = "Erro ao criar conta.";
      if (error.code === "auth/email-already-in-use") {
        msg = "Já existe uma conta com este e-mail.";
      } else if (error.code === "auth/weak-password") {
        msg = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        msg = "E-mail inválido.";
      }
      setLoading(false);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      const { useUserStore } = await import("@/store/useUserStore");
      useUserStore.getState().clearStore();
      
      // Força a UI a desmontar as telas protegidas IMEDIATAMENTE.
      // Como os listeners onSnapshot estão atrelados ao ciclo de vida (useEffect) dessas telas,
      // desmontá-las vai invocar as funções de unsubscribe() do Firebase ANTES do token ser destruído.
      setUser(null);

      // Dá tempo para o React terminar de desmontar os componentes e fechar as conexões ativas.
      // Isso previne o console error "Missing or insufficient permissions" do Firebase.
      await new Promise(resolve => setTimeout(resolve, 150));
      
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Erro ao resetar senha", error);
      let msg = "Não foi possível enviar o email de recuperação.";
      if (error.code === "auth/invalid-email") {
        msg = "E-mail inválido.";
      } else if (error.code === "auth/user-not-found") {
        msg = "Não há nenhuma conta com este e-mail.";
      }
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateUserName = async (newName: string) => {
    try {
      setLoading(true);
      const { updateProfile } = await import("firebase/auth");
      
      if (user) {
        await updateProfile(user, { displayName: newName });
      }
      
      useUserStore.getState().setNomeUsuario(newName);
    } catch (error) {
      console.error("Erro ao atualizar nome", error);
      throw new Error("Não foi possível atualizar o nome. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { deleteUser } = await import("firebase/auth");
      const { doc, deleteDoc, getDoc, getDocs, query, where, collection } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const uData = userSnap.data();
          if (uData.permissoes?.isMasterAdmin) {
            const adminQ = query(collection(db, "users"), where("permissoes.isMasterAdmin", "==", true));
            const adminSnap = await getDocs(adminQ);
            if (adminSnap.size <= 1) {
              throw new Error("Você é o último Master Admin. Passe o cargo a outra pessoa antes de apagar a conta.");
            }
          }
        }
        await deleteDoc(userRef);
      } catch (e: any) {
        if (e.message.includes("último Master Admin")) {
          throw e; // Repassa o erro específico
        }
        console.warn("Não foi possível apagar dados do Firestore", e);
      }
      await deleteUser(user);
    } catch (error: any) {
      console.error("Erro ao deletar conta", error);
      if (error.code === "auth/requires-recent-login") {
        throw new Error("Por segurança, você precisa ter feito login recentemente para apagar a conta. Saia, entre novamente e tente apagar.");
      }
      throw new Error("Erro ao apagar a conta. Tente novamente.");
    } finally {
      // Garantir logout e limpeza independente de sucesso/erro
      const { useUserStore } = await import("@/store/useUserStore");
      useUserStore.getState().clearStore();
      try { await signOut(auth); } catch (e) { console.warn("Logout falhou ao deletar conta", e); }
      if (typeof window !== "undefined") { window.location.reload(); }
      setLoading(false);
    }
  };

  return { user, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout, deleteAccount, updateUserName, resetPassword };
}

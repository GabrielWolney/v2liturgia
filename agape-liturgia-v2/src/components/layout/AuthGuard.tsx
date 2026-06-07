"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";
import { useHaptics } from "@/hooks/useHaptics";
import { useSound } from "@/hooks/useSound";
import Image from "next/image";
import { OnboardingCarousel } from "@/components/onboarding/OnboardingCarousel";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

const COMUNIDADES_DISPONIVEIS = [
  "Emaús",
  "Cafarnaum",
  "Jerusalém"
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const { comunidade, setComunidade, setStatusComunidade, isAgape, setIsAgape, onboardingCompleto, setOnboardingCompleto, hasSynced } = useUserStore();
  const { triggerHaptic } = useHaptics();
  const { playPop, playSuccess } = useSound();

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [emailLocal, setEmailLocal] = useState("");
  const [passwordLocal, setPasswordLocal] = useState("");
  const [nameLocal, setNameLocal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [carouselStep, setCarouselStep] = useState(0);

  const [comunidadeTemp, setComunidadeTemp] = useState("");

  const handleSwitchMode = (mode: "login" | "signup") => {
    playPop();
    setAuthMode(mode);
    setErrorMsg("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    triggerHaptic("light");
    playPop();

    try {
      if (authMode === "login") {
        await loginWithEmail(emailLocal, passwordLocal);
      } else {
        await signUpWithEmail(nameLocal, emailLocal, passwordLocal);
      }
      triggerHaptic("success");
      playSuccess();
      router.replace("/");
    } catch (err: any) {
      triggerHaptic("error");
      setErrorMsg(err.message || "Erro na autenticação. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleNative = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setErrorMsg("");
        setIsSubmitting(true);
        triggerHaptic("light");
        playPop();
        
        // Passa o token do Google nativo para o Firebase! Mágica absoluta.
        const credential = GoogleAuthProvider.credential(null, tokenResponse.access_token);
        await signInWithCredential(auth, credential);
        
        triggerHaptic("success");
        playSuccess();
        router.replace("/");
      } catch (err: any) {
        triggerHaptic("error");
        setErrorMsg(err.message || "Erro ao conectar conta do Google no servidor.");
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: () => {
      triggerHaptic("error");
      setErrorMsg("O pop-up do Google foi fechado ou ocorreu um erro.");
    }
  });

  const handleGoogle = () => {
    // Isso aciona o hook do Google nativamente:
    handleGoogleNative();
  };

  const handleResetPassword = async () => {
    if (!emailLocal.trim()) {
      setErrorMsg("Insira o seu e-mail acima para recuperar a senha.");
      triggerHaptic("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");
      await resetPassword(emailLocal.trim());
      setErrorMsg("E-mail de recuperação enviado! Verifique a sua caixa de correio.");
      triggerHaptic("success");
      playSuccess();
    } catch (err: any) {
      triggerHaptic("error");
      setErrorMsg(err.message || "Erro ao tentar enviar o email de recuperação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSalvarComunidade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comunidadeTemp && user) {
      triggerHaptic("success");
      playSuccess();
      setComunidade(comunidadeTemp);
      setStatusComunidade("pendente");

      try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await updateDoc(doc(db, "users", user.uid), {
          comunidade: comunidadeTemp,
          statusComunidade: "pendente"
        });
      } catch (error) {
        console.error("Erro ao salvar comunidade no banco", error);
      }
    }
  };

  const handleResponderAgape = async (isParticipante: boolean) => {
    triggerHaptic("medium");
    playPop();
    setIsAgape(isParticipante);
    if (!isParticipante) {
      triggerHaptic("success");
      playSuccess();
    }

    // ATUALIZA NA NUVEM IMEDIATAMENTE PARA NÃO PERGUNTAR MAIS
    if (user) {
      try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        await updateDoc(doc(db, "users", user.uid), {
          isAgape: isParticipante
        });
      } catch (error) {
        console.error("Erro ao salvar isAgape no banco", error);
      }
    }
  };

  const handleFinalizarOnboarding = async () => {
    triggerHaptic("success");
    playSuccess();
    setOnboardingCompleto(true);

    if (user) {
      try {
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const state = useUserStore.getState();
        await updateDoc(doc(db, "users", user.uid), {
          onboardingCompleto: true,
          formatoVia: state.formatoVia,
          modulosInativos: state.modulosInativos
        });
      } catch (error) {
        console.error("Erro ao salvar onboarding", error);
      }
    }
  };

  // Mostra o spinner se ainda estiver resolvendo a sessão OU se está logado mas ainda não sincronizou a nuvem
  if (loading || (user && !hasSynced)) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl transition-all duration-500">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 border-[3px] border-primary/10 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
          <div className="absolute w-[120px] h-[120px] border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>

          <div className="relative z-10 animate-float bg-card p-2 rounded-[2.2rem] shadow-2xl border border-border">
            <Image
              src="/icon-192x192.png"
              alt="Logo Ágape"
              width={88}
              height={88}
              className="w-[88px] h-[88px] rounded-[1.8rem]"
              priority
            />
          </div>
        </div>

        <p className="mt-12 font-bold text-muted uppercase tracking-[0.25em] text-[10px] animate-pulse">
          Preparando...
        </p>
      </div>
    );
  }

  // Não logado
  if (!user) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background px-6 overflow-y-auto pb-10">
        <div className="w-full max-w-[400px] flex flex-col items-center pt-10">

          <div className="relative mb-8 animate-float">
            <Image
              src="/icon-192x192.png"
              alt="Logo Ágape"
              width={100}
              height={100}
              className="relative w-[100px] h-[100px] rounded-[2rem] shadow-2xl border border-border/50"
            />
          </div>

          <h1 className="text-3xl font-black tracking-tighter mb-2 text-foreground text-center">
            Ágape <span className="text-[#2F6BFF]">Liturgia</span>
          </h1>

          <div className="w-full mt-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center mb-6">
              <h2 className="flex-1 text-center font-bold text-2xl">{authMode === "login" ? "Entrar" : "Criar Conta"}</h2>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1 ml-1">Nome</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={nameLocal}
                    onChange={(e) => setNameLocal(e.target.value)}
                    className="w-full bg-card border-2 border-border rounded-2xl py-4 px-5 font-bold focus:outline-none focus:border-[#2F6BFF] transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1 ml-1">E-mail</label>
                <input
                  type="email"
                  required
                  autoFocus={authMode === "login"}
                  value={emailLocal}
                  onChange={(e) => setEmailLocal(e.target.value)}
                  className="w-full bg-card border-2 border-border rounded-2xl py-4 px-5 font-bold focus:outline-none focus:border-[#2F6BFF] transition-colors"
                  placeholder="voce@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1 ml-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordLocal}
                    onChange={(e) => setPasswordLocal(e.target.value)}
                    className="w-full bg-card border-2 border-border rounded-2xl py-4 pl-5 pr-12 font-bold focus:outline-none focus:border-[#2F6BFF] transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  >
                    <span className="material-symbols-rounded text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {authMode === "login" && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={isSubmitting}
                      className="text-xs font-bold text-[#2F6BFF] hover:underline opacity-80 hover:opacity-100 disabled:opacity-50"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                )}
              </div>

              {errorMsg && (
                <p className={`font-bold text-sm p-3 rounded-xl ${errorMsg.includes('enviado') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {errorMsg}
                </p>
              )}



              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-[#2F6BFF] text-white font-bold text-lg py-5 rounded-[2rem] shadow-[0_8px_0_#1E4BCC] active:translate-y-2 active:shadow-none transition-all hover:brightness-105 disabled:opacity-70 disabled:active:translate-y-0"
              >
                {isSubmitting ? "AGUARDE..." : (authMode === "login" ? "ENTRAR" : "CRIAR CONTA")}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink-0 mx-4 text-muted text-xs font-bold uppercase tracking-widest">OU</span>
                <div className="flex-grow border-t border-border"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full h-14 rounded-full bg-card border border-border text-foreground font-bold text-lg flex items-center justify-center gap-3 shadow-sm hover:bg-card/80 active:scale-95 transition-all"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                Continuar com Google
              </button>

              <div className="pt-4 text-center">
                {authMode === "login" ? (
                  <p className="text-sm font-medium text-muted">
                    Ainda não tem conta? <button type="button" onClick={() => handleSwitchMode("signup")} className="text-[#2F6BFF] font-bold hover:underline">Crie uma</button>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-muted">
                    Já tem conta? <button type="button" onClick={() => handleSwitchMode("login")} className="text-[#2F6BFF] font-bold hover:underline">Entre aqui</button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Logado, Onboarding Passo 1: Carrossel (Se for conta nova / nunca completou)
  if (user && !onboardingCompleto) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background overflow-hidden">
        <div className="w-full h-full max-w-[400px] relative">
          <OnboardingCarousel
            initialStep={0}
            onComplete={handleFinalizarOnboarding}
          />
        </div>
      </div>
    );
  }

  // Logado, Onboarding Passo 2: Perguntar se é do Agape
  if (user && isAgape === null) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background px-6 animate-fade-in">
        <div className="w-full max-w-[400px] flex flex-col p-8 rounded-[2.5rem] border shadow-2xl bg-card border-border text-center">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
            <span className="material-symbols-rounded text-[40px]">group</span>
          </div>
          <h2 className="text-3xl font-black mb-4 text-foreground tracking-tight">Você é do Ágape?</h2>
          <p className="text-sm font-medium mb-4 text-muted max-w-[280px]">
            O aplicativo é aberto a todos, mas membros do movimento <strong>Ágape de Jovens</strong> têm acesso a funções de comunidade de servos.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleResponderAgape(true)}
              className="w-full py-5 bg-[#2F6BFF] text-white font-bold text-lg rounded-[2rem] shadow-[0_6px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all hover:brightness-105"
            >
              SIM, EU FAÇO PARTE
            </button>
            <button
              onClick={() => handleResponderAgape(false)}
              className="w-full py-5 bg-background border-2 border-border text-muted font-bold text-lg rounded-[2rem] active:scale-95 transition-transform hover:bg-muted/10"
            >
              NÃO, SOU CONVIDADO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logado, é do Agape, mas não escolheu a comunidade
  if (user && isAgape === true && !comunidade) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background px-6 animate-in slide-in-from-right-8 duration-500">
        <div className="w-full max-w-[400px] flex flex-col p-8 rounded-[2.5rem] border shadow-2xl bg-card border-border">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <span className="material-symbols-rounded text-[32px]">church</span>
          </div>
          <h2 className="text-2xl font-black mb-2 text-foreground tracking-tight">Sua Comunidade</h2>
          <p className="text-sm font-medium text-muted mb-8 leading-relaxed">
            Selecione a sua comunidade de servos para receber avisos e o propósito da semana.
          </p>
          <form onSubmit={handleSalvarComunidade} className="flex flex-col gap-4">
            <div className="relative group">
              <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10">location_on</span>
              <select
                required
                value={comunidadeTemp}
                onChange={(e) => {
                  setComunidadeTemp(e.target.value);
                  playPop();
                  triggerHaptic("light");
                }}
                className="w-full border-2 rounded-[1.25rem] py-4 pl-12 pr-12 font-bold focus:outline-none focus:border-emerald-500 hover:border-emerald-500/50 transition-all bg-background border-border text-foreground appearance-none shadow-sm cursor-pointer"
              >
                <option value="" disabled>Selecione uma comunidade...</option>
                {COMUNIDADES_DISPONIVEIS.map(com => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-muted/10 rounded-full flex items-center justify-center pointer-events-none group-hover:bg-emerald-500/10 transition-colors">
                <span className="material-symbols-rounded text-muted group-hover:text-emerald-500 transition-colors">expand_more</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 mt-6 bg-emerald-500 text-white font-bold text-lg rounded-[2rem] shadow-[0_6px_0_#059669] active:translate-y-1 active:shadow-none transition-all hover:brightness-105"
            >
              SALVAR E CONTINUAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

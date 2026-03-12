import { useState, useEffect } from "react";

// Tipagem rigorosa para substituir o "any"
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impede o Chrome de mostrar o banner nativo dele
      e.preventDefault();
      // Guarda o evento (fazendo um cast seguro) para usarmos no nosso botão
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Avisa a tela que pode mostrar o botão "Instalar"
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    
    // Mostra o prompt oficial de instalação
    await deferredPrompt.prompt();
    
    // Espera a resposta do jovem
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("Usuário instalou o App Ágape!");
      setIsInstallable(false); // Esconde o botão
    }
    
    // Limpa o prompt
    setDeferredPrompt(null);
  };

  return { isInstallable, installPWA };
}
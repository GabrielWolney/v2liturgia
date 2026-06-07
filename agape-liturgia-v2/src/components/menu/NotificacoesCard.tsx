"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { getMessagingInstance } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { salvarTokenNotificacao } from "@/services/db-home";
import { useAlertStore } from "@/store/useAlertStore";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
const FCM_SW_PATH = "/firebase-messaging-sw.js";

export function NotificacoesCard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [loading, setLoading] = useState(false);

  const { modoVisual, nomeUsuario, comunidade, isAgape } = useUserStore();
  const { showAlert } = useAlertStore();

  // Escuta mensagens em foreground e exibe alerta nativo
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    getMessagingInstance().then((messagingInstance) => {
      // Se o componente desmontou antes da Promise resolver, não registra o listener
      if (cancelled || !messagingInstance) return;
      unsubscribe = onMessage(messagingInstance, (payload) => {
        if (cancelled) return;
        showAlert(
          payload.notification?.title || "Nova notificação",
          payload.notification?.body || "",
          "info"
        );
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [showAlert]);


  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);

      const checkStandalone = () => {
        const nav = window.navigator as unknown as { standalone?: boolean };
        return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
      };
      setIsStandalone(checkStandalone());

      if (!('Notification' in window)) {
        setPermission('unsupported');
      } else {
        setPermission(Notification.permission);
      }
    }, 0);

    return () => clearTimeout(mountTimer);
  }, []);

  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  const registrarOuAtualizarToken = async () => {
    playPop();
    triggerHaptic('light');
    if (!('serviceWorker' in navigator)) return;

    setLoading(true);
    try {
      // ✅ Aguarda a instância real do messaging (sem race condition)
      const messagingInstance = await getMessagingInstance();
      if (!messagingInstance) {
        showAlert("Aviso", "Notificações não são suportadas neste navegador.", "error");
        return;
      }

      // ✅ Remove APENAS o SW do FCM, preservando o Workbox (cache offline)
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.active?.scriptURL.includes(FCM_SW_PATH)) {
          await reg.unregister();
        }
      }

      // Registra o SW do FCM com cache-busting
      const newRegistration = await navigator.serviceWorker.register(
        `${FCM_SW_PATH}?v=${Date.now()}`
      );

      // Aguarda o SW ficar ativo antes de pedir o token
      await navigator.serviceWorker.ready;

      const token = await getToken(messagingInstance, {
        serviceWorkerRegistration: newRegistration,
        vapidKey: VAPID_KEY,
      });

      if (token) {
        await salvarTokenNotificacao(token, nomeUsuario, comunidade || null, isAgape);
        setPermission('granted');
        showAlert("Concluído", "Notificações ativadas com sucesso! 🕊️", "success");
      } else {
        showAlert("Aviso", "Não foi possível obter o token. Verifique a permissão.", "error");
      }
    } catch (erro) {
      console.error("Erro ao registrar token FCM:", erro);
      showAlert("Erro", "Houve um erro ao ativar as notificações. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAtivar = async () => {
    playPop();
    triggerHaptic('light');
    // Solicita permissão somente mediante gesto explícito (browser best practice)
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await registrarOuAtualizarToken();
    } else {
      showAlert(
        "Permissão negada",
        "Para ativar os lembretes, permita notificações nas configurações do seu celular.",
        "error"
      );
    }
  };

  if (!isMounted) return null;

  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";

  return (
    <div className={`rounded-[1.5rem] p-5 shadow-soft border transition-colors duration-300 ${cardBg} ${borderColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-[#2F6BFF]/10 text-[#2F6BFF]`}>
          <span className="material-symbols-rounded">notifications_active</span>
        </div>
        <div>
          <h3 className={`font-extrabold ${textMain}`}>Lembretes Diários</h3>
          <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Notificações nativas</p>
        </div>
      </div>

      <div className="mt-4">
        {permission === 'unsupported' ? (
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs flex flex-col gap-2 items-center text-center">
            <span className="material-symbols-rounded text-2xl opacity-50">phonelink_erase</span>
            <span>O seu sistema atual não suporta notificações nativas. Atualize o seu iOS para usar este recurso.</span>
          </div>
        ) : permission === 'granted' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span className="material-symbols-rounded">verified</span>
              Lembretes Ativos
            </div>

            <button
              onClick={registrarOuAtualizarToken}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "SINCRONIZANDO..." : "RECONECTAR COM O SERVIDOR"}
              <span className="material-symbols-rounded text-sm">sync</span>
            </button>
            <p className="text-[10px] text-center text-muted italic">Se as notificações não chegarem, clique em Reconectar.</p>
          </div>
        ) : permission === 'denied' ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-xs flex flex-col gap-2">
            <span className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-rounded text-base">block</span>
              Notificações bloqueadas
            </span>
            <span>Para ativar, vá em Configurações → Site → Notificações e permita este site.</span>
          </div>
        ) : permission === 'default' && isStandalone ? (
          <button
            onClick={handleAtivar}
            disabled={loading}
            className="w-full bg-[#2F6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "ATIVANDO..." : "ATIVAR LEMBRETES"}
            <span className="material-symbols-rounded text-base">notifications</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex flex-col gap-2">
            <span className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-rounded text-base">install_mobile</span>
              Instale o App primeiro
            </span>
            <span>Adicione o Ágape à Tela de Início para poder ativar os lembretes nativos.</span>
          </div>
        )}
      </div>
    </div>
  );
}
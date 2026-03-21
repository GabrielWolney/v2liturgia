"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";
import { salvarTokenNotificacao } from "@/services/db-home";

export function NotificacoesCard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [loading, setLoading] = useState(false);
  
  const { modoVisual, nomeUsuario } = useUserStore();

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

  const registrarOuAtualizarToken = async () => {
    if (!('serviceWorker' in navigator) || !messaging) return;
    
    setLoading(true);
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("Registro antigo removido.");
      }

      // Pequena pausa para o iOS respirar
      await new Promise(resolve => setTimeout(resolve, 800));

      // --- PASSO B: NOVO REGISTRO ---
      const resultado = await Notification.requestPermission();
      setPermission(resultado);
      
      if (resultado === 'granted') {
        // O getToken vai baixar o novo sw.js silencioso que criámos no Passo 1
        const token = await getToken(messaging, {
          vapidKey: "BDRVdc4K5TpdNyBv9S5RAs01wgk0TVJCjf7D17m4LiUfUBii3W3tRHTSSijB5biqcohVbLmqP7OuRDHxSAE_dDg"
        });

        if (token) {
          await salvarTokenNotificacao(token, nomeUsuario);
          alert("Sincronização completa! Fantasmas removidos e dados preservados. 🕊️");
        }
      }
    } catch (erro) {
      console.error("Erro ao sincronizar:", erro);
      alert("Erro na sincronização.");
    } finally {
      setLoading(false);
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
        {permission === 'granted' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <span className="material-symbols-rounded">verified</span>
              Lembretes Ativos
            </div>
            
            {/* NOVO BOTÃO PARA FORÇAR A GRAVAÇÃO NO BANCO */}
            <button 
              onClick={registrarOuAtualizarToken}
              disabled={loading}
              className="w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold text-xs hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "SINCRONIZANDO..." : "RECONECTAR COM O SERVIDOR"}
              <span className="material-symbols-rounded text-sm">sync</span>
            </button>
            <p className="text-[10px] text-center text-muted italic">Se as notificações não chegarem, clique em Reconectar.</p>
          </div>
        ) : permission === 'default' && isStandalone ? (
          <button 
            onClick={registrarOuAtualizarToken}
            className="w-full bg-[#2F6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            ATIVAR LEMBRETES
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs">
            Instale o App e acesse as configurações para ativar os lembretes.
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { messaging } from "@/lib/firebase"; // Importamos o messaging do seu Firebase
import { getToken } from "firebase/messaging"; // Função que gera o Token
import { salvarTokenNotificacao } from "@/services/db-home";

export function NotificacoesCard() {
  const [isMounted, setIsMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  
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

  const solicitarPermissao = async () => {
    if (!('Notification' in window)) return;
    
    try {
      const resultado = await Notification.requestPermission();
      setPermission(resultado);
      
      if (resultado === 'granted') {
        // Se ele aceitou, vamos gerar o Token único do telemóvel dele!
        if (messaging) {
          const token = await getToken(messaging, {
            vapidKey: "BDRVdc4K5TpdNyBv9S5RAs01wgk0TVJCjf7D17m4LiUfUBii3W3tRHTSSijB5biqcohVbLmqP7OuRDHxSAE_dDg"
          });

          if (token) {
            console.log("🔥 SEU TOKEN DE NOTIFICAÇÃO É:", token);
            

            await salvarTokenNotificacao(token, nomeUsuario);
            
            alert("Lembretes ativados! O seu dispositivo está pronto para a Pequena Via. 🕊️");
          } else {
            console.log("Nenhum token gerado de registro. Tente novamente.");
          }
        } else {
          console.error("Firebase Messaging não está inicializado.");
        }
      }
    } catch (erro) {
      console.error("Erro ao pedir permissão:", erro);
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
          <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Não perca a ofensiva</p>
        </div>
      </div>

      <div className="mt-4">
        {permission === 'unsupported' && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex gap-2 items-start">
            <span className="material-symbols-rounded text-[18px]">error</span>
            <p>Seu dispositivo ou navegador não suporta notificações web.</p>
          </div>
        )}

        {permission !== 'unsupported' && !isStandalone && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${isDark ? 'bg-amber-950/30 border-amber-900/50 text-amber-500' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
            <div className="flex gap-2 items-start font-bold text-sm">
              <span className="material-symbols-rounded text-[18px]">install_mobile</span>
              <p>Instalação Necessária</p>
            </div>
            <p className="text-xs font-medium opacity-90">
              Para receber notificações (especialmente no iPhone), você precisa instalar o aplicativo. Clique em Compartilhar e depois em <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
            </p>
          </div>
        )}

        {permission !== 'unsupported' && isStandalone && permission === 'denied' && (
          <div className={`p-4 rounded-xl border flex flex-col gap-2 ${isDark ? 'bg-red-950/30 border-red-900/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <div className="flex gap-2 items-center font-bold text-sm">
              <span className="material-symbols-rounded text-[18px]">notifications_off</span>
              <p>Notificações Bloqueadas</p>
            </div>
            <p className="text-xs font-medium opacity-90">
              O seu celular bloqueou os lembretes. Para ativar: <br/><br/>
              <strong>iPhone:</strong> Ajustes &gt; Ágape Liturgia &gt; Notificações &gt; Permitir.<br/>
              <strong>Android:</strong> Configurações &gt; Apps &gt; Ágape Liturgia &gt; Permitir.
            </p>
          </div>
        )}

        {permission !== 'unsupported' && isStandalone && permission === 'default' && (
          <div>
            <p className={`text-sm font-medium mb-4 ${textMuted}`}>
              Quer receber um aviso silencioso na hora do Evangelho ou quando uma nova Novena começar?
            </p>
            <button 
              onClick={solicitarPermissao}
              className="w-full bg-[#2F6BFF] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_#1E4BCC] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-rounded text-[20px]">check_circle</span>
              ATIVAR LEMBRETES
            </button>
          </div>
        )}

        {permission !== 'unsupported' && isStandalone && permission === 'granted' && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded">verified</span>
              Lembretes Ativos
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
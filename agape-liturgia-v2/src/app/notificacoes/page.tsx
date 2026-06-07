"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { NotificacoesCard } from "@/components/menu/NotificacoesCard";

export default function NotificacoesPage() {
  const router = useRouter();
  const { modoVisual } = useUserStore();

  const isDark = modoVisual === 'escuro';
  const isSepia = modoVisual === 'leitura';
  const bg = isDark ? "bg-slate-950" : isSepia ? "bg-[#FAF6EE]" : "bg-background";
  const textMain = isDark ? "text-slate-100" : isSepia ? "text-[#4A3C31]" : "text-foreground";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#8C7B65]" : "text-muted";
  const borderColor = isDark ? "border-slate-800" : isSepia ? "border-[#E8DEC1]" : "border-border";

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-10 transition-colors duration-300 ${bg}`}>
      {/* Header */}
      <header className={`px-5 py-4 flex items-center justify-between border-b ${isDark ? "bg-slate-950 border-slate-800" : isSepia ? "bg-[#FAF6EE] border-[#E8DEC1]" : "bg-background border-border"}`}>
        <button
          onClick={() => router.back()}
          className={`w-10 h-10 flex items-center justify-center active:scale-95 rounded-full shadow-sm border transition-colors ${isDark ? "bg-slate-900 border-slate-700 text-slate-300 hover:text-white" : isSepia ? "bg-[#F4ECD8] border-[#E8DEC1] text-[#8C7B65]" : "bg-card border-border text-muted hover:text-primary"}`}
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`flex-1 text-center font-extrabold tracking-tight pr-10 ${textMain}`}>
          Notificações
        </h1>
      </header>

      <main className="flex-1 px-5 pt-6 max-w-[600px] mx-auto w-full flex flex-col gap-6">

        {/* Card principal de ativação */}
        <NotificacoesCard />

        {/* Informações sobre os tipos de notificação */}
        <section>
          <p className={`font-bold text-xs uppercase tracking-widest mb-3 pl-1 ${textMuted}`}>O que você vai receber</p>
          <div className={`rounded-[1.5rem] border overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : isSepia ? "bg-[#F4ECD8] border-[#E8DEC1]" : "bg-card border-border"}`}>

            <div className={`flex items-start gap-4 p-4 border-b ${borderColor}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-rounded text-[22px]">church</span>
              </div>
              <div>
                <span className={`font-extrabold block text-sm mb-0.5 ${textMain}`}>Liturgia Diária</span>
                <span className={`text-xs leading-relaxed ${textMuted}`}>
                  Um lembrete toda manhã com a leitura do dia, para começar o dia com Deus.
                </span>
              </div>
            </div>

            <div className={`flex items-start gap-4 p-4 border-b ${borderColor}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-rounded text-[22px]">volunteer_activism</span>
              </div>
              <div>
                <span className={`font-extrabold block text-sm mb-0.5 ${textMain}`}>Pedidos de Oração</span>
                <span className={`text-xs leading-relaxed ${textMuted}`}>
                  Quando alguém da comunidade pede oração no mural, você é avisado.
                </span>
              </div>
            </div>

            <div className={`flex items-start gap-4 p-4`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-rounded text-[22px]">campaign</span>
              </div>
              <div>
                <span className={`font-extrabold block text-sm mb-0.5 ${textMain}`}>Avisos da Comunidade</span>
                <span className={`text-xs leading-relaxed ${textMuted}`}>
                  Comunicados importantes do seu grupo ou da coordenação Ágape.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dica sobre iOS */}
        <section>
          <div className={`rounded-[1.5rem] border p-4 flex items-start gap-3 ${isDark ? "bg-slate-900 border-slate-800" : isSepia ? "bg-[#F4ECD8] border-[#E8DEC1]" : "bg-blue-50 border-blue-100"}`}>
            <span className="material-symbols-rounded text-[#2F6BFF] text-[22px] mt-0.5 shrink-0">info</span>
            <div>
              <p className={`font-bold text-sm mb-1 ${textMain}`}>Requisito: App instalado</p>
              <p className={`text-xs leading-relaxed ${textMuted}`}>
                As notificações funcionam apenas quando o Ágape está instalado na Tela de Início.
                No iOS (iPhone/iPad), vá em <strong>Compartilhar → Adicionar à Tela de Início</strong>.
                No Android, toque em <strong>Instalar App</strong> nas configurações.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

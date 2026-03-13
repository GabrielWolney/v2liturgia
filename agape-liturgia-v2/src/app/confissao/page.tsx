"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";

const categoriasPecados = [
  {
    titulo: "Amar a Deus",
    pecados: [
      "Faltei à Missa aos domingos ou festas de preceito por culpa própria?",
      "Cheguei tarde à Missa habitualmente por descaso?",
      "Recebi a Eucaristia em estado de pecado grave (sem confessar antes)?",
      "Omiti algum pecado grave em confissões passadas por vergonha?",
      "Neguei a minha fé ou tive vergonha de me posicionar como católico?",
      "Usei o nome de Deus em vão, fiz juramentos falsos ou blasfemei?",
      "Dediquei tempo diário à oração ou esqueci-me de Deus na correria?",
      "Acreditei em superstições, horóscopos, tarô ou práticas de ocultismo?",
    ],
  },
  {
    titulo: "Amar ao Próximo",
    pecados: [
      "Fui desobediente, insolente ou faltei com o respeito aos meus pais?",
      "Tratei mal os meus irmãos, amigos ou colegas?",
      "Guardei ódio, rancor ou desejei o mal a alguém?",
      "Fui motivo de escândalo para outros por minhas atitudes ou palavras?",
      "Fiz fofocas, calúnias ou espalhei boatos (mesmo que fossem verdade)?",
      "Menti para me beneficiar ou para prejudicar/enganar alguém?",
      "Fui egoísta e neguei ajuda a quem realmente precisava?",
      "Julguei os outros precipitadamente com malícia?",
    ],
  },
  {
    titulo: "Pureza e Temperança",
    pecados: [
      "Consenti em pensamentos ou desejos impuros deliberadamente?",
      "Assisti a pornografia ou busquei conteúdos sensuais/eróticos na internet?",
      "Cometi atos de impureza comigo mesmo (masturbação)?",
      "Tive relações sexuais fora ou antes do matrimônio?",
      "No namoro, faltei com o respeito ou levei o outro a pecar?",
      "Vesti-me de forma vulgar ou usei minha imagem para provocar desejo alheio?",
      "Fui guloso, bebi demais ou usei drogas?",
      "Fui vaidoso, soberbo ou senti-me superior aos outros?",
    ],
  },
  {
    titulo: "Deveres e Honestidade",
    pecados: [
      "Fui preguiçoso nos estudos ou no trabalho?",
      "Colei em provas ou apresentei trabalhos que não eram meus?",
      "Peguei em dinheiro ou objetos que não me pertenciam sem permissão?",
      "Desperdicei dinheiro com coisas fúteis enquanto outros passam necessidade?",
      "Perdi tempo excessivo em redes sociais e jogos, negligenciando meus deveres?",
      "Fui invejoso em relação ao sucesso ou bens dos outros?",
    ],
  },
];

export default function ConfissaoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const {
    exameConsciencia,
    togglePecado,
    limparExame,
    modoVisual,
    tamanhoFonte,
  } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "confissao_tematizada" });
    return () => clearTimeout(mountTimer);
  }, []);

  if (!isMounted) return <div className="min-h-[100dvh] bg-background" />;

  // --- CLASSES DO TEMA ---
  const isDark = modoVisual === "escuro";
  const isSepia = modoVisual === "leitura";

  const wrapperClass = isDark
    ? "bg-slate-950"
    : isSepia
      ? "bg-[#FDF6E3]"
      : "bg-background";
  const textMain = isDark
    ? "text-slate-100"
    : isSepia
      ? "text-[#4A3C31]"
      : "text-foreground";
  const textMuted = isDark
    ? "text-slate-400"
    : isSepia
      ? "text-[#8C7B65]"
      : "text-muted";
  const cardBg = isDark ? "bg-slate-900" : isSepia ? "bg-[#F4ECD8]" : "bg-card";
  const borderColor = isDark
    ? "border-slate-800"
    : isSepia
      ? "border-[#E8DEC1]"
      : "border-border";
  const headerBg = isDark
    ? "bg-slate-950/90"
    : isSepia
      ? "bg-[#FDF6E3]/90"
      : "bg-background/90";

  const arrowHover = isDark
    ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
    : isSepia
      ? "hover:bg-[#E8DEC1] text-[#8C7B65] hover:text-[#4A3C31]"
      : "hover:bg-slate-200 text-muted hover:text-foreground";
  const itemHover = isDark
    ? "hover:bg-slate-800/80"
    : isSepia
      ? "hover:bg-[#E8DEC1]/50"
      : "hover:bg-background";

  // Lógica de Fonte
  const fontBody =
    tamanhoFonte === "grande" ? "text-base sm:text-lg" : "text-sm";
  const fontHeader =
    tamanhoFonte === "grande" ? "text-lg sm:text-xl" : "text-base";

  const quantidadePecados = Object.keys(exameConsciencia).length;

  return (
    <div
      className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#6E3AA5]/30 ${wrapperClass}`}
    >
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 ${headerBg} ${borderColor}`}
      >
        <button
          onClick={() => router.back()}
          className={`flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors ${arrowHover}`}
        >
          <span className="material-symbols-rounded text-[26px]">
            arrow_back
          </span>
        </button>
        <h1
          className={`font-extrabold tracking-tight ${textMain} ${fontHeader}`}
        >
          Reconciliação
        </h1>
        {quantidadePecados > 0 ? (
          <button
            onClick={limparExame}
            className="flex items-center gap-1 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-colors hover:bg-red-500/20"
          >
            <span className="material-symbols-rounded text-[16px]">delete</span>{" "}
            Limpar
          </button>
        ) : (
          <div className="w-10 h-10"></div>
        )}
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        {/* CABEÇALHO DO EXAME */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-[#6E3AA5]/10 rounded-[1.5rem] flex items-center justify-center text-[#6E3AA5] mb-5 shadow-inner">
            <svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              stroke="currentColor"
              fill="none"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g>
                <polyline points="195.8,15 195.8,497 75.3,497 75.3,135.5 195.8,15 316.2,15 436.7,135.5 436.7,497 316.2,497 316.2,15 " />
                <line x1="195.8" y1="135.5" x2="316.4" y2="135.5" />
                <line x1="135.5" y1="250" x2="135.5" y2="380" />
                <line x1="95" y1="290" x2="175" y2="290" />
                <line x1="376.5" y1="250" x2="376.5" y2="380" />
                <line x1="336" y1="290" x2="416" y2="290" />
              </g>
            </svg>
          </div>
          <h2
            className={`text-3xl font-extrabold tracking-tight mb-2 ${textMain}`}
          >
            Exame de Consciência
          </h2>
          <p className={`font-medium text-sm max-w-[300px] ${textMuted}`}>
            Marque as suas faltas. Tudo fica guardado{" "}
            <strong>apenas neste celular</strong>.
          </p>
        </div>

        {/* OS 5 PASSOS - O CAMINHO DA GRAÇA */}
        <section
          className={`rounded-[2rem] p-6 sm:p-8 shadow-soft border mb-10 transition-colors duration-300 ${cardBg} ${borderColor}`}
        >
          <div className="text-center mb-6">
            <h3 className="text-[#6E3AA5] font-extrabold text-xl mb-1">
              O Caminho da Graça
            </h3>
            <p
              className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}
            >
              5 Passos para a Confissão
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isDark ? "bg-slate-950/50 border-slate-800" : isSepia ? "bg-[#E8DEC1]/20 border-[#E8DEC1]" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  manage_search
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm ${textMain}`}>1. Exame</h4>
                <p className={`text-xs ${textMuted} leading-snug`}>
                  Refletir onde errei contra Deus.
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isDark ? "bg-slate-950/50 border-slate-800" : isSepia ? "bg-[#E8DEC1]/20 border-[#E8DEC1]" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  sentiment_dissatisfied
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm ${textMain}`}>
                  2. Arrependimento
                </h4>
                <p className={`text-xs ${textMuted} leading-snug`}>
                  Dor sincera no coração.
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isDark ? "bg-slate-950/50 border-slate-800" : isSepia ? "bg-[#E8DEC1]/20 border-[#E8DEC1]" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  verified
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm ${textMain}`}>
                  3. Propósito
                </h4>
                <p className={`text-xs ${textMuted} leading-snug`}>
                  Decidir não pecar mais.
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isDark ? "bg-slate-950/50 border-slate-800" : isSepia ? "bg-[#E8DEC1]/20 border-[#E8DEC1]" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  record_voice_over
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm ${textMain}`}>
                  4. Confissão
                </h4>
                <p className={`text-xs ${textMuted} leading-snug`}>
                  Dizer os pecados ao padre.
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isDark ? "bg-slate-950/50 border-slate-800" : isSepia ? "bg-[#E8DEC1]/20 border-[#E8DEC1]" : "bg-slate-50/50 border-slate-100"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  task_alt
                </span>
              </div>
              <div>
                <h4 className={`font-bold text-sm ${textMain}`}>
                  5. Penitência
                </h4>
                <p className={`text-xs ${textMuted} leading-snug`}>
                  Cumprir o ato reparador.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LISTA DE PECADOS (ACORDEÕES) */}
        <div className="flex flex-col gap-4 mb-12">
          {categoriasPecados.map((cat, catIndex) => (
            <details
              key={catIndex}
              className={`group rounded-[1.5rem] shadow-soft border overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-colors duration-300 ${cardBg} ${borderColor}`}
            >
              <summary
                className={`flex items-center justify-between p-5 cursor-pointer outline-none transition-colors ${itemHover}`}
              >
                <span className={`font-extrabold ${textMain} ${fontHeader}`}>
                  {cat.titulo}
                </span>
                <span
                  className={`material-symbols-rounded group-open:rotate-180 transition-transform duration-300 rounded-full p-1 shrink-0 ${isDark ? "bg-slate-800 text-slate-400" : isSepia ? "bg-[#E8DEC1] text-[#8C7B65]" : "bg-background text-muted"}`}
                >
                  expand_more
                </span>
              </summary>

              <div
                className={`p-5 pt-2 border-t flex flex-col gap-2 ${borderColor} ${isDark ? "bg-slate-950/50" : isSepia ? "bg-[#E8DEC1]/20" : "bg-background/50"}`}
              >
                {cat.pecados.map((pecado, pecIndex) => {
                  const idPecado = `${catIndex}-${pecIndex}`;
                  const isChecked = !!exameConsciencia[idPecado];

                  return (
                    <label
                      key={pecIndex}
                      className={`flex items-start gap-4 cursor-pointer group/item p-3 rounded-xl transition-all ${isChecked ? `shadow-sm border border-[#6E3AA5]/30 ${cardBg}` : `border border-transparent ${itemHover}`}`}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => togglePecado(idPecado)}
                        />
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? "bg-[#6E3AA5] border-[#6E3AA5]"
                              : `${isDark ? "border-slate-700 bg-slate-800" : isSepia ? "border-[#D9CFB3] bg-[#F4ECD8]" : "border-border bg-card"} group-hover/item:border-[#6E3AA5]/50`
                          }`}
                        >
                          <span
                            className={`material-symbols-rounded text-white text-[18px] font-bold transition-transform ${isChecked ? "scale-100" : "scale-0"}`}
                          >
                            check
                          </span>
                        </div>
                      </div>
                      <span
                        className={`leading-relaxed transition-colors select-none ${fontBody} ${isChecked ? "text-[#6E3AA5] font-bold" : `font-medium ${textMain}`}`}
                      >
                        {pecado}
                      </span>
                    </label>
                  );
                })}
              </div>
            </details>
          ))}
        </div>

        {/* ATO DE CONTRIÇÃO */}
        <section className="bg-[#6E3AA5] text-white p-8 rounded-[2rem] shadow-[0_10px_0_rgba(110,58,165,0.4)] text-center relative overflow-hidden mb-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-card rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-card/20 px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="text-xs font-bold uppercase tracking-widest">
                Ato de Contrição
              </span>
            </div>
            <p
              className={`font-serif italic leading-relaxed text-white/95 mb-8 ${tamanhoFonte === "grande" ? "text-xl" : "text-lg"}`}
            >
              &quot;Meu Deus, eu me arrependo de todo o coração de vos ter
              ofendido, porque sois tão bom e amável. Prometo, com a vossa
              graça, esforçar-me para ser bom e não mais pecar.&quot;
            </p>
            <div className="inline-block bg-[#4A2673] px-6 py-3 rounded-[1rem] shadow-inner border border-white/10">
              <p className="font-extrabold text-[11px] tracking-widest text-white/80">
                MEU JESUS, MISERICÓRDIA!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

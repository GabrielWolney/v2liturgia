"use client";

import React, { useEffect } from "react";
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
  const {
    exameConsciencia,
    togglePecado,
    limparExame,
    tamanhoFonte,
  } = useUserStore();

  useEffect(() => {
    trackEvent("page_view", { page_name: "confissao_tematizada" });
  }, []);

  const fontBody = tamanhoFonte === "grande" ? "text-base sm:text-lg" : "text-sm";
  const fontHeader = tamanhoFonte === "grande" ? "text-lg sm:text-xl" : "text-base";

  const quantidadePecados = Object.keys(exameConsciencia).length;

  return (
    <div
      className="min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-[#6E3AA5]/30 bg-background"
    >
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground"
        >
          <span className="material-symbols-rounded text-[26px]">
            arrow_back
          </span>
        </button>
        <h1
          className={`font-extrabold tracking-tight text-foreground ${fontHeader}`}
        >
          Confissão
        </h1>
        <div className="w-10 h-10 shrink-0"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
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
            className="text-3xl font-extrabold tracking-tight mb-2 text-foreground"
          >
            Exame de Consciência
          </h2>
          <p className="font-medium text-sm max-w-[300px] text-muted">
            Marque as suas faltas. Tudo fica guardado{" "}
            <strong>apenas neste celular</strong>.
          </p>
        </div>

        <section
          className="rounded-[2rem] p-6 sm:p-8 shadow-soft border mb-10 transition-colors duration-300 bg-card border-border"
        >
          <div className="text-center mb-6">
            <h3 className="text-[#6E3AA5] font-extrabold text-xl mb-1">
              O Caminho da Graça
            </h3>
            <p
              className="text-xs font-bold uppercase tracking-widest text-muted"
            >
              5 Passos para a Confissão
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-4 p-3 rounded-xl border transition-colors bg-muted/10 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  manage_search
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">1. Exame</h4>
                <p className="text-xs text-muted leading-snug">
                  Refletir onde errei contra Deus.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-xl border transition-colors bg-muted/10 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  sentiment_dissatisfied
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  2. Arrependimento
                </h4>
                <p className="text-xs text-muted leading-snug">
                  Dor sincera no coração.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-xl border transition-colors bg-muted/10 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  verified
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  3. Propósito
                </h4>
                <p className="text-xs text-muted leading-snug">
                  Decidir não pecar mais.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-xl border transition-colors bg-muted/10 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  record_voice_over
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  4. Confissão
                </h4>
                <p className="text-xs text-muted leading-snug">
                  Dizer os pecados ao padre.
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-4 p-3 rounded-xl border transition-colors bg-muted/10 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6E3AA5]/10 text-[#6E3AA5] flex items-center justify-center shrink-0">
                <span className="material-symbols-rounded text-[24px]">
                  task_alt
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  5. Penitência
                </h4>
                <p className="text-xs text-muted leading-snug">
                  Cumprir o ato reparador.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-4 mb-12">
          {categoriasPecados.map((cat, catIndex) => (
            <details
              key={catIndex}
              className="group rounded-[1.5rem] shadow-soft border overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-colors duration-300 bg-card border-border"
            >
              <summary
                className="flex items-center justify-between p-5 cursor-pointer outline-none transition-colors hover:bg-muted/10"
              >
                <span className={`font-extrabold text-foreground ${fontHeader}`}>
                  {cat.titulo}
                </span>
                <span
                  className="material-symbols-rounded group-open:rotate-180 transition-transform duration-300 rounded-full p-1 shrink-0 text-muted bg-muted/20"
                >
                  expand_more
                </span>
              </summary>

              <div
                className="p-5 pt-2 border-t flex flex-col gap-2 border-border bg-muted/5"
              >
                {cat.pecados.map((pecado, pecIndex) => {
                  const idPecado = `${catIndex}-${pecIndex}`;
                  const isChecked = !!exameConsciencia[idPecado];

                  return (
                    <label
                      key={pecIndex}
                      className={`flex items-start gap-4 cursor-pointer group/item p-3 rounded-xl transition-all ${isChecked ? `shadow-sm border border-[#6E3AA5]/30 bg-card` : `border border-transparent hover:bg-muted/10`}`}
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
                              : "border-border bg-card group-hover/item:border-[#6E3AA5]/50"
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
                        className={`leading-relaxed transition-colors select-none ${fontBody} ${isChecked ? "text-[#6E3AA5] font-bold" : `font-medium text-foreground`}`}
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

        {quantidadePecados > 0 && (
          <div className="fixed bottom-6 left-0 right-0 z-50 px-5 pointer-events-none animate-fade-in flex justify-center">
            <div className="pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-full shadow-2xl border backdrop-blur-md bg-card/95 border-border max-w-[400px] w-full">
              <div className="flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded-full bg-[#6E3AA5] text-white font-black flex items-center justify-center text-sm shadow-inner">
                  {quantidadePecados}
                </div>
                <span className="font-bold text-sm text-foreground">
                  {quantidadePecados === 1 ? 'Falta anotada' : 'Faltas anotadas'}
                </span>
              </div>
              <button
                onClick={() => {
                  if(window.confirm("Deseja apagar todas as faltas marcadas?")) {
                    limparExame();
                  }
                }}
                className="flex items-center gap-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              >
                <span className="material-symbols-rounded text-[16px]">delete_sweep</span>
                Apagar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
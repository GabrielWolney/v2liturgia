"use client";

import { useState, useEffect } from "react";
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
      "Neguei minha fé ou tive vergonha de me posicionar como católico?",
      "Usei o nome de Deus em vão, fiz juramentos falsos ou blasfemei?",
      "Dediquei tempo diário à oração ou me esqueci de Deus na correria?",
      "Acreditei em superstições, horóscopos, tarô ou práticas de ocultismo?"
    ]
  },
  {
    titulo: "Amar ao Próximo",
    pecados: [
      "Fui desobediente, insolente ou faltei com o respeito aos meus pais?",
      "Tratei mal meus irmãos, amigos ou colegas?",
      "Guardei ódio, rancor ou desejei o mal a alguém?",
      "Fui motivo de escândalo para outros por minhas atitudes ou palavras?",
      "Fiz fofocas, calúnias ou espalhei boatos (mesmo que fossem verdade)?",
      "Menti para me beneficiar ou para prejudicar/enganar alguém?",
      "Fui egoísta e neguei ajuda a quem realmente precisava?",
      "Julguei os outros precipitadamente com malícia?"
    ]
  },
  {
    titulo: "Pureza e Temperança",
    pecados: [
      "Consenti em pensamentos ou desejos impuros deliberadamente?",
      "Assisti pornografia ou busquei conteúdos sensuais/eróticos na internet?",
      "Cometi atos de impureza comigo mesmo (masturbação)?",
      "Tive relações sexuais fora ou antes do matrimônio?",
      "No namoro, faltei com o respeito ou levei o outro a pecar?",
      "Vesti-me de forma vulgar ou usei minha imagem para provocar desejo alheio?",
      "Fui guloso, bebi demais ou usei drogas?",
      "Fui vaidoso, soberbo ou me senti superior aos outros?"
    ]
  },
  {
    titulo: "Deveres e Honestidade",
    pecados: [
      "Fui preguiçoso nos estudos ou no trabalho?",
      "Colei em provas ou apresentei trabalhos que não eram meus?",
      "Peguei dinheiro ou objetos que não me pertenciam sem permissão?",
      "Desperdicei dinheiro com coisas fúteis enquanto outros passam necessidade?",
      "Perdi tempo excessivo em redes sociais e jogos, negligenciando meus deveres?",
      "Fui invejoso em relação ao sucesso ou bens dos outros?"
    ]
  }
];

export default function ConfissaoPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { exameConsciencia, togglePecado, limparExame } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "confissao" });
    return () => clearTimeout(mountTimer);
  }, []);

  const handleLimpar = () => {
    if (confirm("Deseja apagar todas as marcações do seu exame?")) {
      limparExame();
      trackEvent("clear_examination");
    }
  };

  // TELA DE CARREGAMENTO
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-6 flex items-center justify-center text-blue-500">
          <span className="material-symbols-rounded text-3xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  const quantidadePecados = Object.keys(exameConsciencia).length;

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      {/* HEADER */}
      <header className="mb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
          <span className="material-symbols-rounded text-4xl">clean_hands</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-2">
          Reconciliação
        </h1>
        <p className="text-slate-500 font-medium text-sm font-serif italic">
          &quot;Coragem, filho, os teus pecados estão perdoados.&quot; (Mt 9, 2)
        </p>
      </header>

      {/* OS 5 PASSOS */}
      <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-slate-100 mb-10">
        <h2 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-rounded text-blue-600">format_list_numbered</span>
          Os 5 Passos da Confissão
        </h2>
        <ul className="flex flex-col gap-4">
          {[
            { n: 1, title: "Exame", desc: "Refletir com sinceridade onde errei contra Deus." },
            { n: 2, title: "Arrependimento", desc: "Sentir dor sincera no coração pelos pecados." },
            { n: 3, title: "Propósito", desc: "Decidir firmemente não voltar a pecar." },
            { n: 4, title: "Confissão", desc: "Dizer os pecados ao padre de forma clara." },
            { n: 5, title: "Penitência", desc: "Cumprir o ato reparador que o padre indicar." }
          ].map((passo) => (
            <li key={passo.n} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-sm">
                {passo.n}
              </div>
              <p className="text-sm text-slate-700 mt-1">
                <strong className="text-slate-900">{passo.title}:</strong> {passo.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* EXAME DE CONSCIÊNCIA */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
            <span className="material-symbols-rounded text-blue-600">fact_check</span>
            Exame de Consciência
          </h2>
          {quantidadePecados > 0 && (
            <button 
              onClick={handleLimpar} 
              className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-rounded text-[16px]">delete</span>
              Limpar ({quantidadePecados})
            </button>
          )}
        </div>
        
        <p className="text-slate-500 text-sm mb-6 px-2">
          Marque as suas faltas apenas para ajudar a lembrar na hora da confissão. Tudo fica guardado <strong>apenas no seu dispositivo</strong> em total privacidade.
        </p>

        <div className="flex flex-col gap-4">
          {categoriasPecados.map((cat, catIndex) => (
            <details key={catIndex} className="group bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 outline-none hover:bg-slate-50 transition-colors">
                <span className="text-lg">{cat.titulo}</span>
                <span className="material-symbols-rounded text-slate-400 group-open:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </summary>
              
              <div className="p-6 pt-2 border-t border-slate-50 flex flex-col gap-4">
                {cat.pecados.map((pecado, pecIndex) => {
                  const idPecado = `${catIndex}-${pecIndex}`;
                  const isChecked = !!exameConsciencia[idPecado];

                  return (
                    <label 
                      key={pecIndex} 
                      className="flex items-start gap-4 cursor-pointer group/item hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors"
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={isChecked}
                          onChange={() => togglePecado(idPecado)}
                        />
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-slate-300 group-hover/item:border-blue-400 bg-white'
                        }`}>
                          <span className={`material-symbols-rounded text-white text-[18px] transition-transform ${
                            isChecked ? 'scale-100' : 'scale-0'
                          }`}>
                            check
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm leading-relaxed transition-all duration-200 select-none ${
                        isChecked ? "line-through text-slate-400" : "text-slate-700"
                      }`}>
                        {pecado}
                      </span>
                    </label>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ATO DE CONTRIÇÃO */}
      <section className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8 md:p-10 rounded-[2rem] shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 pointer-events-none flex items-center justify-center">
          <span className="material-symbols-rounded text-[200px]">water_drop</span>
        </div>
        
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-6 tracking-widest uppercase text-blue-200">Ato de Contrição</h2>
          <p className="text-lg md:text-xl font-serif italic leading-relaxed text-blue-50 mb-8">
            &quot;Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois tão bom e amável. Prometo, com a vossa graça, esforçar-me para ser bom e não mais pecar.&quot;
          </p>
          <div className="inline-block border border-blue-400/30 bg-blue-800/50 px-6 py-3 rounded-full">
            <p className="font-bold text-sm tracking-widest text-blue-100">
              MEU JESUS, MISERICÓRDIA!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
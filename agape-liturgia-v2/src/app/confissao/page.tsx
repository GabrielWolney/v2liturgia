"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
      "Acreditei em superstições, horóscopos, tarô ou práticas de ocultismo?"
    ]
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
      "Julguei os outros precipitadamente com malícia?"
    ]
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
      "Fui vaidoso, soberbo ou senti-me superior aos outros?"
    ]
  },
  {
    titulo: "Deveres e Honestidade",
    pecados: [
      "Fui preguiçoso nos estudos ou no trabalho?",
      "Colei em provas ou apresentei trabalhos que não eram meus?",
      "Peguei em dinheiro ou objetos que não me pertenciam sem permissão?",
      "Desperdicei dinheiro com coisas fúteis enquanto outros passam necessidade?",
      "Perdi tempo excessivo em redes sociais e jogos, negligenciando meus deveres?",
      "Fui invejoso em relação ao sucesso ou bens dos outros?"
    ]
  }
];

export default function ConfissaoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { exameConsciencia, togglePecado, limparExame } = useUserStore();

  useEffect(() => {
    const mountTimer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "confissao_v2" });
    return () => clearTimeout(mountTimer);
  }, []);

  const handleLimpar = () => {
    if (confirm("Deseja apagar todas as marcações do seu exame?")) {
      limparExame();
      trackEvent("clear_examination");
    }
  };

  if (!isMounted) {
    return <div className="min-h-[100dvh] bg-[#F5F7FA]" />;
  }

  const quantidadePecados = Object.keys(exameConsciencia).length;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#6E3AA5]/30">
      
      {/* HEADER NAVEGAÇÃO */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <button 
          onClick={() => router.back()}
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">Reconciliação</h1>
        
        {quantidadePecados > 0 ? (
          <button 
            onClick={handleLimpar} 
            className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition-transform"
          >
            <span className="material-symbols-rounded text-[16px]">delete</span>
            Limpar
          </button>
        ) : (
          <div className="w-10 h-10"></div> /* Espaçador para manter o título centrado */
        )}
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* TÍTULO E ÍCONE ROXO */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-[#6E3AA5]/10 rounded-[1.5rem] flex items-center justify-center text-[#6E3AA5] mb-5 shadow-inner">
            <span className="material-symbols-rounded text-[40px]">clean_hands</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#1F1F1F] tracking-tight mb-2">
            Exame de Consciência
          </h2>
          <p className="text-[#6B6B6B] font-medium text-sm max-w-[300px]">
            Marque as suas faltas. Tudo fica guardado <strong>apenas neste telemóvel</strong>.
          </p>
        </div>

        {/* LISTA DE PECADOS (ACORDIÃO ESTILO MIMO) */}
        <div className="flex flex-col gap-4 mb-12">
          {categoriasPecados.map((cat, catIndex) => (
            <details key={catIndex} className="group bg-white rounded-[1.5rem] shadow-soft border border-slate-100 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-extrabold text-[#1F1F1F] outline-none hover:bg-slate-50 transition-colors active:bg-slate-100">
                <span className="text-base">{cat.titulo}</span>
                <span className="material-symbols-rounded text-[#6B6B6B] group-open:rotate-180 transition-transform duration-300 bg-[#F5F7FA] rounded-full p-1">
                  expand_more
                </span>
              </summary>
              
              <div className="p-5 pt-2 border-t border-slate-50 flex flex-col gap-2 bg-slate-50/50">
                {cat.pecados.map((pecado, pecIndex) => {
                  const idPecado = `${catIndex}-${pecIndex}`;
                  const isChecked = !!exameConsciencia[idPecado];

                  return (
                    <label 
                      key={pecIndex} 
                      className={`flex items-start gap-4 cursor-pointer group/item p-3 rounded-xl transition-all ${isChecked ? 'bg-white shadow-sm border border-[#6E3AA5]/20' : 'hover:bg-white border border-transparent'}`}
                    >
                      <div className="relative mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={isChecked}
                          onChange={() => togglePecado(idPecado)}
                        />
                        {/* Checkbox Roxo Penitencial */}
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-[#6E3AA5] border-[#6E3AA5] shadow-[0_2px_0_#4A2673]' 
                            : 'border-slate-300 bg-white group-hover/item:border-[#6E3AA5]/50'
                        }`}>
                          <span className={`material-symbols-rounded text-white text-[18px] font-bold transition-transform ${
                            isChecked ? 'scale-100' : 'scale-0'
                          }`}>
                            check
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm leading-relaxed transition-colors duration-200 select-none ${
                        isChecked ? "text-[#6E3AA5] font-semibold" : "text-[#1F1F1F] font-medium"
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

        {/* ATO DE CONTRIÇÃO (CARD ROXO) */}
        <section className="bg-[#6E3AA5] text-white p-8 rounded-[2rem] shadow-[0_10px_0_#4A2673] text-center relative overflow-hidden mb-8">
          {/* Decoração de Fundo */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="material-symbols-rounded text-[14px]">water_drop</span>
              <span className="text-xs font-bold uppercase tracking-widest">Ato de Contrição</span>
            </div>
            
            <p className="text-lg font-serif italic leading-relaxed text-white/95 mb-8">
              &quot;Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois tão bom e amável. Prometo, com a vossa graça, esforçar-me para ser bom e não mais pecar.&quot;
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
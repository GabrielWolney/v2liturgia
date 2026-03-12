import Link from "next/link";
import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia, Capitulo, Versiculo } from "@/types/biblia";

const bibliaData = bibliaJson as unknown as BibliaData;

// O Normalizador Supremo
const normalizarLivro = (str: string) => {
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  s = s.replace(/\bsao\s+/g, ""); 
  s = s.replace(/^i\s+/, "1 ");
  s = s.replace(/^ii\s+/, "2 ");
  s = s.replace(/^iii\s+/, "3 ");
  s = s.replace(/^1a\s+/, "1 ");
  s = s.replace(/^2a\s+/, "2 ");
  s = s.replace(/^3a\s+/, "3 ");
  s = s.replace(/^primeira\s+/, "1 ");
  s = s.replace(/^segunda\s+/, "2 ");
  s = s.replace(/^terceira\s+/, "3 ");
  if (s === "cantico dos canticos") s = "canticos";
  return s.trim();
};

export default async function LeituraCapituloPage({ params }: { params: Promise<{ livro: string, capitulo: string }> }) {
  const { livro: slug, capitulo: capString } = await params;
  const numeroCapitulo = parseInt(capString);

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center text-[#6B6B6B] mt-20 font-bold">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  
  const slugLimpo = normalizarLivro(slug.replace(/-/g, " "));
  const nomeLimpo = normalizarLivro(bookInfo.nome);

  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = normalizarLivro(l.nome);
    return nomeJson === slugLimpo || nomeJson === nomeLimpo || nomeJson.includes(slugLimpo) || nomeJson.includes(nomeLimpo);
  });

  if (!livroEncontrado) return <div className="p-8 text-center text-[#6B6B6B] mt-20 font-bold">Erro de sincronização. Dados não encontrados.</div>;

  const capituloData = livroEncontrado.capitulos.find((c: Capitulo) => c.capitulo === numeroCapitulo);
  if (!capituloData) return <div className="p-8 text-center text-[#6B6B6B] mt-20 font-bold">Capítulo não encontrado.</div>;

  const totalCapitulos = livroEncontrado.capitulos.length;
  const hasPrev = numeroCapitulo > 1;
  const hasNext = numeroCapitulo < totalCapitulos;

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href={`/biblia/${slug}`}
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">
          {bookInfo.nome} <span className="text-[#2F6BFF] ml-1">{numeroCapitulo}</span>
        </h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        <article className="bg-white p-6 md:p-10 rounded-[2rem] shadow-soft border border-slate-100 font-serif text-lg md:text-xl leading-[2.2] text-[#1F1F1F] text-justify mb-10">
          {capituloData.versiculos.map((v: Versiculo) => (
            <span key={v.versiculo} className="inline">
              <sup className="font-sans font-bold text-[#2F6BFF] text-[0.65em] align-super mr-1.5 ml-1 select-none">
                {v.versiculo}
              </sup>
              {v.texto}{" "}
            </span>
          ))}
        </article>

        <nav className="flex items-center justify-between gap-4">
          {hasPrev ? (
            <Link 
              href={`/biblia/${slug}/${numeroCapitulo - 1}`} 
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] bg-white border-2 border-slate-100 text-[#6B6B6B] hover:border-[#2F6BFF] hover:text-[#2F6BFF] font-bold text-sm shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-rounded">chevron_left</span>
              Anterior
            </Link>
          ) : <div className="flex-1" />}

          {hasNext ? (
            <Link 
              href={`/biblia/${slug}/${numeroCapitulo + 1}`} 
              className="flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-[1.25rem] bg-[#2F6BFF] border-2 border-[#2F6BFF] text-white hover:brightness-105 font-bold text-sm shadow-[0_4px_0_#1E4BCC] active:shadow-none active:translate-y-1 transition-all"
            >
              Próximo
              <span className="material-symbols-rounded">chevron_right</span>
            </Link>
          ) : <div className="flex-1" />}
        </nav>

      </main>
    </div>
  );
}
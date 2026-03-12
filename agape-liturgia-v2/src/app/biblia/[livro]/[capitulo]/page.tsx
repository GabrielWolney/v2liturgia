import Link from "next/link";
import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia, Capitulo, Versiculo } from "@/types/biblia";

const bibliaData = bibliaJson as unknown as BibliaData;
const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function LeituraCapituloPage({ params }: { params: Promise<{ livro: string, capitulo: string }> }) {
  const { livro: slug, capitulo: capString } = await params;
  const numeroCapitulo = parseInt(capString);

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center text-slate-500 mt-20">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  
  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = removerAcentos(l.nome);
    const slugLimpo = slug.replace(/-/g, " ");
    return nomeJson === slugLimpo || nomeJson === removerAcentos(bookInfo.nome) || nomeJson.includes(slugLimpo);
  });

  if (!livroEncontrado) return <div className="p-8 text-center text-slate-500 mt-20">Erro ao carregar o livro.</div>;

  const capituloData = livroEncontrado.capitulos.find((c: Capitulo) => c.capitulo === numeroCapitulo);
  if (!capituloData) return <div className="p-8 text-center text-slate-500 mt-20">Capítulo não encontrado.</div>;

  const totalCapitulos = livroEncontrado.capitulos.length;
  const hasPrev = numeroCapitulo > 1;
  const hasNext = numeroCapitulo < totalCapitulos;

  return (
    <div className="max-w-[750px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-5 sm:px-8 md:px-0 animate-fade-in pb-32">
      
      <header className="flex flex-col items-center text-center mb-12 relative border-b border-slate-200 pb-8">
        <Link href={`/biblia/${slug}`} className="absolute left-0 top-0 text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm active:scale-95">
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        </Link>

        <span className="material-symbols-rounded text-blue-100 text-5xl mb-2 mt-8 sm:mt-0">auto_stories</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          {bookInfo.nome} <span className="text-blue-600">{numeroCapitulo}</span>
        </h1>
      </header>

      {/* ÁREA DE LEITURA (Typography Otimizada) */}
      <article className="font-serif text-lg md:text-xl leading-[1.85] text-slate-800 text-justify mb-16">
        {capituloData.versiculos.map((v: Versiculo) => (
          <span key={v.versiculo} className="inline">
            <sup className="font-sans font-bold text-blue-500 text-[0.65em] align-super mr-1.5 ml-1 select-none">
              {v.versiculo}
            </sup>
            {v.texto}{" "}
          </span>
        ))}
      </article>

      {/* NAVEGAÇÃO DE CAPÍTULOS */}
      <nav className="flex items-center justify-between border-t border-slate-200 pt-8">
        {hasPrev ? (
          <Link href={`/biblia/${slug}/${numeroCapitulo - 1}`} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-bold text-sm shadow-sm transition-all active:scale-95">
            <span className="material-symbols-rounded">chevron_left</span>
            Capítulo {numeroCapitulo - 1}
          </Link>
        ) : <div />}

        {hasNext ? (
          <Link href={`/biblia/${slug}/${numeroCapitulo + 1}`} className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-95">
            Capítulo {numeroCapitulo + 1}
            <span className="material-symbols-rounded">chevron_right</span>
          </Link>
        ) : <div />}
      </nav>

    </div>
  );
}
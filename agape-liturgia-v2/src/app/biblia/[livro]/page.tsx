import Link from "next/link";
import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia } from "@/types/biblia";

const bibliaData = bibliaJson as unknown as BibliaData;
const removerAcentos = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function CapitulosPage({ params }: { params: Promise<{ livro: string }> }) {
  const { livro: slug } = await params;

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);

  if (!bookInfo) return <div className="p-8 text-center text-slate-500 mt-20">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  const slugLimpo = slug.replace(/-/g, " ");
  const nomeLimpo = removerAcentos(bookInfo.nome);

  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = removerAcentos(l.nome);
    return nomeJson === slugLimpo || nomeJson === nomeLimpo || nomeJson.includes(slugLimpo);
  });

  if (!livroEncontrado) return <div className="p-8 text-center text-slate-500 mt-20">Dados não encontrados na base.</div>;

  const quantidadeCapitulos = livroEncontrado.capitulos.length;
  const capitulos = Array.from({ length: quantidadeCapitulos }, (_, i) => i + 1);

  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-4 sm:px-6 md:px-0 animate-fade-in pb-32">
      
      <header className="mb-12 text-center relative flex flex-col items-center">
        <Link href="/biblia" className="absolute left-0 top-0 text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm active:scale-95">
          <span className="material-symbols-rounded text-[20px]">arrow_back</span>
          <span className="hidden sm:inline text-sm font-bold">Voltar</span>
        </Link>
        
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 mt-10 sm:mt-0">
          <span className="material-symbols-rounded text-2xl">import_contacts</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
          {bookInfo.nome}
        </h1>
        <p className="text-slate-500 font-bold text-sm mt-2 tracking-widest uppercase">
          {quantidadeCapitulos} Capítulos
        </p>
      </header>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {capitulos.map((cap) => (
          <Link
            key={cap}
            href={`/biblia/${slug}/${cap}`}
            className="aspect-square flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-700 text-lg font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm hover:shadow-md transition-all active:scale-90"
          >
            {cap}
          </Link>
        ))}
      </div>

    </div>
  );
}
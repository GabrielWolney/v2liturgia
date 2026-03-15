import { bibliaCatolica } from "@/lib/bible-index";
import { buscarLivro, getCapitulo } from "@/services/db-biblia";
import { BibliaCapituloClient } from "@/components/biblia/BibliaCapituloClient";

export default async function LeituraCapituloPage({ params }: { params: Promise<{ livro: string, capitulo: string }> }) {
  const { livro: slug, capitulo: capString } = await params;
  const numeroCapitulo = parseInt(capString);

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Livro não encontrado.</div>;

  const livroEncontrado = await buscarLivro(slug);
  if (!livroEncontrado) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Erro de sincronização.</div>;

  const capituloData = await getCapitulo(slug, numeroCapitulo);
  if (!capituloData) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Capítulo não encontrado.</div>;

  const totalCapitulos = livroEncontrado.capitulos.length;
  const hasPrev = numeroCapitulo > 1;
  const hasNext = numeroCapitulo < totalCapitulos;

  return (
    <BibliaCapituloClient 
      nomeLivro={bookInfo.nome}
      slug={slug}
      numeroCapitulo={numeroCapitulo}
      versiculos={capituloData.versiculos}
      hasPrev={hasPrev}
      hasNext={hasNext}
    />
  );
}
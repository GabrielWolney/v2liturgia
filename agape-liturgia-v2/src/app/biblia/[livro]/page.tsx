import { bibliaCatolica } from "@/lib/bible-index";
import { buscarLivro } from "@/services/db-biblia";
import { BibliaLivroClient } from "@/components/biblia/BibliaLivroClient";

export default async function CapitulosPage({ params }: { params: Promise<{ livro: string }> }) {
  const { livro: slug } = await params;

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Livro não encontrado.</div>;

  const livroEncontrado = await buscarLivro(slug);

  if (!livroEncontrado) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Erro de base de dados.</div>;
  
  const totalCapitulos = livroEncontrado.capitulos.length;

  return (
    <BibliaLivroClient 
      nomeLivro={bookInfo.nome} 
      slug={slug} 
      totalCapitulos={totalCapitulos} 
    />
  );
}
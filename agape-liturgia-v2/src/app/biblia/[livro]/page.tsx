import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia } from "@/types/biblia";
import { BibliaLivroClient } from "@/components/biblia/BibliaLivroClient";

const bibliaData = bibliaJson as unknown as BibliaData;

const normalizarLivro = (str: string) => {
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  s = s.replace(/\bsao\s+/g, ""); 
  s = s.replace(/^i\s+/, "1 "); s = s.replace(/^ii\s+/, "2 "); s = s.replace(/^iii\s+/, "3 ");
  s = s.replace(/^1a\s+/, "1 "); s = s.replace(/^2a\s+/, "2 "); s = s.replace(/^3a\s+/, "3 ");
  s = s.replace(/^primeira\s+/, "1 "); s = s.replace(/^segunda\s+/, "2 "); s = s.replace(/^terceira\s+/, "3 ");
  if (s === "cantico dos canticos") s = "canticos";
  return s.trim();
};

export default async function CapitulosPage({ params }: { params: Promise<{ livro: string }> }) {
  const { livro: slug } = await params;

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  const slugLimpo = normalizarLivro(slug.replace(/-/g, " "));
  const livroEncontrado = todosLivros.find((l: LivroBiblia) => normalizarLivro(l.nome) === slugLimpo || normalizarLivro(l.nome).includes(slugLimpo));

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
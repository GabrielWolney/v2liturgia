import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia, Capitulo } from "@/types/biblia";
import { BibliaCapituloClient } from "@/components/biblia/BibliaCapituloClient";

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

export default async function LeituraCapituloPage({ params }: { params: Promise<{ livro: string, capitulo: string }> }) {
  const { livro: slug, capitulo: capString } = await params;
  const numeroCapitulo = parseInt(capString);

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);
  if (!bookInfo) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  const slugLimpo = normalizarLivro(slug.replace(/-/g, " "));
  const nomeLimpo = normalizarLivro(bookInfo.nome);

  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = normalizarLivro(l.nome);
    return nomeJson === slugLimpo || nomeJson === nomeLimpo || nomeJson.includes(slugLimpo) || nomeJson.includes(nomeLimpo);
  });

  if (!livroEncontrado) return <div className="p-8 text-center mt-20 font-bold text-slate-400">Erro de sincronização.</div>;

  const capituloData = livroEncontrado.capitulos.find((c: Capitulo) => c.capitulo === numeroCapitulo);
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
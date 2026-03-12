import Link from "next/link";
import { bibliaCatolica } from "@/lib/bible-index";
import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia } from "@/types/biblia";

const bibliaData = bibliaJson as unknown as BibliaData;

// O Normalizador Supremo que resolve os problemas da V1!
const normalizarLivro = (str: string) => {
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  
  // Limpa prefixos
  s = s.replace(/\bsao\s+/g, ""); 
  
  // Converte Numeração Romana para Arábica (Apenas no início)
  s = s.replace(/^i\s+/, "1 ");
  s = s.replace(/^ii\s+/, "2 ");
  s = s.replace(/^iii\s+/, "3 ");
  
  // Converte Ordinais e Extenso
  s = s.replace(/^1a\s+/, "1 ");
  s = s.replace(/^2a\s+/, "2 ");
  s = s.replace(/^3a\s+/, "3 ");
  s = s.replace(/^primeira\s+/, "1 ");
  s = s.replace(/^segunda\s+/, "2 ");
  s = s.replace(/^terceira\s+/, "3 ");
  
  // Caso particular
  if (s === "cantico dos canticos") s = "canticos";
  
  return s.trim();
};

export default async function CapitulosPage({ params }: { params: Promise<{ livro: string }> }) {
  const { livro: slug } = await params;

  const bookInfo = [...bibliaCatolica.novo, ...bibliaCatolica.antigo].find(b => b.slug === slug);

  if (!bookInfo) return <div className="p-8 text-center text-[#6B6B6B] mt-20 font-bold">Livro não encontrado.</div>;

  const todosLivros = [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
  
  // Normalizamos tudo para o mesmo padrão (ex: "i-sao-joao" -> "1 joao")
  const slugLimpo = normalizarLivro(slug.replace(/-/g, " "));
  const nomeLimpo = normalizarLivro(bookInfo.nome);

  const livroEncontrado = todosLivros.find((l: LivroBiblia) => {
    const nomeJson = normalizarLivro(l.nome);
    // Tenta correspondência exata primeiro, e depois parcial
    return nomeJson === slugLimpo || nomeJson === nomeLimpo || nomeJson.includes(slugLimpo) || nomeJson.includes(nomeLimpo);
  });

  if (!livroEncontrado) return <div className="p-8 text-center text-[#6B6B6B] mt-20 font-bold">Erro de sincronização. Dados não encontrados na base.</div>;

  const quantidadeCapitulos = livroEncontrado.capitulos.length;
  const capitulos = Array.from({ length: quantidadeCapitulos }, (_, i) => i + 1);

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/biblia"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="font-extrabold text-[#1F1F1F] text-lg tracking-tight">{bookInfo.nome}</h1>
          <p className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-widest">{quantidadeCapitulos} Capítulos</p>
        </div>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {capitulos.map((cap) => (
            <Link
              key={cap}
              href={`/biblia/${slug}/${cap}`}
              className="aspect-square flex items-center justify-center rounded-2xl bg-white border-2 border-slate-100 text-[#1F1F1F] text-lg font-extrabold hover:bg-[#2F6BFF] hover:text-white hover:border-[#2F6BFF] shadow-sm hover:shadow-[0_4px_0_#1E4BCC] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
            >
              {cap}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
import { BibliaData, LivroBiblia, Capitulo } from "@/types/biblia";

export interface ResultadoBusca {
  livro: string;
  capitulo: number;
  versiculo: number | string;
  texto: string;
}

const normalizar = (str: string) => 
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export async function getBibliaData(): Promise<BibliaData> {
  const modulo = await import("@/data/biblia.json");
  return modulo.default as BibliaData; 
}

export async function getTodosLivros(): Promise<LivroBiblia[]> {
  const bibliaData = await getBibliaData();
  return [...(bibliaData.antigoTestamento || []), ...(bibliaData.novoTestamento || [])];
}

export async function buscarLivro(query: string): Promise<LivroBiblia | undefined> {
  const q = normalizar(query.replace(/-/g, " "));
  const livros = await getTodosLivros();
  
  return livros.find(l => {
    const nomeLivro = normalizar(l.nome);
    return nomeLivro === q || nomeLivro.includes(q);
  });
}

export async function getCapitulo(livroSlug: string, numeroCapitulo: number): Promise<Capitulo | undefined> {
  const livro = await buscarLivro(livroSlug);
  if (!livro) return undefined;
  
  return livro.capitulos.find(c => c.capitulo === numeroCapitulo);
}

export async function pesquisarNaBiblia(termo: string): Promise<ResultadoBusca[]> {
  const termoNorm = normalizar(termo);
  if (termoNorm.length < 3) return []; 

  const resultados: ResultadoBusca[] = []; 
  const livros = await getTodosLivros();

  for (const livro of livros) {
    for (const cap of livro.capitulos) {
      for (const ver of cap.versiculos) {
        if (normalizar(ver.texto).includes(termoNorm)) {
          resultados.push({
            livro: livro.nome,
            capitulo: cap.capitulo,
            versiculo: ver.versiculo,
            texto: ver.texto
          });
        }
        if (resultados.length >= 50) return resultados;
      }
    }
  }

  return resultados;
}
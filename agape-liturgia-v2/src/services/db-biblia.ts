import bibliaJson from "@/data/biblia.json";
import { BibliaData, LivroBiblia, Capitulo } from "@/types/biblia";

const bibliaData = bibliaJson as unknown as BibliaData;

// Interface para o resultado da pesquisa
export interface ResultadoBusca {
  livro: string;
  capitulo: number;
  versiculo: number | string;
  texto: string;
}

// Auxiliar para normalização
const normalizar = (str: string) => 
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/**
 * Retorna todos os livros em uma única lista plana
 */
export function getTodosLivros(): LivroBiblia[] {
  return [...bibliaData.antigoTestamento, ...bibliaData.novoTestamento];
}

/**
 * Busca um livro pelo nome ou slug
 */
export function buscarLivro(query: string): LivroBiblia | undefined {
  const q = normalizar(query.replace(/-/g, " "));
  const livros = getTodosLivros();
  
  return livros.find(l => {
    const nomeLivro = normalizar(l.nome);
    return nomeLivro === q || nomeLivro.includes(q);
  });
}

/**
 * Obtém um capítulo específico de um livro
 */
export function getCapitulo(livroSlug: string, numeroCapitulo: number): Capitulo | undefined {
  const livro = buscarLivro(livroSlug);
  if (!livro) return undefined;
  
  return livro.capitulos.find(c => c.capitulo === numeroCapitulo);
}

/**
 * Lógica de Pesquisa Global
 * Busca uma palavra em toda a Bíblia e retorna as ocorrências
 */
export function pesquisarNaBiblia(termo: string): ResultadoBusca[] {
  const termoNorm = normalizar(termo);
  if (termoNorm.length < 3) return []; 

  const resultados: ResultadoBusca[] = []; // CORRIGIDO: Tipagem explícita em vez de any
  const livros = getTodosLivros();

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
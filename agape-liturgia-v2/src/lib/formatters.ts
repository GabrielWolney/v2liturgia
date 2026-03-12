export function formatarTextoLiturgico(texto: string): string {
  if (!texto) return "";

  let html = texto;

  // 1. Remove textos intrusos como "Proclamação do Evangelho..." do meio do texto (se a API mandar sujo)
  html = html.replace(/^(Proclamação|Leitura|Início).+?:\s*/i, '');

  // 2. Transforma números soltos (versículos) em sobrescritos coloridos (ex: ¹² )
  // Procura por números no início de frases ou após espaços e os envolve na tag <sup>
  html = html.replace(
    /(^|\s|>|“|")(\d+)\s/gm,
    '$1<sup class="font-sans font-bold text-primary/80 text-[0.65em] align-super mr-1">$2</sup> '
  );

  // 3. Converte quebras de linha reais em tags <br> para manter os parágrafos espaçados
  html = html.replace(/\n/g, '<br /><br />');

  return html;
}

export function formatarSalmo(texto: string, refrao: string): string {
  if (!texto) return "";
  
  // Limpa o refrão se ele vier repetido no texto
  let html = texto.replace(new RegExp(`(—|R\\.|R:)?\\s*${refrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), '');
  
  // Transforma quebras de linha em <br> simples para o ritmo do Salmo (poesia)
  html = html.replace(/\n/g, '<br />');

  return html;
}
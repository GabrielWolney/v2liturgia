/**
 * Estilo idêntico ao da aba Bíblia
 */
const CLASSE_VERSICULO = "font-sans font-bold text-[#2F6BFF] text-[0.65em] align-super mr-1.5 ml-1 select-none";

export function formatarTextoLiturgico(texto: string): string {
  if (!texto) return "";

  let html = texto;

  
  html = html.replace(/^(Proclamação|Leitura|Início).+?:\s*/i, '');

  
  
  html = html.replace(/(?<![a-zA-Záàâãéèêíïóôõöúç\d])(\d+)(?!\d|[:\-])/g, (match, numero) => {
    return `<sup class="${CLASSE_VERSICULO}">${numero}</sup>`;
  });

  
  html = html.replace(/\n/g, '<br /><br />');

  return html;
}

export function formatarSalmo(texto: string, refrao: string): string {
  if (!texto) return "";
  
  let html = texto.replace(new RegExp(`(—|R\\.|R:)?\\s*${refrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'), '');
  
  
  html = html.replace(/(?<![a-zA-Záàâãéèêíïóôõöúç\d])(\d+)(?!\d|[:\-])/g, (match, numero) => {
    return `<sup class="${CLASSE_VERSICULO}">${numero}</sup>`;
  });

  html = html.replace(/\n/g, '<br />');

  return html;
}
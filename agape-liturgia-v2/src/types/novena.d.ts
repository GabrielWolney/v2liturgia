export interface NovenaCalendario {
  id: string;
  nome: string;
  mes: number;
  inicio: string; 
  fim: string;    
}

export interface NovenaDia {
  dia: number;
  texto: string;
}

export interface NovenaDetalhes {
  titulo: string;
  intro: string;
  oracaoInicial: string;
  oracaoFinal: string;
  dias: NovenaDia[];
}

export interface NovenasData {
  calendario: NovenaCalendario[];
  detalhes: Record<string, NovenaDetalhes>;
}
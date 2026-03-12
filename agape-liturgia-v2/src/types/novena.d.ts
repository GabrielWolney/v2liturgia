export interface NovenaCalendario {
  id: string;
  nome: string;
  mes: number;
  inicio: string; // Ex: "12-28"
  fim: string;    // Ex: "01-05"
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
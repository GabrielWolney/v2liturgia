export interface Versiculo {
  versiculo: number | string;
  texto: string;
}

export interface Capitulo {
  capitulo: number;
  versiculos: Versiculo[];
}

export interface LivroBiblia {
  nome: string;
  capitulos: Capitulo[];
}

export interface BibliaData {
  antigoTestamento: LivroBiblia[];
  novoTestamento: LivroBiblia[];
}
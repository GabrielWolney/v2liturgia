export interface LeituraV2 {
  referencia?: string;
  titulo?: string;
  texto: string;
  refrao?: string;
  tipo?: string; 
}

export interface LiturgiaDiaria {
  data: string;
  liturgia: string;
  cor: string;
  dia?: string;
  oracoes?: {
    coleta?: string;
    oferendas?: string;
    comunhao?: string;
    extras?: { titulo: string; texto: string; }[];
  };
  leituras?: {
    primeiraLeitura?: LeituraV2[];
    salmo?: LeituraV2[];
    segundaLeitura?: LeituraV2[];
    evangelho?: LeituraV2[];
    extras?: LeituraV2[];
  };
  antifonas?: {
    entrada?: string;
    comunhao?: string;
  };

  [key: string]: unknown; 
}
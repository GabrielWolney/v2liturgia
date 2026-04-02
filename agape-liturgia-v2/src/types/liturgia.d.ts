export interface Leitura {
  referencia: string;
  titulo: string;
  texto: string;
  refrao?: string; 
}

export interface LiturgiaDiaria {
  data: string;
  liturgia: string;
  cor: string;
  dia: string;
  oferendas: string;
  comunhao: string;
  primeiraLeitura?: Leitura;
  segundaLeitura?: Leitura | string; 
  salmo?: Leitura;
  evangelho?: Leitura;
  [key: string]: Leitura | string | undefined; 
}
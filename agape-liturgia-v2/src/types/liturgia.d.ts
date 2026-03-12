// Define o formato exato que esperamos da API de Liturgia
export interface Leitura {
  referencia: string;
  titulo: string;
  texto: string;
  refrao?: string; // <-- ADICIONAMOS ISTO AQUI!
}

export interface LiturgiaDiaria {
  data: string;
  liturgia: string;
  cor: string;
  dia: string;
  oferendas: string;
  comunhao: string;
  primeiraLeitura: Leitura;
  segundaLeitura?: Leitura | string; // Opcional, pois nem todo dia tem
  salmo: Leitura;
  evangelho: Leitura;
}
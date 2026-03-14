export function getFormattedDate(): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}

export function getDataIso(): string {
  return new Date().toLocaleDateString("en-CA"); // Retorna YYYY-MM-DD
}

// REGRA: Identificação Visual (Cores)
export function getCorLiturgica(tituloLiturgia: string, corApi: string): string {
  const titulo = (tituloLiturgia || "").toLowerCase();
  let corBase = (corApi || "Branco").toLowerCase();

  if (titulo.includes("tempo comum")) corBase = "verde";
  else if (titulo.includes("quaresma") || titulo.includes("advento")) corBase = "roxo";
  else if (titulo.includes("mártir") || titulo.includes("paixão")) corBase = "vermelho";

  if (corBase.includes("verde")) return "verde";
  if (corBase.includes("roxo")) return "roxo";
  if (corBase.includes("vermelho")) return "vermelho";
  if (corBase.includes("rosa")) return "rosa";
  return "branco";
}

// REGRA: Jejum (Quarta de Cinzas e Sexta Santa)
export function isDiaDeJejum(tituloLiturgia: string): boolean {
  const titulo = (tituloLiturgia || "").toLowerCase();
  return (titulo.includes("cinzas") && titulo.includes("quarta")) || titulo.includes("paixão do senhor");
}

// REGRA: Mistérios do Terço
export function obterMisterioDoDia() {
  const diaSemana = new Date().getDay();
  if (diaSemana === 0 || diaSemana === 3) return { tipo: "Gloriosos"};
  if (diaSemana === 1 || diaSemana === 6) return { tipo: "Gozosos",};
  if (diaSemana === 2 || diaSemana === 5) return { tipo: "Dolorosos",};
  return { tipo: "Luminosos"};
}

// REGRA: Status da Novena
export function getNovenaStatus(inicioStr: string, fimStr: string): 'agora' | 'breve' | 'fim' {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const anoAtual = hoje.getFullYear();
  const mesAtual = hoje.getMonth() + 1;

  const [mIni, dIni] = inicioStr.split('-').map(Number);
  const [mFim, dFim] = fimStr.split('-').map(Number);
  
  let anoInicio = anoAtual;
  if (mIni > mFim && mesAtual <= mFim) anoInicio = anoAtual - 1;
  
  const dataInicio = new Date(anoInicio, mIni - 1, dIni);
  const dataFim = new Date(anoInicio, mFim - 1, dFim);
  if (dataFim < dataInicio) dataFim.setFullYear(dataFim.getFullYear() + 1);

  if (hoje >= dataInicio && hoje <= dataFim) return 'agora';
  if (hoje < dataInicio) return 'breve';
  return 'fim';
}

export function getImagemPorCor(cor: string): string {
  const c = cor.toLowerCase();
  const mapaImagens: Record<string, string> = {
    verde: "/liturgia/verde.png",
    roxo: "/liturgia/roxo.png",
    vermelho: "/liturgia/vermelho.png",
    rosa: "/liturgia/rosa.png",
    branco: "/liturgia/branco.png",
  };
  return mapaImagens[c] || "/liturgia/verde.png"; 
}

// Função auxiliar segura contra Fuso Horário (DST - Horário de Verão)
function diffDias(dataMenor: Date, dataMaior: Date): number {
  const utc1 = Date.UTC(dataMenor.getFullYear(), dataMenor.getMonth(), dataMenor.getDate());
  const utc2 = Date.UTC(dataMaior.getFullYear(), dataMaior.getMonth(), dataMaior.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

// =====================================================================
// REGRA: MOTOR CALENDÁRIO LITÚRGICO (ALGORITMO ASTRONÔMICO)
// =====================================================================
export function calcularProgressoTempo(tituloLiturgia: string) {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();

  // 1. ALGORITMO DE MEEUS/JONES/BUTCHER PARA O DOMINGO DE PÁSCOA
  // (A fórmula matemática que a Igreja Católica usa para definir o calendário)
  const a = anoAtual % 19;
  const b = Math.floor(anoAtual / 100);
  const c = anoAtual % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  const pascoa = new Date(anoAtual, month, day);

  // 2. CALCULAR AS DATAS ÂNCORA MÓVEIS
  const cinzas = new Date(pascoa);
  cinzas.setDate(pascoa.getDate() - 46); // A Quarta de Cinzas é sempre 46 dias antes da Páscoa

  const pentecostes = new Date(pascoa);
  pentecostes.setDate(pascoa.getDate() + 49); // Pentecostes é 49 dias depois da Páscoa

  // 3. CALCULAR O ADVENTO E NATAL (Fixo de Dezembro)
  const natal = new Date(anoAtual, 11, 25);
  const offset = natal.getDay() === 0 ? 7 : natal.getDay(); // Quantos dias voltar para o Domingo
  const advento = new Date(natal);
  advento.setDate(natal.getDate() - offset - 21); // O 1º Dom. do Advento é 4 domingos antes do Natal

  const batismoAnt = new Date(anoAtual, 0, 13); // Data aproximada do fim do tempo do Natal (Batismo)

  // 4. LÓGICA DE ATRIBUIÇÃO
  let nome = "Tempo Comum";
  let diaAtual = 1;
  let totalDias = 238;

  if (hoje >= cinzas && hoje < pascoa) {
    // QUARESMA (Das Cinzas até o Sábado Santo)
    nome = "Quaresma";
    totalDias = 46; // Na Liturgia, o tempo real corrido no calendário é de 46 dias.
    diaAtual = diffDias(cinzas, hoje) + 1;
  } 
  else if (hoje >= pascoa && hoje <= pentecostes) {
    // PÁSCOA
    nome = "Páscoa";
    totalDias = 50;
    diaAtual = diffDias(pascoa, hoje) + 1;
  } 
  else if (hoje >= advento && hoje < natal) {
    // ADVENTO
    nome = "Advento";
    totalDias = diffDias(advento, natal);
    diaAtual = diffDias(advento, hoje) + 1;
  } 
  else if (hoje >= natal || hoje <= batismoAnt) {
    // NATAL
    nome = "Natal";
    totalDias = 20; 
    const refNatal = hoje >= natal ? natal : new Date(anoAtual - 1, 11, 25);
    diaAtual = diffDias(refNatal, hoje) + 1;
  } 
  else {
    // TEMPO COMUM
    nome = "Tempo Comum";
    totalDias = 238; // Aproximadamente 34 semanas
    
    // Parte 1: Entre o Batismo e as Cinzas
    if (hoje > batismoAnt && hoje < cinzas) {
        diaAtual = diffDias(batismoAnt, hoje) + 1;
    } 
    // Parte 2: Entre Pentecostes e o Advento
    else if (hoje > pentecostes && hoje < advento) {
        const diasBloco1 = diffDias(batismoAnt, cinzas);
        const diasBloco2 = diffDias(pentecostes, hoje);
        diaAtual = diasBloco1 + diasBloco2;
    }
  }

  // Prevenir falhas visuais no anel (caso ocorram viragens de dia bizarras no fuso horário do telemóvel)
  if (diaAtual > totalDias) diaAtual = totalDias;
  if (diaAtual < 1) diaAtual = 1;

  // 5. MATEMÁTICA DO CÍRCULO SVG
  const dasharray = 263.89;
  const progresso = diaAtual / totalDias;
  const dashoffset = dasharray - (dasharray * progresso);

  return { nome, diaAtual, totalDias, dasharray, dashoffset };
}
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
  if (diaSemana === 0 || diaSemana === 3) return { tipo: "Gloriosos", foco: "Esperança e Céu" };
  if (diaSemana === 1 || diaSemana === 6) return { tipo: "Gozosos", foco: "Alegria e Humildade" };
  if (diaSemana === 2 || diaSemana === 5) return { tipo: "Dolorosos", foco: "Coragem e Arrependimento" };
  return { tipo: "Luminosos", foco: "Luz e Conversão" };
}

// REGRA: Status da Novena (Trata a virada de ano)
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
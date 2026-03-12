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

// REGRA: Motor de Progresso do Tempo Litúrgico
export function calcularProgressoTempo(tituloLiturgia: string) {
  const titulo = (tituloLiturgia || "").toLowerCase();
  let nome = "Tempo Comum";
  let totalDias = 238; // ~34 semanas
  
  if (titulo.includes("quaresma")) { nome = "Quaresma"; totalDias = 40; }
  else if (titulo.includes("páscoa") || titulo.includes("pascoa")) { nome = "Páscoa"; totalDias = 50; }
  else if (titulo.includes("advento")) { nome = "Advento"; totalDias = 28; }
  else if (titulo.includes("natal")) { nome = "Natal"; totalDias = 15; }

  // Extrair o número da semana (ex: "3ª Semana" -> 3)
  const semanaMatch = titulo.match(/(\d+)[ªa]/);
  const semana = semanaMatch ? parseInt(semanaMatch[1]) : 1;

  // Extrair o dia da semana
  let diaSemana = 1; // Domingo é o dia 1 da semana litúrgica
  if (titulo.includes("segunda")) diaSemana = 2;
  if (titulo.includes("terça") || titulo.includes("terca")) diaSemana = 3;
  if (titulo.includes("quarta")) diaSemana = 4;
  if (titulo.includes("quinta")) diaSemana = 5;
  if (titulo.includes("sexta")) diaSemana = 6;
  if (titulo.includes("sábado") || titulo.includes("sabado")) diaSemana = 7;

  // Cálculo do dia atual
  let diaAtual = ((semana - 1) * 7) + diaSemana;
  
  // Ajuste para a Quaresma (que começa na Quarta-feira de Cinzas)
  if (nome === "Quaresma") diaAtual += 3;

  // Prevenção de bugs
  if (diaAtual > totalDias) diaAtual = totalDias;
  if (diaAtual < 1) diaAtual = 1;

  // Matemática para o Círculo SVG (Perímetro = 2 * PI * Raio 42 = ~263.89)
  const dasharray = 263.89;
  const progresso = diaAtual / totalDias;
  const dashoffset = dasharray - (dasharray * progresso);

  return { nome, diaAtual, totalDias, dasharray, dashoffset };
}
export function getImagemPorCor(cor: string): string {
  const c = cor.toLowerCase();
  // Mapeia a cor para o arquivo correspondente na pasta public/liturgia
  const mapaImagens: Record<string, string> = {
    verde: "/liturgia/verde.png",
    roxo: "/liturgia/roxo.png",
    vermelho: "/liturgia/vermelho.png",
    rosa: "/liturgia/rosa.png",
    branco: "/liturgia/branco.png",
  };

  return mapaImagens[c] || "/liturgia/verde.png"; // Fallback para verde
}
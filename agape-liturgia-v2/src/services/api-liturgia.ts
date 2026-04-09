import { LiturgiaDiaria } from "@/types/liturgia";

export async function getLiturgiaDoDia(): Promise<LiturgiaDiaria | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Aumentei para 5s por segurança

    // 1. Pega a data exata no fuso horário de Brasília (evita o erro do servidor UTC)
    const dataBR = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const dia = String(dataBR.getDate()).padStart(2, '0');
    const mes = String(dataBR.getMonth() + 1).padStart(2, '0');
    const ano = dataBR.getFullYear();

    // 2. Coloca a data no URL. Assim o Next.js sabe que hoje é um dia NOVO e quebra o cache de ontem!
    const url = `https://liturgia.up.railway.app/v2/?dia=${dia}&mes=${mes}&ano=${ano}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Reduzimos o cache de 12h para apenas 1 hora
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error('Falha ao buscar liturgia');
    }

    const data: LiturgiaDiaria = await res.json();
    return data;
  } catch (error) {
    console.error("Erro na API de Liturgia (ou Timeout):", error);
    return null;
  }
}
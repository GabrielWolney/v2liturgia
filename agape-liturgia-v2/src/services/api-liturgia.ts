import { LiturgiaDiaria } from "@/types/liturgia";

export async function getLiturgiaDoDia(): Promise<LiturgiaDiaria | null> {
  try {
    // REGRA V1: Timeout de 3 segundos para não travar o app se a API cair
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://liturgia.up.railway.app/', {
      next: { revalidate: 43200 }, // Cache de 12h
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
    // Aqui retornamos nulo. Na UI, se for nulo, injetamos o "Modo Offline" ou mensagem de erro.
    return null;
  }
}
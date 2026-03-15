import { LiturgiaDiaria } from "@/types/liturgia";

export async function getLiturgiaDoDia(): Promise<LiturgiaDiaria | null> {
  try {
    
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
    
    return null;
  }
}
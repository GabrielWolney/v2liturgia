import { LiturgiaDiaria } from "@/types/liturgia";

export async function getLiturgiaDoDia(): Promise<LiturgiaDiaria | null> {
  const dataBR = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const dia = String(dataBR.getDate()).padStart(2, '0');
  const mes = String(dataBR.getMonth() + 1).padStart(2, '0');
  const ano = dataBR.getFullYear();
  const cacheKey = `agape-liturgia-${ano}-${mes}-${dia}`;

  // 1. OFFLINE-FIRST: Tenta recuperar do localStorage (rápido e funciona sem internet)
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached) as LiturgiaDiaria;
      }
    } catch (e) {
      console.warn("Falha ao ler cache local da liturgia", e);
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const url = `https://liturgia.up.railway.app/v2/?dia=${dia}&mes=${mes}&ano=${ano}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error('Falha ao buscar liturgia');
    }

    const data: LiturgiaDiaria = await res.json();

    // 2. Salva no localStorage para as próximas vezes (e para modo offline)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (e) {
        console.warn("Falha ao gravar cache local da liturgia", e);
      }
    }

    return data;
  } catch (error) {
    console.error("Erro na API de Liturgia (ou Offline):", error);
    
    // Fallback: se houver erro e tivermos em cache, usamos o cache (já verificado no topo, mas garantimos aqui)
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached) as LiturgiaDiaria;
    }
    
    return null;
  }
}
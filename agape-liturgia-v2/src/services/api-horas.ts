import * as cheerio from 'cheerio';

export type HoraLiturgica = 'oficio-das-leituras' | 'laudes' | 'hora-media' | 'vesperas' | 'completas';

export interface BlocoHora {
  tipo: 'titulo' | 'subtitulo' | 'texto' | 'rubrica' | 'antifona';
  conteudo: string;
}

export interface LiturgiaHorasDia {
  titulo: string;
  blocos: BlocoHora[];
}

export async function getLiturgiaDasHoras(tipo: HoraLiturgica): Promise<LiturgiaHorasDia | null> {
  try {
    let url = `https://liturgiadashoras.online/${tipo}/`;

    // Tentar sempre buscar a URL exata do dia na homepage primeiro.
    // As URLs genéricas (como /laudes/) muitas vezes sofrem de cache (Vercel/WordPress) e apontam para dias passados.
    try {
      const homeResponse = await fetch('https://liturgiadashoras.online/', { next: { revalidate: 3600 } });
      const homeHtml = await homeResponse.text();
      const $home = cheerio.load(homeHtml);
      
      const linkDia = $home('a').filter((i, el) => {
        const t = $home(el).text().toLowerCase();
        if (tipo === 'hora-media') {
          return t.includes('hora sexta') || t.includes('hora terça') || t.includes('hora nona');
        }
        if (tipo === 'oficio-das-leituras') return t.includes('ofício');
        if (tipo === 'vesperas') return t.includes('véspera');
        return t.includes(tipo);
      }).first().attr('href');
      
      if (linkDia) {
        url = linkDia;
      }
    } catch (e) {
      console.warn("Falha ao tentar obter link exato da homepage, caindo para URL genérica.", e);
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Restaurado para 1h para manter alta performance
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar ${tipo}`);
    }

    return processarHtml(await response.text());

  } catch (error) {
    console.error("Erro no Scraping da Liturgia das Horas:", error);
    return null;
  }
}

function processarHtml(html: string): LiturgiaHorasDia {
  const $ = cheerio.load(html);

  let mainTitle = $("h1.entry-title").first().text().trim();
  if (!mainTitle) mainTitle = $("title").first().text().trim().split('–')[0].trim();

  // LIMPEZA PROFUNDA DO DOM ANTES DO PARSING
  // Remove scripts, estilos, iframes e blocos de embed do WP
  $('script, style, iframe, noscript, .su-youtube, .wp-block-embed').remove();
  
  // Encontrar e remover elementos que contêm texto de spam do YouTube ou links indesejados
  // Filtramos apenas por parágrafos, spans, a e iframes para não apagar divs completas sem querer
  $('p, span, a, div.su-youtube').each((i, el) => {
    const text = $(el).text().toLowerCase();
    const isAnchor = el.tagName.toLowerCase() === 'a';
    const href = isAnchor ? $(el).attr('href') || '' : '';
    
    if (
      href.includes('youtube.com') || 
      href.includes('youtu.be') ||
      text === 'veja no youtube' ||
      text === 'veja no youtube.' ||
      text.includes('inscreva-se no canal') ||
      text === 'compartilhe'
    ) {
      $(el).remove();
    }
  });

  const blocos: BlocoHora[] = [];
  const keywordsToRemove = ['veja no youtube', 'adsbygoogle', 'compartilhe', 'youtube', 'inscreva-se', 'canal', 'clique aqui'];

  $('.entry-content p, .entry-content h2, .entry-content h3, .entry-content h4, .entry-content div').each((i, el) => {
    // Substituir <br> por \n para manter a estrutura poética
    $(el).find('br').replaceWith('\n');
    
    const tag = el.tagName.toLowerCase();
    const rawText = $(el).text().trim();

    if (!rawText || rawText.length < 2) return;
    
    // Alguns ofícios juntam "Salmodia\n\nAnt. 1..." no mesmo parágrafo. Vamos separar!
    const parts = rawText.split(/\n{2,}/);
    
    parts.forEach(text => {
      text = text.trim();
      if (text.length < 2) return;
      
      const lowerText = text.toLowerCase();
      if (keywordsToRemove.some(kw => lowerText.includes(kw))) return;

      if (tag.startsWith('h')) {
        blocos.push({ tipo: 'titulo', conteudo: text });
      } else {
        const htmlContent = $(el).html() || '';
        
        // FORÇAR TÍTULOS PRINCIPAIS
        const titleKeywords = [
          'Hino', 'Salmodia', 'Cântico Evangélico', 'Leitura breve', 'Preces', 'Oração', 'Conclusão',
          'Primeira leitura', 'Segunda leitura', 'Te Deum', 'Responsório'
        ];
        
        if (titleKeywords.includes(text) || text.startsWith('Salmo ') || text.startsWith('Cântico ')) {
          blocos.push({ tipo: 'titulo', conteudo: text });
        }
        else if (text.startsWith('Ant. ') || text.startsWith('Ant.')) {
          blocos.push({ tipo: 'antifona', conteudo: text });
        }
        // Detetar subtítulos que estão em negrito ou itálico (Antífonas/Rubricas)
        else if ((htmlContent.startsWith('<b') || htmlContent.startsWith('<strong')) && text.length < 150) {
          blocos.push({ tipo: 'subtitulo', conteudo: text });
        } 
        else if ((htmlContent.startsWith('<i') || htmlContent.startsWith('<em')) && text.length < 150) {
          blocos.push({ tipo: 'rubrica', conteudo: text });
        }
        else {
          blocos.push({ tipo: 'texto', conteudo: text });
        }
      }
    });
  });

  return {
    titulo: mainTitle,
    blocos
  };
}

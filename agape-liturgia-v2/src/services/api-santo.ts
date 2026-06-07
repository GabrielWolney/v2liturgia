import * as cheerio from 'cheerio';

export interface SantoDoDia {
  titulo: string;
  imagem: string;
  historia: string[];
  fonte: string;
}

export async function getSantoDoDia(): Promise<SantoDoDia | null> {
  try {
    const url = "https://santo.cancaonova.com/";
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache na Vercel por 1h
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar Santo do Dia");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Extrair Título
    let titulo = $("h1.entry-title").first().text().trim();
    if (!titulo) titulo = $("h1").first().text().trim();

    // 2. Extrair Imagem
    let imagemUrl = "";
    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const className = $(el).attr("class") || "";
      // A imagem do santo costuma ter 'wp-image' na class ou estar na pasta uploads
      if (!imagemUrl && (className.includes("wp-image") || src.includes("uploads/sites"))) {
        imagemUrl = src;
      }
    });

    // 3. Extrair Conteúdo (História) e Outros Santos (Listas)
    const contentHtml = $(".entry-content").html() || $("article").html();
    const conteudos: string[] = [];

    if (contentHtml) {
      const $content = cheerio.load(contentHtml);
      // Remove scripts, styles e lixo
      $content('script, style, div.sharedaddy, div.jp-relatedposts').remove();
      
      // Itera por todos os elementos no nível principal
      $content("p, ul, ol, h2, h3, h4, h5, h6").each((i, el) => {
        const tagName = el.tagName.toLowerCase();
        
        if (tagName === "p") {
          const text = $content(el).text().trim();
          const htmlContent = $content(el).html() || "";
          
          if (text && text.length > 0) {
            const lower = text.toLowerCase();
            if (
              lower.includes("compartilhe no") || 
              lower.includes("whatsapp") || 
              lower.includes("facebook") || 
              lower.includes("twitter") || 
              lower.includes("telegram") ||
              lower === "compartilhe:" ||
              lower === "compartilhe"
            ) {
              return;
            }

            // Se o parágrafo começar com negrito e for curto, é um título
            if ((htmlContent.startsWith("<b") || htmlContent.startsWith("<strong")) && text.length < 150) {
               conteudos.push(`### ${text}`);
            } else if (text.length > 20) {
               conteudos.push(text);
            }
          }
        } else if (tagName.startsWith("h")) {
          const text = $content(el).text().trim();
          if (text) {
            const lower = text.toLowerCase();
            if (
              lower.includes("compartilhe no") || 
              lower.includes("whatsapp") || 
              lower.includes("facebook") || 
              lower.includes("twitter") || 
              lower.includes("telegram") ||
              lower === "compartilhe:" ||
              lower.startsWith("compartilhe") ||
              lower.includes("compartilhar")
            ) {
              return;
            }
            // Normalizar espaços no título
            const cleanedText = text.replace(/\s+/g, ' ').trim();
            conteudos.push(`### ${cleanedText}`);
          }
        } else if (tagName === "ul" || tagName === "ol") {
          $content(el).find("li").each((_, li) => {
            const liText = $content(li).text().trim();
            if (liText) {
              const lower = liText.toLowerCase();
              if (
                lower.includes("compartilhe no") || 
                lower.includes("whatsapp") || 
                lower.includes("facebook") || 
                lower.includes("twitter") || 
                lower.includes("telegram") ||
                lower === "compartilhe:" ||
                lower.startsWith("compartilhe")
              ) {
                return;
              }
              // Normalizar espaços e quebras de linha que o Cheerio pode deixar
              const cleanedText = liText.replace(/\s+/g, ' ').trim();
              conteudos.push(`• ${cleanedText}`);
            }
          });
        }
      });
    }

    return {
      titulo: titulo || "Santo do Dia",
      imagem: imagemUrl,
      historia: conteudos,
      fonte: "Canção Nova"
    };

  } catch (error) {
    console.error("Erro no Scraping Santo do Dia:", error);
    return null;
  }
}

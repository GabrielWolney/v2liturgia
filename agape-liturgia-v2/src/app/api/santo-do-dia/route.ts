import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
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
    const imgElement = $(".entry-content img").first();
    if (imgElement.length) {
      imagemUrl = imgElement.attr("src") || "";
    } else {
      imagemUrl = $("article img").first().attr("src") || "";
    }

    // 3. Extrair Conteúdo (História)
    const contentHtml = $(".entry-content").html();
    const conteudos: string[] = [];

    if (contentHtml) {
      const $content = cheerio.load(contentHtml);
      // Remove scripts, styles e divs desnecessários
      $content('script, style, div.sharedaddy, div.jp-relatedposts').remove();
      
      $content("p").each((i, el) => {
        const text = $content(el).text().trim();
        if (text && text.length > 20) { // ignorar parágrafos vazios ou curtos (ex: botões)
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
          conteudos.push(text);
        }
      });
    }

    // Retornar objeto limpo
    return NextResponse.json({
      titulo: titulo || "Santo do Dia",
      imagem: imagemUrl,
      historia: conteudos,
      fonte: "Canção Nova"
    });

  } catch (error) {
    console.error("Erro na API Santo do Dia:", error);
    return NextResponse.json({ erro: "Não foi possível carregar o Santo do Dia." }, { status: 500 });
  }
}

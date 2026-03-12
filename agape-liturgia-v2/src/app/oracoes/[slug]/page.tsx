import Link from "next/link";
import { dbOracoes } from "@/lib/prayers-data";
import { notFound } from "next/navigation";

export default async function OracaoLeituraPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const oracao = dbOracoes[slug];

  if (!oracao) {
    notFound(); 
  }

  // Prepara o texto trocando quebras de linha por <br/>
  const htmlTexto = oracao.texto.replace(/\n/g, '<br />');

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FA] flex flex-col font-sans pb-32 selection:bg-[#2F6BFF]/30">
      
      {/* HEADER NAVEGAÇÃO FIXA */}
      <header className="sticky top-0 z-50 bg-[#F5F7FA]/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full">
        <Link 
          href="/oracoes"
          className="text-[#6B6B6B] hover:text-[#1F1F1F] transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 active:scale-95 shrink-0"
        >
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </Link>
        <span className="font-extrabold text-[#6B6B6B] text-xs uppercase tracking-widest">
          Oração
        </span>
        <div className="w-10 h-10"></div> {/* Espaçador */}
      </header>

      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 pt-8 animate-fade-in">
        
        {/* TÍTULO DA ORAÇÃO */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="material-symbols-rounded text-[#2F6BFF]/40 text-5xl mb-4 drop-shadow-sm">self_improvement</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F1F1F] font-serif tracking-tight mb-6 px-4">
            {oracao.titulo}
          </h1>
          <div className="w-16 h-1.5 bg-[#2F6BFF] rounded-full"></div>
        </div>

        {/* TEXTO DA ORAÇÃO */}
        <article className="bg-white p-8 md:p-12 rounded-[2rem] shadow-soft border border-slate-100">
          <div 
            className="font-serif text-lg md:text-xl leading-[2.2] text-[#1F1F1F] text-center whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: htmlTexto }}
          />
        </article>

        {/* ÍCONE DE RODAPÉ (Ponto de Foco) */}
        <div className="mt-12 text-center flex justify-center opacity-30">
          <span className="material-symbols-rounded text-4xl">church</span>
        </div>

      </main>

    </div>
  );
}
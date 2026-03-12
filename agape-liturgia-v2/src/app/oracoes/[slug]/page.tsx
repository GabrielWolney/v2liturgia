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
    <div className="max-w-[750px] mx-auto w-full flex flex-col pt-8 md:pt-12 px-5 sm:px-8 md:px-0 animate-fade-in pb-32">
      
      {/* BOTÃO VOLTAR */}
      <Link href="/oracoes" className="text-slate-400 hover:text-blue-600 flex items-center gap-1 mb-8 transition-colors self-start bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm active:scale-95">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        <span className="text-sm font-bold">Voltar</span>
      </Link>

      {/* HEADER DA ORAÇÃO */}
      <header className="mb-10 text-center flex flex-col items-center">
        <span className="material-symbols-rounded text-blue-100 text-5xl mb-4">self_improvement</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-serif tracking-tight mb-6">
          {oracao.titulo}
        </h1>
        <div className="w-16 h-1 bg-blue-200 rounded-full"></div>
      </header>

      {/* TEXTO DA ORAÇÃO */}
      <article className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-soft border border-slate-100">
        <div 
          className="font-serif text-lg md:text-xl leading-[2.2] text-slate-800 text-center whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: htmlTexto }}
        />
      </article>

      {/* ÍCONE DE RODAPÉ */}
      <div className="mt-12 text-center text-slate-300 flex justify-center">
        <span className="material-symbols-rounded text-4xl">church</span>
      </div>

    </div>
  );
}
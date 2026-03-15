import { formatarTextoLiturgico } from "@/lib/formatters";

interface LeituraBlocoProps {
  tipo: string; 
  referencia: string;
  texto: string;
  isDestaque?: boolean; 
}

export function LeituraBloco({ tipo, referencia, texto, isDestaque = false }: LeituraBlocoProps) {
  if (!texto || texto.length < 5) return null;

  const htmlFormatado = formatarTextoLiturgico(texto);

  return (
    <section className={`mb-12 ${isDestaque ? 'bg-primary/5 p-6 md:p-10 rounded-[2rem] border border-primary/10' : ''}`}>
      <h2 className="font-sans text-sm font-bold text-primary uppercase tracking-widest mb-1">
        {tipo}
      </h2>
      <p className="font-sans text-xs font-semibold text-muted mb-6">
        {referencia}
      </p>
      
      {/* dangerouslySetInnerHTML é usado no React para injetar nosso HTML seguro (os <sup> dos versículos) */}
      <div 
        className="font-serif text-readable leading-[1.85] text-foreground text-justify"
        dangerouslySetInnerHTML={{ __html: htmlFormatado }}
      />
    </section>
  );
}
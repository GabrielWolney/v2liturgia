import Link from "next/link";

export default function LiturgiaPage() {
  return (
    <div className="max-w-[800px] mx-auto w-full flex flex-col items-center justify-center pt-20 px-4 animate-fade-in">
      <span className="material-symbols-rounded text-6xl text-primary/30 mb-4">menu_book</span>
      <h1 className="text-2xl font-bold text-foreground font-serif text-center mb-2">
        Acervo de Liturgias
      </h1>
      <p className="text-muted text-center mb-8">
        Esta seção está a ser preparada. Por enquanto, acompanhe a Liturgia de hoje na página inicial.
      </p>
      <Link href="/" className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">
        Ir para a Liturgia de Hoje
      </Link>
    </div>
  );
}
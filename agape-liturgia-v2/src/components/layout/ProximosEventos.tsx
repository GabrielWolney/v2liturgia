import { eventos2026 } from "@/data/eventos-2026";
import Link from "next/link"; // Adicionamos a importação do Link

export function ProximosEventos() {
  const hoje = new Date();
  const chaveHoje = `${hoje.getDate()}-${hoje.getMonth() + 1}`;
  const eventoHoje = eventos2026[chaveHoje];

  return (
    <section className="bg-card rounded-[2rem] p-6 border border-border shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-rounded text-primary">event_note</span>
          <h3 className="font-bold text-foreground italic">Agenda Ágape 2026</h3>
        </div>

        {eventoHoje ? (
          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-rounded">notification_important</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">Acontece Hoje</p>
              <h4 className="font-bold text-foreground leading-tight">{eventoHoje.titulo}</h4>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted italic">Nenhum evento para hoje.</p>
          </div>
        )}
      </div>
      
      {/* Aqui transformamos o button num Link real apontando para /calendario */}
      <Link href="/calendario" className="w-full mt-6 py-3 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors text-center block">
        Ver calendário completo
      </Link>
    </section>
  );
}
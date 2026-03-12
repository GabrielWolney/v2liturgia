"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "home", label: "Liturgia Diária" },
    { href: "/mural", icon: "volunteer_activism", label: "Mural de Oração" },
    { href: "/biblia", icon: "menu_book", label: "Bíblia Sagrada" },
    { href: "/oracoes", icon: "self_improvement", label: "Devocionário" },
    { href: "/novenas", icon: "event", label: "Novenas" },
    { href: "/confissao", icon: "clean_hands", label: "Confissão" },
    { href: "/calendario", icon: "calendar_month", label: "Calendário" },
    { href: "/anotacoes", icon: "edit_note", label: "Meu Diário" },
  ];

  return (
    <aside className="hidden md:flex w-72 h-full bg-card border-r border-border flex-col p-8 shrink-0 fixed left-0 top-0 z-50 overflow-y-auto transition-colors duration-300">
      
      <div className="flex items-center gap-4 mb-10 border-b border-border pb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/30 shrink-0">
          <span className="material-symbols-rounded">dove</span>
        </div>
        <div>
          <h1 className="font-extrabold text-readable text-foreground tracking-tight leading-none">App Ágape</h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Grupo de Jovens</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          <li className="px-3 text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Menu Principal</li>
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted hover:bg-background hover:text-primary"
                  }`}
                >
                  <span className="material-symbols-rounded text-[20px] opacity-80">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 pt-6 border-t border-border">
        <Link 
          href="/admin" 
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-muted hover:bg-background hover:text-foreground transition-all group"
        >
          <span className="material-symbols-rounded text-[20px] group-hover:rotate-45 transition-transform">
            settings
          </span>
          Painel de Admin
        </Link>
      </div>

    </aside>
  );
}

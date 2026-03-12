"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "home", label: "Liturgia" },
    { href: "/mural", icon: "volunteer_activism", label: "Mural" },
    { href: "/biblia", icon: "menu_book", label: "Bíblia" },
    { href: "/confissao", icon: "clean_hands", label: "Confissão" },
    { href: "/menu", icon: "grid_view", label: "Menu" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card/90 backdrop-blur-md border-t border-border pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)] transition-colors duration-300">
      <ul className="flex justify-around items-center h-16 sm:h-20 px-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link 
                href={item.href} 
                className="flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform"
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${isActive ? "bg-primary/10 text-primary" : "text-muted"}`}>
                  <span className="material-symbols-rounded text-[22px] sm:text-[24px]">
                    {item.icon}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"></span>
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold transition-colors duration-300 ${isActive ? "text-primary" : "text-muted"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

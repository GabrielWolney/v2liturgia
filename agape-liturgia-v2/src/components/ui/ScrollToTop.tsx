"use client";

import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = (e?: Event) => {
      const target = e?.target as Document | Element;
      const scrollTop = 
        window.scrollY || 
        document.documentElement.scrollTop || 
        document.body.scrollTop || 
        (target && 'scrollTop' in target ? target.scrollTop : 0);
      
      if (scrollTop > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true, capture: true });
    
    toggleVisibility(); 
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility, { capture: true });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl border-2 flex items-center justify-center transition-all duration-300 ease-in-out bg-card text-primary border-border hover:brightness-105 active:scale-95 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
    >
      <span className="material-symbols-rounded text-[24px] sm:text-[28px] font-black">arrow_upward</span>
    </button>
  );
}
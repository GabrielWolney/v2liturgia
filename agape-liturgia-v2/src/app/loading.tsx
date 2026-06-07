import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl transition-all duration-500">
      <div className="relative flex items-center justify-center">
        {/* Anéis de carregamento */}
        <div className="absolute w-40 h-40 border-[3px] border-primary/10 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-[120px] h-[120px] border-[3px] border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        
        {/* Logo flutuante */}
        <div className="relative z-10 animate-float bg-card p-2 rounded-[2.2rem] shadow-2xl border border-border">
          <Image 
            src="/icon-192x192.png" 
            alt="Logo Ágape" 
            width={88}
            height={88}
            className="w-[88px] h-[88px] rounded-[1.8rem]" 
            priority
          />
        </div>
      </div>
      
      <p className="mt-12 font-bold text-muted uppercase tracking-[0.25em] text-[10px] animate-pulse">
        Preparando...
      </p>
    </div>
  );
}

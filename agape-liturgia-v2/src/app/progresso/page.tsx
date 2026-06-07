"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { trackEvent } from "@/lib/analytics";
import { subscribeToContador } from "@/services/db-home";
import { getDataIso } from "@/lib/date-utils";
import { useSound } from "@/hooks/useSound";
import { useHaptics } from "@/hooks/useHaptics";

export default function ProgressoPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [leiturasComunidade, setLeiturasComunidade] = useState(0);
  const [tercosComunidade, setTercosComunidade] = useState(0);
  const [oficiosComunidade, setOficiosComunidade] = useState(0);

  const { modoVisual, tamanhoFonte, streak, ultimaAtividade, leiturasConcluidas, tercosConcluidos, oficiosConcluidos } = useUserStore();
  const { playPop } = useSound();
  const { triggerHaptic } = useHaptics();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    trackEvent("page_view", { page_name: "progresso_espiritual" });

    const dataHoje = getDataIso();

    const unsubLeituras = subscribeToContador(dataHoje, 'leitura', setLeiturasComunidade);
    const unsubTercos = subscribeToContador(dataHoje, 'terco', setTercosComunidade);
    const unsubOficios = subscribeToContador(dataHoje, 'oficio', setOficiosComunidade);

    return () => {
      clearTimeout(timer);
      unsubLeituras();
      unsubTercos();
      unsubOficios();
    };
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-background" />;

  // --- ESTATÍSTICAS PESSOAIS NESTE MÊS ---
  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth() + 1;
  const anoAtual = dataAtual.getFullYear();

  const leiturasEsteMes = Object.keys(leiturasConcluidas).filter(dataIso => {
    const [ano, mes] = dataIso.split('-').map(Number);
    return ano === anoAtual && mes === mesAtual;
  }).length;

  const tercosEsteMes = Object.keys(tercosConcluidos).filter(dataIso => {
    const [ano, mes] = dataIso.split('-').map(Number);
    return ano === anoAtual && mes === mesAtual;
  }).length;

  const oficiosEsteMes = Object.keys(oficiosConcluidos || {}).filter(dataIso => {
    const [ano, mes] = dataIso.split('-').map(Number);
    return ano === anoAtual && mes === mesAtual;
  }).length;

  // --- HISTÓRICO DOS ÚLTIMOS 7 DIAS ---
  const ultimos7Dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dataIso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const diaSemana = d.toLocaleDateString('pt-PT', { weekday: 'short' }).replace('.', '');

    ultimos7Dias.push({
      diaSemana,
      dataIso,
      leitura: !!leiturasConcluidas[dataIso],
      terco: !!tercosConcluidos[dataIso],
      oficio: !!(oficiosConcluidos && oficiosConcluidos[dataIso])
    });
  }

  // --- LÓGICA DO FOGUINHO TIKTOK ---
  const dataHojeISO = getDataIso();
  const isFoguinhoAcesoHoje = ultimaAtividade === dataHojeISO;

  const fontClass = tamanhoFonte === 'grande' ? 'text-lg' : 'text-base';

  const IconeTerco = (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" className="w-[28px] h-[28px] mb-2 fill-current">
      <g transform="matrix(.1 0 0 -.1 0 512)">
        <path d="m4074.7 4995.1c-377.8-136.9-564.8-534-412.5-875.2 67.5-152.3 233.2-308.4 387.5-366.3 348.9-131.1 747.9 94.5 846.2 480 36.6 146.5 19.3 269.9-57.8 420.2-57.8 115.7-215.9 266-335.4 318.1-119.6 54-314.2 63.7-428 23.2zm347-339.3c111.8-57.8 163.8-146.5 163.8-285.3 0-198.5-107.9-312.3-304.6-323.8-142.7-7.7-231.3 30.8-296.9 129.1-55.9 82.9-61.7 266-9.6 368.2 40.5 82.9 171.6 154.2 283.4 154.2 42.5 0 117.6-19.3 163.9-42.4z" />
        <path d="m5535.9 4823.5c-104.1-38.6-233.2-133-302.6-219.8-161.9-204.3-192.8-439.5-82.9-661.2 119.5-242.9 347-391.3 593.7-391.3 456.9 3.9 780.7 497.3 589.9 906-115.7 244.8-343.1 397.1-591.8 393.2-73.3.1-167.8-13.4-206.3-26.9zm385.5-337.3c106-65.5 142.7-142.6 134.9-298.8-9.6-214-106-306.5-314.2-308.4-215.9 0-325.8 111.8-325.8 331.6 0 136.9 30.8 194.7 142.6 271.8 84.9 57.8 270 59.7 362.5 3.8z" />
        <path d="m2740.8 4495.8c-362.4-133-547.5-541.7-395.2-867.4 90.6-196.6 242.9-327.7 447.2-387.5 206.3-59.8 431.8 7.7 603.4 179.3 131.1 131.1 185.1 250.6 192.8 433.7 7.7 127.2 1.9 161.9-42.4 260.2-67.5 146.5-204.3 285.3-348.9 354.7-94.5 46.3-138.8 55.9-250.6 54-73.3 0-167.8-13.5-206.3-27zm370.1-333.5c104.1-52.1 154.2-142.7 154.2-279.5 0-215.9-109.9-329.6-318.1-331.6-214 0-327.7 113.7-327.7 331.6 0 133 32.8 194.7 144.6 271.8 81 54 248.7 57.9 347 7.7z" />
        <path d="m6995.1 4486.2c-144.6-57.8-285.3-190.8-360.5-343.1-55.9-111.8-63.6-148.4-63.6-273.7 0-181.2 46.3-287.2 185-433.7 138.8-148.4 273.7-210.1 460.7-210.1 179.3-1.9 320 57.8 453 190.8 258.3 256.4 269.9 618.8 28.9 882.9-138.8 152.3-262.1 212-453 219.8-119.4 3.7-175.3-2.1-250.5-32.9zm428-339.3c79-57.8 121.4-154.2 121.4-279.5 0-119.5-42.4-202.4-140.7-275.6-75.2-55.9-266-55.9-360.5-1.9-82.9 48.2-154.2 181.2-154.2 291.1 0 106 71.3 235.2 154.2 281.4 90.6 50.1 302.7 42.3 379.8-15.5z" />
        <path d="m1994.8 3368.1c-111.8-23.1-279.5-125.3-360.5-219.8-108-125.3-150.4-235.2-158.1-401-7.7-134.9-1.9-161.9 50.1-275.7 246.7-526.2 927.2-535.9 1183.6-13.5 54 109.9 63.6 148.4 63.6 264.1-3.8 397.3-399 723-778.7 645.9zm312.3-362.4c90.6-54 138.8-152.3 138.8-283.4 0-208.2-115.7-320-329.6-320-198.5 0-316.1 115.7-316.1 314.2 0 169.6 73.2 279.5 212 321.9 84.7 23.2 223.5 7.8 294.9-32.7z" />
        <path d="m7891.5 3358.5c-188.9-52.1-343.1-183.1-445.3-375.9-38.6-73.3-46.3-113.7-46.3-260.2 0-204.3 32.8-283.4 185-445.3 266-279.5 672.8-275.6 929.1 11.6 134.9 150.4 175.4 250.6 177.3 433.7 0 192.8-59.7 327.7-202.4 460.7-179.1 167.7-395 229.4-597.4 175.4zm337.3-354.7c73.2-40.5 144.6-179.3 144.6-281.4 0-104.1-71.3-241-150.4-285.3-84.8-50.1-269.9-50.1-352.8 0-94.5 54-138.8 127.2-148.4 242.9-15.4 185.1 48.2 296.9 202.4 352.8 86.8 30.8 219.8 19.2 304.6-29z" />
        <path d="m7342.1 2028.4c-113.7-42.4-260.2-161.9-333.5-267.9-175.4-262.2-148.4-555.2 73.3-790.3 138.8-146.5 279.5-212 462.6-212 181.2-1.9 321.9 57.8 458.8 194.7 144.6 144.6 187 250.6 187 458.8 0 200.5-32.8 281.4-175.4 433.7-133 140.7-256.4 198.5-441.4 206.3-102.2 3.7-181.3-4-231.4-23.3zm408.7-348.9c79-57.8 121.4-154.2 121.4-279.5 0-181.2-109.9-300.7-291.1-318.1-217.8-21.2-377.8 136.9-356.6 352.8 19.3 206.3 131.1 300.7 343.1 291.1 92.6-5.8 144.6-17.4 183.2-46.3z" />
        <path d="m1800.1 1878.1c-121.4-34.7-208.2-92.5-316.1-206.3-133-142.7-175.4-246.7-175.4-433.7 0-138.8 5.8-165.8 65.5-275.6 167.7-308.5 499.2-443.4 801.9-329.7 160 59.8 333.5 233.3 393.2 393.2 175.4 466.5-294.9 987-769.1 852.1zm345-356.6c102.2-75.2 127.2-133 127.2-279.5 0-115.7-7.7-150.4-46.3-204.3-57.8-81-144.6-117.6-275.7-117.6-212 0-335.4 136.9-318.1 354.7 11.6 136.9 52.1 198.6 169.6 258.3 69.4 36.6 104.1 42.4 188.9 34.7 60-5.9 127.4-25.2 154.4-46.3z" />
        <path d="m6179.7 1033.7c-146.5-57.8-312.3-217.8-379.8-368.2-106-237.1-57.8-481.9 136.9-690.1 133-142.7 268-202.4 460.7-202.4 192.8 0 327.7 59.8 460.7 202.4 165.8 177.3 227.5 379.8 177.3 576.4-36.6 146.5-96.4 241-221.7 354.7-181.1 162-418.2 210.1-634.1 127.2zm414.5-339.2c127.2-94.5 171.6-310.4 90.6-451.1-46.3-81-181.2-152.3-287.2-152.3-98.3 1.9-229.4 59.8-269.9 123.4-109.9 167.7-57.8 414.5 106 499.3 92.5 48.1 287.2 36.6 360.5-19.3z" />
        <path d="m2066.1 374.5c-198.5-84.8-356.6-256.4-414.4-454.9-79-277.6 75.2-595.6 364.3-747.9 88.7-46.3 123.4-54 266-54 202.4 0 306.5 44.3 464.6 202.4 142.6 140.7 196.6 279.5 187 472.3-21.3 429.8-487.8 742.1-867.5 582.1zm383.6-323.9c106-52.1 160-148.4 160-291.1 0-194.7-125.3-321.9-314.2-323.8-233.2 0-372 167.7-331.6 404.8 34.7 208.2 275.7 312.3 485.8 210.1z" />
        <path d="m5032.8 44.8c-356.6-150.3-522.4-497.3-395.2-834.7 57.8-156.1 233.2-329.6 391.3-389.4 306.5-115.6 667 42.4 815.4 360.5 73.3 156.1 73.3 354.7 0 505-158.1 322-520.5 482-811.5 358.6zm331.5-300.7c206.3-57.8 281.4-362.4 134.9-530.1-71.3-81-163.8-113.8-296.9-102.2-179.3 15.4-279.5 131.1-279.5 321.9.1 243 196.7 381.8 441.5 310.4z" />
        <path d="m2789-919c-123.4-40.5-241-115.6-321.9-206.2-242.9-266-233.2-626.5 21.2-880.9 131.1-131.1 250.6-185.1 433.7-192.8 127.2-7.7 161.9-1.9 260.2 42.4 148.4 67.5 296.9 217.9 362.4 362.4 44.3 100.2 52.1 134.9 44.3 264.1-7.7 181.2-61.7 300.7-192.8 431.8-165.7 165.7-420.1 240.9-607.1 179.2zm339.2-350.8c86.7-52 136.9-158 136.9-289.1 0-204.3-111.8-316.1-316.1-316.1-129.2 0-237.1 50.1-287.2 133-71.3 121.5-57.8 316.1 30.8 416.4 88.7 104 308.4 131 435.6 55.8z" />
        <path d="m4219.3-1366.2c-383.6-214-453-267.9-453-348.9 0-27 73.2-179.3 163.9-335.4 90.6-158 163.8-293 163.8-302.6s-133-92.5-296.9-185.1c-310.4-177.3-360.5-225.5-329.6-320 21.2-69.4 433.7-778.8 466.5-803.8 67.5-52.1 144.6-27 435.6 140.7 266 152.3 293 163.8 314.2 133 13.5-17.4 181.2-310.4 374-647.7 289.2-510.8 360.5-624.6 420.2-661.2 94.5-61.7 225.5-94.5 310.4-79 77.1 13.5 460.7 221.7 508.9 275.6 67.5 75.2 113.7 217.8 106 323.8-7.7 90.6-48.2 171.6-343.1 686.3-185 321.9-350.8 611.1-368.2 641.9l-34.7 57.8 298.8 169.6c163.8 94.5 306.5 187 316.1 206.3 11.6 19.3 19.3 59.7 19.3 88.7 0 54-383.6 757.6-447.2 821.2-65.5 65.5-150.3 44.3-404.8-102.2-129.2-75.2-260.2-148.4-287.2-163.9l-52-25-167.7 298.8c-92.5 163.8-183.1 306.5-202.4 316.1-79.1 42.5-150.4 17.4-510.9-185zm528.2-472.3c88.7-158.1 181.2-302.6 202.4-318.1 75.2-52 140.7-30.8 429.9 134.9 156.1 90.6 289.2 160 296.8 154.2 19.3-11.6 235.2-395.2 225.5-401-1.9-3.9-138.8-82.9-300.7-175.4-293-167.7-331.6-200.5-331.6-283.4 0-23.1 187-372 416.4-773 348.9-613 412.5-734.5 391.3-755.6-15.4-13.5-104.1-69.4-200.5-123.4-134.9-77.1-177.3-92.5-196.6-73.2-11.6 11.6-185 310.4-381.7 659.3-198.5 350.8-381.7 672.8-406.7 715.1-57.8 100.3-136.9 135-225.5 96.4-34.7-13.5-177.3-92.5-320-173.5-142.6-80.9-260.2-144.6-262.2-142.6-32.8 54-221.7 401-221.7 406.7 0 5.8 119.5 79 266 162 287.2 161.9 370.1 229.4 370.1 298.8 0 25.1-77.1 181.2-171.6 347l-171.6 302.6 206.3 115.7c111.8 65.5 208.2 117.6 214 117.6 5.9 0 83-131.1 171.7-291.1z" />
      </g>
    </svg>
  );

  return (
    <div className={`min-h-[100dvh] flex flex-col font-sans pb-32 transition-colors duration-300 selection:bg-primary/30 bg-background`}>

      <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 sm:px-6 py-4 flex items-center justify-between max-w-[800px] mx-auto w-full transition-colors duration-300 bg-background/90 border-border`}>
        <button onClick={() => { playPop(); triggerHaptic('light'); router.back(); }} className="flex items-center justify-center w-10 h-10 rounded-full active:scale-95 shrink-0 transition-colors text-muted hover:bg-muted/20 hover:text-foreground">
          <span className="material-symbols-rounded text-[26px]">arrow_back</span>
        </button>
        <h1 className={`font-extrabold tracking-tight text-foreground ${fontClass}`}>Meu Progresso</h1>
        <div className="w-10 h-10"></div>
      </header>

      <main className="flex-1 w-full max-w-[600px] mx-auto px-5 pt-8 animate-fade-in">

        {/* === FOGUINHO REDESENHADO === */}
        <section className="flex flex-col items-center justify-center mb-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className={`absolute w-[180px] h-[180px] rounded-full border-[6px] ${isFoguinhoAcesoHoje ? 'border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]' : 'border-border'}`}></div>
            <div className={`relative flex items-center justify-center w-40 h-40 rounded-full bg-card border-4 border-background shadow-xl z-10 overflow-hidden`}>
              {isFoguinhoAcesoHoje ? (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-10"></div>
              ) : null}
              <div className="flex flex-col items-center">
                <span className={`material-symbols-rounded text-[48px] mb-1 ${isFoguinhoAcesoHoje ? 'text-orange-500' : 'text-muted opacity-50'}`}>
                  local_fire_department
                </span>
                <span className={`font-black text-5xl tracking-tighter ${isFoguinhoAcesoHoje ? 'text-foreground' : 'text-muted'}`}>
                  {streak}
                </span>
              </div>
            </div>
          </div>

          <h2 className={`font-black text-xl mb-1 text-foreground`}>Ofensiva Espiritual</h2>

          {!isFoguinhoAcesoHoje && streak > 0 ? (
            <p className="mt-3 text-center text-sm font-bold text-orange-500 bg-orange-500/10 px-5 py-2.5 rounded-full animate-pulse border border-orange-500/20">
              A sua chama apaga à meia-noite!
            </p>
          ) : isFoguinhoAcesoHoje ? (
            <p className="text-muted font-medium text-sm">Mandou muito bem hoje!</p>
          ) : (
            <p className="text-muted font-medium text-sm">Faça algo hoje para acender a chama.</p>
          )}
        </section>

        {/* === HISTÓRICO DE ATIVIDADE (HEATMAP) === */}
        <h3 className="font-bold text-sm uppercase tracking-widest mb-4 pl-2 mt-12 text-muted">A Sua semana</h3>
        <div className="bg-card border border-border p-5 rounded-[2rem] shadow-sm mb-10 overflow-x-auto hide-scrollbar">
          <div className="flex justify-between items-end gap-2 min-w-[280px]">
            {ultimos7Dias.map((dia, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="flex flex-col gap-1 h-[60px] justify-end">
                  {dia.oficio && <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>}
                  {dia.terco && <div className="w-3 h-3 rounded-full bg-[#6E3AA5] shadow-[0_0_8px_rgba(110,58,165,0.5)]"></div>}
                  {dia.leitura && <div className="w-3 h-3 rounded-full bg-[#2F6BFF] shadow-[0_0_8px_rgba(47,107,255,0.5)]"></div>}

                  {/* Ponto invisível para manter altura quando vazio */}
                  {!dia.leitura && !dia.terco && !dia.oficio && <div className="w-3 h-3 rounded-full bg-border/50"></div>}
                </div>
                <span className={`text-[10px] font-bold uppercase ${dia.dataIso === dataHojeISO ? 'text-foreground' : 'text-muted'}`}>
                  {dia.dataIso === dataHojeISO ? 'HOJE' : dia.diaSemana}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border flex justify-center gap-4">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2F6BFF]"></div><span className="text-[10px] font-bold text-muted uppercase">Liturgia</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#6E3AA5]"></div><span className="text-[10px] font-bold text-muted uppercase">Terço</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-[10px] font-bold text-muted uppercase">Ofício</span></div>
          </div>
        </div>

        {/* === ESTATÍSTICAS PESSOAIS === */}
        <h3 className="font-bold text-sm uppercase tracking-widest mb-3 pl-2 mt-8 text-muted">Estatísticas Mensais</h3>
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-gradient-to-br from-[#2F6BFF]/10 to-[#2F6BFF]/5 p-4 rounded-[1.5rem] border border-[#2F6BFF]/20 flex flex-col items-center text-center">
            <span className="material-symbols-rounded text-[#2F6BFF] mb-2 text-[24px]">menu_book</span>
            <span className="font-black text-2xl mb-0.5 text-[#2F6BFF]">{leiturasEsteMes}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2F6BFF]/70">Liturgias</span>
          </div>

          <div className="bg-gradient-to-br from-[#6E3AA5]/10 to-[#6E3AA5]/5 p-4 rounded-[1.5rem] border border-[#6E3AA5]/20 flex flex-col items-center text-center">
            {IconeTerco}
            <span className="font-black text-2xl mb-0.5 text-[#6E3AA5]">{tercosEsteMes}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E3AA5]/70">Terços</span>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 rounded-[1.5rem] border border-amber-500/20 flex flex-col items-center text-center">
            <span className="material-symbols-rounded text-amber-500 mb-2 text-[24px]">wb_twilight</span>
            <span className="font-black text-2xl mb-0.5 text-amber-500">{oficiosEsteMes}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500/70">Ofícios</span>
          </div>
        </div>

        {/* === ESTATÍSTICAS DA COMUNIDADE === */}
        <h3 className="font-bold text-sm uppercase tracking-widest mb-3 pl-2 mt-8 text-muted">A comunidade hoje</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-black text-xl md:text-2xl mb-1 mt-3 text-foreground">{leiturasComunidade}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Liturgias Lidas</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-black text-xl md:text-2xl mb-1 mt-3 text-foreground">{tercosComunidade}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Terços Rezados</span>
          </div>

          <div className="bg-card border border-border p-4 rounded-[1.5rem] flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-black text-xl md:text-2xl mb-1 mt-3 text-foreground">{oficiosComunidade}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Ofícios Rezados</span>
          </div>
        </div>

      </main>
    </div>
  );
}
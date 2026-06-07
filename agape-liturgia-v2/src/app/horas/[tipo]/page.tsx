import { HorasClient } from "@/components/horas/HorasClient";
import { getLiturgiaDasHoras, HoraLiturgica } from "@/services/api-horas";
import { Metadata } from "next";

export const revalidate = 3600; // Cache por 1 hora

interface HorasPageProps {
  params: Promise<{
    tipo: string;
  }>;
}

export async function generateMetadata({ params }: HorasPageProps): Promise<Metadata> {
  const p = await params;
  const tipo = p.tipo.replace('-', ' ');
  return {
    title: `Liturgia das Horas - ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} | Ágape`,
    description: "Reze a Liturgia das Horas de hoje.",
  };
}

export default async function HorasPage({ params }: HorasPageProps) {
  const p = await params;
  const { tipo } = p;
  
  // Validar se o tipo é válido
  const validTypes = ['oficio-das-leituras', 'laudes', 'hora-media', 'vesperas', 'completas'];
  if (!validTypes.includes(tipo)) {
    return <div className="p-10 text-center">Hora litúrgica inválida.</div>;
  }

  const horasData = await getLiturgiaDasHoras(tipo as HoraLiturgica);

  return <HorasClient horasData={horasData} tipo={tipo} />;
}

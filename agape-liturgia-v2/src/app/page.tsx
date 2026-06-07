import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { HomeClient } from "@/components/home/HomeClient"; 

export const revalidate = 3600; // Cache de 1 hora no CDN da Vercel (ISR)

export default async function PortalInicialPage() {
  const liturgia = await getLiturgiaDoDia();
  
  return <HomeClient liturgiaServer={liturgia} />;
}
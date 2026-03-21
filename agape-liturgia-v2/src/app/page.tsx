import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { HomeClient } from "@/components/home/HomeClient"; 

export const dynamic = 'force-dynamic';

export default async function PortalInicialPage() {
  const liturgia = await getLiturgiaDoDia();
  
  return <HomeClient liturgiaServer={liturgia} />;
}
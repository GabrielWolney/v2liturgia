import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { LiturgiaClient } from "@/components/liturgia/LiturgiaClient";

export const dynamic = 'force-dynamic';

export default async function LiturgiaAulaPage() {
  const liturgia = await getLiturgiaDoDia();
  
  return <LiturgiaClient liturgiaServer={liturgia} />;
}
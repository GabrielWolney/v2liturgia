import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { LiturgiaClient } from "@/components/liturgia/LiturgiaClient";

export default async function LiturgiaAulaPage() {
  const liturgia = await getLiturgiaDoDia();
  
  return <LiturgiaClient liturgiaServer={liturgia} />;
}
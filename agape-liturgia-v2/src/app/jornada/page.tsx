import { getLiturgiaDoDia } from "@/services/api-liturgia";
import { JornadaClient } from "@/components/jornada/JornadaClient";

export default async function JornadaPage() {
  const liturgia = await getLiturgiaDoDia();
  
  return <JornadaClient liturgiaServer={liturgia} />;
}
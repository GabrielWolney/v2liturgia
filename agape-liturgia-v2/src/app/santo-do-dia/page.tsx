import { getSantoDoDia } from "@/services/api-santo";
import { SantoClient } from "@/components/santo-do-dia/SantoClient";

export const dynamic = 'force-dynamic';

export default async function SantoDoDiaPage() {
  const santo = await getSantoDoDia();
  
  return <SantoClient santoData={santo} />;
}

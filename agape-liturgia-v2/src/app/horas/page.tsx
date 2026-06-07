import { MenuHorasClient } from "@/components/horas/MenuHorasClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofício Divino | Ágape",
  description: "Acesse a Liturgia das Horas completa.",
};

export default function HorasMenuPage() {
  return <MenuHorasClient />;
}

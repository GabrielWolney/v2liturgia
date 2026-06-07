import { Metadata } from "next";
import { PersonalizarViaClient } from "@/components/menu/PersonalizarViaClient";

export const metadata: Metadata = {
  title: "Personalizar a Via | Ágape",
  description: "Escolha quais módulos exibir na sua Pequena Via",
};

export default function PersonalizarViaPage() {
  return <PersonalizarViaClient />;
}

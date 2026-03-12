import type { Metadata, Viewport } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
  title: "Ágape Liturgia",
  description: "Oração e Liturgia Diária",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Ajuda a manter a sensação de App Nativo
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,600,0,0&display=optional" rel="stylesheet" />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased selection:bg-[#2F6BFF]/30 selection:text-[#2F6BFF] bg-[#F5F7FA]`}>
        <ThemeProvider>
          
          {/* Layout 100% Limpo, sem Sidebar ou BottomNav */}
          <main className="min-h-[100dvh] w-full max-w-full">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}
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
  appleWebApp: {
    capable: true,
    // ISTO FAZ A BARRA DE STATUS FICAR INVISÍVEL NO IOS (Passa por cima)
    statusBarStyle: "black-translucent", 
    title: "Ágape",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // ESTA É A PALAVRA MÁGICA PARA IGNORAR O NOTCH E OCUPAR 100% DO ECRÃ:
  viewportFit: "cover", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,600,0,0&display=block" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased selection:bg-[#2F6BFF]/30 selection:text-[#2F6BFF] bg-background`}>
        <ThemeProvider>
          <main className="min-h-[100dvh] w-full max-w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
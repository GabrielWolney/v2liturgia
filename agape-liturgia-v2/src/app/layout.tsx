import type { Metadata, Viewport } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
  metadataBase: new URL("https://https://liturgia-agape.vercel.app"), 
  title: "Ágape Liturgia",
  description: "A sua jornada espiritual diária. Liturgia, Santo Terço, Bíblia e Orações num só lugar.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent", 
    title: "Ágape",
  },
  openGraph: {
    title: "Ágape Liturgia | Jovens Católicos",
    description: "Acompanhe a Liturgia Diária, reze o Santo Terço, leia a Bíblia e faça o seu Diário Espiritual. Uma ferramenta feita para elevar a sua fé.",
    url: "https://https://liturgia-agape.vercel.app", 
    siteName: "Ágape Liturgia",
    images: [
      {
        url: "/icon-512x512.png", 
        width: 512,
        height: 512,
        alt: "Logo Ágape Liturgia",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ágape Liturgia",
    description: "A sua jornada espiritual diária. Liturgia, Santo Terço, Bíblia e Orações.",
    images: ["/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        
        {/* Novos Favicons Apple e Standard */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased selection:bg-[#2F6BFF]/30 selection:text-[#2F6BFF] bg-background`}>
        <ThemeProvider>
          <main className="min-h-[100dvh] w-full max-w-full">
            {children}
          </main>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { OfflineIndicator } from "@/components/ui/OfflineIndicator";
import { AppleSplashScreens } from "@/components/layout/AppleSplashScreens";
import { NativeAlert } from "@/components/ui/NativeAlert";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const lora = Lora({ subsets: ["latin"], variable: '--font-lora' });

export const metadata: Metadata = {
  metadataBase: new URL("https://liturgia-agape.vercel.app"),
  title: {
    default: "Ágape Liturgia | A Sua Jornada Espiritual",
    template: "%s | Ágape Liturgia",
  },
  description: "Acompanhe a Liturgia Diária, reze o Santo Terço, leia a Bíblia Sagrada e faça o seu Diário Espiritual. Uma app feita para jovens católicos.",
  keywords: ["Liturgia", "Católico", "Ágape", "Santo Terço", "Bíblia", "Orações", "Diário Espiritual", "Jovens"],
  authors: [{ name: "Ágape" }],
  creator: "Ágape",
  publisher: "Ágape",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ágape",
  },
  openGraph: {
    title: "Ágape Liturgia | A Sua Jornada Espiritual",
    description: "Liturgia Diária, Santo Terço, Bíblia e Orações num só lugar. Mergulhe na sua fé com a nossa app desenhada para si.",
    url: "https://liturgia-agape.vercel.app",
    siteName: "Ágape Liturgia",
    images: [
      {
        url: "/og-image.png", // A nova imagem grande que vais criar
        width: 1200,
        height: 630,
        alt: "Banner do Ágape Liturgia",
        type: "image/png",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image", // O formato de banner grande
    title: "Ágape Liturgia | A Sua Jornada Espiritual",
    description: "Acompanhe a Liturgia Diária, reze o Santo Terço e leia a Bíblia Sagrada. Junte-se a nós!",
    images: ["/og-image.png"],
    creator: "@AgapeLiturgia",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
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
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,600,0,0&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <AppleSplashScreens />
      </head>
      <body className={`${montserrat.variable} ${lora.variable} font-sans antialiased selection:bg-[#2F6BFF]/30 selection:text-[#2F6BFF] bg-background`}>
        <OfflineIndicator />
        <ThemeProvider>
          <AuthGuard>
            <main className="min-h-dvh w-full max-w-full">
              {children}
            </main>
          </AuthGuard>
          <ScrollToTop />
          <NativeAlert />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
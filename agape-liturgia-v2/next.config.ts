import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    importScripts: ['/firebase-messaging-sw.js'],
    // Cache agressivo da API de liturgia
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/liturgia\.up\.railway\.app\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'liturgia-api',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
          },
        },
      },
      // Cache de navegação para a Liturgia das Horas (Offline support)
      {
        urlPattern: /\/horas\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'liturgia-horas-pages',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 24 * 60 * 60, // 1 dia (mudam diariamente)
          },
          networkTimeoutSeconds: 5, // Tenta a rede por 5s, depois cai pro offline
        },
      },
    ],
    // ✅ Agora aponta para a rota do Next.js (e não para um HTML estático)
    navigateFallback: '/offline',
    navigateFallbackDenylist: [/^\/api\//, /^\/_next\//],
  },
  // fallback: '/offline', ← essa opção pode ser usada diretamente no plugin
  // mas o @ducanh2912/next-pwa já encaminha navigateFallback para o Workbox.
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
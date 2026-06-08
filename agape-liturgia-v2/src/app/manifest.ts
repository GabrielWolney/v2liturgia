import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: 'Ágape Liturgia V2',
    short_name: 'Ágape',
    description: 'Liturgia Diária, Bíblia e Vida de Oração para jovens Católicos',
    start_url: '/?v=9',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone'],
    background_color: '#f1f5f9',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    lang: 'pt-BR',
    dir: 'ltr',
    scope: '/',
    categories: ['lifestyle', 'education', 'religious'],
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Liturgia do Dia',
        url: '/liturgia',
        description: 'Ver a liturgia de hoje',
        icons: [{ src: '/liturgia/branco.png', sizes: '96x96' }],
      },
      {
        name: 'Bíblia',
        url: '/biblia',
        description: 'Ler a Bíblia',
        icons: [{ src: '/favicon-32x32.png', sizes: '32x32' }],
      },
      {
        name: 'Terço',
        url: '/terco',
        description: 'Rezar o Terço',
        icons: [{ src: '/favicon-32x32.png', sizes: '32x32' }],
      },
      {
        name: 'Confissão',
        url: '/confissao',
        description: 'Exame de Consciência',
        icons: [{ src: '/favicon-32x32.png', sizes: '32x32' }],
      },
    ],
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Tela principal com a liturgia',
      },
    ],
    // Manipulação de protocolos e arquivos
    protocol_handlers: [
      {
        protocol: 'web+agape',
        url: '/jornada?url=%s',
      },
    ],
    file_handlers: [
      {
        action: '/importar-texto',
        accept: {
          'text/plain': ['.txt'],
          'application/json': ['.json'],
        },
      },
    ],
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
  }
}
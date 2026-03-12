import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ágape Liturgia V2',
    short_name: 'Ágape',
    description: 'Liturgia Diária, Bíblia e Vida de Oração para jovens Católicos',
    start_url: '/',
    display: 'standalone',
    background_color: '#f1f5f9',
    theme_color: '#2563eb',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
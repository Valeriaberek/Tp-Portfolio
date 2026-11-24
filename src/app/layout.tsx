import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import MusicPlayer from '@/components/ui/MusicPlayer'

export const metadata: Metadata = {
  title: 'Mon portfolio',
  icons: {
    icon: { url: '/favicon.svg?v=heart-transparent', type: 'image/svg+xml' },
  },
  description: 'Le portfolio 3D d’une étudiante en Master 1 Développement Web : parcours, compétences en cours de pratique et projet d’île interactive.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <MusicPlayer />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import PortfolioTheme from '@/components/ui/PortfolioTheme'
import AboutSection from '@/components/ui/AboutSection'

export const metadata: Metadata = {
  title: 'À propos | Mon portfolio',
  description: 'Mon parcours en Master Développement Web et mon univers créatif.',
}

export default function AboutPage() {
  return (
    <PortfolioTheme>
      <main id="main-content" tabIndex={-1}>
        <AboutSection />
      </main>
    </PortfolioTheme>
  )
}

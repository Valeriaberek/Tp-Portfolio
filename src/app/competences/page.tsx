import type { Metadata } from 'next'
import PortfolioTheme from '@/components/ui/PortfolioTheme'
import SkillsInventory from '@/components/ui/SkillsInventory'

export const metadata: Metadata = {
  title: 'Compétences | Mon portfolio',
  description: 'Mon inventaire des technologies pratiquées dans ce portfolio.',
}

// Les badges reflètent le contenu actuel de la table skills.
export const dynamic = 'force-dynamic'

export default function SkillsPage() {
  return (
    <PortfolioTheme>
      <main id="main-content" tabIndex={-1}>
        <SkillsInventory />
      </main>
    </PortfolioTheme>
  )
}

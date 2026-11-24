import PortfolioTheme from '@/components/ui/PortfolioTheme'
import IslandPreview from '@/components/three/IslandPreview'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <PortfolioTheme>
      <main id="main-content" tabIndex={-1}>
        <section id="accueil" className={styles.hero} aria-labelledby="welcome-title" tabIndex={-1}>
          <p className={styles.eyebrow}>Portfolio · Développement web</p>
          <h1 id="welcome-title">Une petite île, de grandes idées.</h1>
          <IslandPreview />
        </section>
      </main>
    </PortfolioTheme>
  )
}

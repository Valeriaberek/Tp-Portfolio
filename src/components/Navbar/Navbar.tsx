import Link from 'next/link'

import styles from './Navbar.module.css'
import { aboutLink, skillsLink, projectsLink, contactLink } from '@/data/navigation'

export default function Navbar() {
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">Aller au contenu</a>
      <Link className={styles.brand} href="/">Mon portfolio</Link>
      <nav aria-label="Navigation principale">
        <ul className={styles.links}>
          <li><Link href="/">Accueil</Link></li>
          <li><Link href={aboutLink.href}>À propos</Link></li>
          <li><Link href={skillsLink.href}>Compétences</Link></li>
          <li><Link href={projectsLink.href}>Projets</Link></li>
          <li><Link href={contactLink.href}>Contact</Link></li>
        </ul>
      </nav>
    </header>
  )
}

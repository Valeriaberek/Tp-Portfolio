import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PortfolioTheme from '@/components/ui/PortfolioTheme'
import { getProjects } from '@/services/projects'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Projets | Mon portfolio',
  description: 'Les projets de mon portfolio de Master.',
}

// La liste est relue à chaque visite pour refléter les publications dans Supabase.
export const dynamic = 'force-dynamic'

const errorMessages = {
  configuration: 'La connexion aux projets n’est pas encore configurée.',
  request: 'Les projets sont momentanément indisponibles. Réessaie dans un instant.',
  validation: 'Les données des projets ne peuvent pas être affichées pour le moment.',
}

export default async function ProjectsPage() {
  const result = await getProjects()

  return (
    <PortfolioTheme>
      <main id="main-content" tabIndex={-1} className={styles.page}>
        <header className={styles.intro}>
          <span className={styles.flower} aria-hidden="true">✿</span>
          <p className={styles.eyebrow}>Mon carnet de création</p>
          <h1>Mes projets</h1>
          <p>Voici ce que je construis au fil de mon apprentissage.</p>
        </header>
        {!result.ok ? (
          <p className={styles.notice} role="alert">{errorMessages[result.reason]}</p>
        ) : result.projects.length === 0 ? (
          <p className={styles.notice}>Mon carnet attend ses premiers projets publiés. À bientôt !</p>
        ) : (
          <ul className={styles.list}>
            {result.projects.map((project) => (
              <li key={project.slug}>
                <article className={styles.card} aria-labelledby={`project-${project.slug}`}>
                  <figure className={styles.cover}>
                    <span className={styles.coverLabel}>Mon univers créatif</span>
                    <Image src="/images/portfolio-island.svg" alt="" width={720} height={520}
                      sizes="(max-width: 760px) 100vw, 50vw" className={styles.image} />
                    <figcaption>Illustration du portfolio · visuel du projet à venir</figcaption>
                  </figure>
                  <div className={styles.content}>
                    <span className={styles.status}><span aria-hidden="true" />Projet publié</span>
                    <h2 id={`project-${project.slug}`}>{project.title}</h2>
                    <p className={styles.description}>{project.summary}</p>
                    {project.skills.length > 0 && (
                      <>
                        <h3>Dans ma boîte à outils</h3>
                        <ul className={styles.technologies} aria-label="Technologies utilisées">
                          {project.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
                        </ul>
                      </>
                    )}
                    <div className={styles.actions}>
                      <Link href="/" className={styles.exploreLink}>Explorer l’île <span aria-hidden="true">↗</span></Link>
                      <Link href="/contact" className={styles.contactLink}>Échanger sur ce projet</Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </PortfolioTheme>
  )
}

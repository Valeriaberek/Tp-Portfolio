import { getSkills } from '@/services/skills'
import styles from './SkillsInventory.module.css'

const categorySymbols = ['⌘', '{ }', '◇', '✓']

const errorMessages = {
  configuration: 'La connexion aux compétences n’est pas encore configurée.',
  request: 'Les compétences sont momentanément indisponibles. Réessaie dans un instant.',
  validation: 'Les données des compétences ne peuvent pas être affichées pour le moment.',
}

export default async function SkillsInventory() {
  const result = await getSkills()
  const skills = result.ok ? result.skills : []
  // Set conserve chaque catégorie une seule fois, quel que soit son nom en base.
  const categories = Array.from(new Set(skills.map((skill) => skill.category)))

  return (
    <section id="competences" className={styles.inventory} aria-labelledby="skills-title" tabIndex={-1}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Mon inventaire</p>
          <h1 id="skills-title">Mes compétences</h1>
        </div>
        <span className={styles.practiceLabel}>En pratique dans ce portfolio</span>
      </header>
      <p className={styles.intro}>Les outils que j’équipe au fil de mon apprentissage.</p>
      {!result.ok ? (
        <p className={styles.notice} role="alert">{errorMessages[result.reason]}</p>
      ) : skills.length === 0 ? (
        <p className={styles.notice}>Mon inventaire attend ses premières compétences.</p>
      ) : (
        <div className={styles.groups}>
          {categories.map((category, index) => (
            <article key={category} className={styles.group} aria-labelledby={`skill-group-${index}`}>
              <div className={styles.groupHeader}>
                <span className={styles.emblem} aria-hidden="true">{categorySymbols[index % categorySymbols.length]}</span>
                <h2 id={`skill-group-${index}`}>{category}</h2>
              </div>
              <ul className={styles.badges} aria-label={`Technologies : ${category}`}>
                {skills.filter((skill) => skill.category === category).map((skill) => (
                  <li key={skill.name} className={styles.badge}>
                    <span className={styles.badgeMark} aria-hidden="true">✦</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

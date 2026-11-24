import AboutPortrait from './AboutPortrait'
import styles from './AboutSection.module.css'

export default function AboutSection() {
  return (
    <section id="a-propos" className={styles.section} aria-labelledby="about-title" tabIndex={-1}>
      <div className={styles.illustration}>
        <AboutPortrait />
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Un peu de moi</p>
        <h1 id="about-title">À propos</h1>
        <p className={styles.lead}>
          Je suis étudiante en première année de Master Développement Web.
          Je construis ce portfolio pour présenter mon apprentissage et les projets
          sur lesquels je progresse.
        </p>
        <p>
          J’aime les univers doux et ludiques. Pour ce projet, j’ai choisi une petite
          île flottante en 3D, des couleurs pastel et une ambiance qui passe du jour à la nuit.
          Chaque élément de l’île permet de découvrir une rubrique de mon portfolio.
        </p>
        <p>
          Mon objectif est de progresser étape par étape, avec un code simple,
          lisible et que je peux expliquer en soutenance. Je porte aussi attention
          à l’accès au clavier et aux préférences de réduction des animations.
        </p>
        <span className={styles.signature}><span aria-hidden="true">♡</span> Apprendre, créer, comprendre.</span>
      </div>
    </section>
  )
}

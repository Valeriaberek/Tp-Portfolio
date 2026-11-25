'use client'

import { useEffect, type ReactNode } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import { useThemeStore } from '@/store/themeStore'
import styles from './PortfolioTheme.module.css'
import BackToIsland from './BackToIsland'

type PortfolioThemeProps = {
  children: ReactNode
}
//au montage du composant dans le navigateur, il restaure la préférence
export default function PortfolioTheme({ children }: PortfolioThemeProps) {
  // Ce sélecteur lit le mode ET abonne le composant à ses changements.

  const mode = useThemeStore((state) => state.mode)
  // Un second sélecteur récupère l’action à appeler au clic.
  const toggleMode = useThemeStore((state) => state.toggleMode)
  const isNight = mode === 'night'

  useEffect(() => {
    // Après montage dans le navigateur, on restaure la préférence sauvegardée.
   
    void useThemeStore.persist.rehydrate()
  }, [])

  // data-mode permet au CSS de choisir les couleurs de jour ou de nuit.
  return (
    <div className={styles.theme} data-mode={mode}>
      <div className={styles.sky} aria-hidden="true">
        <span className={styles.cloud} />
        <span className={styles.cloud} />
        <span className={styles.cloud} />
        <span className={styles.cloud} />
        <span className={styles.stars} />
      </div>
      <div className={styles.toolbar}>
        <Navbar />
        {/* Le clic appelle l’action du store ; tous les abonnés au mode réagissent. */}
        <button
          type="button"
          role="switch"
          aria-label="Mode nuit"
          aria-checked={isNight}
          className={styles.toggle}
          onClick={toggleMode}
        >
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb}>{isNight ? '☾' : '☀'}</span>
          </span>
          <span>{isNight ? 'Nuit' : 'Jour'}</span>
        </button>
      </div>
      {children}
      <BackToIsland />
    </div>
  )
}

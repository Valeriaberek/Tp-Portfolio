'use client'

import dynamic from 'next/dynamic'
import { useSceneVisibility } from '@/hooks/useSceneVisibility'
import styles from './AboutSection.module.css'

const CharacterPortraitScene = dynamic(() => import('../three/CharacterPortraitScene'), {
  ssr: false,
  loading: () => <p className={styles.loading}>Le petit personnage arrive…</p>,
})

export default function AboutPortrait() {
  const { containerRef, hasBeenVisible, isVisible, reducedMotion } = useSceneVisibility()

  return (
    <div ref={containerRef} className={styles.portrait} aria-hidden="true">
      <div className={styles.characterStage}>
        {hasBeenVisible && (
          <CharacterPortraitScene isAnimating={isVisible && !reducedMotion} reducedMotion={reducedMotion} />
        )}
      </div>
    </div>
  )
}

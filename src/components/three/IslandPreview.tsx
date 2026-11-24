'use client'

import dynamic from 'next/dynamic'
import { useSceneVisibility } from '@/hooks/useSceneVisibility'
import styles from './IslandPreview.module.css'

const IslandScene = dynamic(() => import('./IslandScene'), {
  ssr: false,
  loading: () => <p className={styles.loading}>Chargement de l’île…</p>,
})

export default function IslandPreview() {
  const { containerRef, hasBeenVisible, isVisible, reducedMotion } = useSceneVisibility()

  return (
    <div className={styles.preview}>
      <div
        id="island-scene"
        ref={containerRef}
        className={styles.scene}
        role="group"
        aria-label="Île 3D : une mini figurine vers À propos, une maison vers Compétences, un panneau vers Projets et une boîte aux lettres vers Contact. Toutes les rubriques sont aussi accessibles dans le menu."
      >
        {hasBeenVisible && (
          <IslandScene
            autoRotate={isVisible && !reducedMotion}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
    </div>
  )
}

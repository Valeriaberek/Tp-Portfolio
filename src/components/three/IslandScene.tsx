'use client'

import { Canvas } from '@react-three/fiber'
import { Bounds } from '@react-three/drei'
import { useThemeStore } from '@/store/themeStore'
import FloatingIsland from './FloatingIsland'
import IslandControls from './IslandControls'

type IslandSceneProps = {
  autoRotate: boolean
  reducedMotion: boolean
}

export default function IslandScene({ autoRotate, reducedMotion }: IslandSceneProps) {
  // Le sélecteur renvoie un booléen : l’éclairage suit le même mode que le bouton HTML.
  const isNight = useThemeStore((state) => state.mode === 'night')

  return (
    <Canvas
      shadows="soft"
      camera={{ position: [7, 5.8, 8], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={autoRotate ? 'always' : 'demand'}
      fallback={<p>La 3D est indisponible. Les rubriques restent accessibles dans le menu en haut de page.</p>}
    >
      <IslandControls autoRotate={autoRotate} reducedMotion={reducedMotion} />
      <hemisphereLight args={[isNight ? '#b9c5f4' : '#fff5ec', '#b4b1c9', isNight ? 0.4 : 1.7]} />
      <directionalLight
        castShadow
        position={[-3, 6, 5]}
        intensity={isNight ? 0.6 : 2}
        color={isNight ? '#bbc9ff' : '#ffffff'}
        shadow-mapSize={[1024, 1024]}
        shadow-normalBias={0.04}
      />
      {/* Le cadrage suit la taille de l’écran, sans mouvement de caméra initial. */}
      <Bounds fit clip observe margin={1.3} maxDuration={0}>
        <FloatingIsland isAnimating={autoRotate} reducedMotion={reducedMotion} />
      </Bounds>
    </Canvas>
  )
}

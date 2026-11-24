'use client'

import { Canvas } from '@react-three/fiber'
import { Bounds } from '@react-three/drei'
import { useThemeStore } from '@/store/themeStore'
import PocketCharacter from './PocketCharacter'

type CharacterPortraitSceneProps = {
  isAnimating: boolean
  reducedMotion: boolean
}

export default function CharacterPortraitScene({ isAnimating, reducedMotion }: CharacterPortraitSceneProps) {
  // Le portrait lit le store existant, sans créer une deuxième préférence jour/nuit.
  const isNight = useThemeStore((state) => state.mode === 'night')

  return (
    <Canvas
      camera={{ position: [0, 1, 4], fov: 35 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      fallback={<p>Le personnage 3D n’est pas disponible sur cet appareil.</p>}
    >
      <hemisphereLight args={['#fff5ec', '#b4b1c9', isNight ? 0.8 : 1.7]} />
      <directionalLight position={[-2, 4, 4]} intensity={isNight ? 1.2 : 2} color={isNight ? '#c5ceef' : '#ffffff'} />
      <Bounds fit clip observe margin={1.25} maxDuration={0}>
        <PocketCharacter variant="portrait" isAnimating={isAnimating} reducedMotion={reducedMotion} />
      </Bounds>
    </Canvas>
  )
}

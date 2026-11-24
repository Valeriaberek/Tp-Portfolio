import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, type ComponentRef } from 'react'
import { MathUtils } from 'three'

type IslandControlsProps = {
  autoRotate: boolean
  reducedMotion: boolean
}

export default function IslandControls({ autoRotate, reducedMotion }: IslandControlsProps) {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null)
  const [isDragging, setIsDragging] = useState(false)

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    // La vitesse remonte progressivement après le glisser, sans minuterie.
    controls.autoRotateSpeed = MathUtils.damp(
      controls.autoRotateSpeed,
      autoRotate && !isDragging ? 0.35 : 0,
      2,
      Math.min(delta, 0.1),
    )
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 0.15, 0]}
      autoRotate={autoRotate && !isDragging}
      autoRotateSpeed={0}
      enableDamping={!reducedMotion}
      enablePan={false}
      enableZoom
      zoomSpeed={0.75}
      minDistance={6}
      maxDistance={24}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 2.7}
      rotateSpeed={0.6}
      onStart={() => {
        setIsDragging(true)
        if (controlsRef.current) controlsRef.current.autoRotateSpeed = 0
      }}
      onEnd={() => setIsDragging(false)}
    />
  )
}

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh, MeshStandardMaterial } from 'three'

type SmokeProps = {
  isAnimating: boolean
}

export default function Smoke({ isAnimating }: SmokeProps) {
  const puffs = useRef<(Mesh | null)[]>([])
  const materials = useRef<(MeshStandardMaterial | null)[]>([])
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    if (!isAnimating) return
    elapsed.current += Math.min(delta, 0.1)

    puffs.current.forEach((puff, index) => {
      const material = materials.current[index]
      if (!puff || !material) return
      // Chaque bouffée monte pendant six secondes, avec un départ décalé.
      const progress = (elapsed.current / 6 + index / 3) % 1
      puff.position.set(progress * 0.18, progress * 0.85, 0)
      puff.scale.setScalar(0.08 + progress * 0.18)
      material.opacity = Math.sin(progress * Math.PI) * 0.28
    })
  })

  return (
    <group position={[0.5, 2.4, -0.3]}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(mesh) => { puffs.current[index] = mesh }}
          scale={0.08}
          raycast={() => {}}
        >
          <sphereGeometry args={[1, 7, 5]} />
          <meshStandardMaterial
            ref={(material) => { materials.current[index] = material }}
            color="#eee4eb"
            transparent
            opacity={0}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  )
}

import { Html, RoundedBox, useCursor } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { projectsLink } from '@/data/navigation'
import styles from './SceneLabel.module.css'

const posters = [
  { x: -0.43, color: '#e5b3c4', rotation: -0.08 },
  { x: 0, color: '#c6bce0', rotation: 0.05 },
  { x: 0.43, color: '#afd0d6', rotation: -0.04 },
]

export default function ProjectsBoard() {
  const [isHovered, setIsHovered] = useState(false)
  const canvas = useThree((state) => state.gl.domElement)
  const router = useRouter()
  useCursor(isHovered, 'pointer', 'grab', canvas)

  function openProjects(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (event.button === 0 && event.delta <= 4) router.push(projectsLink.href)
  }

  return (
    <group
      position={[-1.35, 0.1, 1]}
      rotation={[0, 0.3, 0]}
      onClick={openProjects}
      onPointerOver={(event) => {
        event.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {isHovered && (
        <Html position={[0, 1.9, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className={styles.label} aria-hidden="true">{projectsLink.label}</span>
        </Html>
      )}
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} castShadow position={[x, 0.55, 0]}>
          <boxGeometry args={[0.1, 1.1, 0.1]} />
          <meshStandardMaterial color="#a38570" roughness={1} />
        </mesh>
      ))}
      <RoundedBox castShadow receiveShadow args={[1.4, 0.85, 0.14]} radius={0.06} smoothness={2} position={[0, 1.05, 0]}>
        <meshStandardMaterial color="#c7a78c" roughness={1} />
      </RoundedBox>
      <RoundedBox castShadow args={[1.55, 0.13, 0.24]} radius={0.04} smoothness={2} position={[0, 1.51, 0]}>
        <meshStandardMaterial color="#a5bca2" roughness={1} />
      </RoundedBox>
      {posters.map((poster) => (
        <group key={poster.x} position={[poster.x, 1.05, 0.08]} rotation={[0, 0, poster.rotation]}>
          <mesh>
            <boxGeometry args={[0.32, 0.48, 0.02]} />
            <meshStandardMaterial color="#fff3df" roughness={1} />
          </mesh>
          <mesh position={[0, 0.04, 0.016]}>
            <boxGeometry args={[0.24, 0.18, 0.01]} />
            <meshStandardMaterial color={poster.color} roughness={1} />
          </mesh>
          <mesh position={[0, -0.13, 0.016]}>
            <boxGeometry args={[0.2, 0.025, 0.01]} />
            <meshStandardMaterial color="#b7a99e" />
          </mesh>
          <mesh position={[0, 0.2, 0.03]}>
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color={poster.color} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

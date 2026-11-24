import { Html, RoundedBox, useCursor } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useThemeStore } from '@/store/themeStore'
import { skillsLink } from '@/data/navigation'
import Smoke from './Smoke'
import styles from './SceneLabel.module.css'

type HouseProps = {
  roofColor: string
  position: [number, number, number]
  isAnimating: boolean
  reducedMotion: boolean
}

export default function House({ roofColor, position, isAnimating, reducedMotion }: HouseProps) {
  // La maison suit le thème partagé pour éclairer ses fenêtres la nuit.
  const isNight = useThemeStore((state) => state.mode === 'night')
  // Le survol ne concerne que cette maison : il reste dans un état local React.
  const [isHovered, setIsHovered] = useState(false)
  const canvas = useThree((state) => state.gl.domElement)
  const router = useRouter()
  useCursor(isHovered, 'pointer', 'grab', canvas)

  function openHouse(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    // Un déplacement de plus de quatre pixels est traité comme un glisser.
    if (event.button === 0 && event.delta <= 4) router.push(skillsLink.href)
  }

  return (
    <group
      position={position}
      onClick={openHouse}
      onPointerOver={(event) => {
        event.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {isHovered && (
        <Html position={[0, 2.75, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className={styles.label} aria-hidden="true">{skillsLink.label}</span>
        </Html>
      )}
      {!reducedMotion && <Smoke isAnimating={isAnimating} />}
      <RoundedBox castShadow receiveShadow args={[1.4, 1.3, 1.2]} radius={0.08} smoothness={2} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#fff0d9" roughness={1} />
      </RoundedBox>
      {/* Un cylindre à trois côtés, couché, donne un toit triangulaire simple. */}
      <mesh castShadow position={[0, 1.67, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.45, 1, 1]}>
        <cylinderGeometry args={[0.78, 0.78, 1.65, 3]} />
        <meshStandardMaterial color={roofColor} flatShading roughness={1} />
      </mesh>
      <RoundedBox castShadow args={[0.5, 0.82, 0.1]} radius={0.15} smoothness={3} position={[0, 0.41, 0.62]}>
        <meshStandardMaterial color="#b4927c" />
      </RoundedBox>
      <mesh position={[0.12, 0.38, 0.69]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#f5ddb0" />
      </mesh>
      <RoundedBox castShadow args={[0.28, 0.65, 0.32]} radius={0.03} smoothness={2} position={[0.5, 2, -0.3]}>
        <meshStandardMaterial color="#f4dfcb" />
      </RoundedBox>
      <mesh castShadow position={[0.5, 2.32, -0.3]}>
        <boxGeometry args={[0.38, 0.1, 0.42]} />
        <meshStandardMaterial color="#b4927c" />
      </mesh>
      {/* Les deux fenêtres utilisent le même modèle et le thème partagé. */}
      {[-0.43, 0.43].map((x) => (
        <group key={x} position={[x, 0.94, 0.61]}>
          <mesh>
            <circleGeometry args={[0.17, 16]} />
            <meshStandardMaterial
              color={isNight ? '#ffe1a0' : '#a7cfda'}
              emissive="#ffc878"
              emissiveIntensity={isNight ? 1.8 : 0}
              toneMapped={!isNight}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <torusGeometry args={[0.17, 0.035, 6, 16]} />
            <meshStandardMaterial color="#b4927c" />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.025, 0.32, 0.025]} />
            <meshStandardMaterial color="#fff0d9" />
          </mesh>
        </group>
      ))}
      {isNight && <pointLight position={[0, 1, 1]} color="#ffc878" intensity={2} distance={3} decay={2} />}
      <mesh receiveShadow position={[0, 0.06, 0.85]}>
        <boxGeometry args={[0.65, 0.12, 0.4]} />
        <meshStandardMaterial color="#d5c3b4" />
      </mesh>
    </group>
  )
}

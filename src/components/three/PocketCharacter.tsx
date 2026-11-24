import { Html, RoundedBox, useCursor } from '@react-three/drei'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import type { Group } from 'three'
import { aboutLink } from '@/data/navigation'
import styles from './SceneLabel.module.css'

type PocketCharacterProps = {
  isAnimating: boolean
  reducedMotion: boolean
  variant?: 'island' | 'portrait'
}

const restingArmAngle = 2.45
const waveDuration = 2.6

export default function PocketCharacter({ isAnimating, reducedMotion, variant = 'island' }: PocketCharacterProps) {
  const armRef = useRef<Group>(null)
  const waveTime = useRef(0)
  const [isHovered, setIsHovered] = useState(false)
  const canvas = useThree((state) => state.gl.domElement)
  const invalidate = useThree((state) => state.invalidate)
  const router = useRouter()
  const isPortrait = variant === 'portrait'
  useCursor(isHovered && !isPortrait, 'pointer', isPortrait ? 'default' : 'grab', canvas)

  // On déplace le bras directement, sans relancer React à chaque image.
  useFrame((_, delta) => {
    const arm = armRef.current
    if (!arm) return
    if (!isAnimating || reducedMotion) {
      arm.rotation.z = restingArmAngle
      return
    }
    if (waveTime.current >= waveDuration) return

    waveTime.current = Math.min(waveTime.current + Math.min(delta, 0.1), waveDuration)
    const fade = Math.sin((waveTime.current / waveDuration) * Math.PI)
    arm.rotation.z = restingArmAngle + Math.sin(waveTime.current * Math.PI * 3.2) * 0.24 * fade
    if (isPortrait && waveTime.current < waveDuration) invalidate()
  })

  function openAbout(event: ThreeEvent<MouseEvent>) {
    if (isPortrait) return
    event.stopPropagation()
    if (event.button === 0 && event.delta <= 4) router.push(aboutLink.href)
  }

  return (
    <group
      position={isPortrait ? [0, 0, 0] : [1.15, 0.1, 0.4]}
      rotation={[0, isPortrait ? 0.05 : 0.45, 0]}
      scale={isPortrait ? 1 : 0.8}
      onClick={openAbout}
      onPointerOver={(event) => {
        event.stopPropagation()
        setIsHovered(true)
        if (!reducedMotion) {
          waveTime.current = 0
          invalidate()
        }
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {isHovered && !isPortrait && (
        <Html position={[0, 1.85, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <span className={styles.label} aria-hidden="true">{aboutLink.label}</span>
        </Html>
      )}
      {[-1, 1].map((side) => (
        <group key={side}>
          <RoundedBox castShadow args={[0.17, 0.13, 0.28]} radius={0.05} smoothness={2} position={[side * 0.1, 0.065, 0.04]}>
            <meshStandardMaterial color="#fff0d9" roughness={0.7} />
          </RoundedBox>
          <mesh castShadow position={[side * 0.1, 0.26, 0]}>
            <capsuleGeometry args={[0.055, 0.28, 4, 8]} />
            <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh castShadow receiveShadow position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.17, 0.27, 0.43, 12]} />
        <meshStandardMaterial color="#b8afd1" roughness={0.65} />
      </mesh>
      <RoundedBox castShadow args={[0.32, 0.28, 0.2]} radius={0.07} smoothness={2} position={[0, 0.87, 0]}>
        <meshStandardMaterial color="#fff0d9" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.24, 0.15, 0.035]} radius={0.02} smoothness={2} position={[0, 0.8, 0.125]}>
        <meshStandardMaterial color="#b8afd1" roughness={0.65} />
      </RoundedBox>
      <mesh castShadow position={[0, 1.04, 0]}>
        <sphereGeometry args={[0.065, 10, 8]} />
        <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 1.25, -0.055]} scale={[1, 1.08, 0.9]}>
        <sphereGeometry args={[0.255, 12, 10]} />
        <meshStandardMaterial color="#d69daf" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.24, 0.03]} scale={[0.98, 1, 0.92]}>
        <sphereGeometry args={[0.225, 14, 12]} />
        <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh castShadow position={[side * 0.19, 1.23, 0.015]} scale={[0.07, 0.22, 0.14]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#d69daf" roughness={0.7} />
          </mesh>
          <mesh position={[side * 0.075, 1.27, 0.24]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshStandardMaterial color="#493e49" />
          </mesh>
          <mesh position={[side * 0.12, 1.23, 0.225]} scale={[0.028, 0.018, 0.01]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshStandardMaterial color="#e7a9be" />
          </mesh>
        </group>
      ))}
      <mesh castShadow position={[0, 1.405, 0.13]} scale={[0.21, 0.065, 0.13]}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshStandardMaterial color="#d69daf" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0.244]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.045, 0.009, 4, 12, Math.PI]} />
        <meshStandardMaterial color="#a77682" />
      </mesh>
      <mesh castShadow position={[-0.23, 0.84, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
        <meshStandardMaterial color="#fff0d9" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.25, 0.69, 0]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
      </mesh>
      {/* Le groupe pivote à l’épaule ; le bras et la main suivent ce mouvement. */}
      <group ref={armRef} position={[0.2, 0.94, 0]} rotation={[0, 0, restingArmAngle]}>
        <mesh castShadow position={[0, -0.1, 0]}>
          <capsuleGeometry args={[0.055, 0.11, 4, 8]} />
          <meshStandardMaterial color="#fff0d9" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.23, 0]}>
          <capsuleGeometry args={[0.04, 0.1, 4, 8]} />
          <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, -0.33, 0]} scale={[1, 1.05, 0.6]}>
          <sphereGeometry args={[0.065, 10, 8]} />
          <meshStandardMaterial color="#f2d8c4" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

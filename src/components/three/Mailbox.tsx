import { RoundedBox, useCursor } from '@react-three/drei'
import { useThree, type ThreeEvent } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { contactLink } from '@/data/navigation'

export default function Mailbox() {
  const [isHovered, setIsHovered] = useState(false)
  const canvas = useThree((state) => state.gl.domElement)
  const router = useRouter()
  useCursor(isHovered, 'pointer', 'grab', canvas)

  function openContact(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    if (event.button === 0 && event.delta <= 4) router.push(contactLink.href)
  }

  return (
    <group
      position={[0.85, 0.1, 1.4]}
      rotation={[0, -0.15, 0]}
      onClick={openContact}
      onPointerOver={(event) => {
        event.stopPropagation()
        setIsHovered(true)
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      <mesh castShadow position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.68, 6]} />
        <meshStandardMaterial color="#a98b77" flatShading roughness={1} />
      </mesh>
      <RoundedBox castShadow receiveShadow args={[0.42, 0.32, 0.5]} radius={0.12} smoothness={3} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#afc6c3" roughness={1} />
      </RoundedBox>
      <mesh position={[0, 0.8, 0.252]}>
        <boxGeometry args={[0.25, 0.14, 0.02]} />
        <meshStandardMaterial color="#fff0d9" />
      </mesh>
      <mesh position={[0.23, 0.94, 0]}>
        <boxGeometry args={[0.025, 0.24, 0.025]} />
        <meshStandardMaterial color="#a98b77" />
      </mesh>
      <mesh position={[0.29, 1.02, 0]}>
        <boxGeometry args={[0.13, 0.09, 0.03]} />
        <meshStandardMaterial color="#dba0ae" />
      </mesh>
    </group>
  )
}

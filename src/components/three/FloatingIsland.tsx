import House from './House'
import Tree from './Tree'
import Mailbox from './Mailbox'
import ProjectsBoard from './ProjectsBoard'
import PocketCharacter from './PocketCharacter'
import { RoundedBox } from '@react-three/drei'

const steppingStones: [number, number, number][] = [
  [0, 0.15, 1.1],
  [-0.1, 0.15, 1.55],
  [0.08, 0.15, 2],
]

type FloatingIslandProps = {
  isAnimating: boolean
  reducedMotion: boolean
}
//construit le sol et place les éléments.

export default function FloatingIsland({ isAnimating, reducedMotion }: FloatingIslandProps) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, -0.55, 0]}>
        <cylinderGeometry args={[2.65, 2.15, 0.9, 9]} />
        <meshStandardMaterial color="#c5a18c" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0.08, -1.35, -0.06]} rotation={[0, 0.08, 0]}>
        <cylinderGeometry args={[2.15, 1.15, 0.7, 9]} />
        <meshStandardMaterial color="#a88478" flatShading roughness={1} />
      </mesh>
      <mesh position={[0.08, -1.95, -0.06]} rotation={[Math.PI, 0.08, 0]}>
        <coneGeometry args={[1.15, 0.5, 9]} />
        <meshStandardMaterial color="#947669" flatShading roughness={1} />
      </mesh>
      <mesh receiveShadow>
        <cylinderGeometry args={[2.65, 2.65, 0.2, 9]} />
        <meshStandardMaterial color="#b1c49b" flatShading roughness={1} />
      </mesh>
      <mesh position={[-1.8, -0.55, 1.3]} rotation={[0.3, 0.5, 0.2]} scale={[0.6, 0.8, 0.5]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#d1c5bd" flatShading roughness={1} />
      </mesh>
      <mesh position={[1.7, -0.7, 1.1]} rotation={[0.2, 0, 0.5]} scale={[0.6, 0.5, 0.45]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#c4bbc1" flatShading roughness={1} />
      </mesh>
      <House position={[0, 0.1, -0.2]} roofColor="#dba0ae" isAnimating={isAnimating} reducedMotion={reducedMotion} />
      <Mailbox />
      <PocketCharacter isAnimating={isAnimating} reducedMotion={reducedMotion} />
      <ProjectsBoard />
      <Tree position={[-1.65, 0.1, -0.65]} scale={1} />
      <Tree position={[1.65, 0.1, -0.65]} scale={0.85} />
      {steppingStones.map((position) => (
        <RoundedBox
          key={position[2]}
          position={position}
          rotation={[0, 0.12, 0]}
          args={[0.55, 0.1, 0.3]}
          radius={0.04}
          smoothness={2}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#e3d3c4" roughness={1} />
        </RoundedBox>
      ))}
    </group>
  )
}

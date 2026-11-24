type TreeProps = {
  position: [number, number, number]
  scale: number
}

export default function Tree({ position, scale }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.07, 0.12, 0.9, 5]} />
        <meshStandardMaterial color="#9c7b6b" flatShading roughness={1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial color="#e6afbf" flatShading roughness={1} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.38, 1, 0.08]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#f3c6d2" flatShading roughness={1} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.38, 1.05, 0.05]}>
        <dodecahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color="#d99eb5" flatShading roughness={1} />
      </mesh>
    </group>
  )
}

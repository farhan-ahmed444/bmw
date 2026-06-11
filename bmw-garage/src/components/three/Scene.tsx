import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Particles from './Particles'

interface SceneProps {
  className?: string
}

function CarModel() {
  const groupRef = useRef<THREE.Group>(null)

  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0066B1',
    metalness: 0.8,
    roughness: 0.2,
    envMapIntensity: 1.5,
  }), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.15
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.3
  })

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#88CCFF',
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.4,
    envMapIntensity: 1.0,
  }), [])

  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111111',
    metalness: 0.3,
    roughness: 0.7,
  }), [])

  const lightMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    metalness: 0.1,
    roughness: 0.3,
    emissive: '#4466AA',
    emissiveIntensity: 0.3,
  }), [])

  const wheelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.6,
    roughness: 0.4,
  }), [])

  const rimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#888888',
    metalness: 0.9,
    roughness: 0.1,
  }), [])

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      <mesh position={[0, 0.15, 0]} material={bodyMat}>
        <boxGeometry args={[1.8, 0.3, 3.6]} />
      </mesh>
      <mesh position={[0, 0.35, -0.2]} material={glassMat}>
        <boxGeometry args={[1.4, 0.2, 1.8]} />
      </mesh>
      <mesh position={[0.7, 0.1, 0.8]} material={darkMat}>
        <boxGeometry args={[0.15, 0.1, 0.5]} />
      </mesh>
      <mesh position={[-0.7, 0.1, 0.8]} material={darkMat}>
        <boxGeometry args={[0.15, 0.1, 0.5]} />
      </mesh>
      <mesh position={[0.7, 0.1, -1.0]} material={lightMat}>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
      </mesh>
      <mesh position={[-0.7, 0.1, -1.0]} material={lightMat}>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
      </mesh>
      <mesh position={[0.6, 0, 1.2]} material={lightMat}>
        <boxGeometry args={[0.1, 0.08, 0.1]} />
      </mesh>
      <mesh position={[-0.6, 0, 1.2]} material={lightMat}>
        <boxGeometry args={[0.1, 0.08, 0.1]} />
      </mesh>
      {[[0.7, 0, 1.1], [-0.7, 0, 1.1], [0.7, 0, -1.1], [-0.7, 0, -1.1]].map((pos, i) => (
        <group key={i} position={[pos[0], pos[1], pos[2]]}>
          <mesh material={wheelMat} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
          </mesh>
          <mesh material={rimMat} position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.16, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-3, 5, -3]} intensity={0.5} color="#4488ff" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#0066B1" />
      <CarModel />
      <Particles count={1500} color="#4A90D9" size={0.03} />
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#1a3a5c"
        sectionSize={2}
        sectionThickness={1.2}
        sectionColor="#2a5a8c"
        fadeDistance={25}
        infiniteGrid
      />
      <Environment preset="studio" resolution={1024} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.6} mipmapBlur />
      </EffectComposer>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={2}
        maxDistance={8}
        autoRotate={false}
        target={[0, 0.5, 0]}
      />
    </>
  )
}

export default function Scene({ className }: SceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere, useTexture, Text } from "@react-three/drei"
import * as THREE from "three"

function Earth() {
  // Use a more realistic Earth texture
  const earthTexture = useTexture("/placeholder.svg?height=1024&width=2048")
  const bumpMap = useTexture("/placeholder.svg?height=1024&width=2048")
  const specularMap = useTexture("/placeholder.svg?height=1024&width=2048")

  return (
    <Sphere args={[1, 64, 64]}>
      <meshPhongMaterial
        map={earthTexture}
        bumpMap={bumpMap}
        bumpScale={0.05}
        specularMap={specularMap}
        specular={new THREE.Color(0x333333)}
        shininess={5}
        emissive={new THREE.Color(0x112244)}
        emissiveIntensity={0.1}
      />
    </Sphere>
  )
}

function Atmosphere() {
  return (
    <Sphere args={[1.01, 32, 32]}>
      <meshStandardMaterial color="#8ab4ff" transparent opacity={0.15} roughness={0.2} metalness={0.8} />
    </Sphere>
  )
}

function Satellites({ count = 120 }) {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // Create satellite positions with different orbital planes
  const satellites = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const orbitGroup = Math.floor(i / 20) // Group satellites into different orbital planes
      const angle = ((i % 20) / 20) * Math.PI * 2
      const orbitRadius = 1.5 + orbitGroup * 0.1
      const orbitInclination = Math.PI * 0.1 + orbitGroup * Math.PI * 0.02

      return {
        position: new THREE.Vector3(
          Math.cos(angle) * orbitRadius,
          Math.sin(orbitInclination) * orbitRadius * 0.5,
          Math.sin(angle) * orbitRadius,
        ),
        speed: 0.001 + Math.random() * 0.001,
        angle,
        orbitRadius,
        orbitInclination,
        orbitGroup,
        active: Math.random() > 0.2, // Some satellites are inactive
        size: 0.03 + Math.random() * 0.01,
      }
    })
  }, [count])

  // Create satellite meshes
  const satelliteMeshes = useMemo(() => {
    return satellites.map((data, i) => {
      const geometry = new THREE.BoxGeometry(data.size, data.size, data.size)
      const material = new THREE.MeshStandardMaterial({
        color: data.active ? "#60a5fa" : "#475569",
        emissive: data.active ? "#3b82f6" : "#1e293b",
        emissiveIntensity: data.active ? 2 : 0.5,
        metalness: 0.8,
        roughness: 0.2,
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.copy(data.position)
      return mesh
    })
  }, [satellites])

  useEffect(() => {
    if (group.current) {
      // Add all satellite meshes to the group
      satelliteMeshes.forEach((mesh) => {
        group.current?.add(mesh)
      })
    }

    return () => {
      if (group.current) {
        // Clean up meshes on unmount
        satelliteMeshes.forEach((mesh) => {
          group.current?.remove(mesh)
        })
      }
    }
  }, [satelliteMeshes])

  useFrame((_, delta) => {
    if (!group.current) return

    // Rotate the entire satellite group
    group.current.rotation.y += 0.0005

    // Update each satellite position
    satellites.forEach((data, i) => {
      if (i >= group.current!.children.length) return

      const satellite = group.current!.children[i]
      data.angle += data.speed * delta * 60

      satellite.position.x = Math.cos(data.angle) * data.orbitRadius
      satellite.position.z = Math.sin(data.angle) * data.orbitRadius
      satellite.position.y = Math.sin(data.orbitInclination + data.angle * 0.2) * data.orbitRadius * 0.5

      // Add subtle rotation to each satellite
      satellite.rotation.x += delta * 0.5
      satellite.rotation.y += delta * 0.3
    })
  })

  return <group ref={group} />
}

function OrbitLines() {
  const orbitCount = 6
  const orbits = useMemo(() => {
    return Array.from({ length: orbitCount }, (_, i) => {
      const radius = 1.5 + i * 0.1
      const inclination = Math.PI * 0.1 + i * Math.PI * 0.02
      return { radius, inclination }
    })
  }, [orbitCount])

  return (
    <group>
      {orbits.map((orbit, i) => (
        <mesh key={i} rotation={[orbit.inclination, 0, 0]}>
          <ringGeometry args={[orbit.radius, orbit.radius + 0.005, 128]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

function SatelliteInfo() {
  const { camera } = useThree()

  return (
    <Text
      position={[0, -1.8, 0]}
      fontSize={0.1}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      renderOrder={1000}
      depthTest={false}
      outlineWidth={0.01}
      outlineColor="#000000"
    >
      Starlink Satellite Constellation
    </Text>
  )
}

export default function SatelliteOrbit() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[5, 5, 5]} intensity={1} angle={0.3} penumbra={1} castShadow />

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />

      <Earth />
      <Atmosphere />
      <OrbitLines />
      <Satellites count={120} />
      <SatelliteInfo />

      {/* Add a subtle glow effect */}
      <fog attach="fog" args={["#000000", 5, 15]} />
    </Canvas>
  )
}

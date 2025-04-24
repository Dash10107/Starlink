"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html } from "@react-three/drei"
import * as THREE from "three"
import { motion } from "framer-motion"

// Coverage data with percentages
const coverageData = [
  { region: "North America", lat: 40, lng: -100, coverage: 95 },
  { region: "Europe", lat: 50, lng: 10, coverage: 90 },
  { region: "Asia", lat: 35, lng: 105, coverage: 75 },
  { region: "Australia", lat: -25, lng: 135, coverage: 85 },
  { region: "South America", lat: -20, lng: -60, coverage: 80 },
  { region: "Africa", lat: 5, lng: 20, coverage: 60 },
  { region: "Middle East", lat: 25, lng: 45, coverage: 70 },
  { region: "Russia", lat: 60, lng: 100, coverage: 65 },
  { region: "India", lat: 20, lng: 80, coverage: 55 },
  { region: "Southeast Asia", lat: 10, lng: 115, coverage: 50 },
]

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Earth texture
  const earthTexture = new THREE.TextureLoader().load("/placeholder.svg?height=1024&width=2048")
  const bumpMap = new THREE.TextureLoader().load("/placeholder.svg?height=1024&width=2048")
  const cloudsTexture = new THREE.TextureLoader().load("/placeholder.svg?height=1024&width=2048")

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.055
    }
  })

  return (
    <>
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specular={new THREE.Color(0x333333)}
          shininess={5}
          emissive={new THREE.Color(0x112244)}
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Cloud layer */}
      <Sphere ref={cloudsRef} args={[1.02, 32, 32]}>
        <meshPhongMaterial map={cloudsTexture} transparent opacity={0.4} depthWrite={false} />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[1.1, 32, 32]}>
        <meshBasicMaterial color="#4b6cb7" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
    </>
  )
}

function CoverageAreas({ setHoveredRegion }: { setHoveredRegion: (region: string | null) => void }) {
  // Convert lat/lng to 3D coordinates
  const pointsArray = useMemo(() => {
    return coverageData.map((point) => {
      const { lat, lng, region, coverage } = point
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)

      const x = -(Math.sin(phi) * Math.cos(theta)) * 1.02
      const y = Math.cos(phi) * 1.02
      const z = Math.sin(phi) * Math.sin(theta) * 1.02

      return { x, y, z, region, coverage }
    })
  }, [])

  return (
    <group>
      {pointsArray.map((point, i) => (
        <group
          key={i}
          position={[point.x, point.y, point.z]}
          onPointerOver={() => setHoveredRegion(point.region)}
          onPointerOut={() => setHoveredRegion(null)}
        >
          {/* Pulsing coverage indicator */}
          <mesh>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>

          {/* Coverage area with size based on coverage percentage */}
          <mesh>
            <sphereGeometry args={[0.05 + (point.coverage / 100) * 0.2, 16, 16]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
          </mesh>

          {/* HTML tooltip */}
          <Html
            position={[0, 0.1, 0]}
            center
            style={{
              width: "120px",
              textAlign: "center",
              background: "rgba(0, 0, 0, 0.7)",
              padding: "5px",
              borderRadius: "5px",
              transform: "scale(0.5)",
              opacity: 0,
              transition: "opacity 0.2s",
              pointerEvents: "none",
            }}
            className="coverage-tooltip"
            distanceFactor={10}
          >
            <div className="text-white text-xs">
              <div className="font-bold">{point.region}</div>
              <div className="text-blue-300">{point.coverage}% Coverage</div>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

export default function CoverageGlobe() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />

        <Earth />
        <CoverageAreas setHoveredRegion={setHoveredRegion} />
      </Canvas>

      {/* Region info overlay */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white p-4 rounded-lg border border-blue-500/50 backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold mb-1">{hoveredRegion}</h3>
          <p className="text-sm text-blue-300">
            {coverageData.find((d) => d.region === hoveredRegion)?.coverage}% Coverage
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/80 p-3 rounded-lg border border-blue-500/50 backdrop-blur-sm">
        <h4 className="text-white text-sm font-bold mb-2">Coverage Percentage</h4>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50"></div>
          <span className="text-white text-xs">50-70%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 opacity-75"></div>
          <span className="text-white text-xs">70-90%</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-white text-xs">90-100%</span>
        </div>
      </div>
    </div>
  )
}

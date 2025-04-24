"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Satellite, Zap, Wifi } from "lucide-react"

// Animated counter hook
function useCounter(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!startOnView || isInView) {
      let startTime: number | null = null
      let animationFrameId: number

      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)

        // Easing function for smoother counting
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCount)
        }
      }

      animationFrameId = requestAnimationFrame(updateCount)

      return () => cancelAnimationFrame(animationFrameId)
    }
  }, [end, duration, startOnView, isInView])

  return { count, ref }
}

export default function SatelliteCounter() {
  const { count: satelliteCount, ref: satelliteRef } = useCounter(12000, 3000)
  const { count: countriesCount, ref: countriesRef } = useCounter(100, 2500)
  const { count: speedCount, ref: speedRef } = useCounter(150, 2000)

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="bg-blue-900/30 p-6 rounded-xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <Satellite className="h-10 w-10 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Satellite Constellation</h3>
        <div ref={satelliteRef} className="text-4xl font-bold text-blue-300 mb-2">
          {satelliteCount.toLocaleString()}+
        </div>
        <p className="text-gray-300">
          Satellites planned to provide global coverage with multiple satellites visible from any point on Earth.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-blue-900/30 p-6 rounded-xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <Zap className="h-10 w-10 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Low Latency</h3>
        <div ref={speedRef} className="text-4xl font-bold text-blue-300 mb-2">
          {speedCount} Mbps
        </div>
        <p className="text-gray-300">
          Average download speed with latency as low as 20-30ms, compared to 600ms+ for traditional geostationary
          satellites.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="bg-blue-900/30 p-6 rounded-xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <Wifi className="h-10 w-10 text-blue-400 mb-4" />
        <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
        <div ref={countriesRef} className="text-4xl font-bold text-blue-300 mb-2">
          {countriesCount}+ Countries
        </div>
        <p className="text-gray-300">
          Countries with active Starlink service, creating a resilient mesh network in space that spans the globe.
        </p>
      </motion.div>
    </div>
  )
}

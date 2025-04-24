"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, Satellite } from "lucide-react"
import { Button } from "@/components/ui/button"
import ParticleField from "./particle-field"

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
      {/* Animated particle background */}
      <ParticleField />

      {/* Content */}
      <motion.div className="relative z-10 text-center px-4" style={{ opacity }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-6">
            <Satellite className="h-10 w-10 text-blue-400 mr-3" />
            <span className="text-xl font-light tracking-widest">SPACEX PRESENTS</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-400 tracking-tight"
          >
            The Starlink Revolution
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Global internet through the power of satellite constellations
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 group transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              onClick={() => {
                const timelineSection = document.querySelector("section:nth-of-type(1)")
                if (timelineSection) {
                  timelineSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Explore the Journey{" "}
              <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating satellite */}
      <motion.div
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, -20, 0], opacity: 1 }}
        transition={{
          y: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" },
          opacity: { duration: 1, delay: 1 },
        }}
        className="absolute right-[10%] top-1/3 hidden lg:block"
        style={{ y }}
      >
        <img
          src="/placeholder.svg?height=200&width=200"
          alt="Starlink Satellite"
          className="h-32 w-32 opacity-80 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]"
        />
      </motion.div>

      {/* Earth glow */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/30 to-transparent" />
    </div>
  )
}

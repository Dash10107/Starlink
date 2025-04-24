"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Satellite } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import LoadingSpinner from "@/components/loading-spinner"

// Static components
import HeroSection from "@/components/hero-section"
import Timeline from "@/components/timeline"
import QrCodeSection from "@/components/qr-code-section"

// Dynamically imported heavy components
const SatelliteOrbit = dynamic(() => import("@/components/satellite-orbit"), {
  loading: () => <LoadingSpinner label="Loading satellite visualization..." />,
  ssr: false,
})

const CoverageGlobe = dynamic(() => import("@/components/coverage-globe"), {
  loading: () => <LoadingSpinner label="Loading coverage map..." />,
  ssr: false,
})

const SpeedComparison = dynamic(() => import("@/components/speed-comparison"), {
  loading: () => <LoadingSpinner label="Loading speed comparison..." />,
})

const UseCases = dynamic(() => import("@/components/use-cases"))
const FutureVision = dynamic(() => import("@/components/future-vision"))
const SatelliteCounter = dynamic(() => import("@/components/satellite-counter"))

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Smooth progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const fullHeight = document.body.scrollHeight - windowHeight

      setScrollProgress((scrollPosition / fullHeight) * 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <div className="relative bg-black text-white" ref={mainRef}>
      {/* Accessibility skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-900 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Fixed progress bar */}
      <div className="fixed top-0 left-0 w-full z-50 h-1 bg-black/20">
        <motion.div
          className="h-full bg-blue-500"
          style={{ width: `${scrollProgress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ ease: "easeOut", duration: 0.2 }}
        />
      </div>

      {/* Parallax background */}
      <motion.div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black" />
      </motion.div>

      {/* Hero Section */}
      <HeroSection />

      <main id="main-content">
        {/* Timeline Section */}
        <section className="relative py-24 bg-gradient-to-b from-black to-blue-950/50 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                JOURNEY
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Starlink Timeline</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From concept to global connectivity, follow the revolutionary journey of Starlink's development and
                expansion.
              </p>
            </motion.div>

            <Timeline />
          </div>
        </section>

        {/* Satellite Orbit Visualization */}
        <section className="relative py-24 bg-gradient-to-b from-blue-950/50 to-indigo-950/50 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                CONSTELLATION
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Satellite Network Architecture</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Visualize the vast network of Starlink satellites orbiting Earth in Low Earth Orbit (LEO).
              </p>
            </motion.div>

            <div className="h-[600px] w-full mb-12 relative">
              <Suspense fallback={<LoadingSpinner label="Loading satellite visualization..." />}>
                <SatelliteOrbit />
              </Suspense>
            </div>

            <SatelliteCounter />
          </div>
        </section>

        {/* Coverage Map/Globe */}
        <section className="relative py-24 bg-gradient-to-b from-indigo-950/50 to-blue-950/50 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                GLOBAL REACH
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Worldwide Coverage</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore Starlink's expanding global coverage bringing high-speed internet to previously unconnected
                regions.
              </p>
            </motion.div>

            <div className="h-[600px] w-full relative">
              <Suspense fallback={<LoadingSpinner label="Loading coverage map..." />}>
                <CoverageGlobe />
              </Suspense>
            </div>

            <div className="mt-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
                className="inline-block bg-blue-900/30 p-6 rounded-xl backdrop-blur-sm border border-blue-500/20"
              >
                <h3 className="text-2xl font-bold mb-4">100+ Countries Served</h3>
                <p className="text-gray-300 max-w-2xl">
                  From remote villages in the Himalayas to islands in the Pacific, Starlink is connecting the previously
                  unconnected across the globe.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Internet Speed Comparison */}
        <section className="relative py-24 bg-gradient-to-b from-blue-950/50 to-indigo-950/50 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                PERFORMANCE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Speed Comparison</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how Starlink's performance compares to traditional internet options.
              </p>
            </motion.div>

            <Suspense fallback={<LoadingSpinner label="Loading speed comparison..." />}>
              <SpeedComparison />
            </Suspense>
          </div>
        </section>

        {/* Use Cases */}
        <section className="relative py-24 bg-gradient-to-b from-indigo-950/50 to-blue-950/50 z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                APPLICATIONS
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Real-World Applications</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover how Starlink is transforming lives and industries across the globe.
              </p>
            </motion.div>

            <Suspense fallback={<LoadingSpinner label="Loading use cases..." />}>
              <UseCases />
            </Suspense>
          </div>
        </section>

        {/* Future Vision */}
        <section className="relative py-24 bg-gradient-to-b from-blue-950/50 to-black z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                THE FUTURE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Vision for Tomorrow</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore the ambitious roadmap for Starlink's future expansion and technological advancements.
              </p>
            </motion.div>

            <Suspense fallback={<LoadingSpinner label="Loading future vision..." />}>
              <FutureVision />
            </Suspense>
          </div>
        </section>

        {/* QR Code Section */}
        <section className="relative py-24 bg-black z-10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 text-blue-400 border-blue-400">
                SHARE
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Share This Presentation</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Scan the QR code to access this presentation on your mobile device or share with others.
              </p>
            </motion.div>

            <QrCodeSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-blue-900/30 z-10 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Satellite className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-2xl font-bold">Starlink Revolution</span>
          </div>
          <p className="text-gray-400 mb-8">Created by SPIT Computer Engineering Students | April 2025</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              References
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              About SpaceX
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Starlink Official
            </Link>
            <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

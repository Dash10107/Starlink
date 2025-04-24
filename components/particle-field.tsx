"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, useSpring, motion } from "framer-motion"

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse tracking with springs
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Star properties with different sizes and brightness
    const stars: {
      x: number
      y: number
      radius: number
      speed: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number
      color: string
    }[] = []

    const numStars = Math.floor((canvas.width * canvas.height) / 10000)
    const colors = ["#ffffff", "#f8f8ff", "#e6e6ff", "#b3d9ff", "#80c1ff"]

    // Create stars with varied properties
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Animation loop
    let animationFrameId: number
    let lastTime = 0

    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Get current mouse position
      const currentMouseX = springX.get()
      const currentMouseY = springY.get()

      // Draw stars
      stars.forEach((star) => {
        // Update twinkle phase
        star.twinklePhase += star.twinkleSpeed * deltaTime

        // Calculate distance from mouse for interactive effect
        const dx = star.x - currentMouseX
        const dy = star.y - currentMouseY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Stars react to mouse proximity
        const mouseFactor = Math.max(0, 1 - distance / 300)
        const finalOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase)) + mouseFactor * 0.3
        const finalRadius = star.radius + mouseFactor * 1.5

        // Draw star with glow effect
        ctx.beginPath()

        // Outer glow
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, finalRadius * 4)
        gradient.addColorStop(0, star.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.globalAlpha = finalOpacity * 0.3
        ctx.arc(star.x, star.y, finalRadius * 4, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.fillStyle = star.color
        ctx.globalAlpha = finalOpacity
        ctx.arc(star.x, star.y, finalRadius, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 1.0

        // Move stars
        star.y += star.speed

        // Reset stars that go off screen
        if (star.y > window.innerHeight) {
          star.y = 0
          star.x = Math.random() * window.innerWidth
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mouseX, mouseY, springX, springY])

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  )
}

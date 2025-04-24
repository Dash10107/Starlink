"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Rocket, Satellite, Globe, Zap, Wifi } from "lucide-react"

const timelineEvents = [
  {
    year: 2015,
    title: "Project Announcement",
    description: "Elon Musk announces the Starlink project with a vision to provide global internet coverage.",
    icon: <Rocket className="h-6 w-6" />,
    color: "bg-blue-600",
  },
  {
    year: 2018,
    title: "First Test Satellites",
    description: "SpaceX launches the first two Starlink test satellites, Tintin A and B.",
    icon: <Satellite className="h-6 w-6" />,
    color: "bg-indigo-600",
  },
  {
    year: 2019,
    title: "First 60 Satellites",
    description: "The first batch of 60 operational Starlink satellites is launched into orbit.",
    icon: <Satellite className="h-6 w-6" />,
    color: "bg-purple-600",
  },
  {
    year: 2020,
    title: "Beta Service Begins",
    description: "Starlink begins its 'Better Than Nothing Beta' service in the United States and Canada.",
    icon: <Wifi className="h-6 w-6" />,
    color: "bg-cyan-600",
  },
  {
    year: 2021,
    title: "Global Expansion",
    description: "Starlink expands service to multiple countries and reaches over 100,000 users.",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-teal-600",
  },
  {
    year: 2023,
    title: "Inter-Satellite Links",
    description: "Advanced satellites with laser inter-satellite links deployed, reducing ground station dependence.",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-blue-600",
  },
  {
    year: 2025,
    title: "Global Coverage Complete",
    description: "Full global coverage achieved with over 12,000 satellites in orbit.",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-indigo-600",
  },
]

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Timeline progress animation
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.1, 1])

  return (
    <div className="relative" ref={containerRef}>
      {/* Vertical line with progress animation */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-900/20" />
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-500 origin-top"
        style={{
          scaleY,
          height: "100%",
        }}
      />

      {/* Timeline events */}
      <div className="relative">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={`mb-16 flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Content */}
            <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
              <div className="text-blue-400 text-xl font-bold mb-2">{event.year}</div>
              <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-300">{event.description}</p>
            </div>

            {/* Icon with hover effect */}
            <div className="w-2/12 flex justify-center">
              <motion.div
                className={`${event.color} h-12 w-12 rounded-full flex items-center justify-center z-10 shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer`}
                whileHover={{
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.7)",
                }}
                tabIndex={0}
                role="button"
                aria-label={`${event.year}: ${event.title}`}
              >
                {event.icon}
              </motion.div>
            </div>

            {/* Empty space for alternating layout */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

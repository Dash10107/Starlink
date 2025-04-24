"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Rocket, Satellite, Zap, Smartphone, Globe, Cpu } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const futureVision = [
  {
    year: 2025,
    title: "42,000 Satellite Constellation",
    description: "Expanding the constellation to 42,000 satellites for enhanced coverage and capacity.",
    icon: <Satellite className="h-10 w-10 text-blue-400" />,
    details:
      "With regulatory approval for up to 42,000 satellites, Starlink will achieve unprecedented coverage density. This expansion will enable higher bandwidth allocation per user, reduced congestion during peak hours, and more consistent service quality across all regions.",
  },
  {
    year: 2026,
    title: "Direct-to-Phone Connectivity",
    description: "Enabling direct satellite connectivity to standard smartphones without specialized equipment.",
    icon: <Smartphone className="h-10 w-10 text-green-400" />,
    details:
      "Next-generation satellites will feature enhanced antennas capable of connecting directly to consumer smartphones. This breakthrough will provide basic text messaging and emergency services anywhere on Earth, even without cellular coverage, revolutionizing global communication accessibility.",
  },
  {
    year: 2027,
    title: "Inter-Planetary Internet",
    description: "Extending the network to support communications between Earth, the Moon, and Mars.",
    icon: <Globe className="h-10 w-10 text-purple-400" />,
    details:
      "As humanity expands its presence in space, Starlink will deploy specialized satellites with high-power laser communication links to create the first inter-planetary internet backbone. This network will support NASA's Artemis program, private lunar missions, and eventually the first human settlements on Mars.",
  },
  {
    year: 2028,
    title: "AI-Powered Routing",
    description: "Implementing advanced AI systems for intelligent traffic management and network optimization.",
    icon: <Cpu className="h-10 w-10 text-yellow-400" />,
    details:
      "Artificial intelligence will dynamically optimize data routing through the constellation in real-time, predicting network congestion before it occurs and rerouting traffic accordingly. This system will learn user patterns to preemptively allocate resources where they'll be needed most.",
  },
  {
    year: 2029,
    title: "Quantum Encryption",
    description: "Deploying quantum encryption technology for unhackable communications.",
    icon: <Zap className="h-10 w-10 text-red-400" />,
    details:
      "Leveraging quantum key distribution, Starlink will offer the world's first globally available quantum-encrypted communication channels. This technology will make intercepting or decrypting transmissions theoretically impossible, setting new standards for secure government, financial, and personal communications.",
  },
  {
    year: 2030,
    title: "Starship Integration",
    description: "Using Starship to deploy next-generation satellites with enhanced capabilities.",
    icon: <Rocket className="h-10 w-10 text-cyan-400" />,
    details:
      "SpaceX's Starship will enable deployment of much larger, more capable satellites with expanded solar arrays, more powerful computing systems, and larger antenna arrays. These satellites will offer multi-gigabit speeds to users and support billions of simultaneous connections for IoT devices worldwide.",
  },
]

export default function FutureVision() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  return (
    <div>
      {/* Interactive Timeline */}
      <div className="relative mb-12">
        <div className="absolute left-0 right-0 h-1 top-4 bg-blue-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
        <div className="flex justify-between">
          {futureVision.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className={`${selectedYear === item.year ? "bg-blue-400" : "bg-blue-600"} h-8 w-8 rounded-full flex items-center justify-center z-10 relative cursor-pointer transition-colors duration-300 hover:bg-blue-400`}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedYear(selectedYear === item.year ? null : item.year)}
                tabIndex={0}
                role="button"
                aria-label={`View details for year ${item.year}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedYear(selectedYear === item.year ? null : item.year)
                  }
                }}
              >
                <span className="text-xs font-bold">{item.year}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected year detail */}
      <AnimatePresence mode="wait">
        {selectedYear && (
          <motion.div
            key={selectedYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-blue-900/30 border border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-blue-400 mr-2">{selectedYear}</span>
                  {futureVision.find((v) => v.year === selectedYear)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base">
                  {futureVision.find((v) => v.year === selectedYear)?.details}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {futureVision.map((vision, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <Card
              className={`bg-blue-900/20 border border-blue-900/50 h-full backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] cursor-pointer ${selectedYear === vision.year ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setSelectedYear(selectedYear === vision.year ? null : vision.year)}
            >
              <CardHeader>
                <div className="mb-4">{vision.icon}</div>
                <CardTitle className="flex items-center">
                  <span className="text-blue-400 mr-2">{vision.year}</span>
                  {vision.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base">{vision.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Building, Globe, Home, Shield, Stethoscope, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const useCases = [
  {
    title: "Remote Education",
    description:
      "Enabling students in remote areas to access online learning resources, virtual classrooms, and educational content.",
    icon: <BookOpen className="h-10 w-10 text-blue-400" />,
    color: "border-blue-500",
    details:
      "In the Himalayan regions, schools now connect to global educational platforms, allowing students to participate in advanced courses previously unavailable. Teachers can access training resources and collaborate with educators worldwide.",
  },
  {
    title: "Rural Connectivity",
    description:
      "Bringing high-speed internet to rural communities, farms, and remote homes previously without reliable access.",
    icon: <Home className="h-10 w-10 text-green-400" />,
    color: "border-green-500",
    details:
      "Farmers in remote areas can now access weather forecasts, market prices, and agricultural best practices in real-time. Families can stay connected with relatives, access entertainment, and participate in the digital economy.",
  },
  {
    title: "Telemedicine",
    description:
      "Supporting remote healthcare consultations, medical monitoring, and health services in underserved regions.",
    icon: <Stethoscope className="h-10 w-10 text-red-400" />,
    color: "border-red-500",
    details:
      "Mobile clinics equipped with Starlink can connect patients to specialists hundreds of miles away. Remote monitoring allows doctors to track patient vitals and medication adherence, while emergency services can coordinate responses more effectively.",
  },
  {
    title: "Disaster Response",
    description:
      "Providing critical communications during natural disasters when terrestrial infrastructure is damaged.",
    icon: <Shield className="h-10 w-10 text-yellow-400" />,
    color: "border-yellow-500",
    details:
      "After hurricanes and earthquakes, Starlink terminals have been rapidly deployed to restore communications for emergency services. Search and rescue teams can coordinate efforts, share real-time mapping data, and maintain contact with command centers.",
  },
  {
    title: "Global Business",
    description:
      "Enabling businesses to operate in remote locations with reliable connectivity for operations and communications.",
    icon: <Building className="h-10 w-10 text-purple-400" />,
    color: "border-purple-500",
    details:
      "Mining operations in remote locations can now implement IoT monitoring systems and maintain reliable communications with headquarters. Remote workers can collaborate seamlessly with global teams through video conferencing and cloud-based tools.",
  },
  {
    title: "Developing Nations",
    description:
      "Helping developing countries leapfrog traditional infrastructure limitations to join the digital economy.",
    icon: <Globe className="h-10 w-10 text-cyan-400" />,
    color: "border-cyan-500",
    details:
      "Communities that would have waited decades for fiber infrastructure can now participate in e-commerce, digital government services, and online banking. Local entrepreneurs can access global markets and educational resources to build sustainable businesses.",
  },
]

export default function UseCases() {
  const [expandedCase, setExpandedCase] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {useCases.map((useCase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card
            className={`bg-blue-900/20 border-t-4 ${useCase.color} h-full backdrop-blur-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer`}
            onClick={() => setExpandedCase(expandedCase === index ? null : index)}
          >
            <CardHeader>
              <div className="mb-4">{useCase.icon}</div>
              <CardTitle className="flex items-center justify-between">
                {useCase.title}
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${expandedCase === index ? "rotate-90" : ""}`}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-base">{useCase.description}</CardDescription>

              <AnimatePresence>
                {expandedCase === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-blue-500/20 text-sm text-gray-300">{useCase.details}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

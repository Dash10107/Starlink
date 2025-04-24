"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import QRCode from "qrcode"

export default function QrCodeSection() {
  const qrRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (qrRef.current) {
      // Generate QR code with the current URL
      QRCode.toCanvas(
        qrRef.current,
        window.location.href,
        {
          width: 256,
          margin: 1,
          color: {
            dark: "#ffffff",
            light: "#000000",
          },
          errorCorrectionLevel: "H",
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    }
  }, [])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "The Starlink Revolution",
          text: "Check out this interactive presentation about Starlink!",
          url: window.location.href,
        })
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleDownload = () => {
    if (qrRef.current) {
      const link = document.createElement("a")
      link.download = "starlink-presentation-qr.png"
      link.href = qrRef.current.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)]"
      >
        <canvas ref={qrRef} className="h-64 w-64" aria-label="QR code to access this presentation" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="max-w-md"
      >
        <h3 className="text-2xl font-bold mb-4">Scan to Access</h3>
        <p className="text-gray-300 mb-6">
          Scan this QR code with your mobile device to access this presentation anytime, anywhere. Share it with
          colleagues, students, or anyone interested in the Starlink revolution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 group transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            Share This Presentation
          </Button>

          <Button
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-900/30 flex items-center gap-2 group"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
            Download QR Code
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

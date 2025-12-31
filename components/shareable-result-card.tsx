"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2, Instagram } from "lucide-react"
import { ZeroCaresLogo } from "@/components/zero-caries-logo"
import { QRCodeSVG } from "qrcode.react"

interface ShareableResultCardProps {
  patientAge?: number
  lesionsDetected: number
  curodontEligible: number
  successRate: number
  analysisDate: Date
  clinicName?: string
  clinicLogo?: string
}

export function ShareableResultCard({
  patientAge,
  lesionsDetected,
  curodontEligible,
  successRate = 93,
  analysisDate,
  clinicName = "Clínica Miro",
  clinicLogo,
}: ShareableResultCardProps) {
  const generateImage = async () => {
    const canvas = document.getElementById("shareable-canvas") as HTMLCanvasElement
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `zero-caries-${analysisDate.getTime()}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <Card className="relative overflow-hidden w-full max-w-[540px] aspect-square mx-auto bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="absolute inset-0 mesh-gradient opacity-30" />

        <div className="relative h-full flex flex-col p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <ZeroCaresLogo className="w-16 h-16" />
            <div className="text-right">
              <div className="text-4xl font-black text-black">{successRate}%</div>
              <div className="text-sm text-muted-foreground">Éxito Clínico</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-32 h-32 bg-gradient-to-br from-[#00D9FF] to-blue-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <div className="text-white">
                <div className="text-5xl font-black">{curodontEligible}</div>
                <div className="text-xs uppercase">Elegibles</div>
              </div>
            </motion.div>

            <div>
              <h3 className="text-3xl font-black text-black mb-2">Detección Temprana</h3>
              <p className="text-lg text-muted-foreground">
                {lesionsDetected} caries detectadas • {curodontEligible} tratables sin dolor
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">0</div>
                <div className="text-xs text-muted-foreground">Taladro</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-black">0</div>
                <div className="text-xs text-muted-foreground">Inyecciones</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-black">0</div>
                <div className="text-xs text-muted-foreground">Dolor</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <div className="font-bold text-lg">{clinicName}</div>
              <div className="text-sm text-muted-foreground">Tecnología Zero Caries</div>
            </div>
            <QRCodeSVG value="https://zerocaries.clinicamiro.cl" size={60} />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={generateImage}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          <Instagram className="mr-2" />
          Descargar para Instagram
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Análisis Zero Caries",
                text: `${curodontEligible} caries tratables sin dolor detectadas con IA`,
                url: "https://zerocaries.clinicamiro.cl",
              })
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Hidden canvas for image generation */}
      <canvas id="shareable-canvas" width={1080} height={1080} className="hidden" />
    </div>
  )
}

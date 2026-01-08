"use client"

import { motion } from "framer-motion"
import { Check, AlertCircle, Info, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function CurodontInfoCard() {
  const eligibleConditions = [
    "Caries en esmalte (E1, E2)",
    "Caries inicial en dentina (D1)",
    "Manchas blancas (white spots)",
    "Descalcificación por brackets",
    "Lesiones no cavitadas",
  ]

  const notEligibleConditions = [
    "Caries cavitadas visibles",
    "Caries profundas en dentina (D2, D3)",
    "Lesiones que requieren endodoncia",
    "Fracturas dentales",
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="border-2 border-[#00D9FF] bg-gradient-to-r from-[#00D9FF]/10 to-green-50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#00D9FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tratamiento 100% No Invasivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="font-bold text-gray-900">SIN INYECCIONES</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="font-bold text-gray-900">SIN FRESADO MECÁNICO</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-3 italic">
                Preserva 100% la estructura dental. Perfecto para niños y personas con fobia dental.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-2 border-[#00D9FF]/20">
        <div className="bg-gradient-to-r from-black to-gray-900 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center">
              <Info className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold">¿Qué es Curodont?</h3>
              <p className="text-sm text-gray-300">Tecnología de Regeneración Guiada del Esmalte</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-black">Curodont Repair Fluoride Plus</strong> utiliza péptidos autoensamblables
            (P11-4) que penetran en la lesión cariosa y forman una matriz tridimensional. Esta matriz atrae calcio y
            fosfato de la saliva, regenerando nuevos cristales de hidroxiapatita desde el interior del diente.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Elegible */}
            <div className="space-y-3">
              <h4 className="font-bold text-black flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                Lesiones Elegibles
              </h4>
              <ul className="space-y-2">
                {eligibleConditions.map((condition) => (
                  <li key={condition} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>

            {/* No elegible */}
            <div className="space-y-3">
              <h4 className="font-bold text-black flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                Requieren Otro Tratamiento
              </h4>
              <ul className="space-y-2">
                {notEligibleConditions.map((condition) => (
                  <li key={condition} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence badge */}
          <div className="flex items-center gap-3 p-4 bg-[#00D9FF]/5 rounded-xl border border-[#00D9FF]/20">
            <div className="text-3xl font-bold text-[#00D9FF]">93%</div>
            <div className="text-sm text-muted-foreground">
              <strong className="text-black">Tasa de éxito clínico</strong>
              <br />
              Estudio JADA 2023 con seguimiento de 6 años
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

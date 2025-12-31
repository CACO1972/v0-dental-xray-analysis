"use client"

import { motion } from "framer-motion"
import { Check, AlertCircle, Info } from "lucide-react"
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
    >
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

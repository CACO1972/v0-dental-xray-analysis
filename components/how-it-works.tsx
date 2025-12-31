"use client"

import { motion } from "framer-motion"
import { Upload, Brain, FileCheck, Sparkles } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Sube tu Radiografía",
    description: "Bitewing o periapical para detectar caries interproximales invisibles a simple vista.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Análisis con IA",
    description: "Nuestra IA analiza cada diente usando nomenclatura FDI y clasifica las lesiones E0-D3.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Diagnóstico Instantáneo",
    description: "Recibe un informe detallado con las lesiones detectadas y su elegibilidad para Curodont.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Tratamiento Sin Dolor",
    description: "Las lesiones elegibles se tratan con Curodont en 15 minutos, regenerando tu esmalte.",
  },
]

export function HowItWorks() {
  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent hidden lg:block" />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative text-center"
          >
            {/* Step number */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white text-xl font-bold mb-6 relative z-10">
              <span className="text-[#00D9FF]">{step.number}</span>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center">
              <step.icon className="w-6 h-6 text-[#00D9FF]" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

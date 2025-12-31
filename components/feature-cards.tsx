"use client"

import { motion } from "framer-motion"
import { Scan, Brain, Shield, Sparkles, Zap, Heart } from "lucide-react"

const features = [
  {
    icon: Scan,
    title: "Detección por IA",
    description: "Análisis de RX bitewing y periapicales con precisión del 95% en caries interproximales incipientes.",
    metric: "95%",
    metricLabel: "Precisión",
  },
  {
    icon: Brain,
    title: "Predicción de Riesgo",
    description:
      "Modelo predictivo que evalúa tu riesgo de nuevas caries a 3, 6 y 12 meses basado en múltiples factores.",
    metric: "ML",
    metricLabel: "Algoritmo",
  },
  {
    icon: Shield,
    title: "Sin Taladro",
    description:
      "Curodont regenera el esmalte con péptidos autoensamblables P11-4 que forman nuevos cristales de hidroxiapatita.",
    metric: "0",
    metricLabel: "Dolor",
  },
  {
    icon: Sparkles,
    title: "Regeneración Real",
    description:
      "No solo detiene la caries: regenera el esmalte perdido desde el interior, restaurando la estructura dental.",
    metric: "100%",
    metricLabel: "Biomimético",
  },
  {
    icon: Zap,
    title: "15 Minutos",
    description: "Tratamiento completo en una sola sesión. Sin anestesia, sin molestias, sin tiempo de recuperación.",
    metric: "15",
    metricLabel: "Minutos",
  },
  {
    icon: Heart,
    title: "Desde 3 Años",
    description: "Seguro para niños y adultos con ansiedad dental. La experiencia más suave en odontología moderna.",
    metric: "3+",
    metricLabel: "Años",
  },
]

export function FeatureCards() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
          className="group relative bg-white rounded-2xl p-8 border border-border hover:border-[#00D9FF]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#00D9FF]/10"
        >
          {/* Metric badge */}
          <div className="absolute top-6 right-6 flex flex-col items-end">
            <span className="text-2xl font-bold text-[#00D9FF]">{feature.metric}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{feature.metricLabel}</span>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <feature.icon className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  )
}

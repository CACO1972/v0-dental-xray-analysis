"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ZeroCaresLogotype, ZeroCaresLogo } from "@/components/zero-caries-logo"
import { AnimatedMolarScanner } from "@/components/animated-molar-scanner"
import { StatsSection } from "@/components/stats-counter"
import { FeatureCards } from "@/components/feature-cards"
import { HowItWorks } from "@/components/how-it-works"
import { CurodontInfoCard } from "@/components/curodont-info-card"
import { DualImageUploader } from "@/components/dual-image-uploader"
import { ClinicaMiroBookingWidget } from "@/components/clinica-miro-booking-widget"

export default function Home() {
  const [showAnalyzer, setShowAnalyzer] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <ZeroCaresLogotype />
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground hover:text-black transition-colors"
            >
              Cómo Funciona
            </a>
            <a
              href="#analizar"
              className="text-sm font-medium text-muted-foreground hover:text-black transition-colors"
            >
              Analizar
            </a>
            <a
              href="#curodont"
              className="text-sm font-medium text-muted-foreground hover:text-black transition-colors"
            >
              Curodont
            </a>
          </div>
          <Button
            className="bg-black text-white hover:bg-black/90 rounded-full px-6"
            onClick={() => {
              setShowAnalyzer(true)
              document.getElementById("analizar")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Comenzar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 grid-pattern" />

        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              className="space-y-8 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
                Detección con Inteligencia Artificial
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[1.1] tracking-tight">
                Detecta caries
                <br />
                <span className="text-[#00D9FF] neon-text">antes de sentirlas</span>
              </h1>

              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tratamiento Sin Dolor</h3>
                    <div className="space-y-1 text-base text-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <strong>SIN INYECCIONES</strong> de anestesia
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <strong>SIN FRESADO MECÁNICO</strong> ni taladro
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subheadline */}
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Análisis instantáneo de radiografías dentales con IA. Descubre si eres elegible para
                <strong className="text-black"> tratamiento Curodont</strong> - regeneración sin dolor.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    setShowAnalyzer(true)
                    document.getElementById("analizar")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  Analizar mi Radiografía
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-semibold border-2 bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demostración
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">93%</div>
                  <div className="text-xs text-muted-foreground">Éxito Clínico</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">30s</div>
                  <div className="text-xs text-muted-foreground">Análisis</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">0</div>
                  <div className="text-xs text-muted-foreground">Dolor</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Molar Scanner Animation */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md mx-auto animate-float">
                <AnimatedMolarScanner className="w-full h-auto" />
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="text-xs uppercase tracking-wider">Descubre más</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border bg-white">
        <div className="container mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-[#00D9FF] uppercase tracking-wider">Proceso Simple</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">¿Cómo Funciona?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cuatro pasos simples para detectar y tratar caries sin dolor
            </p>
          </motion.div>
          <HowItWorks />
        </div>
      </section>

      {/* Analyzer Section */}
      <section id="analizar" className="py-24 bg-gradient-to-b from-white to-[#00D9FF]/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-[#00D9FF] uppercase tracking-wider">Análisis con IA</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">Analiza tu Radiografía</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sube tu radiografía bitewing o periapical y recibe un diagnóstico preliminar en segundos
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <DualImageUploader />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-[#00D9FF] uppercase tracking-wider">Tecnología Avanzada</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">¿Por qué Zero Caries?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combinamos inteligencia artificial de última generación con tratamiento biomimético
            </p>
          </motion.div>
          <FeatureCards />
        </div>
      </section>

      {/* Curodont Info */}
      <section id="curodont" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-medium text-[#00D9FF] uppercase tracking-wider">El Tratamiento</span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">Conoce Curodont</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <CurodontInfoCard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-black p-12 md:p-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 grid-pattern" />
            </div>

            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                ¿Listo para una sonrisa
                <br />
                <span className="text-[#00D9FF]">sin caries?</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Agenda tu evaluación completa en Clínica Miró y descubre si eres candidato para tratamiento Curodont sin
                inyecciones ni fresado.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <ClinicaMiroBookingWidget />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ZeroCaresLogo className="w-10 h-10" />
              <div>
                <div className="font-bold text-black">Zero Caries</div>
                <div className="text-xs text-muted-foreground">by Clínica Miro</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Herramienta de evaluación preliminar. El diagnóstico final debe ser confirmado por un dentista
              certificado.
            </p>
            <div className="text-sm text-muted-foreground">© 2025 Clínica Miro. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { ZeroCaresLogotype } from "@/components/zero-caries-logo"
import { DualImageUploader } from "@/components/dual-image-uploader"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, Sparkles, ChevronRight, Shield, Clock, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StatsSection } from "@/components/stats-counter"
import { HowItWorks } from "@/components/how-it-works"
import { CurodontInfoCard } from "@/components/curodont-info-card"
import { CurodontProtocolViewer } from "@/components/curodont-protocol-viewer"
import { PricingCalculator } from "@/components/pricing-calculator"
import { motion } from "framer-motion"

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="sticky top-0 z-50 glass border-b border-[#D4A54A]/20 bg-black/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <ZeroCaresLogotype className="scale-90" />

          <div className="flex gap-3">
            <Button
              size="sm"
              className="bg-[#D4A54A] hover:bg-[#C49540] text-black font-bold rounded-full shadow-lg shadow-[#D4A54A]/30 transition-all hover:scale-105 hidden sm:flex"
              onClick={() => window.open("https://ff.healthatom.io/TA6eA1", "_blank")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="border-[#D4A54A] text-[#D4A54A] hover:bg-[#D4A54A]/10 font-semibold rounded-full transition-all hover:scale-105 bg-transparent"
              onClick={() =>
                window.open(
                  "https://wa.me/56974157966?text=Hola, me gustaría saber más sobre Zero Caries y el tratamiento sin inyecciones",
                  "_blank",
                )
              }
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        <motion.div
          className="text-center space-y-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A54A] text-black text-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
            Detección con Inteligencia Artificial
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Detecta <span className="text-[#D4A54A]">Caries Temprana</span>
            <br />
            <span className="text-[#00D9FF]">Sin Dolor</span>
          </h1>

          <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 rounded-2xl border-2 border-emerald-500/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <span className="text-white text-3xl font-bold">✓</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl font-bold text-white mb-3">Tratamiento Revolucionario</h3>
                <div className="space-y-2 text-lg text-emerald-100">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-2xl">•</span>
                    <strong>SIN INYECCIONES</strong> de anestesia
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-2xl">•</span>
                    <strong>SIN FRESADO MECÁNICO</strong> ni taladro
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold text-2xl">•</span>
                    <strong>REGENERACIÓN NATURAL</strong> del esmalte
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Análisis instantáneo con IA en <strong className="text-[#D4A54A]">30 segundos</strong> • Descubre si
            calificas para <strong className="text-[#00D9FF]">tratamiento Curodont</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-[#D4A54A] hover:bg-[#C49540] text-black font-bold rounded-full px-10 py-6 text-lg shadow-2xl shadow-[#D4A54A]/40 transition-all hover:scale-105 w-full sm:w-auto"
              onClick={() => window.open("https://ff.healthatom.io/TA6eA1", "_blank")}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Evaluación Presencial
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[#D4A54A] text-white hover:bg-[#D4A54A]/20 font-bold rounded-full px-10 py-6 text-lg transition-all hover:scale-105 w-full sm:w-auto bg-transparent"
              onClick={() =>
                window.open(
                  "https://wa.me/56974157966?text=Hola, me gustaría saber más sobre Zero Caries y el tratamiento sin inyecciones ni fresado",
                  "_blank",
                )
              }
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Consultar por WhatsApp
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-900/60 to-emerald-800/30 border-emerald-500/40 p-6 hover:scale-105 transition-transform">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-lg">Sin Inyecciones</h3>
              <p className="text-sm text-gray-300">100% indoloro, sin anestesia</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/60 to-blue-800/30 border-blue-500/40 p-6 hover:scale-105 transition-transform">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-lg">Sin Fresado</h3>
              <p className="text-sm text-gray-300">Preserva tu diente natural</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-[#D4A54A]/60 to-[#C49540]/30 border-[#D4A54A]/40 p-6 hover:scale-105 transition-transform">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D4A54A]/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#D4A54A]" />
              </div>
              <h3 className="font-bold text-white text-lg">30 Segundos</h3>
              <p className="text-sm text-gray-300">Análisis instantáneo con IA</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/60 to-cyan-800/30 border-cyan-500/40 p-6 hover:scale-105 transition-transform">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-bold text-white text-lg">93% Éxito</h3>
              <p className="text-sm text-gray-300">Validado clínicamente</p>
            </div>
          </Card>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border border-white/10">
          <StatsSection />
        </div>

        <div id="analizar" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Analiza Tu Radiografía <span className="text-[#D4A54A]">Ahora</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Sube tu radiografía bitewing y foto intraoral para recibir un análisis completo con IA
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
            <DualImageUploader />
          </div>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Cómo <span className="text-[#D4A54A]">Funciona?</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Proceso simple en 4 pasos para detectar y tratar caries sin dolor
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-8 border border-white/10">
            <HowItWorks />
          </div>
        </div>

        <div id="curodont" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Conoce <span className="text-[#D4A54A]">Curodont</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              La tecnología suiza que regenera el esmalte dental sin dolor
            </p>
          </div>
          <CurodontInfoCard />
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Protocolo <span className="text-[#D4A54A]">Clínico</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Procedimiento paso a paso validado científicamente
            </p>
          </div>
          <CurodontProtocolViewer />
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Inversión en Tu <span className="text-[#D4A54A]">Salud</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Precios transparentes con 80% menos costo que tratamientos tradicionales
            </p>
          </div>
          <PricingCalculator />
        </div>

        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D4A54A] via-[#C49540] to-[#B38530] p-12 md:p-16 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
              ¿Listo para una Sonrisa
              <br />
              <span className="text-white">Sin Caries?</span>
            </h2>
            <p className="text-black/80 text-xl max-w-2xl mx-auto">
              Agenda tu evaluación completa en <strong>Clínica Miró</strong> y descubre si eres candidato para
              tratamiento Curodont <strong>sin inyecciones ni fresado</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="bg-black hover:bg-black/90 text-white font-bold rounded-full px-10 py-6 text-lg shadow-2xl transition-all hover:scale-105 w-full sm:w-auto"
                onClick={() => window.open("https://ff.healthatom.io/TA6eA1", "_blank")}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Evaluación
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black/10 font-bold rounded-full px-10 py-6 text-lg transition-all hover:scale-105 w-full sm:w-auto bg-white/20"
                onClick={() =>
                  window.open("https://wa.me/56974157966?text=Hola, quiero información sobre Zero Caries", "_blank")
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contactar Ahora
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="text-center space-y-6 pb-8 pt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4A54A]/50 to-transparent" />

          <div className="space-y-3">
            <p className="text-gray-400 text-sm">
              Tecnología de detección con IA • Resultados validados clínicamente •{" "}
              <span className="text-[#D4A54A] font-bold">Clínica Miró</span>
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="text-[#D4A54A]">📍</span> Santiago, Chile
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#D4A54A]">📞</span> +56 9 7415 7966
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[#D4A54A]">🌐</span> clinicamiro.cl
              </span>
            </div>

            <p className="text-xs text-gray-600 max-w-2xl mx-auto pt-4">
              Herramienta de evaluación preliminar. El diagnóstico final debe ser confirmado por un dentista
              certificado. © 2025 Clínica Miró - Zero Caries. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

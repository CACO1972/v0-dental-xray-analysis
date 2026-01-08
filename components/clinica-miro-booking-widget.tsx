"use client"

import { Calendar, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function ClinicaMiroBookingWidget() {
  const handleBookAppointment = () => {
    window.open("https://ff.healthatom.io/TA6eA1", "_blank")
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = "56974157966"
    const message = encodeURIComponent("Hola, me gustaría agendar una evaluación en Clínica Miró")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <Card className="bg-zinc-950 border-zinc-800 overflow-hidden">
      {/* Header con gradiente dorado */}
      <div className="bg-gradient-to-r from-[#D4A54A] to-[#C89536] p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-white">Agenda tu Evaluación</h3>
            <p className="text-white/90 text-sm">Da el primer paso hacia tu mejor sonrisa</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Beneficios */}
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-[#D4A54A]/10 p-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#D4A54A]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Evaluación completa</p>
              <p className="text-zinc-400 text-xs">Diagnóstico personalizado con tecnología avanzada</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 bg-[#D4A54A]/10 p-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#D4A54A]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Plan personalizado</p>
              <p className="text-zinc-400 text-xs">Tratamiento diseñado específicamente para ti</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 bg-[#D4A54A]/10 p-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-[#D4A54A]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Financiamiento inteligente</p>
              <p className="text-zinc-400 text-xs">Opciones flexibles para tu presupuesto</p>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-zinc-800 my-6" />

        {/* Botones de acción */}
        <div className="space-y-3">
          {/* Botón principal - Agendar */}
          <Button
            onClick={handleBookAppointment}
            className="w-full bg-[#D4A54A] hover:bg-[#C89536] text-black font-semibold text-base h-12 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#D4A54A]/20"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Evaluación Online
          </Button>

          {/* Botón secundario - WhatsApp */}
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            className="w-full border-2 border-[#D4A54A]/30 bg-[#D4A54A]/5 hover:bg-[#D4A54A]/10 text-white font-medium text-base h-12 rounded-xl transition-all duration-300 hover:border-[#D4A54A]/50"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contactar por WhatsApp
          </Button>
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-zinc-500 text-xs text-center">Horario de atención: Lunes a Viernes 9:00 - 19:00</p>
        </div>
      </div>
    </Card>
  )
}

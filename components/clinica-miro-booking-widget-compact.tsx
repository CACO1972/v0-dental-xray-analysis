"use client"

import { Calendar, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ClinicaMiroBookingWidgetCompact() {
  const handleBookAppointment = () => {
    window.open("https://ff.healthatom.io/TA6eA1", "_blank")
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = "56974157966"
    const message = encodeURIComponent("Hola, me gustaría agendar una evaluación en Clínica Miró")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          ¿Listo para tu <span className="text-[#D4A54A] italic">mejor sonrisa</span>?
        </h3>
        <p className="text-zinc-400 text-sm">Agenda tu evaluación y descubre tu plan personalizado</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleBookAppointment}
          className="flex-1 bg-[#D4A54A] hover:bg-[#C89536] text-black font-semibold h-12 rounded-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Agendar Ahora
        </Button>

        <Button
          onClick={handleWhatsAppContact}
          variant="outline"
          className="flex-1 border-2 border-[#D4A54A]/30 bg-[#D4A54A]/5 hover:bg-[#D4A54A]/10 text-white font-medium h-12 rounded-xl transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          WhatsApp
        </Button>
      </div>
    </div>
  )
}

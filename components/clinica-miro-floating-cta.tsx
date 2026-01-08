"use client"

import { Calendar, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ClinicaMiroFloatingCTA() {
  const [isOpen, setIsOpen] = useState(true)

  const handleBookAppointment = () => {
    window.open("https://ff.healthatom.io/TA6eA1", "_blank")
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = "56974157966"
    const message = encodeURIComponent("Hola, me gustaría agendar una evaluación en Clínica Miró")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-zinc-950 border-2 border-[#D4A54A]/30 rounded-2xl shadow-2xl shadow-[#D4A54A]/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D4A54A] to-[#C89536] p-4 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <h4 className="text-white font-serif font-bold text-lg pr-8">¡Agenda tu Evaluación!</h4>
          <p className="text-white/90 text-sm">Primera consulta disponible</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <Button
            onClick={handleBookAppointment}
            className="w-full bg-[#D4A54A] hover:bg-[#C89536] text-black font-semibold rounded-xl transition-all duration-300"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Online
          </Button>

          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            className="w-full border border-[#D4A54A]/30 bg-[#D4A54A]/5 hover:bg-[#D4A54A]/10 text-white rounded-xl transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Escribir a WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}

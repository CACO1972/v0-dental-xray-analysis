"use client"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EducationalTooltipProps {
  term: string
  explanation: string
}

export function EducationalTooltip({ term, explanation }: EducationalTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors">
            <span className="font-medium border-b border-dashed border-blue-400">{term}</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-black text-white p-3">
          <p className="text-sm">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const DENTAL_TERMS = {
  curodont:
    "Curodont™ es un tratamiento biomimético que remineraliza el esmalte dental sin necesidad de taladro, inyecciones o dolor. Ideal para caries tempranas.",
  e1: "E1 = Caries en esmalte superficial (menos del 50% del grosor). Reversible con tratamiento no invasivo.",
  e2: "E2 = Caries en esmalte profundo (más del 50% del grosor). Aún tratable sin taladro con Curodont.",
  d1: "D1 = Caries que alcanzó la dentina superficial. Última etapa donde Curodont puede ser efectivo.",
  d2: "D2 = Caries en dentina media. Requiere tratamiento restaurador convencional (empaste).",
  d3: "D3 = Caries profunda cerca de la pulpa. Puede requerir endodoncia.",
  interproximal:
    "Caries entre dientes, en la zona de contacto. Solo visible en radiografías. Son las más comunes y difíciles de detectar.",
  bitewing: "Radiografía de aleta de mordida. La mejor técnica para detectar caries interproximales tempranas.",
  periapical:
    "Radiografía que muestra el diente completo desde la corona hasta la raíz. Útil para ver infecciones y caries profundas.",
  remineralization:
    "Proceso natural de reparación del esmalte donde minerales (calcio, fosfato) se depositan para revertir caries tempranas.",
}

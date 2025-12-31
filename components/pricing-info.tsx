import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function PricingInfo() {
  // Información de costos basada en la investigación
  const curodontCost = {
    boxPrice: 80, // USD por caja de 10 aplicadores
    applicatorsPerBox: 10,
    lesionsPerBox: 30, // Hasta 30 lesiones tratables
    costPerLesion: 2.67, // USD (80/30)
    clpExchangeRate: 950, // Aproximado USD to CLP
  }

  const pricePerTreatmentCLP = Math.round(curodontCost.costPerLesion * curodontCost.clpExchangeRate * 8) // 8x markup para clínica

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00D9FF]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <span className="text-2xl">💰</span>
            Información de Costos - Curodont™
          </CardTitle>
          <CardDescription>Tratamiento transparente y accesible</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#00D9FF]/20">
              <div className="text-sm text-muted-foreground mb-1">Precio por lesión</div>
              <div className="text-3xl font-bold text-black">${pricePerTreatmentCLP.toLocaleString("es-CL")}</div>
              <div className="text-sm text-muted-foreground">CLP por caries tratada</div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-[#00D9FF]/20">
              <div className="text-sm text-muted-foreground mb-1">Duración tratamiento</div>
              <div className="text-3xl font-bold text-black">15 min</div>
              <div className="text-sm text-muted-foreground">Una sola sesión</div>
            </div>
          </div>

          <Alert className="bg-blue-50 border-[#00D9FF]/30">
            <Info className="h-4 w-4 text-[#00D9FF]" />
            <AlertDescription className="text-black text-sm">
              <strong>Comparación:</strong> Una obturación convencional cuesta entre $35,000-$60,000 CLP y requiere
              taladro, anestesia y más tiempo de recuperación.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold text-black text-sm">Incluye:</h4>
            <ul className="space-y-1.5 text-sm text-black">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                <span>Evaluación diagnóstica completa</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                <span>Aplicación profesional de Curodont™ Repair Fluoride Plus</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                <span>Seguimiento radiográfico a los 6 meses</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00D9FF] mt-0.5 flex-shrink-0" />
                <span>Instrucciones de cuidado post-tratamiento</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Aprobado desde los 3 años:</strong> Curodont™ es seguro para niños y adultos de todas las edades.
              Ideal para pacientes pediátricos con ansiedad dental.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

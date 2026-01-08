"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Clock, AlertCircle, Sparkles } from "lucide-react"

const PROTOCOL_STEPS = [
  {
    step: 1,
    title: "Remoción de Película",
    duration: "2 min",
    description: "Limpiar la superficie dental con piedra pómez, pasta profiláctica o hipoclorito de sodio al 2%",
    critical: false,
  },
  {
    step: 2,
    title: "Enjuague y Secado",
    duration: "30 seg",
    description: "Enjuagar completamente con agua y secar con aire comprimido",
    critical: false,
  },
  {
    step: 3,
    title: "Grabado Ácido",
    duration: "20 seg",
    description:
      "Aplicar ácido fosfórico al 35% durante exactamente 20 segundos. Usar hilo dental sin cera para superficies interproximales",
    critical: true,
  },
  {
    step: 4,
    title: "Enjuague y Secado Final",
    duration: "30 seg",
    description: "Enjuagar abundantemente y secar. NO secar agresivamente",
    critical: true,
  },
  {
    step: 5,
    title: "Aislamiento Básico",
    duration: "1 min",
    description: "Aislar con rollos de algodón o dique seco. NO es necesario dique de goma",
    critical: false,
  },
  {
    step: 6,
    title: "Activación del Aplicador",
    duration: "10 seg",
    description: "Remover clip de seguridad, presionar cilindros juntos, esperar 10 segundos hasta saturación",
    critical: true,
  },
  {
    step: 7,
    title: "Aplicación de Curodont",
    duration: "1 min",
    description: "Exprimir esponja directamente sobre lesión. Para interproximales: aplicar desde vestibular Y lingual",
    critical: true,
  },
  {
    step: 8,
    title: "Tiempo de Espera",
    duration: "5 min",
    description: "NO enjuagar. Mantener área aislada durante 5 minutos completos",
    critical: true,
  },
]

export function CurodontProtocolViewer() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleCompleteStep = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
    if (stepIndex < PROTOCOL_STEPS.length - 1) {
      setCurrentStep(stepIndex + 1)
    }
  }

  const totalTime = PROTOCOL_STEPS.reduce((acc, step) => {
    const minutes = Number.parseInt(step.duration.split(" ")[0])
    return acc + minutes
  }, 0)

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00D9FF] bg-gradient-to-r from-[#00D9FF]/10 to-green-50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-[#00D9FF] flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Tratamiento 100% No Invasivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="font-semibold text-gray-900">SIN INYECCIONES DE ANESTESIA</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                  <span className="font-semibold text-gray-900">SIN FRESADO MECÁNICO</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-3 italic">
                Preserva 100% la estructura dental original. Ideal para pacientes con fobia dental o niños.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#00D9FF]/20 bg-white/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Protocolo Clínico Curodont™</CardTitle>
              <CardDescription className="text-base mt-2">
                Procedimiento validado paso a paso - Tiempo total: ~{totalTime} minutos
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completedSteps.length}/{PROTOCOL_STEPS.length} Completados
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PROTOCOL_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(index)
              const isCurrent = currentStep === index
              const isUpcoming = index > currentStep

              return (
                <div
                  key={step.step}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrent
                      ? "border-[#00D9FF] bg-[#00D9FF]/5 shadow-lg shadow-[#00D9FF]/20"
                      : isCompleted
                        ? "border-green-500/30 bg-green-50"
                        : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : isCurrent ? (
                        <Circle className="w-6 h-6 text-[#00D9FF] fill-[#00D9FF]/20" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3
                            className={`font-semibold ${
                              isCurrent ? "text-[#00D9FF]" : isCompleted ? "text-green-700" : "text-gray-700"
                            }`}
                          >
                            Paso {step.step}: {step.title}
                          </h3>
                          {step.critical && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Crítico
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {step.duration}
                        </div>
                      </div>

                      <p className={`text-sm ${isUpcoming ? "text-gray-500" : "text-gray-700"}`}>{step.description}</p>

                      {isCurrent && !isCompleted && (
                        <Button
                          onClick={() => handleCompleteStep(index)}
                          className="mt-3 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black"
                          size="sm"
                        >
                          Marcar como Completado
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Instrucciones Post-Tratamiento</h4>
                <p className="text-sm text-amber-800">
                  Indicar al paciente: <strong>NO enjuagar, comer ni beber durante 30 minutos</strong> después del
                  procedimiento. El aplicador es de un solo uso y debe descartarse después de la aplicación.
                </p>
              </div>
            </div>
          </div>

          {completedSteps.length === PROTOCOL_STEPS.length && (
            <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">¡Protocolo Completado!</h4>
                  <p className="text-sm text-green-800">
                    Agendar seguimiento a 3 meses para evaluar efectividad del tratamiento
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

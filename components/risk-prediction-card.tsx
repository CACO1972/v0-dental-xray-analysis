"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp, Calendar, Shield, Activity } from "lucide-react"

interface RiskPrediction {
  score: number
  level: "BAJO" | "MODERADO" | "ALTO" | "MUY ALTO"
  color: string
  factors: string[]
  futureProjection: string
  recommendations: string[]
  timeline: {
    "3meses": string
    "6meses": string
    "12meses": string
  }
}

interface RiskPredictionCardProps {
  prediction?: RiskPrediction
  lesionCount?: number
  patientAge?: number
  hasRadiograph?: boolean
  riskFactors?: string[]
}

export function RiskPredictionCard({
  prediction: predictionProp,
  lesionCount = 0,
  patientAge,
  hasRadiograph = true,
  riskFactors = [],
}: RiskPredictionCardProps) {
  const prediction = predictionProp || calculateLocalPrediction(lesionCount, patientAge, hasRadiograph, riskFactors)

  const getColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600 bg-green-50 border-green-200"
      case "yellow":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "orange":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "red":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-2 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Predicción de Riesgo</CardTitle>
                <CardDescription className="text-gray-400">Análisis predictivo con IA</CardDescription>
              </div>
            </div>
            <Badge className={`text-base font-bold px-4 py-2 ${getColorClass(prediction.color)}`}>
              {prediction.level}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Score visual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-muted-foreground">Puntuación de Riesgo</span>
              <span className="font-bold text-2xl text-black">{prediction.score}/100</span>
            </div>
            <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  prediction.score < 25
                    ? "bg-green-500"
                    : prediction.score < 50
                      ? "bg-yellow-500"
                      : prediction.score < 75
                        ? "bg-orange-500"
                        : "bg-red-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${prediction.score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Proyección futura */}
          <Alert className={getColorClass(prediction.color)}>
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-bold">Proyección 12 Meses</AlertTitle>
            <AlertDescription className="mt-2">{prediction.futureProjection}</AlertDescription>
          </Alert>

          {/* Factores de riesgo */}
          {prediction.factors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-black flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Factores de Riesgo Detectados
              </h4>
              <div className="space-y-2">
                {prediction.factors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-sm p-2 bg-orange-50 rounded-lg"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                    <span className="text-gray-700">{factor}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline predictivo */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00D9FF]" />
              Línea de Tiempo Predictiva
            </h4>
            <div className="grid gap-3">
              {[
                { label: "3 meses", key: "3meses" as const },
                { label: "6 meses", key: "6meses" as const },
                { label: "12 meses", key: "12meses" as const },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <Badge variant="outline" className="font-mono text-xs shrink-0 bg-white">
                    {item.label}
                  </Badge>
                  <p className="text-sm text-gray-700">{prediction.timeline[item.key]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-3">
            <h4 className="font-bold text-black flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Recomendaciones Personalizadas
            </h4>
            <div className="space-y-2">
              {prediction.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm p-2 bg-green-50 rounded-lg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 bg-[#00D9FF]/5 rounded-xl border border-[#00D9FF]/20">
            <Activity className="w-4 h-4 text-[#00D9FF] mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Modelo predictivo basado en estudios clínicos de progresión de caries. Los resultados son estimaciones y
              deben ser validados por un profesional dental.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function calculateLocalPrediction(
  lesionCount: number,
  patientAge: number | undefined,
  hasRadiograph: boolean,
  riskFactors: string[],
): RiskPrediction {
  let riskScore = 0
  const factors: string[] = [...riskFactors]

  // Factor: Número de lesiones
  if (lesionCount === 0) {
    riskScore += 0
  } else if (lesionCount <= 2) {
    riskScore += 20
    if (!factors.includes("Presencia de 1-2 lesiones activas")) {
      factors.push("Presencia de 1-2 lesiones activas")
    }
  } else if (lesionCount <= 4) {
    riskScore += 40
    if (!factors.includes("Múltiples lesiones activas (3-4)")) {
      factors.push("Múltiples lesiones activas (3-4)")
    }
  } else {
    riskScore += 60
    if (!factors.includes("Alto número de lesiones activas (5+)")) {
      factors.push("Alto número de lesiones activas (5+)")
    }
  }

  // Factor: Edad
  if (patientAge) {
    if (patientAge < 18) {
      riskScore += 15
      factors.push("Edad joven con mayor actividad de caries")
    } else if (patientAge > 60) {
      riskScore += 10
      factors.push("Riesgo de caries radiculares por recesión gingival")
    }
  }

  // Factor: Sin radiografía
  if (!hasRadiograph) {
    riskScore += 20
    factors.push("Sin evaluación radiográfica completa")
  }

  riskScore = Math.min(riskScore, 100)

  let level: "BAJO" | "MODERADO" | "ALTO" | "MUY ALTO"
  let color: string
  let futureProjection: string
  let recommendations: string[]

  if (riskScore < 25) {
    level = "BAJO"
    color = "green"
    futureProjection =
      "Con higiene adecuada, baja probabilidad de nuevas caries en los próximos 12 meses. Mantén controles anuales."
    recommendations = [
      "Mantén tu rutina de higiene actual",
      "Control dental anual preventivo",
      "Continúa con dieta baja en azúcares",
    ]
  } else if (riskScore < 50) {
    level = "MODERADO"
    color = "yellow"
    futureProjection =
      "Riesgo medio de desarrollar 1-2 nuevas lesiones en 6-12 meses sin intervención. Control cada 6 meses recomendado."
    recommendations = [
      "Aumenta frecuencia de cepillado a 3x/día",
      "Usa hilo dental diariamente",
      "Control cada 6 meses",
      "Considera enjuague con flúor",
    ]
  } else if (riskScore < 75) {
    level = "ALTO"
    color = "orange"
    futureProjection =
      "Alto riesgo de progresión. Sin tratamiento, las lesiones actuales avanzarán en 3-6 meses. Tratamiento urgente."
    recommendations = [
      "✨ Considera Curodont: SIN INYECCIONES NI FRESADO",
      "Tratamiento de lesiones en próximas 4 semanas",
      "Aplicación profesional de flúor cada 3 meses",
      "Elimina snacks azucarados entre comidas",
      "Control cada 3-4 meses",
    ]
  } else {
    level = "MUY ALTO"
    color = "red"
    futureProjection =
      "Riesgo crítico. Alta probabilidad de compromiso pulpar en 3 meses. Requiere plan de tratamiento integral."
    recommendations = [
      "⚠️ URGENTE: Agenda tratamiento esta semana",
      "✨ Curodont disponible: SIN INYECCIONES NI FRESADO",
      "Plan integral: trata todas las lesiones",
      "Aplicación de flúor profesional mensual",
      "Evaluación dietética con higienista",
    ]
  }

  if (!hasRadiograph) {
    recommendations.push("📸 CRÍTICO: Realiza radiografía bitewing")
  }

  return {
    score: riskScore,
    level,
    color,
    factors,
    futureProjection,
    recommendations,
    timeline: {
      "3meses": `${Math.round(riskScore * 0.1)} posibles nuevas lesiones`,
      "6meses": `${Math.round(riskScore * 0.2)} posibles nuevas lesiones, progresión de existentes`,
      "12meses": `${Math.round(riskScore * 0.4)} posibles nuevas lesiones si no hay intervención`,
    },
  }
}

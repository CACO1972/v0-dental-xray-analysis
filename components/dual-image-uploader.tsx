"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  X,
  Activity,
  ImageIcon,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
  XCircle,
} from "lucide-react"
import { RiskPredictionCard } from "@/components/risk-prediction-card"
import { validateImageFile, detectImageQuality } from "@/lib/validators"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { AnalysisProgressTracker } from "@/components/analysis-progress-tracker"
import { EducationalTooltip, DENTAL_TERMS } from "@/components/educational-tooltips"
import { ShareResultsButton } from "@/components/share-results-button"
import { CariesVisualization } from "@/components/caries-visualization"
import { formatToothDisplay } from "@/lib/fdi-nomenclature"

interface CariesLesion {
  tooth: string
  surface: string
  depth: string
  classification: string
  curodontEligible: "IDEAL" | "POSIBLE" | "NO"
  confidence: number
  description: string
}

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

interface AnalysisResult {
  dualAnalysis: boolean
  hasRadiograph: boolean
  hasIntraoral: boolean
  summary: string
  cariesDetected: number
  curodontEligible: number
  findings: string[]
  detailedAnalysis: CariesLesion[]
  markers: any[]
  recommendations: string[]
  curodontSummary: {
    eligible: number
    possiblyEligible: number
    notEligible: number
    overallRecommendation: string
  }
  riskPrediction: RiskPrediction
  analysisId?: string
}

export function DualImageUploader() {
  const [radiograph, setRadiograph] = useState<File | null>(null)
  const [radiographPreview, setRadiographPreview] = useState<string | null>(null)
  const [radiographQuality, setRadiographQuality] = useState<{ quality: string; issues: string[] } | null>(null)

  const [intraoral, setIntraoral] = useState<File | null>(null)
  const [intraoralPreview, setIntraoralPreview] = useState<string | null>(null)
  const [intraoralQuality, setIntraoralQuality] = useState<{ quality: string; issues: string[] } | null>(null)

  const [patientAge, setPatientAge] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState("")
  const [progressSteps, setProgressSteps] = useState<Array<{ id: string; label: string; status: string }>>([])
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const rxInputRef = useRef<HTMLInputElement>(null)
  const ioInputRef = useRef<HTMLInputElement>(null)

  const handleRadiographChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || "Archivo inválido")
        return
      }

      setRadiograph(file)
      setResult(null)
      setError(null)

      const reader = new FileReader()
      reader.onloadend = async () => {
        setRadiographPreview(reader.result as string)

        const quality = await detectImageQuality(file)
        setRadiographQuality(quality)

        if (quality.quality === "Pobre") {
          setError(`Advertencia: ${quality.issues.join(". ")}. Considera subir una imagen de mejor calidad.`)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIntraoralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || "Archivo inválido")
        return
      }

      setIntraoral(file)
      setResult(null)
      setError(null)

      const reader = new FileReader()
      reader.onloadend = async () => {
        setIntraoralPreview(reader.result as string)

        const quality = await detectImageQuality(file)
        setIntraoralQuality(quality)

        if (quality.quality === "Pobre") {
          setError(`Advertencia: ${quality.issues.join(". ")}. Considera subir una imagen de mejor calidad.`)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const clearRadiograph = () => {
    setRadiograph(null)
    setRadiographPreview(null)
    setResult(null)
    setRadiographQuality(null)
    if (rxInputRef.current) rxInputRef.current.value = ""
  }

  const clearIntraoral = () => {
    setIntraoral(null)
    setIntraoralPreview(null)
    setResult(null)
    setIntraoralQuality(null)
    if (ioInputRef.current) ioInputRef.current.value = ""
  }

  const handleAnalyze = async () => {
    if (!radiograph && !intraoral) return

    setAnalyzing(true)
    setError(null)
    setResult(null)

    const steps = [
      { id: "validate", label: "Validando imágenes", status: "in-progress" },
      { id: "upload", label: "Subiendo archivos", status: "pending" },
      { id: "ai", label: "Analizando con IA", status: "pending" },
      { id: "risk", label: "Calculando predicción de riesgo", status: "pending" },
      { id: "save", label: "Guardando resultados", status: "pending" },
    ]
    setProgressSteps(steps)

    try {
      const formData = new FormData()
      if (radiograph) formData.append("radiograph", radiograph)
      if (intraoral) formData.append("intraoral", intraoral)
      if (patientAge) formData.append("patientAge", patientAge)

      updateStepStatus("validate", "completed")
      updateStepStatus("upload", "in-progress")
      await delay(500)

      updateStepStatus("upload", "completed")
      updateStepStatus("ai", "in-progress")
      setAnalysisProgress("Analizando con IA (esto puede tomar 30-60 segundos)...")

      const response = await fetch("/api/analyze-dual", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === "INVALID_RX_FILE" || data.code === "INVALID_IO_FILE") {
          throw new Error(data.error)
        } else if (data.code === "TIMEOUT") {
          throw new Error("El análisis tomó demasiado tiempo. Intenta con una imagen más pequeña.")
        } else if (data.error?.includes("no es una radiografía dental")) {
          throw new Error("La imagen subida no parece ser una radiografía dental. Por favor verifica el archivo.")
        } else {
          throw new Error(data.error || "Error en el análisis")
        }
      }

      updateStepStatus("ai", "completed")
      updateStepStatus("risk", "in-progress")
      await delay(800)

      updateStepStatus("risk", "completed")
      updateStepStatus("save", "in-progress")
      await delay(500)

      updateStepStatus("save", "completed")
      setAnalysisProgress("Análisis completado")
      setResult(data)

      if (data.warning) {
        setError(data.warning)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error al analizar la imagen. Por favor intenta de nuevo.")
      console.error(err)
    } finally {
      setAnalyzing(false)
      setAnalysisProgress("")
    }
  }

  const updateStepStatus = (stepId: string, status: string) => {
    setProgressSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const idealCount = result?.curodontSummary?.eligible || 0
  const posibleCount = result?.curodontSummary?.possiblyEligible || 0
  const noCount = result?.curodontSummary?.notEligible || 0

  return (
    <div className="space-y-6">
      <MedicalDisclaimer />

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>¿Por qué necesito una radiografía?</strong> Las{" "}
          <EducationalTooltip term="caries interproximales" explanation={DENTAL_TERMS.interproximal} /> (entre dientes)
          son invisibles en fotos. Una{" "}
          <EducationalTooltip term="radiografía bitewing" explanation={DENTAL_TERMS.bitewing} /> es esencial para
          detectar <EducationalTooltip term="caries E1-E2" explanation={DENTAL_TERMS.e1 + " " + DENTAL_TERMS.e2} /> que
          son perfectas para <EducationalTooltip term="Curodont" explanation={DENTAL_TERMS.curodont} />.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                radiograph ? "border-[#00D9FF]" : "border-dashed border-gray-300 hover:border-[#00D9FF]/50"
              }`}
            >
              {radiograph && <div className="absolute inset-0 bg-[#00D9FF]/5 pointer-events-none" />}

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${radiograph ? "bg-[#00D9FF]" : "bg-black"}`}
                    >
                      <Activity className={`w-6 h-6 ${radiograph ? "text-black" : "text-white"}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-lg">Radiografía</h3>
                      <p className="text-xs text-muted-foreground">MANDATORIA para caries ocultas</p>
                    </div>
                  </div>
                  {radiograph && (
                    <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Lista
                    </Badge>
                  )}
                </div>

                {!radiographPreview ? (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => rxInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#00D9FF]/10 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#00D9FF] transition-colors" />
                    </div>
                    <p className="font-medium text-gray-700">Sube tu radiografía</p>
                    <p className="text-sm text-muted-foreground mt-1">Bitewing o Periapical</p>
                    <input
                      ref={rxInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleRadiographChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-black">
                    <img
                      src={radiographPreview || "/placeholder.svg"}
                      alt="Radiografía"
                      className="w-full h-48 object-contain"
                    />
                    <button
                      onClick={clearRadiograph}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card
              className={`relative overflow-hidden border-2 transition-all duration-300 ${
                intraoral ? "border-blue-400" : "border-dashed border-gray-300 hover:border-blue-300"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${intraoral ? "bg-blue-500" : "bg-gray-200"}`}
                    >
                      <ImageIcon className={`w-6 h-6 ${intraoral ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-lg">Foto Intraoral</h3>
                      <p className="text-xs text-muted-foreground">Opcional - Caries visibles</p>
                    </div>
                  </div>
                  {intraoral && (
                    <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Lista
                    </Badge>
                  )}
                </div>

                {!intraoralPreview ? (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => ioInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                      <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <p className="font-medium text-gray-700">Sube una foto</p>
                    <p className="text-sm text-muted-foreground mt-1">Foto de tus dientes</p>
                    <input
                      ref={ioInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleIntraoralChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={intraoralPreview || "/placeholder.svg"}
                      alt="Foto intraoral"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={clearIntraoral}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence>
          {analyzing && progressSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AnalysisProgressTracker steps={progressSteps} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-2 flex-1 max-w-xs">
            <Label htmlFor="patientAge" className="text-sm font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              Edad del paciente (mejora predicción)
            </Label>
            <Input
              id="patientAge"
              type="number"
              min="3"
              max="120"
              placeholder="Ej: 25"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              className="bg-white"
            />
          </div>

          <Button
            size="lg"
            className="bg-black text-white hover:bg-black/90 rounded-full px-8 py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            onClick={handleAnalyze}
            disabled={analyzing || (!radiograph && !intraoral)}
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analizar con IA
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        <AnimatePresence>
          {!radiograph && intraoral && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Sin radiografía</strong> no podemos detectar caries interproximales tempranas (las más
                  tratables con Curodont). El análisis será limitado a superficies visibles.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {analyzing && analysisProgress && (
          <Alert className="bg-blue-50 border-blue-200">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <AlertDescription className="text-blue-900">{analysisProgress}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-black">Resultados del Análisis</h3>
                <ShareResultsButton analysisId={result.analysisId} summary={result.summary} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600">{idealCount}</div>
                    <div className="text-sm text-green-700 font-medium mt-1">Lesiones Ideales</div>
                    <div className="text-xs text-green-600 mt-1">Para Curodont</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-amber-600">{posibleCount}</div>
                    <div className="text-sm text-amber-700 font-medium mt-1">Posibles</div>
                    <div className="text-xs text-amber-600 mt-1">Evaluar clínicamente</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-red-600">{noCount}</div>
                    <div className="text-sm text-red-700 font-medium mt-1">Avanzadas</div>
                    <div className="text-xs text-red-600 mt-1">Otro tratamiento</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-black to-gray-900 p-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#00D9FF]" />
                    Resultado del Análisis
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {result.hasRadiograph && result.hasIntraoral
                      ? "Análisis dual completo (RX + Foto)"
                      : result.hasRadiograph
                        ? "Análisis radiográfico"
                        : "Análisis de foto intraoral"}
                  </p>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="p-4 bg-[#00D9FF]/5 rounded-xl border border-[#00D9FF]/20">
                    <p className="text-gray-800">{result.summary}</p>
                  </div>

                  {result.detailedAnalysis && result.detailedAnalysis.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-bold text-black">Lesiones Detectadas</h4>
                      <div className="space-y-3">
                        {result.detailedAnalysis.map((lesion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl border-2 ${
                              lesion.curodontEligible === "IDEAL"
                                ? "bg-green-50 border-green-200"
                                : lesion.curodontEligible === "POSIBLE"
                                  ? "bg-amber-50 border-amber-200"
                                  : "bg-red-50 border-red-200"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-black text-lg">
                                    {formatToothDisplay(lesion.tooth)}
                                  </span>
                                  <Badge
                                    className={
                                      lesion.curodontEligible === "IDEAL"
                                        ? "bg-green-100 text-green-700"
                                        : lesion.curodontEligible === "POSIBLE"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-red-100 text-red-700"
                                    }
                                  >
                                    {lesion.curodontEligible === "IDEAL"
                                      ? "IDEAL para Curodont"
                                      : lesion.curodontEligible === "POSIBLE"
                                        ? "Posible Curodont"
                                        : "Requiere otro tto"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium">Superficie:</span> {lesion.surface} •
                                  <span className="font-medium ml-2">Clasificación:</span> {lesion.classification} •
                                  <span className="font-medium ml-2">Profundidad:</span> {lesion.depth}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">{lesion.description}</p>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-2xl font-bold text-[#00D9FF]">
                                  {Math.round(lesion.confidence)}%
                                </div>
                                <div className="text-xs text-muted-foreground">confianza</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                      <h4 className="text-xl font-bold text-black mb-2">Sin Caries Detectadas</h4>
                      <p className="text-muted-foreground mt-2">
                        No se identificaron lesiones cariosas en las imágenes analizadas.
                      </p>
                    </div>
                  )}

                  {result.curodontSummary?.overallRecommendation && (
                    <div className="p-4 bg-black rounded-xl">
                      <h4 className="font-bold text-white mb-2">Recomendación General</h4>
                      <p className="text-gray-300">{result.curodontSummary.overallRecommendation}</p>
                    </div>
                  )}

                  {!result.hasRadiograph && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <strong>Limitación:</strong> Sin radiografía, no es posible detectar caries interproximales
                        tempranas (las más tratables con Curodont). Se recomienda evaluación radiográfica completa.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {result.riskPrediction && <RiskPredictionCard prediction={result.riskPrediction} />}

              {result.markers && result.markers.length > 0 && (radiographPreview || intraoralPreview) && (
                <CariesVisualization
                  imageUrl={radiographPreview || intraoralPreview || ""}
                  markers={result.markers}
                  imageType={radiographPreview ? "radiograph" : "intraoral"}
                />
              )}

              <motion.div
                className="text-center p-8 bg-gradient-to-br from-[#00D9FF]/10 to-blue-50 rounded-2xl border border-[#00D9FF]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold text-black mb-2">¿Quieres confirmar el diagnóstico?</h3>
                <p className="text-muted-foreground mb-6">
                  Agenda una cita en Clínica Miro para una evaluación completa y tratamiento personalizado.
                </p>
                <Button size="lg" className="bg-black text-white hover:bg-black/90 rounded-full px-8">
                  Agendar Evaluación
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

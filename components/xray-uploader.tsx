"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2, FileImage, X, Activity, AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadiologistFeedback } from "./radiologist-feedback"

interface TreatmentOption {
  name: string
  description: string
  advantages: string[]
  disadvantages: string[]
  whenRecommended: string
}

interface EducationInfo {
  problem: string
  consequences: string
  curodontBenefit?: string
  treatments: TreatmentOption[]
}

interface Marker {
  id: string
  x: number
  y: number
  toothNumber?: string
  label: string
  severity: "low" | "medium" | "high"
  pathology?: string
  description: string
  curodontEligible?: boolean
  education?: EducationInfo
}

interface DetailedAnalysis {
  tooth: string
  surface: string
  depth: string
  severity: string
  curodontCandidate: "IDEAL" | "POSIBLE" | "NO"
  reasoning: string
  alternativeTreatment?: string
}

interface CurodontSummary {
  eligible: number
  possiblyEligible: number
  notEligible: number
  overallRecommendation: string
}

interface AnalysisResult {
  analysisId?: string
  imageType?: string
  quality?: string
  summary: string
  cariesDetected?: number
  curodontEligible?: number
  findings: string[]
  detailedAnalysis?: DetailedAnalysis[]
  markers?: Marker[]
  recommendations: string[]
  curodontSummary?: CurodontSummary
  error?: string
}

export function XrayUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showRadiologistPanel, setShowRadiologistPanel] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResult(null)
      setError(null)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      setResult(null)
      setError(null)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setSelectedMarker(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = async () => {
    if (!file || !preview) return

    setAnalyzing(true)
    setError(null)
    setSelectedMarker(null)
    setShowRadiologistPanel(false)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError("Error al conectar con el servidor de análisis")
    } finally {
      setAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500 border-red-600"
      case "medium":
        return "bg-yellow-500 border-yellow-600"
      case "low":
        return "bg-blue-500 border-blue-600"
      default:
        return "bg-gray-500 border-gray-600"
    }
  }

  const getCandidacyBadge = (candidate: string) => {
    switch (candidate) {
      case "IDEAL":
        return {
          text: "Candidato Ideal",
          class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: CheckCircle2,
        }
      case "POSIBLE":
        return {
          text: "Candidato Posible",
          class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
          icon: AlertCircle,
        }
      case "NO":
        return {
          text: "No Candidato",
          class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          icon: XCircle,
        }
      default:
        return {
          text: "Evaluando",
          class: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
          icon: Info,
        }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Upload Area */}
      <Card className="p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Paso 1: Sube tu Imagen Dental</h3>
            {file && (
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Tipos de imagen aceptados</AlertTitle>
            <AlertDescription>
              Puedes subir: <strong>Radiografía Periapical, Bitewing, Panorámica</strong> o{" "}
              <strong>Fotografía de tus dientes</strong> (tomada con celular)
            </AlertDescription>
          </Alert>

          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-teal-500/50 transition-colors cursor-pointer bg-muted/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">Arrastra tu imagen aquí</p>
                  <p className="text-sm text-muted-foreground">o haz clic para seleccionar desde tu dispositivo</p>
                </div>
                <p className="text-xs text-muted-foreground">JPG, PNG, JPEG - Máximo 10MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Vista previa de imagen dental"
                  fill
                  className="object-contain"
                />
                {result?.markers && result.markers.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {result.markers.map((marker) => (
                      <button
                        key={marker.id}
                        className="absolute pointer-events-auto group"
                        style={{
                          left: `${marker.x}%`,
                          top: `${marker.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => setSelectedMarker(selectedMarker?.id === marker.id ? null : marker)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 ${
                            marker.curodontEligible
                              ? "bg-green-500 border-green-600"
                              : getSeverityColor(marker.severity)
                          } animate-pulse group-hover:scale-125 transition-transform cursor-pointer shadow-lg`}
                        >
                          <div className="absolute inset-0 rounded-full bg-white/30"></div>
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 text-white px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                          {marker.label}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileImage className="w-5 h-5 text-teal-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analyze Button */}
      {preview && !result && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={analyzeImage}
            disabled={analyzing}
            className="min-w-[250px] bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizando Caries...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Detectar Caries y Evaluar
              </>
            )}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Card className="p-6 border-destructive bg-destructive/5">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-destructive text-center">{error}</p>
          </div>
        </Card>
      )}

      {selectedMarker?.education && (
        <Card
          className={`p-6 border-2 ${selectedMarker.curodontEligible ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-primary bg-primary/5"}`}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-3 h-3 rounded-full ${selectedMarker.curodontEligible ? "bg-green-500" : getSeverityColor(selectedMarker.severity)} shrink-0 mt-1`}
              ></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-semibold text-lg text-foreground">{selectedMarker.label}</h4>
                  {selectedMarker.curodontEligible !== undefined && (
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${selectedMarker.curodontEligible ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {selectedMarker.curodontEligible ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {selectedMarker.curodontEligible ? "Candidato Curodont" : "No Candidato Curodont"}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedMarker.description}</p>
                {selectedMarker.toothNumber && (
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">
                    Pieza dental: {selectedMarker.toothNumber} (FDI)
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <h5 className="font-semibold text-foreground">Acerca de esta Caries</h5>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">{selectedMarker.education.problem}</p>
              </div>

              {selectedMarker.education.curodontBenefit && (
                <div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    <h5 className="font-semibold text-teal-900 dark:text-teal-100">Por qué Curodont es Ideal Aquí</h5>
                  </div>
                  <p className="text-sm text-teal-800 dark:text-teal-200 leading-relaxed">
                    {selectedMarker.education.curodontBenefit}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h5 className="font-semibold text-foreground">Si No Se Trata</h5>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                  {selectedMarker.education.consequences}
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-foreground mb-3">Opciones de Tratamiento</h5>
                <div className="space-y-4">
                  {selectedMarker.education.treatments.map((treatment, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-4 space-y-3 ${treatment.name.includes("Curodont") ? "bg-teal-50 dark:bg-teal-950/20 border-2 border-teal-500" : "bg-muted/30"}`}
                    >
                      <div>
                        <h6 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                          {treatment.name.includes("Curodont") && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                          {treatment.name}
                        </h6>
                        <p className="text-sm text-muted-foreground">{treatment.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-green-600 dark:text-green-400 mb-1">Ventajas:</p>
                          <ul className="space-y-1 text-foreground/80">
                            {treatment.advantages.map((adv, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">+</span>
                                <span>{adv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-red-600 dark:text-red-400 mb-1">Desventajas:</p>
                          <ul className="space-y-1 text-foreground/80">
                            {treatment.disadvantages.map((dis, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">-</span>
                                <span>{dis}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">Recomendado cuando:</span> {treatment.whenRecommended}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {result && !error && (
        <Card className="p-8">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
                <h3 className="text-2xl font-bold text-foreground">Resultados del Análisis</h3>
                {result.imageType && (
                  <span className="px-3 py-1 bg-teal-500/10 text-teal-700 dark:text-teal-400 rounded-full text-sm font-medium border border-teal-500/20">
                    {result.imageType}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
              {result.quality && (
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-semibold">Calidad de imagen:</span> {result.quality}
                </p>
              )}
            </div>

            {/* Curodont Summary Card */}
            {result.curodontSummary && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-xl p-6 border-2 border-teal-500/30">
                <h4 className="font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-teal-600" />
                  Evaluación Curodont
                </h4>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 mb-1">{result.curodontSummary.eligible}</div>
                    <div className="text-sm text-muted-foreground">Candidatos Ideales</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 text-center border border-yellow-200 dark:border-yellow-800">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {result.curodontSummary.possiblyEligible}
                    </div>
                    <div className="text-sm text-muted-foreground">Candidatos Posibles</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 text-center border border-red-200 dark:border-red-800">
                    <div className="text-3xl font-bold text-red-600 mb-1">{result.curodontSummary.notEligible}</div>
                    <div className="text-sm text-muted-foreground">No Candidatos</div>
                  </div>
                </div>

                <Alert className="bg-white dark:bg-gray-900/50 border-teal-500/50">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <AlertTitle className="text-lg">Recomendación General</AlertTitle>
                  <AlertDescription className="text-base text-foreground/90 mt-2">
                    {result.curodontSummary.overallRecommendation}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Detailed Analysis Table */}
            {result.detailedAnalysis && result.detailedAnalysis.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-lg">Análisis Detallado por Caries</h4>
                <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                      <tr>
                        <th className="px-4 py-3 text-left">Diente</th>
                        <th className="px-4 py-3 text-left">Superficie</th>
                        <th className="px-4 py-3 text-left">Profundidad</th>
                        <th className="px-4 py-3 text-left">Curodont</th>
                        <th className="px-4 py-3 text-left">Explicación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.detailedAnalysis.map((analysis, idx) => {
                        const badge = getCandidacyBadge(analysis.curodontCandidate)
                        const Icon = badge.icon
                        return (
                          <tr key={idx} className="hover:bg-muted/20 transition-colors">
                            <td className="px-4 py-3 font-semibold text-teal-700 dark:text-teal-400">
                              {analysis.tooth}
                            </td>
                            <td className="px-4 py-3 text-foreground/90">{analysis.surface}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  analysis.severity === "low"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : analysis.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {analysis.depth}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${badge.class}`}
                              >
                                <Icon className="w-3 h-3" />
                                {badge.text}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-foreground/80 text-xs leading-relaxed max-w-md">
                              {analysis.reasoning}
                              {analysis.alternativeTreatment && (
                                <div className="mt-1 text-muted-foreground italic">
                                  Alternativa: {analysis.alternativeTreatment}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Interactive Markers */}
            {result.markers && result.markers.length > 0 && (
              <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg p-5 border border-teal-500/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-teal-600" />
                  Caries Detectadas ({result.cariesDetected || result.markers.length})
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Haz clic en cada marcador para ver evaluación de Curodont, opciones de tratamiento y más detalles.
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.markers.map((marker) => (
                    <button
                      key={marker.id}
                      onClick={() => setSelectedMarker(selectedMarker?.id === marker.id ? null : marker)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedMarker?.id === marker.id
                          ? "bg-teal-600 text-white border-teal-600 shadow-md scale-105"
                          : "bg-background hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${marker.curodontEligible ? "bg-green-400" : getSeverityColor(marker.severity)}`}
                      ></div>
                      <span>{marker.label}</span>
                      {marker.curodontEligible && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Findings and Recommendations */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                  Hallazgos Técnicos
                </h4>
                <ul className="space-y-3">
                  {result.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <span className="text-teal-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      <span className="text-foreground/90 leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
                  Recomendaciones
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <span className="text-cyan-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      <span className="text-foreground/90 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Disclaimer */}
            <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500/50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Este análisis es una evaluación preliminar. Para confirmar tu candidatura a Curodont, debes agendar una
                cita con un dentista certificado que realice examen clínico y evaluación radiográfica profesional.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRadiologistPanel(!showRadiologistPanel)}
                className="border-teal-200 hover:bg-teal-50"
              >
                {showRadiologistPanel ? "Ocultar" : "Mostrar"} Panel de Radiólogo
              </Button>
            </div>

            {result && result.detailedAnalysis && showRadiologistPanel && (
              <RadiologistFeedback
                analysisId={result.analysisId || ""}
                imageUrl={preview || ""}
                originalAnalysis={result.detailedAnalysis}
                onFeedbackSubmitted={() => {
                  setShowRadiologistPanel(false)
                  alert("Gracias por tu retroalimentación")
                }}
              />
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

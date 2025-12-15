"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Loader2, FileImage, X, Activity, AlertCircle, Info } from "lucide-react"
import Image from "next/image"

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
  treatments: TreatmentOption[]
}

interface Marker {
  id: string
  x: number
  y: number
  toothNumber?: string
  label: string
  severity: "low" | "medium" | "high"
  pathology?: "caries" | "restauracion" | "filtracion" | "fractura" | "subgingival"
  description: string
  education?: EducationInfo
}

interface AnalysisResult {
  imageType?: string
  quality?: string
  findings: string[]
  toothAnalysis?: { tooth: string; finding: string; severity?: string }[]
  markers?: Marker[]
  recommendations: string[]
  summary: string
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

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error en el análisis")
      }

      const data = await response.json()
      if (data.error) {
        setError(data.error)
        setResult(null)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError("Hubo un error al analizar la imagen. Por favor, intenta de nuevo.")
      console.error(err)
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

  const getPathologyBadge = (pathology?: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      caries: { text: "Caries", class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
      restauracion: { text: "Restauración", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
      filtracion: {
        text: "Filtración",
        class: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      },
      fractura: { text: "Fractura", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
      subgingival: { text: "Subgingival", class: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400" },
    }

    if (!pathology || !badges[pathology]) {
      return { text: "Hallazgo", class: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" }
    }

    return badges[pathology]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Paso 1: Sube tu Radiografía</h3>
            {file && (
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>

          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">Arrastra y suelta tu radiografía aquí</p>
                  <p className="text-sm text-muted-foreground">o haz clic para seleccionar un archivo</p>
                </div>
                <p className="text-xs text-muted-foreground">Formatos soportados: JPG, PNG, JPEG</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Vista previa de radiografía"
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
                          className={`w-6 h-6 rounded-full border-2 ${getSeverityColor(marker.severity)} animate-pulse group-hover:scale-125 transition-transform cursor-pointer shadow-lg`}
                        >
                          <div className="absolute inset-0 rounded-full bg-white/30"></div>
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/90 text-white px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                          {marker.label}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileImage className="w-5 h-5 text-primary" />
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
          <Button size="lg" onClick={analyzeImage} disabled={analyzing} className="min-w-[200px]">
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5 mr-2" />
                Analizar Radiografía
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
        <Card className="p-6 border-primary bg-primary/5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedMarker.severity)} shrink-0 mt-1`}></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg text-foreground">{selectedMarker.label}</h4>
                  {selectedMarker.pathology && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPathologyBadge(selectedMarker.pathology).class}`}
                    >
                      {getPathologyBadge(selectedMarker.pathology).text}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedMarker.description}</p>
                {selectedMarker.toothNumber && (
                  <p className="text-xs text-primary font-semibold mt-1">
                    Pieza dental: {selectedMarker.toothNumber} (FDI)
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMarker(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              {/* Problem explanation */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <h5 className="font-semibold text-foreground">¿Qué es este problema?</h5>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">{selectedMarker.education.problem}</p>
              </div>

              {/* Consequences */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h5 className="font-semibold text-foreground">Consecuencias si no se trata</h5>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed pl-6">
                  {selectedMarker.education.consequences}
                </p>
              </div>

              {/* Treatment options */}
              <div>
                <h5 className="font-semibold text-foreground mb-3">Opciones de Tratamiento</h5>
                <div className="space-y-4">
                  {selectedMarker.education.treatments.map((treatment, idx) => (
                    <div key={idx} className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <h6 className="font-semibold text-foreground mb-1">{treatment.name}</h6>
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-foreground">Informe Radiológico de Precisión</h3>
                {result.imageType && (
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {result.imageType}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
              {result.quality && (
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-semibold">Calidad diagnóstica:</span> {result.quality}
                </p>
              )}
            </div>

            {result.markers && result.markers.length > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-5 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Patologías Detectadas con Certeza ({result.markers.length})
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Haz clic en cada marcador para ver información detallada, consecuencias y opciones de tratamiento.
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.markers.map((marker) => (
                    <button
                      key={marker.id}
                      onClick={() => setSelectedMarker(selectedMarker?.id === marker.id ? null : marker)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        selectedMarker?.id === marker.id
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${getSeverityColor(marker.severity)}`}></div>
                      <span>{marker.label}</span>
                      {marker.pathology && (
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getPathologyBadge(marker.pathology).class}`}>
                          {getPathologyBadge(marker.pathology).text}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Findings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Hallazgos Técnicos
                </h4>
                <ul className="space-y-3">
                  {result.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      <span className="text-foreground/90 leading-relaxed">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Recomendaciones Clínicas
                </h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                      <span className="text-secondary mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"></span>
                      <span className="text-foreground/90 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.toothAnalysis && result.toothAnalysis.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold text-foreground mb-4 text-lg">
                  Análisis Detallado por Pieza Dental (FDI)
                </h4>
                <div className="bg-muted/30 rounded-lg overflow-hidden border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                      <tr>
                        <th className="px-4 py-3 w-32">Pieza (FDI)</th>
                        <th className="px-4 py-3 w-24">Severidad</th>
                        <th className="px-4 py-3">Diagnóstico Preciso</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.toothAnalysis.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-primary">{item.tooth}</td>
                          <td className="px-4 py-3">
                            {item.severity && (
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  item.severity === "high"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : item.severity === "medium"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}
                              >
                                {item.severity === "high" ? "Alta" : item.severity === "medium" ? "Media" : "Baja"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-foreground/90 leading-relaxed">{item.finding}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-border mt-6">
              <p className="text-xs text-muted-foreground italic">
                ⚠️ Este análisis es una herramienta de asistencia y no sustituye el diagnóstico profesional de un
                odontólogo certificado.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

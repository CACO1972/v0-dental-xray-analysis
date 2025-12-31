"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Send, Loader2 } from "lucide-react"
import { ImageAnnotator } from "./image-annotator"

interface DetailedAnalysis {
  tooth: string
  surface: string
  depth: string
  severity: string
  curodontCandidate: string
  reasoning: string
  alternativeTreatment?: string
}

interface RadiologistFeedbackProps {
  analysisId: string
  imageUrl: string
  originalAnalysis: DetailedAnalysis[]
  onFeedbackSubmitted?: () => void
}

export function RadiologistFeedback({
  analysisId,
  imageUrl,
  originalAnalysis,
  onFeedbackSubmitted,
}: RadiologistFeedbackProps) {
  const [radiologistName, setRadiologistName] = useState("")
  const [radiologistEmail, setRadiologistEmail] = useState("")
  const [feedbackType, setFeedbackType] = useState<string>("confirmation")
  const [comments, setComments] = useState("")
  const [confidenceScore, setConfidenceScore] = useState<number>(3)
  const [correctedFindings, setCorrectedFindings] = useState<any[]>([])
  const [annotations, setAnnotations] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!radiologistName || !radiologistEmail) {
      alert("Por favor ingresa tu nombre y email")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          radiologistName,
          radiologistEmail,
          feedbackType,
          correctedData: correctedFindings.length > 0 ? { detailedAnalysis: correctedFindings } : null,
          annotations,
          comments,
          confidenceScore,
        }),
      })

      if (response.ok) {
        alert("Retroalimentación enviada exitosamente. ¡Gracias por ayudar a mejorar el sistema!")
        onFeedbackSubmitted?.()
      } else {
        alert("Error al enviar retroalimentación")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Error al enviar retroalimentación")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addCorrection = (index: number, isCorrect: boolean, wasMissed = false) => {
    const finding = originalAnalysis[index]
    const corrected = {
      ...finding,
      wasCorrect: isCorrect,
      wasMissed,
      correctedBy: radiologistName,
    }

    setCorrectedFindings([...correctedFindings.filter((f) => f.tooth !== finding.tooth), corrected])
  }

  return (
    <Card className="mt-6 border-teal-200 dark:border-teal-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-teal-600" />
          Panel de Retroalimentación del Radiólogo
        </CardTitle>
        <CardDescription>Ayuda a mejorar el sistema validando o corrigiendo el diagnóstico de IA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Radiólogo</Label>
            <Input
              id="name"
              placeholder="Dr. Juan Pérez"
              value={radiologistName}
              onChange={(e) => setRadiologistName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="juan.perez@clinica.com"
              value={radiologistEmail}
              onChange={(e) => setRadiologistEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Marcado Visual de Correcciones</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Dibuja directamente sobre la imagen para marcar caries no detectadas (rojo) o falsos positivos (azul)
          </p>
          <ImageAnnotator imageUrl={imageUrl} onAnnotationsChange={setAnnotations} />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Retroalimentación</Label>
          <Select value={feedbackType} onValueChange={setFeedbackType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmation">Confirmación - El diagnóstico es correcto</SelectItem>
              <SelectItem value="correction">Corrección - Hay errores que necesitan ajuste</SelectItem>
              <SelectItem value="additional_findings">Hallazgos Adicionales - IA omitió lesiones</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Validación de Lesiones Detectadas</Label>
          <div className="space-y-2">
            {originalAnalysis.map((finding, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">
                    Diente {finding.tooth} - {finding.surface}
                  </p>
                  <p className="text-sm text-muted-foreground">{finding.depth}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 hover:bg-green-50 bg-transparent"
                    onClick={() => addCorrection(index, true, false)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Correcto
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 bg-transparent"
                    onClick={() => addCorrection(index, false, false)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Falso Positivo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Confianza en el Análisis de IA (1-5)</Label>
          <Select value={String(confidenceScore)} onValueChange={(v) => setConfidenceScore(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muy bajo (muchos errores)</SelectItem>
              <SelectItem value="2">2 - Bajo (varios errores)</SelectItem>
              <SelectItem value="3">3 - Aceptable (algunos ajustes necesarios)</SelectItem>
              <SelectItem value="4">4 - Bueno (mínimos ajustes)</SelectItem>
              <SelectItem value="5">5 - Excelente (diagnóstico preciso)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments">Comentarios y Observaciones</Label>
          <Textarea
            id="comments"
            placeholder="Describe correcciones, lesiones omitidas, o cualquier observación relevante..."
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        {correctedFindings.length > 0 && (
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Correcciones registradas:</p>
            <div className="space-y-1">
              {correctedFindings.map((f, i) => (
                <div key={i} className="text-sm flex items-center gap-2">
                  {f.wasCorrect ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <XCircle className="w-3 h-3 mr-1" /> Falso Positivo
                    </Badge>
                  )}
                  <span>
                    Diente {f.tooth} - {f.surface}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={handleSubmitFeedback} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Retroalimentación
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

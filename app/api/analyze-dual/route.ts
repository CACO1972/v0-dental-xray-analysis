import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"
import { validateImageFile, validatePatientAge, AIAnalysisSchema, normalizeAIResponse } from "@/lib/validators"

const AI_TIMEOUT_MS = 60000 // 60 segundos
const MAX_RETRIES = 2

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting dual analysis")
    const formData = await request.formData()
    const radiograph = formData.get("radiograph") as File | null
    const intraoral = formData.get("intraoral") as File | null
    const patientAge = formData.get("patientAge") as string | null
    const patientId = formData.get("patientId") as string | null

    console.log("[v0] Files received:", {
      hasRadiograph: !!radiograph,
      hasIntraoral: !!intraoral,
      patientAge,
    })

    if (!radiograph && !intraoral) {
      return NextResponse.json(
        {
          error: "Debes subir al menos una imagen (RX o foto intraoral)",
          code: "NO_IMAGE_PROVIDED",
        },
        { status: 400 },
      )
    }

    if (radiograph) {
      const rxValidation = validateImageFile(radiograph)
      if (!rxValidation.valid) {
        return NextResponse.json(
          {
            error: `Radiografía inválida: ${rxValidation.error}`,
            code: "INVALID_RX_FILE",
          },
          { status: 400 },
        )
      }
    }

    if (intraoral) {
      const ioValidation = validateImageFile(intraoral)
      if (!ioValidation.valid) {
        return NextResponse.json(
          {
            error: `Foto intraoral inválida: ${ioValidation.error}`,
            code: "INVALID_IO_FILE",
          },
          { status: 400 },
        )
      }
    }

    if (patientAge) {
      const ageValidation = validatePatientAge(patientAge)
      if (!ageValidation.valid) {
        return NextResponse.json(
          {
            error: ageValidation.error,
            code: "INVALID_AGE",
          },
          { status: 400 },
        )
      }
    }

    const analyses: any[] = []

    let primaryImageBase64 = ""
    let primaryImageType = ""

    const visionModel = "openai/gpt-4o"

    if (radiograph) {
      console.log("[v0] Analyzing radiograph with model:", visionModel)
      const rxBytes = await radiograph.arrayBuffer()
      const rxBuffer = Buffer.from(rxBytes)
      const rxBase64 = rxBuffer.toString("base64")
      const rxMimeType = radiograph.type

      primaryImageBase64 = rxBase64
      primaryImageType = rxMimeType

      const rxAnalysis = await callAIWithRetry(visionModel, rxBase64, rxMimeType, "radiograph")
      analyses.push({ type: "radiograph", result: rxAnalysis })
    }

    if (intraoral) {
      console.log("[v0] Analyzing intraoral photo with model:", visionModel)
      const ioBytes = await intraoral.arrayBuffer()
      const ioBuffer = Buffer.from(ioBytes)
      const ioBase64 = ioBuffer.toString("base64")
      const ioMimeType = intraoral.type

      if (!primaryImageBase64) {
        primaryImageBase64 = ioBase64
        primaryImageType = ioMimeType
      }

      const ioAnalysis = await callAIWithRetry(visionModel, ioBase64, ioMimeType, "intraoral")
      analyses.push({ type: "intraoral", result: ioAnalysis })
    }

    console.log("[v0] Combining analyses...")
    const combinedResult = combineAnalyses(analyses, patientAge)
    console.log("[v0] Combined result:", JSON.stringify(combinedResult, null, 2).substring(0, 500))

    console.log("[v0] Saving to database...")
    const supabase = await createClient()

    const imageUrl = primaryImageBase64
      ? `data:${primaryImageType};base64,${primaryImageBase64.substring(0, 1000)}...`
      : "no-image"

    const { data: analysisData, error: dbError } = await supabase
      .from("caries_analyses")
      .insert({
        image_type: `dual_${radiograph ? "rx" : ""}${intraoral ? "_io" : ""}`,
        image_url: imageUrl,
        ai_analysis: combinedResult,
        patient_id: patientId || "anonymous",
        status: "pending_review",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError.message)
      combinedResult.warning = "El análisis se completó pero no se pudo guardar en la base de datos"
    } else if (analysisData) {
      console.log("[v0] Analysis saved with ID:", analysisData.id)
      combinedResult.analysisId = analysisData.id
    }

    console.log("[v0] Returning result to client")
    return NextResponse.json(combinedResult)
  } catch (error) {
    console.error("[v0] Error in dual analysis:", error)

    if (error instanceof Error && error.message.includes("timeout")) {
      return NextResponse.json(
        {
          error: "El análisis tomó demasiado tiempo. Por favor intenta con una imagen más pequeña o de mejor calidad.",
          code: "TIMEOUT",
        },
        { status: 504 },
      )
    }

    return NextResponse.json(
      {
        error: "Error al procesar las imágenes. Por favor verifica que sean radiografías o fotos dentales válidas.",
        details: error instanceof Error ? error.message : String(error),
        code: "PROCESSING_ERROR",
      },
      { status: 500 },
    )
  }
}

async function callAIWithRetry(
  model: string,
  imageBase64: string,
  mimeType: string,
  imageType: "radiograph" | "intraoral",
  attempt = 1,
): Promise<any> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

    const prompt =
      imageType === "radiograph"
        ? `Eres un asistente educativo dental. Analiza esta imagen radiográfica para PROPÓSITOS EDUCATIVOS identificando características radiográficas que podrían indicar desmineralización temprana del esmalte.

CONTEXTO EDUCATIVO: Esta aplicación enseña a identificar áreas radiolúcidas tempranas que podrían beneficiarse de remineralización con fluoruro (Curodont).

NOMENCLATURA DENTAL FDI (OBLIGATORIO):
Debes usar el sistema FDI de dos dígitos para identificar dientes:
- Cuadrante 1 (Superior Derecho): 11-18 (11=Incisivo Central, 16=Primer Molar, 18=Muela del Juicio)
- Cuadrante 2 (Superior Izquierdo): 21-28 (21=Incisivo Central, 26=Primer Molar)
- Cuadrante 3 (Inferior Izquierdo): 31-38 (36=Primer Molar)
- Cuadrante 4 (Inferior Derecho): 41-48 (46=Primer Molar)
- Temporales: 51-55 (superior derecho), 61-65 (superior izquierdo), 71-75 (inferior izquierdo), 81-85 (inferior derecho)

Ejemplos: "16" (Primer Molar Superior Derecho), "46" (Primer Molar Inferior Derecho), "21" (Incisivo Central Superior Izquierdo)

INSTRUCCIÓN: Responde SOLO con JSON válido usando esta estructura exacta:

{
  "imageType": "BITEWING_XRAY" | "PERIAPICAL_XRAY" | "PANORAMIC_XRAY" | "NO_DENTAL_XRAY",
  "quality": "Excelente" | "Buena" | "Aceptable" | "Pobre",
  "cariesDetected": <número de 0 a 32>,
  "curodontEligible": <número>,
  "findings": ["observación educativa 1", "observación educativa 2"],
  "detailedAnalysis": [
    {
      "tooth": "16",
      "surface": "Mesial" | "Distal" | "Oclusal" | "Vestibular" | "Lingual/Palatina",
      "classification": "E0" | "E1" | "E2" | "D1" | "D2" | "D3",
      "depth": "0.5mm en esmalte",
      "description": "Área radiolúcida observada en superficie mesial del diente 16 (Primer Molar Superior Derecho)...",
      "curodontCandidate": "IDEAL" | "POSIBLE" | "NO",
      "confidence": 85
    }
  ],
  "markers": [
    {"x": 45, "y": 60, "label": "E1 - Diente 16"}
  ],
  "recommendations": ["Consulta con profesional dental", "Considerar fluorización"]
}

CLASIFICACIÓN EDUCATIVA DE RADIOLUCIDEZ:
- E0: Desmineralización inicial apenas visible - IDEAL para Curodont
- E1: Radiolucidez en esmalte superficial (<50%) - IDEAL para remineralización con Curodont
- E2: Radiolucidez en esmalte profundo (>50%, no dentina) - IDEAL para remineralización con Curodont
- D1: Radiolucidez alcanza dentina superficial (primer tercio) - POSIBLE remineralización con Curodont
- D2: Radiolucidez en dentina media - Requiere restauración convencional
- D3: Radiolucidez profunda cercana a pulpa - Requiere tratamiento de conducto

SUPERFICIES DENTALES:
- Mesial: Hacia la línea media
- Distal: Alejándose de la línea media
- Oclusal: Superficie de masticación
- Vestibular: Cara hacia el labio/mejilla
- Lingual/Palatina: Cara hacia la lengua/paladar

IMPORTANTE: Usa SIEMPRE números FDI de dos dígitos (ej: "16", "36", "21") en el campo "tooth".

NOTA: Si la imagen NO muestra una radiografía dental, responde:
{"imageType": "NO_DENTAL_XRAY", "error": "Imagen educativa no válida", "cariesDetected": 0, "curodontEligible": 0, "findings": ["Proporciona imagen radiográfica dental"], "detailedAnalysis": [], "markers": [], "recommendations": ["Sube radiografía dental para análisis educativo"]}`
        : `Eres un asistente educativo dental. Analiza esta fotografía intraoral para PROPÓSITOS EDUCATIVOS identificando características visibles de desmineralización.

CONTEXTO: Aplicación educativa que enseña identificación visual de manchas blancas y áreas desmineralizadas.

NOMENCLATURA DENTAL FDI (OBLIGATORIO):
Usa sistema FDI de dos dígitos: 11-18 (superior derecho), 21-28 (superior izquierdo), 31-38 (inferior izquierdo), 41-48 (inferior derecho).
Ejemplo: "16" = Primer Molar Superior Derecho, "36" = Primer Molar Inferior Izquierdo

Responde SOLO con JSON válido:

{
  "imageType": "INTRAORAL_PHOTO" | "NO_INTRAORAL_PHOTO",
  "quality": "Excelente" | "Buena" | "Aceptable" | "Pobre",
  "cariesDetected": <número>,
  "curodontEligible": <número>,
  "findings": ["observación 1", "observación 2"],
  "detailedAnalysis": [
    {
      "tooth": "16",
      "surface": "Oclusal" | "Vestibular" | "Lingual",
      "classification": "E0" | "E1" | "E2" | "D1",
      "depth": "Superficial",
      "description": "Área visible con cambio de coloración en diente 16 (Primer Molar Superior Derecho)...",
      "curodontCandidate": "POSIBLE",
      "confidence": 70
    }
  ],
  "markers": [{"x": 50, "y": 50, "label": "Área sospechosa - Diente 16"}],
  "recommendations": ["Requiere radiografía para evaluación completa"]
}

IMPORTANTE: 
- Usa números FDI (ej: "16", "21", "36") en el campo "tooth"
- Las fotografías tienen LIMITACIONES para detectar desmineralización interproximal
- Solo evalúa superficies VISIBLES (Oclusal, Vestibular, Lingual)

Si NO es foto intraoral dental, responde:
{"imageType": "NO_INTRAORAL_PHOTO", "error": "No es fotografía intraoral", "cariesDetected": 0, "curodontEligible": 0, "findings": [], "detailedAnalysis": [], "markers": [], "recommendations": ["Proporciona fotografía intraoral dental"]}`

    const { text } = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image",
              image: `data:${mimeType};base64,${imageBase64}`,
            },
          ],
        },
      ],
      abortSignal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log(`[v0] ${imageType} analysis received (attempt ${attempt}):`, text.substring(0, 300))

    const parsed = parseAndValidateAIResponse(text)

    if (parsed.imageType?.includes("NO_DENTAL") || parsed.imageType?.includes("NO_INTRAORAL")) {
      throw new Error(parsed.error || "Imagen no válida para análisis dental")
    }

    return parsed
  } catch (error) {
    console.error(`[v0] Error in AI call (attempt ${attempt}):`, error)

    if (attempt < MAX_RETRIES && !(error instanceof Error && error.message.includes("abort"))) {
      console.log(`[v0] Retrying (attempt ${attempt + 1}/${MAX_RETRIES})...`)
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt))
      return callAIWithRetry(model, imageBase64, mimeType, imageType, attempt + 1)
    }

    console.log("[v0] All retries failed, returning empty result")
    return {
      imageType: imageType === "radiograph" ? "XRAY_ANALYSIS_FAILED" : "PHOTO_ANALYSIS_FAILED",
      cariesDetected: 0,
      curodontEligible: 0,
      findings: [
        "No se pudo completar el análisis educativo.",
        "Por favor, verifica que la imagen sea clara y muestre claramente los dientes.",
        "Si el problema persiste, intenta con otra imagen.",
      ],
      detailedAnalysis: [],
      markers: [],
      recommendations: [
        "Intenta con otra imagen de mejor calidad",
        "Asegúrate de que sea una radiografía o foto dental válida",
      ],
    }
  }
}

function parseAndValidateAIResponse(text: string): any {
  console.log("[v0] Parsing and validating AI response...")
  try {
    let jsonStr = text

    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    } else {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[0]
      }
    }

    if (!jsonStr || !jsonStr.includes("{")) {
      throw new Error("No se encontró JSON en la respuesta de IA")
    }

    const parsed = JSON.parse(jsonStr)
    console.log("[v0] JSON parsed successfully")

    const normalized = normalizeAIResponse(parsed)
    console.log("[v0] Response normalized")

    const validated = AIAnalysisSchema.parse(normalized)
    console.log("[v0] Schema validation passed")

    return validated
  } catch (error) {
    console.error("[v0] Error validating AI response:", error)
    console.error("[v0] Raw text:", text.substring(0, 500))

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const partialData = JSON.parse(jsonMatch[0])
        const normalized = normalizeAIResponse(partialData)

        return {
          imageType: normalized.imageType || "UNKNOWN",
          cariesDetected: normalized.cariesDetected || 0,
          curodontEligible: normalized.curodontEligible || 0,
          findings: normalized.findings || [],
          detailedAnalysis: normalized.detailedAnalysis || [],
          markers: normalized.markers || [],
          recommendations: normalized.recommendations || ["Análisis parcial - algunos datos pueden estar incompletos"],
        }
      }
    } catch (recoveryError) {
      console.error("[v0] Recovery attempt failed:", recoveryError)
    }

    throw new Error(
      `Respuesta de IA inválida: ${error instanceof Error ? error.message : "Formato incorrecto"}. La imagen puede no ser una radiografía o foto dental válida.`,
    )
  }
}

function combineAnalyses(analyses: any[], patientAge: string | null): any {
  const rxAnalysis = analyses.find((a) => a.type === "radiograph")?.result
  const ioAnalysis = analyses.find((a) => a.type === "intraoral")?.result

  const allFindings = [...(rxAnalysis?.findings || []), ...(ioAnalysis?.findings || [])]

  const allDetailedAnalysis = [...(rxAnalysis?.detailedAnalysis || []), ...(ioAnalysis?.detailedAnalysis || [])]

  // Combinar markers de ambos análisis y enriquecerlos con datos de Curodont
  const enrichedMarkers = []

  // Procesar markers de radiografía
  if (rxAnalysis?.markers) {
    rxAnalysis.markers.forEach((marker: any, index: number) => {
      const matchingLesion = allDetailedAnalysis[index] || rxAnalysis.detailedAnalysis?.[index]
      enrichedMarkers.push({
        x: marker.x,
        y: marker.y,
        label: marker.label,
        curodontEligible: matchingLesion?.curodontCandidate || matchingLesion?.curodontEligible,
        classification: matchingLesion?.classification,
        confidence: matchingLesion?.confidence,
      })
    })
  }

  // Procesar markers de foto intraoral
  if (ioAnalysis?.markers) {
    const offset = rxAnalysis?.markers?.length || 0
    ioAnalysis.markers.forEach((marker: any, index: number) => {
      const matchingLesion = ioAnalysis.detailedAnalysis?.[index]
      enrichedMarkers.push({
        x: marker.x,
        y: marker.y,
        label: marker.label,
        curodontEligible: matchingLesion?.curodontCandidate || matchingLesion?.curodontEligible,
        classification: matchingLesion?.classification,
        confidence: matchingLesion?.confidence,
      })
    })
  }

  const totalCaries = (rxAnalysis?.cariesDetected || 0) + (ioAnalysis?.cariesDetected || 0)
  const totalCurodont = (rxAnalysis?.curodontEligible || 0) + (ioAnalysis?.curodontEligible || 0)

  const riskPrediction = calculateRiskPrediction({
    totalCaries,
    hasRadiograph: !!rxAnalysis,
    hasIntraoral: !!ioAnalysis,
    patientAge: patientAge ? Number.parseInt(patientAge) : null,
    deepCaries: allDetailedAnalysis.filter((d: any) => d.depth?.includes("D2") || d.depth?.includes("D3")).length,
    superficialCaries: allDetailedAnalysis.filter(
      (d: any) => d.depth?.includes("E1") || d.depth?.includes("E2") || d.depth?.includes("D1"),
    ).length,
  })

  return {
    dualAnalysis: true,
    hasRadiograph: !!rxAnalysis,
    hasIntraoral: !!ioAnalysis,
    summary: generateCombinedSummary(rxAnalysis, ioAnalysis, riskPrediction),
    cariesDetected: totalCaries,
    curodontEligible: totalCurodont,
    findings: allFindings,
    detailedAnalysis: allDetailedAnalysis,
    markers: enrichedMarkers, // Usando markers enriquecidos con datos de Curodont
    recommendations: generateCombinedRecommendations(rxAnalysis, ioAnalysis, riskPrediction),
    curodontSummary: {
      eligible: totalCurodont,
      possiblyEligible: allDetailedAnalysis.filter((d: any) => d.curodontCandidate === "POSIBLE").length,
      notEligible: allDetailedAnalysis.filter((d: any) => d.curodontCandidate === "NO").length,
      overallRecommendation: generateOverallRecommendation(totalCaries, totalCurodont, riskPrediction),
    },
    riskPrediction,
  }
}

function calculateRiskPrediction(data: {
  totalCaries: number
  hasRadiograph: boolean
  hasIntraoral: boolean
  patientAge: number | null
  deepCaries: number
  superficialCaries: number
}): any {
  let riskScore = 0
  const riskFactors = []

  if (data.totalCaries === 0) {
    riskScore += 0
  } else if (data.totalCaries <= 2) {
    riskScore += 20
    riskFactors.push("Presencia de 1-2 áreas de desmineralización")
  } else if (data.totalCaries <= 4) {
    riskScore += 40
    riskFactors.push("Múltiples áreas de desmineralización (3-4)")
  } else {
    riskScore += 60
    riskFactors.push("Alto número de áreas de desmineralización (5+)")
  }

  if (data.deepCaries > 0) {
    riskScore += 25
    riskFactors.push(`${data.deepCaries} área(s) profunda(s) indica progresión rápida`)
  }

  if (data.patientAge) {
    if (data.patientAge < 18) {
      riskScore += 15
      riskFactors.push("Edad joven con mayor actividad de desmineralización")
    } else if (data.patientAge > 60) {
      riskScore += 10
      riskFactors.push("Riesgo de desmineralización radicular por recesión gingival")
    }
  }

  if (!data.hasRadiograph) {
    riskScore += 20
    riskFactors.push("Sin evaluación radiográfica (caries ocultas no detectadas)")
  }

  riskScore = Math.min(riskScore, 100)

  let riskLevel: "BAJO" | "MODERADO" | "ALTO" | "MUY ALTO"
  let riskColor: string
  let futureProjection: string

  if (riskScore < 25) {
    riskLevel = "BAJO"
    riskColor = "green"
    futureProjection =
      "Con higiene adecuada, baja probabilidad de nuevas áreas de desmineralización en los próximos 12 meses. Mantén controles anuales."
  } else if (riskScore < 50) {
    riskLevel = "MODERADO"
    riskColor = "yellow"
    futureProjection =
      "Riesgo medio de desarrollar 1-2 nuevas áreas de desmineralización en 6-12 meses sin intervención. Recomendado control cada 6 meses y tratamiento de áreas actuales."
  } else if (riskScore < 75) {
    riskLevel = "ALTO"
    riskColor = "orange"
    futureProjection =
      "Alto riesgo de progresión. Sin tratamiento, las áreas actuales avanzarán a dentina profunda en 3-6 meses y pueden aparecer 2-3 nuevas áreas de desmineralización. Tratamiento urgente recomendado."
  } else {
    riskLevel = "MUY ALTO"
    riskColor = "red"
    futureProjection =
      "Riesgo crítico. Alta probabilidad de compromiso pulpar en áreas existentes dentro de 3 meses. Pueden desarrollarse 4+ nuevas áreas de desmineralización. Requiere plan de tratamiento integral inmediato."
  }

  return {
    score: riskScore,
    level: riskLevel,
    color: riskColor,
    factors: riskFactors,
    futureProjection,
    recommendations: generateRiskRecommendations(riskLevel, data),
    timeline: {
      "3meses": calculateTimeline(3, riskScore, data),
      "6meses": calculateTimeline(6, riskScore, data),
      "12meses": calculateTimeline(12, riskScore, data),
    },
  }
}

function calculateTimeline(months: number, riskScore: number, data: any): string {
  const progressionRate = riskScore / 100
  const baseProgression = data.superficialCaries * 0.3 * (months / 6)
  const deepProgression = data.deepCaries * 0.7 * (months / 6)

  const newCariesProbability = Math.round(progressionRate * months * 0.5)
  const progressingLesions = Math.round((baseProgression + deepProgression) * progressionRate)

  return `${newCariesProbability} posibles nuevas áreas de desmineralización, ${progressingLesions} áreas actuales pueden progresar a estadio más profundo`
}

function generateRiskRecommendations(riskLevel: string, data: any): string[] {
  const recs = []

  if (riskLevel === "BAJO") {
    recs.push("Mantén tu rutina de higiene actual")
    recs.push("Control dental anual preventivo")
    recs.push("Continúa con dieta baja en azúcares")
  } else if (riskLevel === "MODERADO") {
    recs.push("Aumenta frecuencia de cepillado a 3x/día")
    recs.push("Usa hilo dental diariamente sin falta")
    recs.push("Control cada 6 meses")
    recs.push("Considera enjuague con flúor")
  } else if (riskLevel === "ALTO") {
    recs.push("Tratamiento de áreas actuales en próximas 4 semanas")
    recs.push("Aplicación profesional de flúor barniz cada 3 meses")
    recs.push("Revisa dieta y elimina snacks azucarados entre comidas")
    recs.push("Control cada 3-4 meses")
  } else {
    recs.push("⚠️ URGENTE: Agenda tratamiento esta semana")
    recs.push("Plan integral: trata todas las áreas en 1-2 meses")
    recs.push("Aplicación de flúor profesional cada mes durante 6 meses")
    recs.push("Evaluación dietética y de higiene con higienista")
    recs.push("Considera pruebas de saliva y test bacteriano")
  }

  if (!data.hasRadiograph) {
    recs.push("📸 CRÍTICO: Realiza radiografía bitewing para detectar caries ocultas")
  }

  return recs
}

function generateCombinedSummary(rxAnalysis: any, ioAnalysis: any, risk: any): string {
  let summary = ""

  if (rxAnalysis && ioAnalysis) {
    summary = `Análisis dual completo (RX + foto intraoral): `
  } else if (rxAnalysis) {
    summary = `Análisis radiográfico: `
  } else {
    summary = `Análisis clínico (foto intraoral): `
  }

  const total = (rxAnalysis?.cariesDetected || 0) + (ioAnalysis?.cariesDetected || 0)
  summary += `${total} área(s) de desmineralización detectada(s). `
  summary += `Nivel de riesgo futuro: ${risk.level}. `

  return summary
}

function generateCombinedRecommendations(rxAnalysis: any, ioAnalysis: any, risk: any): string[] {
  const recs = []

  if (!rxAnalysis && ioAnalysis) {
    recs.push(
      "⚠️ IMPORTANTE: Se detectaron signos en foto clínica. Se requiere RX para evaluar caries interproximales ocultas",
    )
  }

  if (rxAnalysis) {
    recs.push(...(rxAnalysis.recommendations || []))
  }

  if (ioAnalysis) {
    recs.push(...(ioAnalysis.recommendations || []))
  }

  recs.push(...risk.recommendations)

  return [...new Set(recs)]
}

function generateOverallRecommendation(totalCaries: number, totalCurodont: number, risk: any): string {
  if (totalCaries === 0) {
    return "¡Excelente! No se detectaron áreas de desmineralización activas. Mantén tu rutina de higiene para prevenir futuras áreas."
  }

  let rec = `Se detectaron ${totalCaries} área(s) de desmineralización. `

  if (totalCurodont > 0) {
    rec += `${totalCurodont} son candidatas para remineralización con fluoruro (Curodont™). `
  }

  rec += `Tu riesgo de desmineralización futura es ${risk.level}. `
  rec += risk.futureProjection

  return rec
}

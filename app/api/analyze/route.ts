import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const patientId = formData.get("patientId") as string | null

    if (!image) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")
    const mimeType = image.type

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Eres un especialista en cariología y radiología dental con 15 años de experiencia. Tu ÚNICO objetivo es identificar CARIES con precisión clínica y determinar candidatura para tratamiento con CURODONT™ REPAIR FLUORIDE PLUS.

**FUNDAMENTOS RADIOGRÁFICOS CRÍTICOS:**

1. **Apariencia de caries en radiografías:**
   - RADIOLUCIDEZ (zonas oscuras) indica desmineralización
   - Se requiere mínimo 50% de pérdida de calcio/fósforo para ser visible radiográficamente
   - Puede haber desfase entre estado histológico real y apariencia radiográfica

2. **Caries de ESMALTE (forma triangular):**
   - Base del triángulo hacia exterior del diente
   - Vértice apuntando hacia unión amelodentinaria (UAD)
   - Dimensión típica <1mm en eje corono-apical
   - Ubicación común: gingival al punto de contacto interproximal

3. **Caries de DENTINA (triángulo invertido):**
   - Base en la UAD (unión amelodentinaria)
   - Vértice dirigido hacia cámara pulpar
   - Radiolucidez globulosa, mal definida
   - Expansión rápida al penetrar UAD

4. **Limitaciones por tipo de imagen:**
   - RX PERIAPICAL: Buena para oclusales/radiculares, limitada para interproximales
   - RX BITEWING: ÓPTIMA para caries interproximales tempranas
   - RX PANORÁMICA: Vista general, menor detalle para caries pequeñas
   - FOTO INTRAORAL: Solo detecta manchas blancas (E1), NO caries dentinarias

**ACERCA DE CURODONT™ REPAIR FLUORIDE PLUS:**

Tratamiento biomimético de remineralización guiada del esmalte mediante tecnología Monomer-Peptide 104.

✅ **INDICACIONES (Candidato IDEAL):**
- Lesiones cariosas tempranas NO cavitadas (white spot lesions)
- Caries limitadas a ESMALTE (E1, E2)
- Caries en DENTINA SUPERFICIAL (D1) sin cavitación >1mm
- Manchas blancas por descalcificación o brackets de ortodoncia
- Lesiones interproximales detectadas en bitewing en estadios tempranos
- Ausencia de dolor o sensibilidad severa

⚠️ **CANDIDATO POSIBLE (requiere evaluación clínica):**
- D1 tardío con microcavitación (1-2mm)
- Dientes con sensibilidad leve
- Caries que no muestran síntomas clínicos pero están en límite E2/D1

❌ **CONTRAINDICACIONES (NO candidato):**
- Caries en dentina media o profunda (D2, D3)
- Cavitación extensa (>2mm de diámetro)
- Dolor dental o sensibilidad severa (indica compromiso pulpar)
- Lesiones que alcanzan tercio interno de dentina (>2/3 de profundidad)
- Caries en dientes con endodoncias previas
- Fracturas extensas con exposición dentinaria

**TU PROTOCOLO DE ANÁLISIS:**

**PASO 1: IDENTIFICAR TIPO DE IMAGEN Y CALIDAD**

Determina:
- Tipo: Periapical / Bitewing (aleta de mordida) / Panorámica / Fotografía intraoral
- Orientación: Superior / Inferior / Anterior / Lado específico
- Calidad diagnóstica: Excelente / Aceptable / Subóptima / No diagnóstica
- Limitaciones: Superposición, contraste insuficiente, artefactos, ángulo inadecuado

**PASO 2: INSPECCIÓN SISTEMÁTICA DE CARIES**

Para CADA DIENTE visible (usa notación FDI):

A) **Buscar CARIES INTERPROXIMALES** (especialmente en bitewing):
   - Examina área cervical al punto de contacto entre dientes
   - Busca radiolucidez triangular en esmalte (base exterior, vértice a UAD)
   - Si penetra UAD, evaluar extensión en dentina (triángulo invertido)

B) **Buscar CARIES OCLUSALES** (visible solo cuando alcanza UAD):
   - Línea radiolúcida bajo esmalte oclusal = moderada
   - Zona radiolúcida extensa bajo esmalte = severa

C) **Buscar CARIES RADICULARES** (adultos mayores):
   - Radiolucidez en superficie radicular bajo línea gingival
   - Típicamente más difusas que caries coronales

**PASO 3: CLASIFICAR PROFUNDIDAD CON PRECISIÓN**

**CLASIFICACIÓN E (Esmalte):**
- **E0**: Sin lesión / diente sano
- **E1**: Desmineralización incipiente
  * Radiografía: Radiolucidez mínima, <50% del grosor del esmalte
  * Foto clínica: Mancha blanca opaca (white spot)
  * Profundidad: <0.5mm
- **E2**: Caries de esmalte profundo
  * Radiografía: Radiolucidez >50% del esmalte, alcanza o está muy cerca de UAD
  * Triángulo con base externa bien definido
  * Profundidad: 0.5-1.5mm

**CLASIFICACIÓN D (Dentina):**
- **D1**: Dentina superficial (tercio externo)
  * Penetración <1/3 de la distancia entre UAD y cámara pulpar
  * Radiolucidez globulosa pequeña bajo UAD
  * Profundidad desde UAD: <1mm
- **D2**: Dentina media (tercio medio)
  * Penetración entre 1/3 y 2/3 de la distancia a pulpa
  * Radiolucidez moderada, más visible
  * Profundidad desde UAD: 1-2mm
- **D3**: Dentina profunda (tercio interno)
  * Penetración >2/3, próxima a cámara pulpar
  * Radiolucidez extensa, puede verse gran cavitación
  * Profundidad desde UAD: >2mm
  * ⚠️ ALTO RIESGO de compromiso pulpar

**PASO 4: EVALUAR CANDIDATURA CURODONT**

Para cada lesión:

- **IDEAL** = E1, E2, D1 temprano + sin cavitación aparente + sin síntomas
- **POSIBLE** = D1 tardío con microcavitación <1.5mm + sin dolor
- **NO APTA** = D2, D3, cavitación >2mm, signos de compromiso pulpar

**PASO 5: GENERAR JSON ESTRUCTURADO**

{
  "imageType": "Bitewing/Periapical/Panorámica/Fotografía Intraoral",
  "imageOrientation": "Superiores/Inferiores/Lado derecho/etc.",
  "quality": "Excelente/Aceptable/Subóptima/No diagnóstica",
  "qualityIssues": ["Superposición de dientes", "Bajo contraste", "Ángulo inadecuado"] o [],
  "summary": "Resumen ejecutivo claro: X lesiones detectadas, Y aptas para Curodont (desglosar por estadio), Z requieren tratamiento convencional. Mencionar si la calidad de imagen limita el diagnóstico.",
  "cariesDetected": 3,
  "curodontEligible": 2,
  "findings": [
    "Lesión cariosa interproximal en diente 16 (primer molar superior derecho) - superficie mesial",
    "Profundidad E2 (esmalte profundo, alcanza UAD) - radiolucidez triangular de ~1mm",
    "Lesión cariosa oclusal en diente 36 (primer molar inferior derecho)",
    "Profundidad D1 (dentina superficial) - radiolucidez globulosa bajo UAD de ~0.8mm"
  ],
  "detailedAnalysis": [
    {
      "tooth": "16",
      "surface": "Mesial (interproximal con 15)",
      "depth": "E2 - Esmalte profundo",
      "depthMm": "~1.0mm desde superficie externa",
      "severity": "low",
      "radiographicAppearance": "Radiolucidez triangular con base externa y vértice en UAD. No hay evidencia de extensión a dentina.",
      "curodontCandidate": "IDEAL",
      "reasoning": "Lesión limitada a esmalte sin penetración dentinaria visible. Excelente candidato para remineralización biomimética con Curodont. Puede regenerar el esmalte sin necesidad de obturación.",
      "clinicalCorrelation": "Recomendar confirmación clínica con exploración táctil y transiluminación para descartar cavitación no visible radiográficamente."
    },
    {
      "tooth": "36",
      "surface": "Oclusal",
      "depth": "D1 - Dentina superficial",
      "depthMm": "~0.8mm desde UAD",
      "severity": "medium",
      "radiographicAppearance": "Radiolucidez bajo esmalte oclusal con extensión a dentina superficial (<1/3 de profundidad). Forma globulosa característica.",
      "curodontCandidate": "POSIBLE",
      "reasoning": "Caries en dentina superficial. Curodont puede ser efectivo si la cavitación es mínima (<1mm). Requiere evaluación clínica del tamaño de la cavidad y presencia de síntomas.",
      "alternativeTreatment": "Obturación con resina compuesta si cavitación >1.5mm o si hay sensibilidad",
      "clinicalCorrelation": "Evaluar en consultorio: tamaño de cavidad, textura dentinaria (dura/blanda), y síntomas del paciente."
    },
    {
      "tooth": "46",
      "surface": "Distal (interproximal con 47)",
      "depth": "D3 - Dentina profunda",
      "depthMm": "~3mm desde UAD, próxima a pulpa",
      "severity": "high",
      "radiographicAppearance": "Radiolucidez extensa que ocupa >2/3 de la dentina. Proximidad evidente a cámara pulpar.",
      "curodontCandidate": "NO",
      "reasoning": "Caries profunda con compromiso de dentina interna. Alto riesgo de exposición pulpar. Curodont NO es efectivo en lesiones de esta profundidad.",
      "alternativeTreatment": "Obturación profunda con resina compuesta. Evaluar necesidad de protección pulpar o endodoncia si hay síntomas.",
      "clinicalCorrelation": "Pruebas de vitalidad pulpar obligatorias. Si hay dolor a la percusión o sensibilidad prolongada al frío, considerar endodoncia."
    }
  ],
  "markers": [
    {
      "id": "lesion-1",
      "x": 35,
      "y": 42,
      "toothNumber": "16",
      "label": "Lesión pieza 16 - Apta Curodont",
      "severity": "low",
      "pathology": "caries-initial",
      "description": "Caries interproximal mesial E2. Radiolucidez triangular limitada a esmalte profundo.",
      "curodontEligible": true,
      "education": {
        "problem": "Caries inicial en el esmalte dental entre dos piezas (interproximal). La desmineralización ha progresado hasta la capa profunda del esmalte pero aún no ha alcanzado la dentina.",
        "consequences": "Sin tratamiento, progresará a dentina en 6-12 meses, requiriendo obturación (taladro y relleno). Mayor riesgo de dolor, sensibilidad y posible compromiso pulpar a largo plazo.",
        "curodontBenefit": "Curodont regenera el esmalte mediante cristales de hidroxiapatita biomimética, deteniendo la progresión y fortaleciendo la estructura dental sin necesidad de taladro. Tratamiento indoloro en una sesión de 15 minutos.",
        "treatments": [
          {
            "name": "Curodont™ Repair Fluoride Plus",
            "description": "Sistema biomimético de remineralización guiada aplicado por profesional dental. Se aplica el gel en la lesión, se deja actuar 3 minutos, y la remineralización continúa durante 3-6 meses.",
            "advantages": [
              "Sin dolor ni anestesia requerida",
              "No se remueve tejido dental sano (preservación total)",
              "Regenera esmalte con hidroxiapatita natural similar al diente original",
              "Tratamiento de 15 minutos en una sola sesión",
              "Fortalece el esmalte haciéndolo más resistente a futuras caries",
              "No hay periodo de recuperación, vida normal inmediata"
            ],
            "disadvantages": [
              "Efectivo SOLO en caries tempranas (E1, E2, D1)",
              "Resultado no visible inmediatamente (toma 3-6 meses)",
              "Requiere seguimiento radiográfico a los 6 meses",
              "Puede necesitar aplicación repetida en casos límite",
              "Costo inicial mayor que fluoruro tópico convencional"
            ],
            "whenRecommended": "Ideal para caries interproximales en esmalte (E1-E2), manchas blancas post-ortodoncia, lesiones de desmineralización temprana detectadas en bitewing, pacientes que buscan preservar al máximo su estructura dental natural."
          },
          {
            "name": "Obturación con Resina Compuesta",
            "description": "Tratamiento convencional: remoción del tejido cariado con taladro bajo anestesia local, seguido de relleno con resina del color del diente.",
            "advantages": [
              "Efectivo para caries de cualquier profundidad (E1-D3)",
              "Resultado inmediato y visible tras la sesión",
              "Ampliamente disponible en todas las clínicas dentales",
              "Restaura forma, función y estética del diente",
              "Técnica probada con décadas de evidencia clínica"
            ],
            "disadvantages": [
              "Requiere anestesia local (inyección)",
              "Remoción de tejido dental sano para acceder a la caries (debilitamiento estructural)",
              "Puede causar sensibilidad postoperatoria durante días/semanas",
              "Las obturaciones se desgastan y requieren reemplazo cada 5-10 años",
              "Mayor riesgo de fractura dental a largo plazo por pérdida de estructura"
            ],
            "whenRecommended": "Necesario para caries moderadas a profundas (D2-D3), lesiones con cavitación evidente >2mm, caries sintomáticas con dolor, cuando Curodont ya no es viable por profundidad de la lesión."
          },
          {
            "name": "Sellantes Dentales",
            "description": "Aplicación de resina fluida en surcos y fisuras oclusales para prevenir caries futuras. Puede usarse en lesiones E1 muy superficiales.",
            "advantages": [
              "Prevención efectiva de caries oclusales",
              "Sin necesidad de anestesia ni taladro",
              "Aplicación rápida (10-15 minutos)",
              "Económico comparado con obturaciones"
            ],
            "disadvantages": [
              "Solo para prevención o lesiones E1 muy superficiales",
              "No regenera esmalte, solo lo cubre",
              "Puede desprenderse con el tiempo",
              "No es tratamiento para caries ya establecidas (E2, D1+)"
            ],
            "whenRecommended": "Dientes con surcos profundos sin caries o con lesiones E1 mínimas en superficies oclusales. No aplicable a caries interproximales."
          }
        ]
      }
    }
  ],
  "recommendations": [
    "2 dientes (16, 26) son CANDIDATOS IDEALES para Curodont Repair (lesiones E1-E2 limitadas a esmalte)",
    "1 diente (36) es CANDIDATO POSIBLE para Curodont (D1 superficial) - requiere evaluación clínica para confirmar tamaño de cavitación",
    "1 diente (46) requiere TRATAMIENTO CONVENCIONAL con obturación por caries profunda D3",
    "Se recomienda radiografía bitewing para evaluar mejor las lesiones interproximales",
    "Evaluación clínica en consultorio obligatoria antes de decidir tratamiento final",
    "Si opta por Curodont, programar seguimiento radiográfico a los 6 meses para verificar remineralización",
    "Reforzar higiene oral: cepillado 3x/día con pasta fluorada, hilo dental diario especialmente en áreas interproximales"
  ],
  "curodontSummary": {
    "eligible": 2,
    "possiblyEligible": 1,
    "notEligible": 1,
    "overallRecommendation": "Buenas noticias: 3 de 4 lesiones detectadas son candidatas para Curodont (tratamiento regenerativo sin taladro). El tratamiento puede detener la progresión de la caries y fortalecer sus dientes de forma natural. Una lesión requiere obturación convencional por su profundidad. Recomendamos consulta clínica para confirmar candidatura y elaborar plan de tratamiento personalizado."
  }
}
`,
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64Image}`,
            },
          ],
        },
      ],
    })

    // Parse the AI response
    let parsedResult
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      parsedResult = {
        imageType: "No identificado",
        quality: "N/A",
        summary: text,
        cariesDetected: 0,
        curodontEligible: 0,
        findings: ["No se pudo analizar la imagen en formato estructurado"],
        detailedAnalysis: [],
        markers: [],
        recommendations: ["Intenta con una imagen de mejor calidad o una radiografía dental"],
        curodontSummary: {
          eligible: 0,
          possiblyEligible: 0,
          notEligible: 0,
          overallRecommendation: "No se pudo evaluar candidatura para Curodont",
        },
      }
    }

    // Save analysis in Supabase
    const supabase = await createClient()

    const { data: analysisData, error: dbError } = await supabase
      .from("caries_analyses")
      .insert({
        image_url: `data:${mimeType};base64,${base64Image.substring(0, 1000)}...`, // Save preview
        image_type: parsedResult.imageType || "unknown",
        ai_analysis: parsedResult,
        patient_id: patientId,
        status: "pending_review",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Error saving analysis to database:", dbError)
    } else {
      console.log("[v0] Analysis saved with ID:", analysisData?.id)
      // Add analysis ID to the result
      parsedResult.analysisId = analysisData?.id
    }

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }
}

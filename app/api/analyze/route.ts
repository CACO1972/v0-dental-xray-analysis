import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

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
              text: `Eres un Radiólogo Oral especializado en diagnóstico de precisión. Tu objetivo es identificar ÚNICAMENTE las siguientes patologías con MÁXIMA CERTEZA:

**PATOLOGÍAS A DIAGNOSTICAR:**
1. **CARIES**: Radiolucidez en corona (esmalte, dentina, pulpa). Describe profundidad exacta.
2. **RESTAURACIONES EXISTENTES**: IDENTIFICA TODAS las restauraciones presentes en cada diente:
   - Amalgama: Radiopacidad alta (blanco brillante)
   - Resina compuesta: Radiopacidad similar a dentina (gris)
   - Corona: Radiopacidad uniforme cubriendo todo el diente
   - Endodoncia: Material radiopaco en canal radicular
   - Incrustaciones: Restauración parcial radiopaca
   Indica SIEMPRE: Material, superficies restauradas (oclusal, mesial, distal, vestibular, lingual), estado (íntegra/con filtración)
3. **CARIES SUBGINGIVALES**: Lesiones bajo el margen gingival en área cervical.
4. **FILTRACIONES**: Espacios radiolúcidos entre restauración y tejido dental (recidiva de caries).
5. **FRACTURAS**: Líneas radiolúcidas en raíz o corona, fragmentación visible.

**INSTRUCCIONES CRÍTICAS:**
- USA NUMERACIÓN FDI OBLIGATORIAMENTE (ej. pieza 16, 21, 36, 46). NO uses otros sistemas.
- IDENTIFICA CADA RESTAURACIÓN VISIBLE: No omitas ninguna. Si ves una amalgama o resina, repórtala.
- Si NO estás SEGURO de un hallazgo, NO lo reportes. Mejor omitir que equivocarse.
- Para CADA hallazgo, indica su UBICACIÓN EXACTA en porcentajes X,Y (0,0 = arriba izquierda, 100,100 = abajo derecha).
- Describe usando terminología técnica: radiolucidez, radiopacidad, pérdida de lámina dura, etc.
- NO diagnostiques nada fuera de estas 5 patologías. Si ves algo más, solo menciónalo en "findings" generales.

**NIVEL DE DETALLE REQUERIDO:**
- **Caries**: "Radiolucidez de 3mm en superficie distal de pieza 36 comprometiendo esmalte y dentina superficial"
- **Restauración**: "Restauración radiopaca (amalgama) en superficies oclusal y mesial de pieza 46 con ajuste marginal adecuado. Estado: Íntegra"
- **Restauración con endodoncia**: "Material radiopaco intraconducto compatible con gutapercha/obturación en pieza 16. Corona radiopaca (metal-porcelana) supragingival"
- **Filtración**: "Espacio radiolúcido de 1mm entre restauración de amalgama y tejido en mesial de pieza 16, sugerente de recidiva de caries"
- **Fractura**: "Línea radiolúcida vertical en raíz distal de pieza 11, compatible con fractura radicular"

**IMPORTANTE PARA RESTAURACIONES:**
- Si un diente tiene restauración, SIEMPRE reporta: material (amalgama/resina/corona/etc), superficies, y estado
- Si una restauración está presente PERO presenta filtración, reporta AMBAS cosas (restauración + filtración)
- Si hay endodoncia (tratamiento de conducto), repórtala como "Material radiopaco intraconducto compatible con gutapercha/obturación"

Responde EN FORMATO JSON ESTRICTO:
{
  "imageType": "Tipo de radiografía (Panorámica/Periapical/Bitewing/CBCT)",
  "quality": "Calidad diagnóstica (Excelente/Aceptable/Subóptima/No diagnóstica)",
  "summary": "Resumen ejecutivo del caso en 2-3 líneas. MENCIONA el número total de restauraciones detectadas.",
  "findings": [
    "Hallazgo técnico detallado 1",
    "Hallazgo técnico detallado 2",
    "Lista de todas las restauraciones encontradas"
  ],
  "toothAnalysis": [
    { 
      "tooth": "Pieza XX (FDI)", 
      "finding": "Descripción precisa del problema o restauración presente",
      "severity": "low/medium/high"
    }
  ],
  "markers": [
    { 
      "id": "marker-1",
      "x": 25, 
      "y": 30, 
      "toothNumber": "16",
      "label": "Restauración amalgama pieza 16" o "Caries distal pieza 16",
      "severity": "low/medium/high",
      "pathology": "caries/restoration/subgingival-caries/filtration/fracture",
      "description": "Descripción técnica detallada del hallazgo",
      "education": {
        "problem": "Explicación del problema detectado o descripción de la restauración existente",
        "consequences": "Consecuencias si no se trata (para patologías) o estado actual (para restauraciones)",
        "treatments": [
          {
            "name": "Nombre del tratamiento",
            "description": "Descripción breve del procedimiento",
            "advantages": ["Ventaja 1", "Ventaja 2"],
            "disadvantages": ["Desventaja 1", "Desventaja 2"],
            "whenRecommended": "Situaciones donde se recomienda"
          }
        ]
      }
    }
  ],
  "recommendations": [
    "Recomendación clínica específica 1",
    "Recomendación clínica específica 2"
  ]
}

**SI LA IMAGEN NO ES UNA RADIOGRAFÍA DENTAL:** Responde: {"error": "Esta no es una radiografía dental válida", "summary": "No se puede realizar diagnóstico"}

**RECUERDA:** Solo reporta lo que VES con CERTEZA. Precisión sobre cantidad. NO OMITAS RESTAURACIONES VISIBLES.`,
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
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // Fallback if parsing fails
      parsedResult = {
        imageType: "No identificado",
        quality: "N/A",
        summary: text,
        findings: ["No se pudo analizar la imagen correctamente en formato estructurado"],
        toothAnalysis: [],
        markers: [],
        recommendations: ["Por favor, intenta con otra imagen de mejor calidad"],
      }
    }

    return NextResponse.json(parsedResult)
  } catch (error) {
    console.error("Error analyzing image:", error)
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }
}

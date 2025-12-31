import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      analysisId,
      radiologistName,
      radiologistEmail,
      feedbackType,
      correctedData,
      annotations,
      comments,
      confidenceScore,
    } = body

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId es requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    // Guardar retroalimentación
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("radiologist_feedback")
      .insert({
        analysis_id: analysisId,
        radiologist_name: radiologistName,
        radiologist_email: radiologistEmail,
        feedback_type: feedbackType,
        corrected_data: correctedData,
        comments,
        confidence_score: confidenceScore,
      })
      .select()
      .single()

    if (feedbackError) {
      console.error("[v0] Error saving feedback:", feedbackError)
      return NextResponse.json({ error: "Error al guardar retroalimentación" }, { status: 500 })
    }

    if (annotations && annotations.length > 0) {
      const annotationsToInsert = annotations.map((annotation: any) => ({
        analysis_id: analysisId,
        radiologist_email: radiologistEmail,
        annotation_type: annotation.type,
        coordinates: annotation.points,
        notes: `${annotation.type === "missed_caries" ? "Caries no detectada" : "Falso positivo"} marcado por ${radiologistName}`,
      }))

      const { error: annotationsError } = await supabase.from("radiologist_annotations").insert(annotationsToInsert)

      if (annotationsError) {
        console.error("[v0] Error saving annotations:", annotationsError)
      }
    }

    // Actualizar estado del análisis
    await supabase.from("caries_analyses").update({ status: "reviewed" }).eq("id", analysisId)

    // Registrar métricas de entrenamiento
    if (correctedData?.detailedAnalysis) {
      const metrics = correctedData.detailedAnalysis.map((item: any) => ({
        analysis_id: analysisId,
        metric_type: item.wasCorrect ? "true_positive" : item.wasMissed ? "false_negative" : "false_positive",
        tooth_number: item.tooth,
        lesion_type: item.depth,
        ai_detected: !item.wasMissed,
        radiologist_confirmed: item.wasCorrect || item.wasMissed,
      }))

      await supabase.from("training_metrics").insert(metrics)
    }

    if (annotations && annotations.length > 0) {
      const annotationMetrics = annotations.map((annotation: any) => ({
        analysis_id: analysisId,
        metric_type: annotation.type === "missed_caries" ? "false_negative" : "false_positive_correction",
        lesion_type: "annotated",
        ai_detected: annotation.type === "false_positive",
        radiologist_confirmed: true,
      }))

      await supabase.from("training_metrics").insert(annotationMetrics)
    }

    return NextResponse.json({ success: true, feedback: feedbackData })
  } catch (error) {
    console.error("[v0] Error processing feedback:", error)
    return NextResponse.json({ error: "Error al procesar retroalimentación" }, { status: 500 })
  }
}

// GET: Obtener retroalimentación de un análisis
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get("analysisId")

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId es requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("radiologist_feedback")
      .select("*")
      .eq("analysis_id", analysisId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "Error al obtener retroalimentación" }, { status: 500 })
    }

    return NextResponse.json({ feedback: data })
  } catch (error) {
    console.error("[v0] Error fetching feedback:", error)
    return NextResponse.json({ error: "Error al obtener retroalimentación" }, { status: 500 })
  }
}

import { z } from "zod"

// Validación de archivos de imagen
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Validar tipo de archivo
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido. Solo se aceptan: ${ACCEPTED_IMAGE_TYPES.join(", ")}`,
    }
  }

  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Archivo muy grande. Máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Validar nombre de archivo
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "Nombre de archivo muy largo",
    }
  }

  return { valid: true }
}

// Validación de edad del paciente
export function validatePatientAge(age: string): { valid: boolean; error?: string } {
  const ageNum = Number.parseInt(age)
  if (isNaN(ageNum) || ageNum < 3 || ageNum > 120) {
    return {
      valid: false,
      error: "Edad inválida. Debe estar entre 3 y 120 años",
    }
  }
  return { valid: true }
}

// Schema Zod para respuesta de IA
export const AIAnalysisSchema = z.object({
  imageType: z.string().optional(),
  quality: z.enum(["Excelente", "Buena", "Aceptable", "Pobre"]).optional(),
  error: z.string().optional(),
  cariesDetected: z.number().min(0).max(32).default(0),
  curodontEligible: z.number().min(0).max(32).default(0),
  findings: z.array(z.string()).default([]),
  detailedAnalysis: z
    .array(
      z.object({
        tooth: z.string(),
        surface: z.string(),
        classification: z.enum(["E0", "E1", "E2", "D1", "D2", "D3"]),
        depth: z.string(),
        description: z.string(),
        curodontCandidate: z.enum(["IDEAL", "POSIBLE", "NO"]),
        confidence: z.number().min(0).max(100),
      }),
    )
    .default([]),
  markers: z
    .array(
      z.object({
        x: z.number(),
        y: z.number(),
        label: z.string(),
      }),
    )
    .default([]),
  recommendations: z.array(z.string()).default([]),
})

export function normalizeAIResponse(raw: any): any {
  if (!raw || typeof raw !== "object") {
    return raw
  }

  const normalized = { ...raw }

  // Normalizar detailedAnalysis si existe con nombres alternativos
  if (Array.isArray(raw.detailedAnalysis)) {
    normalized.detailedAnalysis = raw.detailedAnalysis.map((item: any) => ({
      tooth: item.tooth || item.toothLocation || item.toothNumber || item.diente || "No especificado",
      surface: item.surface || item.surfaceAffected || item.superficie || "Interproximal",
      classification: normalizeClassification(
        item.classification || item.cariesStage || item.stage || item.clasificacion,
      ),
      depth: item.depth || item.depthMM || item.profundidad || "No determinada",
      description: item.description || item.findings || item.descripcion || "Lesión detectada",
      curodontCandidate: normalizeCurodontCandidate(
        item.curodontCandidate || item.curodontEligibility || item.elegibilidad,
      ),
      confidence:
        typeof item.confidence === "number"
          ? item.confidence
          : typeof item.confianza === "number"
            ? item.confianza
            : 75,
    }))
  }

  // Normalizar markers si existe con nombres alternativos
  if (Array.isArray(raw.markers)) {
    normalized.markers = raw.markers.map((item: any) => ({
      x: typeof item.x === "number" ? item.x : typeof item.posX === "number" ? item.posX : 50,
      y: typeof item.y === "number" ? item.y : typeof item.posY === "number" ? item.posY : 50,
      label: item.label || item.etiqueta || item.tooth || "Lesión",
    }))
  }

  return normalized
}

function normalizeClassification(value: any): "E0" | "E1" | "E2" | "D1" | "D2" | "D3" {
  if (!value) return "E1"

  const str = String(value).toUpperCase().trim()

  // Mapeo de variaciones comunes
  if (str.includes("E0") || str.includes("INICIAL") || str.includes("MANCHA")) return "E0"
  if (str.includes("E1") || str.includes("ESMALTE SUPERFICIAL")) return "E1"
  if (str.includes("E2") || str.includes("ESMALTE PROFUNDO")) return "E2"
  if (str.includes("D1") || str.includes("DENTINA SUPERFICIAL")) return "D1"
  if (str.includes("D2") || str.includes("DENTINA MEDIA")) return "D2"
  if (str.includes("D3") || str.includes("DENTINA PROFUNDA") || str.includes("PULPA")) return "D3"

  // Default basado en patrones generales
  if (str.includes("ESMALTE")) return "E1"
  if (str.includes("DENTINA")) return "D1"

  return "E1" // Default seguro
}

function normalizeCurodontCandidate(value: any): "IDEAL" | "POSIBLE" | "NO" {
  if (!value) return "POSIBLE"

  const str = String(value).toUpperCase().trim()

  if (str.includes("IDEAL") || str.includes("SI") || str.includes("YES") || str.includes("EXCELENTE")) return "IDEAL"
  if (str.includes("POSIBLE") || str.includes("MAYBE") || str.includes("PROBABLE") || str.includes("QUIZAS"))
    return "POSIBLE"
  if (str.includes("NO") || str.includes("NOT") || str.includes("NINGUNO")) return "NO"

  return "POSIBLE" // Default seguro
}

export type AIAnalysis = z.infer<typeof AIAnalysisSchema>

// Detectar calidad de imagen usando análisis básico
export async function detectImageQuality(file: File): Promise<{ quality: string; issues: string[] }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    const issues: string[] = []

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Verificar resolución mínima
      if (img.width < 800 || img.height < 600) {
        issues.push("Resolución muy baja (mínimo 800x600px)")
      }

      // Verificar aspect ratio razonable
      const aspectRatio = img.width / img.height
      if (aspectRatio > 3 || aspectRatio < 0.3) {
        issues.push("Proporción de imagen inusual")
      }

      // Evaluar calidad basada en tamaño de archivo vs resolución
      const bytesPerPixel = file.size / (img.width * img.height)
      if (bytesPerPixel < 0.1) {
        issues.push("Imagen muy comprimida, puede estar borrosa")
      }

      const quality = issues.length === 0 ? "Buena" : issues.length === 1 ? "Aceptable" : "Pobre"
      resolve({ quality, issues })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ quality: "Pobre", issues: ["No se pudo cargar la imagen"] })
    }

    img.src = url
  })
}

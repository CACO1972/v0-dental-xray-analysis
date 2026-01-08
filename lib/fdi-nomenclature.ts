// Nomenclatura FDI (Federación Dental Internacional)
// Sistema de dos dígitos donde:
// - Primer dígito: cuadrante (1=superior derecho, 2=superior izquierdo, 3=inferior izquierdo, 4=inferior derecho)
// - Segundo dígito: posición del diente en el cuadrante (1-8)

export interface ToothInfo {
  fdi: string
  name: string
  type: "incisivo" | "canino" | "premolar" | "molar"
  quadrant: "superior derecho" | "superior izquierdo" | "inferior izquierdo" | "inferior derecho"
  position: number
  fullName: string
}

export const FDI_TOOTH_MAP: Record<string, ToothInfo> = {
  // Cuadrante 1: Superior Derecho (Adulto)
  "11": {
    fdi: "1.1",
    name: "Incisivo Central",
    type: "incisivo",
    quadrant: "superior derecho",
    position: 1,
    fullName: "Incisivo Central Superior Derecho",
  },
  "12": {
    fdi: "1.2",
    name: "Incisivo Lateral",
    type: "incisivo",
    quadrant: "superior derecho",
    position: 2,
    fullName: "Incisivo Lateral Superior Derecho",
  },
  "13": {
    fdi: "1.3",
    name: "Canino",
    type: "canino",
    quadrant: "superior derecho",
    position: 3,
    fullName: "Canino Superior Derecho",
  },
  "14": {
    fdi: "1.4",
    name: "Primer Premolar",
    type: "premolar",
    quadrant: "superior derecho",
    position: 4,
    fullName: "Primer Premolar Superior Derecho",
  },
  "15": {
    fdi: "1.5",
    name: "Segundo Premolar",
    type: "premolar",
    quadrant: "superior derecho",
    position: 5,
    fullName: "Segundo Premolar Superior Derecho",
  },
  "16": {
    fdi: "1.6",
    name: "Primer Molar",
    type: "molar",
    quadrant: "superior derecho",
    position: 6,
    fullName: "Primer Molar Superior Derecho",
  },
  "17": {
    fdi: "1.7",
    name: "Segundo Molar",
    type: "molar",
    quadrant: "superior derecho",
    position: 7,
    fullName: "Segundo Molar Superior Derecho",
  },
  "18": {
    fdi: "1.8",
    name: "Tercer Molar",
    type: "molar",
    quadrant: "superior derecho",
    position: 8,
    fullName: "Tercer Molar Superior Derecho (Muela del Juicio)",
  },

  // Cuadrante 2: Superior Izquierdo (Adulto)
  "21": {
    fdi: "2.1",
    name: "Incisivo Central",
    type: "incisivo",
    quadrant: "superior izquierdo",
    position: 1,
    fullName: "Incisivo Central Superior Izquierdo",
  },
  "22": {
    fdi: "2.2",
    name: "Incisivo Lateral",
    type: "incisivo",
    quadrant: "superior izquierdo",
    position: 2,
    fullName: "Incisivo Lateral Superior Izquierdo",
  },
  "23": {
    fdi: "2.3",
    name: "Canino",
    type: "canino",
    quadrant: "superior izquierdo",
    position: 3,
    fullName: "Canino Superior Izquierdo",
  },
  "24": {
    fdi: "2.4",
    name: "Primer Premolar",
    type: "premolar",
    quadrant: "superior izquierdo",
    position: 4,
    fullName: "Primer Premolar Superior Izquierdo",
  },
  "25": {
    fdi: "2.5",
    name: "Segundo Premolar",
    type: "premolar",
    quadrant: "superior izquierdo",
    position: 5,
    fullName: "Segundo Premolar Superior Izquierdo",
  },
  "26": {
    fdi: "2.6",
    name: "Primer Molar",
    type: "molar",
    quadrant: "superior izquierdo",
    position: 6,
    fullName: "Primer Molar Superior Izquierdo",
  },
  "27": {
    fdi: "2.7",
    name: "Segundo Molar",
    type: "molar",
    quadrant: "superior izquierdo",
    position: 7,
    fullName: "Segundo Molar Superior Izquierdo",
  },
  "28": {
    fdi: "2.8",
    name: "Tercer Molar",
    type: "molar",
    quadrant: "superior izquierdo",
    position: 8,
    fullName: "Tercer Molar Superior Izquierdo (Muela del Juicio)",
  },

  // Cuadrante 3: Inferior Izquierdo (Adulto)
  "31": {
    fdi: "3.1",
    name: "Incisivo Central",
    type: "incisivo",
    quadrant: "inferior izquierdo",
    position: 1,
    fullName: "Incisivo Central Inferior Izquierdo",
  },
  "32": {
    fdi: "3.2",
    name: "Incisivo Lateral",
    type: "incisivo",
    quadrant: "inferior izquierdo",
    position: 2,
    fullName: "Incisivo Lateral Inferior Izquierdo",
  },
  "33": {
    fdi: "3.3",
    name: "Canino",
    type: "canino",
    quadrant: "inferior izquierdo",
    position: 3,
    fullName: "Canino Inferior Izquierdo",
  },
  "34": {
    fdi: "3.4",
    name: "Primer Premolar",
    type: "premolar",
    quadrant: "inferior izquierdo",
    position: 4,
    fullName: "Primer Premolar Inferior Izquierdo",
  },
  "35": {
    fdi: "3.5",
    name: "Segundo Premolar",
    type: "premolar",
    quadrant: "inferior izquierdo",
    position: 5,
    fullName: "Segundo Premolar Inferior Izquierdo",
  },
  "36": {
    fdi: "3.6",
    name: "Primer Molar",
    type: "molar",
    quadrant: "inferior izquierdo",
    position: 6,
    fullName: "Primer Molar Inferior Izquierdo",
  },
  "37": {
    fdi: "3.7",
    name: "Segundo Molar",
    type: "molar",
    quadrant: "inferior izquierdo",
    position: 7,
    fullName: "Segundo Molar Inferior Izquierdo",
  },
  "38": {
    fdi: "3.8",
    name: "Tercer Molar",
    type: "molar",
    quadrant: "inferior izquierdo",
    position: 8,
    fullName: "Tercer Molar Inferior Izquierdo (Muela del Juicio)",
  },

  // Cuadrante 4: Inferior Derecho (Adulto)
  "41": {
    fdi: "4.1",
    name: "Incisivo Central",
    type: "incisivo",
    quadrant: "inferior derecho",
    position: 1,
    fullName: "Incisivo Central Inferior Derecho",
  },
  "42": {
    fdi: "4.2",
    name: "Incisivo Lateral",
    type: "incisivo",
    quadrant: "inferior derecho",
    position: 2,
    fullName: "Incisivo Lateral Inferior Derecho",
  },
  "43": {
    fdi: "4.3",
    name: "Canino",
    type: "canino",
    quadrant: "inferior derecho",
    position: 3,
    fullName: "Canino Inferior Derecho",
  },
  "44": {
    fdi: "4.4",
    name: "Primer Premolar",
    type: "premolar",
    quadrant: "inferior derecho",
    position: 4,
    fullName: "Primer Premolar Inferior Derecho",
  },
  "45": {
    fdi: "4.5",
    name: "Segundo Premolar",
    type: "premolar",
    quadrant: "inferior derecho",
    position: 5,
    fullName: "Segundo Premolar Inferior Derecho",
  },
  "46": {
    fdi: "4.6",
    name: "Primer Molar",
    type: "molar",
    quadrant: "inferior derecho",
    position: 6,
    fullName: "Primer Molar Inferior Derecho",
  },
  "47": {
    fdi: "4.7",
    name: "Segundo Molar",
    type: "molar",
    quadrant: "inferior derecho",
    position: 7,
    fullName: "Segundo Molar Inferior Derecho",
  },
  "48": {
    fdi: "4.8",
    name: "Tercer Molar",
    type: "molar",
    quadrant: "inferior derecho",
    position: 8,
    fullName: "Tercer Molar Inferior Derecho (Muela del Juicio)",
  },

  // Dentición Temporal (Niños) - Cuadrante 5: Superior Derecho
  "51": {
    fdi: "5.1",
    name: "Incisivo Central Temporal",
    type: "incisivo",
    quadrant: "superior derecho",
    position: 1,
    fullName: "Incisivo Central Temporal Superior Derecho",
  },
  "52": {
    fdi: "5.2",
    name: "Incisivo Lateral Temporal",
    type: "incisivo",
    quadrant: "superior derecho",
    position: 2,
    fullName: "Incisivo Lateral Temporal Superior Derecho",
  },
  "53": {
    fdi: "5.3",
    name: "Canino Temporal",
    type: "canino",
    quadrant: "superior derecho",
    position: 3,
    fullName: "Canino Temporal Superior Derecho",
  },
  "54": {
    fdi: "5.4",
    name: "Primer Molar Temporal",
    type: "molar",
    quadrant: "superior derecho",
    position: 4,
    fullName: "Primer Molar Temporal Superior Derecho",
  },
  "55": {
    fdi: "5.5",
    name: "Segundo Molar Temporal",
    type: "molar",
    quadrant: "superior derecho",
    position: 5,
    fullName: "Segundo Molar Temporal Superior Derecho",
  },

  // Cuadrante 6: Superior Izquierdo Temporal
  "61": {
    fdi: "6.1",
    name: "Incisivo Central Temporal",
    type: "incisivo",
    quadrant: "superior izquierdo",
    position: 1,
    fullName: "Incisivo Central Temporal Superior Izquierdo",
  },
  "62": {
    fdi: "6.2",
    name: "Incisivo Lateral Temporal",
    type: "incisivo",
    quadrant: "superior izquierdo",
    position: 2,
    fullName: "Incisivo Lateral Temporal Superior Izquierdo",
  },
  "63": {
    fdi: "6.3",
    name: "Canino Temporal",
    type: "canino",
    quadrant: "superior izquierdo",
    position: 3,
    fullName: "Canino Temporal Superior Izquierdo",
  },
  "64": {
    fdi: "6.4",
    name: "Primer Molar Temporal",
    type: "molar",
    quadrant: "superior izquierdo",
    position: 4,
    fullName: "Primer Molar Temporal Superior Izquierdo",
  },
  "65": {
    fdi: "6.5",
    name: "Segundo Molar Temporal",
    type: "molar",
    quadrant: "superior izquierdo",
    position: 5,
    fullName: "Segundo Molar Temporal Superior Izquierdo",
  },

  // Cuadrante 7: Inferior Izquierdo Temporal
  "71": {
    fdi: "7.1",
    name: "Incisivo Central Temporal",
    type: "incisivo",
    quadrant: "inferior izquierdo",
    position: 1,
    fullName: "Incisivo Central Temporal Inferior Izquierdo",
  },
  "72": {
    fdi: "7.2",
    name: "Incisivo Lateral Temporal",
    type: "incisivo",
    quadrant: "inferior izquierdo",
    position: 2,
    fullName: "Incisivo Lateral Temporal Inferior Izquierdo",
  },
  "73": {
    fdi: "7.3",
    name: "Canino Temporal",
    type: "canino",
    quadrant: "inferior izquierdo",
    position: 3,
    fullName: "Canino Temporal Inferior Izquierdo",
  },
  "74": {
    fdi: "7.4",
    name: "Primer Molar Temporal",
    type: "molar",
    quadrant: "inferior izquierdo",
    position: 4,
    fullName: "Primer Molar Temporal Inferior Izquierdo",
  },
  "75": {
    fdi: "7.5",
    name: "Segundo Molar Temporal",
    type: "molar",
    quadrant: "inferior izquierdo",
    position: 5,
    fullName: "Segundo Molar Temporal Inferior Izquierdo",
  },

  // Cuadrante 8: Inferior Derecho Temporal
  "81": {
    fdi: "8.1",
    name: "Incisivo Central Temporal",
    type: "incisivo",
    quadrant: "inferior derecho",
    position: 1,
    fullName: "Incisivo Central Temporal Inferior Derecho",
  },
  "82": {
    fdi: "8.2",
    name: "Incisivo Lateral Temporal",
    type: "incisivo",
    quadrant: "inferior derecho",
    position: 2,
    fullName: "Incisivo Lateral Temporal Inferior Derecho",
  },
  "83": {
    fdi: "8.3",
    name: "Canino Temporal",
    type: "canino",
    quadrant: "inferior derecho",
    position: 3,
    fullName: "Canino Temporal Inferior Derecho",
  },
  "84": {
    fdi: "8.4",
    name: "Primer Molar Temporal",
    type: "molar",
    quadrant: "inferior derecho",
    position: 4,
    fullName: "Primer Molar Temporal Inferior Derecho",
  },
  "85": {
    fdi: "8.5",
    name: "Segundo Molar Temporal",
    type: "molar",
    quadrant: "inferior derecho",
    position: 5,
    fullName: "Segundo Molar Temporal Inferior Derecho",
  },
}

/**
 * Convierte notación FDI a nombre completo en español
 * @param fdiNumber - Número FDI (ej: "16", "46", "1.6", "4.6")
 * @returns Información completa del diente o undefined
 */
export function getFDIToothInfo(fdiNumber: string): ToothInfo | undefined {
  // Normalizar el input (eliminar punto si existe)
  const normalized = fdiNumber.replace(".", "")
  return FDI_TOOTH_MAP[normalized]
}

/**
 * Formatea un diente para mostrar: "Pieza 1.6 - Primer Molar Superior Derecho"
 */
export function formatToothDisplay(fdiNumber: string): string {
  const info = getFDIToothInfo(fdiNumber)
  if (!info) return `Pieza ${fdiNumber}`
  return `Pieza ${info.fdi} - ${info.fullName}`
}

/**
 * Obtiene solo el nombre corto: "Primer Molar Superior Derecho"
 */
export function getToothFullName(fdiNumber: string): string {
  const info = getFDIToothInfo(fdiNumber)
  return info?.fullName || fdiNumber
}

/**
 * Valida si un número FDI es válido
 */
export function isValidFDI(fdiNumber: string): boolean {
  const normalized = fdiNumber.replace(".", "")
  return normalized in FDI_TOOTH_MAP
}

/**
 * Obtiene el tipo de diente (incisivo, canino, premolar, molar)
 */
export function getToothType(fdiNumber: string): string {
  const info = getFDIToothInfo(fdiNumber)
  return info?.type || "desconocido"
}

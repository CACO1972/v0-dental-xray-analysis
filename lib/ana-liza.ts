"use strict"

/**
 * ANA LIZA - Analizador de IA para Zero Caries
 * Sistema de monitoreo, validacion y optimizacion de variables de IA
 */

export interface IAMetrics {
  timestamp: Date
  requestId: string
  model: string
  imageType: "radiograph" | "intraoral"
  responseTime: number
  tokenUsage?: number
  success: boolean
  errorType?: string
  confidence: number
  cariesDetected: number
  curodontEligible: number
  qualityScore: number
  anomalies: Anomaly[]
}

export interface Anomaly {
  type: "RESPONSE_TIME" | "LOW_CONFIDENCE" | "PARSE_ERROR" | "INVALID_OUTPUT" | "QUALITY_ISSUE" | "THRESHOLD_EXCEEDED"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  message: string
  value?: number
  threshold?: number
}

export interface AnaLizaConfig {
  responseTimeThresholdMs: number
  minConfidenceThreshold: number
  maxCariesPerImage: number
  enableRealTimeAlerts: boolean
  sampleRate: number // 0-1, porcentaje de requests a monitorear
  adaptiveThresholds: boolean
}

// Configuracion por defecto
const DEFAULT_CONFIG: AnaLizaConfig = {
  responseTimeThresholdMs: 30000, // 30 segundos
  minConfidenceThreshold: 60, // 60% minimo de confianza
  maxCariesPerImage: 15, // Maximo razonable de caries por imagen
  enableRealTimeAlerts: true,
  sampleRate: 1.0, // Monitorear 100% de requests
  adaptiveThresholds: true,
}

// Almacenamiento en memoria para metricas (en produccion usar Redis/DB)
const metricsStore: IAMetrics[] = []
const MAX_METRICS_STORED = 1000

// Estadisticas agregadas
let aggregatedStats = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0,
  avgConfidence: 0,
  totalAnomalies: 0,
  anomaliesByType: {} as Record<string, number>,
  lastUpdated: new Date(),
}

/**
 * Clase principal ANA LIZA
 */
export class AnaLiza {
  private config: AnaLizaConfig
  private startTime: number = 0
  private requestId: string = ""

  constructor(config: Partial<AnaLizaConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Inicia el monitoreo de una request
   */
  startMonitoring(requestId?: string): string {
    this.requestId = requestId || this.generateRequestId()
    this.startTime = Date.now()
    console.log(`[ANA LIZA] Iniciando monitoreo - Request ID: ${this.requestId}`)
    return this.requestId
  }

  /**
   * Registra metricas de una respuesta de IA
   */
  recordMetrics(data: {
    model: string
    imageType: "radiograph" | "intraoral"
    success: boolean
    errorType?: string
    aiResponse?: any
  }): IAMetrics {
    const responseTime = Date.now() - this.startTime
    const anomalies: Anomaly[] = []

    // Extraer metricas de la respuesta de IA
    const confidence = this.calculateAverageConfidence(data.aiResponse)
    const cariesDetected = data.aiResponse?.cariesDetected || 0
    const curodontEligible = data.aiResponse?.curodontEligible || 0
    const qualityScore = this.calculateQualityScore(data.aiResponse)

    // Detectar anomalias
    anomalies.push(...this.detectAnomalies({
      responseTime,
      success: data.success,
      errorType: data.errorType,
      confidence,
      cariesDetected,
      qualityScore,
      aiResponse: data.aiResponse,
    }))

    const metrics: IAMetrics = {
      timestamp: new Date(),
      requestId: this.requestId,
      model: data.model,
      imageType: data.imageType,
      responseTime,
      success: data.success,
      errorType: data.errorType,
      confidence,
      cariesDetected,
      curodontEligible,
      qualityScore,
      anomalies,
    }

    // Almacenar metricas
    this.storeMetrics(metrics)

    // Actualizar estadisticas agregadas
    this.updateAggregatedStats(metrics)

    // Log de metricas
    console.log(`[ANA LIZA] Metricas registradas:`, {
      requestId: this.requestId,
      responseTime: `${responseTime}ms`,
      success: data.success,
      confidence: `${confidence}%`,
      cariesDetected,
      anomalies: anomalies.length,
    })

    // Alertas en tiempo real
    if (this.config.enableRealTimeAlerts && anomalies.some(a => a.severity === "CRITICAL" || a.severity === "HIGH")) {
      this.triggerAlert(anomalies.filter(a => a.severity === "CRITICAL" || a.severity === "HIGH"))
    }

    return metrics
  }

  /**
   * Detecta anomalias en la respuesta de IA
   */
  private detectAnomalies(data: {
    responseTime: number
    success: boolean
    errorType?: string
    confidence: number
    cariesDetected: number
    qualityScore: number
    aiResponse?: any
  }): Anomaly[] {
    const anomalies: Anomaly[] = []

    // 1. Tiempo de respuesta excesivo
    if (data.responseTime > this.config.responseTimeThresholdMs) {
      anomalies.push({
        type: "RESPONSE_TIME",
        severity: data.responseTime > this.config.responseTimeThresholdMs * 2 ? "HIGH" : "MEDIUM",
        message: `Tiempo de respuesta excesivo: ${data.responseTime}ms`,
        value: data.responseTime,
        threshold: this.config.responseTimeThresholdMs,
      })
    }

    // 2. Confianza baja
    if (data.confidence > 0 && data.confidence < this.config.minConfidenceThreshold) {
      anomalies.push({
        type: "LOW_CONFIDENCE",
        severity: data.confidence < 40 ? "HIGH" : "MEDIUM",
        message: `Confianza por debajo del umbral: ${data.confidence}%`,
        value: data.confidence,
        threshold: this.config.minConfidenceThreshold,
      })
    }

    // 3. Error en el parsing
    if (!data.success && data.errorType?.includes("parse")) {
      anomalies.push({
        type: "PARSE_ERROR",
        severity: "HIGH",
        message: `Error al parsear respuesta de IA: ${data.errorType}`,
      })
    }

    // 4. Numero excesivo de caries (posible alucinacion)
    if (data.cariesDetected > this.config.maxCariesPerImage) {
      anomalies.push({
        type: "THRESHOLD_EXCEEDED",
        severity: "HIGH",
        message: `Numero de caries detectadas inusualmente alto: ${data.cariesDetected}`,
        value: data.cariesDetected,
        threshold: this.config.maxCariesPerImage,
      })
    }

    // 5. Calidad de respuesta baja
    if (data.qualityScore < 50) {
      anomalies.push({
        type: "QUALITY_ISSUE",
        severity: data.qualityScore < 30 ? "HIGH" : "MEDIUM",
        message: `Calidad de respuesta baja: ${data.qualityScore}/100`,
        value: data.qualityScore,
      })
    }

    // 6. Respuesta invalida
    if (data.success && data.aiResponse) {
      const validationIssues = this.validateAIOutput(data.aiResponse)
      if (validationIssues.length > 0) {
        anomalies.push({
          type: "INVALID_OUTPUT",
          severity: "MEDIUM",
          message: `Problemas de validacion: ${validationIssues.join(", ")}`,
        })
      }
    }

    return anomalies
  }

  /**
   * Valida la estructura de la respuesta de IA
   */
  private validateAIOutput(response: any): string[] {
    const issues: string[] = []

    if (!response) {
      issues.push("Respuesta vacia")
      return issues
    }

    // Validar campos requeridos
    if (typeof response.cariesDetected !== "number") {
      issues.push("cariesDetected no es numero")
    }

    if (typeof response.curodontEligible !== "number") {
      issues.push("curodontEligible no es numero")
    }

    // Validar coherencia
    if (response.curodontEligible > response.cariesDetected) {
      issues.push("curodontEligible mayor que cariesDetected")
    }

    // Validar detailedAnalysis
    if (response.detailedAnalysis && Array.isArray(response.detailedAnalysis)) {
      response.detailedAnalysis.forEach((item: any, index: number) => {
        if (!item.tooth) issues.push(`detailedAnalysis[${index}]: falta tooth`)
        if (!item.classification) issues.push(`detailedAnalysis[${index}]: falta classification`)
        if (item.confidence && (item.confidence < 0 || item.confidence > 100)) {
          issues.push(`detailedAnalysis[${index}]: confidence fuera de rango`)
        }
      })
    }

    // Validar nomenclatura FDI
    if (response.detailedAnalysis) {
      response.detailedAnalysis.forEach((item: any, index: number) => {
        if (item.tooth && !this.isValidFDI(item.tooth)) {
          issues.push(`detailedAnalysis[${index}]: nomenclatura FDI invalida (${item.tooth})`)
        }
      })
    }

    return issues
  }

  /**
   * Verifica si un numero de diente es FDI valido
   */
  private isValidFDI(tooth: string): boolean {
    const fdiPattern = /^[1-8][1-8]$/
    if (!fdiPattern.test(tooth)) return false

    const quadrant = parseInt(tooth[0])
    const position = parseInt(tooth[1])

    // Adultos: cuadrantes 1-4, posiciones 1-8
    // Temporales: cuadrantes 5-8, posiciones 1-5
    if (quadrant >= 1 && quadrant <= 4) {
      return position >= 1 && position <= 8
    } else if (quadrant >= 5 && quadrant <= 8) {
      return position >= 1 && position <= 5
    }

    return false
  }

  /**
   * Calcula la confianza promedio de las detecciones
   */
  private calculateAverageConfidence(response: any): number {
    if (!response?.detailedAnalysis || !Array.isArray(response.detailedAnalysis)) {
      return 0
    }

    if (response.detailedAnalysis.length === 0) {
      return response.cariesDetected === 0 ? 100 : 0
    }

    const confidences = response.detailedAnalysis
      .map((item: any) => item.confidence)
      .filter((c: any) => typeof c === "number")

    if (confidences.length === 0) return 75 // Default si no hay confidence

    return Math.round(confidences.reduce((a: number, b: number) => a + b, 0) / confidences.length)
  }

  /**
   * Calcula un score de calidad general de la respuesta
   */
  private calculateQualityScore(response: any): number {
    if (!response) return 0

    let score = 100
    const issues = this.validateAIOutput(response)

    // Penalizar por cada issue
    score -= issues.length * 10

    // Penalizar si no hay detailedAnalysis cuando hay caries
    if (response.cariesDetected > 0 && (!response.detailedAnalysis || response.detailedAnalysis.length === 0)) {
      score -= 30
    }

    // Penalizar si no hay markers cuando hay caries
    if (response.cariesDetected > 0 && (!response.markers || response.markers.length === 0)) {
      score -= 20
    }

    // Penalizar si no hay recommendations
    if (!response.recommendations || response.recommendations.length === 0) {
      score -= 10
    }

    // Bonus por alta confianza
    const avgConfidence = this.calculateAverageConfidence(response)
    if (avgConfidence >= 80) score += 10
    else if (avgConfidence < 50) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  /**
   * Almacena metricas (con limite)
   */
  private storeMetrics(metrics: IAMetrics): void {
    metricsStore.unshift(metrics)
    if (metricsStore.length > MAX_METRICS_STORED) {
      metricsStore.pop()
    }
  }

  /**
   * Actualiza estadisticas agregadas
   */
  private updateAggregatedStats(metrics: IAMetrics): void {
    aggregatedStats.totalRequests++

    if (metrics.success) {
      aggregatedStats.successfulRequests++
    } else {
      aggregatedStats.failedRequests++
    }

    // Calcular promedio movil de tiempo de respuesta
    const alpha = 0.1 // Factor de suavizado
    aggregatedStats.avgResponseTime = 
      alpha * metrics.responseTime + (1 - alpha) * aggregatedStats.avgResponseTime

    // Calcular promedio movil de confianza
    if (metrics.confidence > 0) {
      aggregatedStats.avgConfidence = 
        alpha * metrics.confidence + (1 - alpha) * aggregatedStats.avgConfidence
    }

    // Contar anomalias
    aggregatedStats.totalAnomalies += metrics.anomalies.length
    metrics.anomalies.forEach(anomaly => {
      aggregatedStats.anomaliesByType[anomaly.type] = 
        (aggregatedStats.anomaliesByType[anomaly.type] || 0) + 1
    })

    aggregatedStats.lastUpdated = new Date()
  }

  /**
   * Dispara alertas para anomalias criticas
   */
  private triggerAlert(anomalies: Anomaly[]): void {
    console.warn(`[ANA LIZA ALERTA] ${anomalies.length} anomalia(s) critica(s) detectada(s):`)
    anomalies.forEach(a => {
      console.warn(`  - [${a.severity}] ${a.type}: ${a.message}`)
    })
    // En produccion: enviar a sistema de alertas, Slack, email, etc.
  }

  /**
   * Genera ID unico para request
   */
  private generateRequestId(): string {
    return `ana_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Obtiene estadisticas agregadas
   */
  static getAggregatedStats() {
    return {
      ...aggregatedStats,
      successRate: aggregatedStats.totalRequests > 0 
        ? ((aggregatedStats.successfulRequests / aggregatedStats.totalRequests) * 100).toFixed(2) + "%"
        : "N/A",
    }
  }

  /**
   * Obtiene metricas recientes
   */
  static getRecentMetrics(limit: number = 100): IAMetrics[] {
    return metricsStore.slice(0, limit)
  }

  /**
   * Obtiene anomalias recientes
   */
  static getRecentAnomalies(limit: number = 50): { timestamp: Date; requestId: string; anomaly: Anomaly }[] {
    const anomalies: { timestamp: Date; requestId: string; anomaly: Anomaly }[] = []

    metricsStore.forEach(m => {
      m.anomalies.forEach(a => {
        anomalies.push({
          timestamp: m.timestamp,
          requestId: m.requestId,
          anomaly: a,
        })
      })
    })

    return anomalies.slice(0, limit)
  }

  /**
   * Genera reporte de rendimiento
   */
  static generatePerformanceReport(): string {
    const stats = this.getAggregatedStats()
    const recentAnomalies = this.getRecentAnomalies(10)

    return `
=== REPORTE ANA LIZA - Zero Caries ===
Generado: ${new Date().toISOString()}

ESTADISTICAS GENERALES:
- Total Requests: ${stats.totalRequests}
- Exitosos: ${stats.successfulRequests} (${stats.successRate})
- Fallidos: ${stats.failedRequests}
- Tiempo Promedio: ${Math.round(stats.avgResponseTime)}ms
- Confianza Promedio: ${Math.round(stats.avgConfidence)}%

ANOMALIAS:
- Total Detectadas: ${stats.totalAnomalies}
${Object.entries(stats.anomaliesByType)
  .map(([type, count]) => `  - ${type}: ${count}`)
  .join("\n")}

ANOMALIAS RECIENTES:
${recentAnomalies
  .map(a => `- [${a.anomaly.severity}] ${a.anomaly.type}: ${a.anomaly.message}`)
  .join("\n") || "Ninguna"}

=== FIN REPORTE ===
    `.trim()
  }

  /**
   * Ajusta umbrales adaptativamente basado en datos historicos
   */
  adaptThresholds(): void {
    if (!this.config.adaptiveThresholds || metricsStore.length < 50) return

    // Calcular percentil 95 de tiempo de respuesta
    const responseTimes = metricsStore.map(m => m.responseTime).sort((a, b) => a - b)
    const p95Index = Math.floor(responseTimes.length * 0.95)
    const newResponseTimeThreshold = responseTimes[p95Index] * 1.2 // 20% de margen

    // Solo actualizar si hay cambio significativo
    if (Math.abs(newResponseTimeThreshold - this.config.responseTimeThresholdMs) > 5000) {
      console.log(`[ANA LIZA] Ajustando umbral de tiempo: ${this.config.responseTimeThresholdMs}ms -> ${Math.round(newResponseTimeThreshold)}ms`)
      this.config.responseTimeThresholdMs = Math.round(newResponseTimeThreshold)
    }
  }
}

// Instancia singleton
export const anaLiza = new AnaLiza()

// Exportar funciones de utilidad
export const getAnaLizaStats = () => AnaLiza.getAggregatedStats()
export const getAnaLizaReport = () => AnaLiza.generatePerformanceReport()
export const getRecentAnomalies = (limit?: number) => AnaLiza.getRecentAnomalies(limit)

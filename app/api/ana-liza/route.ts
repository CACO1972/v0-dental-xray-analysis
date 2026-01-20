import { type NextRequest, NextResponse } from "next/server"
import { AnaLiza, getAnaLizaStats, getAnaLizaReport, getRecentAnomalies } from "@/lib/ana-liza"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action") || "stats"

  try {
    switch (action) {
      case "stats":
        return NextResponse.json({
          success: true,
          data: getAnaLizaStats(),
        })

      case "report":
        return NextResponse.json({
          success: true,
          data: {
            report: getAnaLizaReport(),
            generatedAt: new Date().toISOString(),
          },
        })

      case "anomalies":
        const limit = parseInt(searchParams.get("limit") || "50")
        return NextResponse.json({
          success: true,
          data: getRecentAnomalies(limit),
        })

      case "metrics":
        const metricsLimit = parseInt(searchParams.get("limit") || "100")
        return NextResponse.json({
          success: true,
          data: AnaLiza.getRecentMetrics(metricsLimit),
        })

      case "health":
        const stats = getAnaLizaStats()
        const successRate = parseFloat(stats.successRate) || 0
        const isHealthy = successRate >= 90 && stats.avgResponseTime < 45000

        return NextResponse.json({
          success: true,
          data: {
            status: isHealthy ? "HEALTHY" : "DEGRADED",
            successRate: stats.successRate,
            avgResponseTime: `${Math.round(stats.avgResponseTime)}ms`,
            totalAnomalies: stats.totalAnomalies,
            lastUpdated: stats.lastUpdated,
          },
        })

      default:
        return NextResponse.json({
          success: false,
          error: `Accion desconocida: ${action}`,
          availableActions: ["stats", "report", "anomalies", "metrics", "health"],
        }, { status: 400 })
    }
  } catch (error) {
    console.error("[ANA LIZA API] Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Error interno",
    }, { status: 500 })
  }
}

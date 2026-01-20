"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  TrendingUp,
  Zap,
  Shield,
  Eye,
  BarChart3
} from "lucide-react"

interface AnaLizaStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  avgResponseTime: number
  avgConfidence: number
  totalAnomalies: number
  anomaliesByType: Record<string, number>
  successRate: string
  lastUpdated: string
}

interface Anomaly {
  timestamp: string
  requestId: string
  anomaly: {
    type: string
    severity: string
    message: string
    value?: number
    threshold?: number
  }
}

export function AnaLizaDashboard() {
  const [stats, setStats] = useState<AnaLizaStats | null>(null)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [healthStatus, setHealthStatus] = useState<"HEALTHY" | "DEGRADED" | "UNKNOWN">("UNKNOWN")
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, anomaliesRes, healthRes] = await Promise.all([
        fetch("/api/ana-liza?action=stats"),
        fetch("/api/ana-liza?action=anomalies&limit=20"),
        fetch("/api/ana-liza?action=health"),
      ])

      const statsData = await statsRes.json()
      const anomaliesData = await anomaliesRes.json()
      const healthData = await healthRes.json()

      if (statsData.success) setStats(statsData.data)
      if (anomaliesData.success) setAnomalies(anomaliesData.data)
      if (healthData.success) setHealthStatus(healthData.data.status)

      setLastRefresh(new Date())
    } catch (error) {
      console.error("Error fetching ANA LIZA data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refrescar cada 30s
    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500"
      case "HIGH": return "bg-orange-500"
      case "MEDIUM": return "bg-yellow-500"
      case "LOW": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "HEALTHY": return "text-green-500"
      case "DEGRADED": return "text-yellow-500"
      default: return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
            <Eye className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              ANA LIZA
            </h1>
            <p className="text-sm text-muted-foreground">
              Analizador de Variables de IA - Zero Caries
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge 
            variant="outline" 
            className={`text-lg px-4 py-2 ${getHealthColor(healthStatus)}`}
          >
            {healthStatus === "HEALTHY" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {healthStatus}
          </Badge>
          <Button 
            onClick={fetchData} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-cyan-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalRequests || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.successfulRequests || 0} exitosos / {stats?.failedRequests || 0} fallidos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tasa de Exito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.successRate || "N/A"}</div>
            <Progress 
              value={parseFloat(stats?.successRate || "0")} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tiempo Promedio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats ? `${Math.round(stats.avgResponseTime / 1000)}s` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats ? `${Math.round(stats.avgResponseTime)}ms` : "Sin datos"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Confianza Promedio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats ? `${Math.round(stats.avgConfidence)}%` : "N/A"}
            </div>
            <Progress 
              value={stats?.avgConfidence || 0} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs de contenido */}
      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalias ({stats?.totalAnomalies || 0})
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Desglose
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Validacion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Anomalias Recientes
              </CardTitle>
              <CardDescription>
                Ultimas anomalias detectadas en las respuestas de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {anomalies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No hay anomalias recientes detectadas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anomalies.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border"
                    >
                      <Badge className={getSeverityColor(item.anomaly.severity)}>
                        {item.anomaly.severity}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {item.anomaly.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.anomaly.message}
                        </p>
                        {item.anomaly.value !== undefined && item.anomaly.threshold !== undefined && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Valor: {item.anomaly.value} | Umbral: {item.anomaly.threshold}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Desglose de Anomalias por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.anomaliesByType && Object.keys(stats.anomaliesByType).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.anomaliesByType).map(([type, count]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress 
                        value={(count / stats.totalAnomalies) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Sin anomalias registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Reglas de Validacion Activas
              </CardTitle>
              <CardDescription>
                Configuracion actual del sistema ANA LIZA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Tiempo de Respuesta</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Umbral maximo: 30,000ms
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alerta si excede este tiempo
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Confianza Minima</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Umbral minimo: 60%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alerta si confianza menor
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Max Caries por Imagen</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Limite: 15 detecciones
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detecta posibles alucinaciones
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Validacion FDI</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Nomenclatura dental internacional
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verifica formato de dientes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Ultima actualizacion: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  )
}

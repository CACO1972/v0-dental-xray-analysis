"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CariesMarker {
  x: number
  y: number
  label: string
  curodontEligible?: "IDEAL" | "POSIBLE" | "NO"
  classification?: string
  confidence?: number
}

interface CariesVisualizationProps {
  imageUrl: string
  markers: CariesMarker[]
  imageType: "radiograph" | "intraoral"
}

export function CariesVisualization({ imageUrl, markers, imageType }: CariesVisualizationProps) {
  const [zoom, setZoom] = useState(1)
  const [showMarkers, setShowMarkers] = useState(true)
  const [highlightCurodont, setHighlightCurodont] = useState(true)

  const curodontCandidates = markers.filter((m) => m.curodontEligible === "IDEAL" || m.curodontEligible === "POSIBLE")
  const otherMarkers = markers.filter((m) => !m.curodontEligible || m.curodontEligible === "NO")

  const getMarkerStyle = (marker: CariesMarker) => {
    if (marker.curodontEligible === "IDEAL") {
      return {
        borderColor: "#00D9FF",
        backgroundColor: "rgba(0, 217, 255, 0.2)",
        shadowColor: "#00D9FF",
        textColor: "#00D9FF",
        pulseClass: "animate-pulse-glow",
      }
    } else if (marker.curodontEligible === "POSIBLE") {
      return {
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        shadowColor: "#F59E0B",
        textColor: "#F59E0B",
        pulseClass: "animate-pulse-slow",
      }
    }
    return {
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      shadowColor: "#EF4444",
      textColor: "#EF4444",
      pulseClass: "animate-pulse",
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Visualización de Lesiones
            <Badge className="ml-2 bg-blue-100 text-blue-700">
              {markers.length} {markers.length === 1 ? "lesión" : "lesiones"} marcadas
            </Badge>
            {curodontCandidates.length > 0 && (
              <Badge className="ml-2 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {curodontCandidates.length} candidata{curodontCandidates.length !== 1 ? "s" : ""} Curodont
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {curodontCandidates.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHighlightCurodont(!highlightCurodont)}
                className={highlightCurodont ? "bg-[#00D9FF]/10 border-[#00D9FF]/30" : ""}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Curodont
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMarkers(!showMarkers)}
              className={showMarkers ? "bg-blue-50" : ""}
            >
              <Info className="w-4 h-4 mr-1" />
              Marcadores
            </Button>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="icon" onClick={() => setZoom(Math.min(3, zoom + 0.25))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-auto max-h-[600px] bg-gray-900 rounded-xl">
          <div
            className="relative"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`${imageType === "radiograph" ? "Radiografía" : "Foto intraoral"}`}
              className="w-full"
            />
            {showMarkers &&
              markers.map((marker, index) => {
                const style = getMarkerStyle(marker)
                const isCurodontCandidate = marker.curodontEligible === "IDEAL" || marker.curodontEligible === "POSIBLE"
                const shouldHighlight = highlightCurodont && isCurodontCandidate

                return (
                  <div
                    key={index}
                    className="absolute group"
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-125 ${shouldHighlight ? style.pulseClass : ""}`}
                      style={{
                        border: `3px solid ${style.borderColor}`,
                        backgroundColor: style.backgroundColor,
                        boxShadow: shouldHighlight
                          ? `0 0 20px ${style.shadowColor}, 0 0 40px ${style.shadowColor}, 0 0 60px ${style.shadowColor}`
                          : `0 0 10px ${style.shadowColor}`,
                      }}
                      title={marker.label}
                    >
                      <span className="text-sm font-bold" style={{ color: style.textColor }}>
                        {index + 1}
                      </span>

                      {marker.curodontEligible === "IDEAL" && shouldHighlight && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00D9FF] rounded-full flex items-center justify-center animate-bounce">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-black/90 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                      style={{ whiteSpace: "normal" }}
                    >
                      <div className="font-bold mb-1">{marker.label}</div>
                      {marker.classification && (
                        <div className="text-gray-300">Clasificación: {marker.classification}</div>
                      )}
                      {marker.confidence && (
                        <div className="text-gray-300">Confianza: {Math.round(marker.confidence)}%</div>
                      )}
                      {marker.curodontEligible === "IDEAL" && (
                        <div className="mt-1 text-[#00D9FF] font-semibold">✓ IDEAL para Curodont</div>
                      )}
                      {marker.curodontEligible === "POSIBLE" && (
                        <div className="mt-1 text-amber-400 font-semibold">~ Posible Curodont</div>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-[#00D9FF]"
                style={{ backgroundColor: "rgba(0, 217, 255, 0.2)" }}
              />
              <span className="text-muted-foreground">Ideal Curodont</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-amber-500"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}
              />
              <span className="text-muted-foreground">Posible Curodont</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-red-500"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }}
              />
              <span className="text-muted-foreground">Otro tratamiento</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {curodontCandidates.length > 0
              ? `${curodontCandidates.length} lesión${curodontCandidates.length !== 1 ? "es" : ""} candidata${curodontCandidates.length !== 1 ? "s" : ""} para tratamiento sin inyecciones ni taladro`
              : "Los marcadores indican la ubicación aproximada de las lesiones detectadas"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

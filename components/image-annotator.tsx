"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Pencil, Eraser, Trash2, Undo } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

interface Annotation {
  id: string
  type: "missed_caries" | "false_positive"
  points: { x: number; y: number }[]
  color: string
}

interface ImageAnnotatorProps {
  imageUrl: string
  onAnnotationsChange: (annotations: Annotation[]) => void
  initialAnnotations?: Annotation[]
}

export function ImageAnnotator({ imageUrl, onAnnotationsChange, initialAnnotations = [] }: ImageAnnotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations)
  const [currentAnnotation, setCurrentAnnotation] = useState<{ x: number; y: number }[]>([])
  const [annotationType, setAnnotationType] = useState<"missed_caries" | "false_positive">("missed_caries")
  const [toolMode, setToolMode] = useState<"draw" | "erase">("draw")

  useEffect(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Cargar imagen
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      redrawCanvas()
    }
  }, [imageUrl])

  useEffect(() => {
    redrawCanvas()
  }, [annotations])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar todas las anotaciones guardadas
    annotations.forEach((annotation) => {
      if (annotation.points.length < 2) return

      ctx.strokeStyle = annotation.color
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      ctx.beginPath()
      ctx.moveTo(annotation.points[0].x, annotation.points[0].y)
      annotation.points.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    })
  }

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode === "erase") {
      handleErase(e)
      return
    }

    setIsDrawing(true)
    const coords = getCanvasCoordinates(e)
    setCurrentAnnotation([coords])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode === "erase") return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const coords = getCanvasCoordinates(e)
    const newPoints = [...currentAnnotation, coords]
    setCurrentAnnotation(newPoints)

    // Dibujar en tiempo real
    redrawCanvas()
    const color = annotationType === "missed_caries" ? "#ef4444" : "#3b82f6"
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.lineCap = "round"

    if (currentAnnotation.length > 0) {
      const lastPoint = currentAnnotation[currentAnnotation.length - 1]
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (currentAnnotation.length > 1) {
      const color = annotationType === "missed_caries" ? "#ef4444" : "#3b82f6"
      const newAnnotation: Annotation = {
        id: crypto.randomUUID(),
        type: annotationType,
        points: currentAnnotation,
        color,
      }

      const updatedAnnotations = [...annotations, newAnnotation]
      setAnnotations(updatedAnnotations)
      onAnnotationsChange(updatedAnnotations)
    }

    setCurrentAnnotation([])
  }

  const handleErase = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    const eraserRadius = 20

    // Encontrar anotaciones cerca del clic
    const updatedAnnotations = annotations.filter((annotation) => {
      const isNear = annotation.points.some(
        (point) => Math.sqrt(Math.pow(point.x - coords.x, 2) + Math.pow(point.y - coords.y, 2)) < eraserRadius,
      )
      return !isNear
    })

    if (updatedAnnotations.length !== annotations.length) {
      setAnnotations(updatedAnnotations)
      onAnnotationsChange(updatedAnnotations)
    }
  }

  const handleUndo = () => {
    if (annotations.length === 0) return
    const updatedAnnotations = annotations.slice(0, -1)
    setAnnotations(updatedAnnotations)
    onAnnotationsChange(updatedAnnotations)
  }

  const handleClearAll = () => {
    setAnnotations([])
    onAnnotationsChange([])
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label>Herramientas de Marcado</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle
            pressed={toolMode === "draw"}
            onPressedChange={() => setToolMode("draw")}
            aria-label="Modo dibujo"
            className="data-[state=on]:bg-teal-600 data-[state=on]:text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Dibujar
          </Toggle>
          <Toggle
            pressed={toolMode === "erase"}
            onPressedChange={() => setToolMode("erase")}
            aria-label="Modo borrar"
            className="data-[state=on]:bg-red-600 data-[state=on]:text-white"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Borrar
          </Toggle>

          {toolMode === "draw" && (
            <>
              <div className="w-px h-6 bg-border" />
              <Badge
                variant={annotationType === "missed_caries" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setAnnotationType("missed_caries")}
              >
                Caries No Detectada (Rojo)
              </Badge>
              <Badge
                variant={annotationType === "false_positive" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setAnnotationType("false_positive")}
              >
                Falso Positivo (Azul)
              </Badge>
            </>
          )}

          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={handleUndo} disabled={annotations.length === 0}>
              <Undo className="w-4 h-4 mr-1" />
              Deshacer
            </Button>
            <Button size="sm" variant="outline" onClick={handleClearAll} disabled={annotations.length === 0}>
              <Trash2 className="w-4 h-4 mr-1" />
              Limpiar Todo
            </Button>
          </div>
        </div>
      </div>

      <div className="relative border rounded-lg overflow-hidden bg-black">
        <img ref={imageRef} src={imageUrl || "/placeholder.svg"} alt="Radiografía" className="w-full opacity-70" />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {annotations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Anotaciones realizadas:</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Caries no detectadas: {annotations.filter((a) => a.type === "missed_caries").length}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Falsos positivos: {annotations.filter((a) => a.type === "false_positive").length}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}

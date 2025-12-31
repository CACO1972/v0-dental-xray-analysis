"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion } from "framer-motion"
import { Upload, X, ImageIcon, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadZonePremiumProps {
  onImageSelect: (file: File, preview: string) => void
  selectedImage: string | null
  onClear: () => void
  isAnalyzing: boolean
}

export function UploadZonePremium({ onImageSelect, selectedImage, onClear, isAnalyzing }: UploadZonePremiumProps) {
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const preview = URL.createObjectURL(file)
        onImageSelect(file, preview)
      }
    },
    [onImageSelect],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  if (selectedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden border-2 border-[#00D9FF]/30 bg-black"
      >
        {/* Image preview */}
        <div className="relative aspect-[4/3] w-full">
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Imagen dental"
            className="w-full h-full object-contain bg-black"
          />

          {/* Scanning overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <motion.div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
              <Loader2 className="w-12 h-12 text-[#00D9FF] animate-spin mb-4" />
              <p className="text-white font-medium">Analizando con IA...</p>
              <p className="text-[#00D9FF] text-sm">Detectando caries y evaluando elegibilidad</p>
            </div>
          )}
        </div>

        {/* Clear button */}
        {!isAnalyzing && (
          <button
            onClick={onClear}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
        isDragActive
          ? "border-[#00D9FF] bg-[#00D9FF]/5 scale-[1.02]"
          : "border-border hover:border-[#00D9FF]/50 hover:bg-[#00D9FF]/5",
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />

      <div className="p-12 text-center space-y-6">
        {/* Upload icon */}
        <motion.div
          className="w-20 h-20 mx-auto rounded-2xl bg-black flex items-center justify-center"
          animate={isDragActive ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Upload className="w-10 h-10 text-white" />
        </motion.div>

        {/* Instructions */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-black">
            {isDragActive ? "Suelta tu imagen aquí" : "Sube tu Radiografía"}
          </h3>
          <p className="text-muted-foreground">
            Arrastra una imagen o <span className="text-[#00D9FF] font-medium">haz clic para seleccionar</span>
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ImageIcon className="w-4 h-4" />
            PNG, JPG, WEBP
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Máx 10MB</span>
        </div>

        {/* Important notice */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl text-left max-w-md mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900">Importante</p>
            <p className="text-amber-700">
              Para detectar caries interproximales (elegibles para Curodont), necesitas una{" "}
              <strong>radiografía bitewing o periapical</strong>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

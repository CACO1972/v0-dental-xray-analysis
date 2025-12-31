"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AnalysisStep {
  id: string
  label: string
  status: "pending" | "in-progress" | "completed"
}

interface AnalysisProgressTrackerProps {
  steps: AnalysisStep[]
}

export function AnalysisProgressTracker({ steps }: AnalysisProgressTrackerProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <h3 className="font-bold text-black mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        Progreso del Análisis
      </h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "in-progress"
                    ? "bg-blue-500 animate-pulse"
                    : "bg-gray-300"
              }`}
            >
              {step.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : step.status === "in-progress" ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <span className="text-xs text-gray-600 font-bold">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  step.status === "completed"
                    ? "text-green-700"
                    : step.status === "in-progress"
                      ? "text-blue-700"
                      : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-800">
          ⏱️ <strong>Tiempo estimado:</strong> 30-60 segundos. La IA está analizando cada diente con precisión
          radiológica.
        </p>
      </div>
    </Card>
  )
}

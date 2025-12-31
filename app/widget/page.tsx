"use client"

import { XrayUploader } from "@/components/xray-uploader"
import { ZeroCaresLogo } from "@/components/zero-caries-logo"

export default function WidgetPage() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <ZeroCaresLogo className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold text-black">Zero Caries</h1>
              <p className="text-xs text-muted-foreground">by Clínica Miro</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Detecta caries temprana y descubre si eres candidato para tratamiento sin taladro
          </p>
        </div>

        <XrayUploader />

        <div className="text-center text-xs text-muted-foreground pt-4 border-t">
          Tecnología de detección con IA • Resultados en 30 segundos
        </div>
      </div>
    </div>
  )
}

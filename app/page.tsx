import { XrayUploader } from '@/components/xray-uploader'
import { Activity } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DentalAI</h1>
              <p className="text-xs text-muted-foreground">Análisis de Radiografías Dentales</p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            AI-Powered
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Análisis Inteligente de Rayos X Dentales
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Sube una radiografía dental y obtén un análisis detallado con IA de última generación.
              Identifica caries, fracturas, problemas periodontales y más.
            </p>
          </div>

          {/* Upload Component */}
          <XrayUploader />

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Detección de Caries</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Identifica caries interproximales, oclusales y radiculares con alta precisión
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Análisis en Tiempo Real</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Resultados instantáneos usando modelos de visión por computadora avanzados
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Informes Detallados</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Recibe análisis completos con recomendaciones y observaciones clínicas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Herramienta de asistencia diagnóstica. No reemplaza el criterio profesional del odontólogo.</p>
        </div>
      </footer>
    </div>
  )
}

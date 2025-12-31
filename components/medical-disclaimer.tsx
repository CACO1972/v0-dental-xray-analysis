import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function MedicalDisclaimer() {
  return (
    <Alert className="bg-amber-50 border-amber-300">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertDescription className="text-sm text-amber-900">
        <strong className="font-semibold">Aviso Médico Importante:</strong> Este sistema utiliza inteligencia artificial
        como herramienta de apoyo diagnóstico. Los resultados NO sustituyen el diagnóstico clínico profesional. Todo
        análisis debe ser verificado por un odontólogo certificado antes de tomar decisiones de tratamiento. El uso de
        este sistema no establece una relación médico-paciente.
      </AlertDescription>
    </Alert>
  )
}

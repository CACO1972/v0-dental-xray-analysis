import { AnaLizaDashboard } from "@/components/ana-liza-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ANA LIZA - Monitor de IA | Zero Caries",
  description: "Sistema de monitoreo y validacion de variables de inteligencia artificial para Zero Caries",
}

export default function AnaLizaPage() {
  return <AnaLizaDashboard />
}

"use client"

import { useState } from "react"
import { Share2, Mail, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface ShareResultsButtonProps {
  analysisId?: string
  summary: string
}

export function ShareResultsButton({ analysisId, summary }: ShareResultsButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)

  const handleDownloadPDF = () => {
    // En producción, esto generaría un PDF real
    toast.success("Función de descarga en desarrollo. Pronto disponible.")
  }

  const handleEmailSend = async () => {
    if (!email) {
      toast.error("Por favor ingresa un correo electrónico")
      return
    }

    setSending(true)
    // Simulación - en producción enviaría email real
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Resultados enviados a ${email}`)
    setEmail("")
    setOpen(false)
    setSending(false)
  }

  const handleShareLink = () => {
    if (analysisId) {
      const shareUrl = `${window.location.origin}/results/${analysisId}`
      navigator.clipboard.writeText(shareUrl)
      toast.success("Enlace copiado al portapapeles")
    } else {
      toast.error("No hay análisis para compartir")
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="rounded-full border-black text-black hover:bg-black hover:text-white bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartir Resultados
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartir Resultados</DialogTitle>
            <DialogDescription>Envía el análisis a tu dentista o guárdalo para tu historial</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Enviar por correo</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="dentista@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleEmailSend} disabled={sending} className="bg-black text-white">
                  {sending ? <CheckCircle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShareLink}>
                <Share2 className="w-4 h-4 mr-2" />
                Copiar Enlace
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

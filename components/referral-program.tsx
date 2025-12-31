"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Gift, Check } from "lucide-react"
import { motion } from "framer-motion"

export function ReferralProgram() {
  const [referralCode] = useState("MIRO2024")
  const [copied, setCopied] = useState(false)
  const [stats] = useState({
    invited: 12,
    joined: 8,
    active: 5,
    earned: 120000,
  })

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola colega! 👋\n\nTe recomiendo Zero Caries, una herramienta de IA que uso para detectar caries tempranas.\n\n✅ Análisis en 30 segundos\n✅ Identifica candidatos para Curodont (sin taladro)\n✅ 93% de precisión validada clínicamente\n\nUsa mi código ${referralCode} para obtener 5 análisis gratis.\n\n🔗 zerocaries.clinicamiro.cl`,
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Hero Card con código */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="text-center mb-8">
            <Gift className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Invita Colegas, Gana Recompensas</h2>
            <p className="text-white/90">Por cada dentista que refieres, ganas créditos para análisis gratuitos</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <div className="text-sm uppercase tracking-wider mb-2">Tu Código de Referido</div>
              <div className="text-5xl font-black mb-6">{referralCode}</div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" variant="secondary" className="flex-1" onClick={copyCode}>
                {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
                {copied ? "¡Copiado!" : "Copiar Código"}
              </Button>
              <Button size="lg" variant="secondary" onClick={shareWhatsApp}>
                <Share2 />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{stats.invited}</div>
              <div className="text-xs text-muted-foreground mt-1">Invitados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.joined}</div>
              <div className="text-xs text-muted-foreground mt-1">Se Unieron</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{stats.active}</div>
              <div className="text-xs text-muted-foreground mt-1">Activos</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg">
              <div className="text-3xl font-bold text-white">${(stats.earned / 1000).toFixed(0)}k</div>
              <div className="text-xs text-white mt-1">Ganado (CLP)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-bold">Programa de Recompensas</h3>
          <p className="text-muted-foreground">Desbloquea beneficios al invitar más colegas</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { refs: 1, reward: "10 análisis gratuitos", value: "15.000 CLP", unlocked: stats.joined >= 1 },
            { refs: 5, reward: "50 análisis + Badge 'Embajador'", value: "75.000 CLP", unlocked: stats.joined >= 5 },
            { refs: 10, reward: "Cuenta Premium 6 meses", value: "180.000 CLP", unlocked: false },
            { refs: 25, reward: "Cuenta Premium 1 año + Certificación", value: "500.000 CLP", unlocked: false },
            { refs: 50, reward: "Acceso de por vida + Revenue Share", value: "∞", unlocked: false },
          ].map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center justify-between p-5 rounded-xl border-2 ${
                tier.unlocked ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    tier.unlocked ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {tier.unlocked ? "✓" : tier.refs}
                </div>
                <div>
                  <div className="font-bold text-lg">{tier.reward}</div>
                  <div className="text-sm text-muted-foreground">Al referir {tier.refs} colegas activos</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{tier.value}</div>
                <div className="text-xs text-muted-foreground">valor estimado</div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

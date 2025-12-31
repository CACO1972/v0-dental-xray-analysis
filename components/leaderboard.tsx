"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, Star, Award } from "lucide-react"
import { motion } from "framer-motion"

interface LeaderboardEntry {
  rank: number
  clinicName: string
  city: string
  country: string
  score: number
  earlyDetections: number
  curodontSuccess: number
  badge?: string
}

export function GlobalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      clinicName: "Clínica Miro",
      city: "Santiago",
      country: "Chile",
      score: 2847,
      earlyDetections: 342,
      curodontSuccess: 98,
      badge: "🏆",
    },
    {
      rank: 2,
      clinicName: "Dental Excellence",
      city: "Buenos Aires",
      country: "Argentina",
      score: 2654,
      earlyDetections: 318,
      curodontSuccess: 96,
      badge: "🥈",
    },
    {
      rank: 3,
      clinicName: "SmileTech",
      city: "São Paulo",
      country: "Brasil",
      score: 2489,
      earlyDetections: 287,
      curodontSuccess: 94,
      badge: "🥉",
    },
    {
      rank: 4,
      clinicName: "Advanced Dental",
      city: "México DF",
      country: "México",
      score: 2234,
      earlyDetections: 256,
      curodontSuccess: 92,
    },
    {
      rank: 5,
      clinicName: "ProCare Dental",
      city: "Lima",
      country: "Perú",
      score: 2156,
      earlyDetections: 243,
      curodontSuccess: 91,
    },
  ])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-black">Ranking Global</h2>
              <p className="text-white/90">Top Clínicas en Detección Temprana</p>
            </div>
          </div>
          <Badge className="bg-white text-black text-lg px-4 py-2">2,847 Clínicas Activas</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center justify-between p-5 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer
                ${index === 0 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300" : ""}
                ${index === 1 ? "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300" : ""}
                ${index === 2 ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300" : ""}
                ${index > 2 ? "bg-white border-gray-200" : ""}
              `}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`
                  w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black
                  ${index === 0 ? "bg-yellow-400 text-yellow-900" : ""}
                  ${index === 1 ? "bg-gray-300 text-gray-800" : ""}
                  ${index === 2 ? "bg-orange-400 text-orange-900" : ""}
                  ${index > 2 ? "bg-blue-100 text-blue-900" : ""}
                `}
                >
                  {entry.badge || `#${entry.rank}`}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-lg flex items-center gap-2">
                    {entry.clinicName}
                    {index < 3 && (
                      <Badge variant="secondary" className="text-xs">
                        TOP {index + 1}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {entry.city}, {entry.country}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-600" />
                      {entry.earlyDetections} detecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      {entry.curodontSuccess}% éxito
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-black text-blue-600">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">puntos</div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-6 bg-transparent" size="lg">
          Ver Ranking Completo
        </Button>

        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-3 text-purple-600" />
            <h4 className="font-bold text-lg mb-2">¿Quieres aparecer en el ranking?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Registra tu clínica y comienza a acumular puntos por cada detección temprana
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">Registrar Mi Clínica</Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

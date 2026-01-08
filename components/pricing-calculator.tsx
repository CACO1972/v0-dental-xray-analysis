"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, Package, DollarSign } from "lucide-react"

const PRICING_DATA = {
  costPerApplicator: 31925, // CLP
  pricePerLesion: 60000, // CLP (80% margin)
  costPerBox: 319250, // CLP (10 aplicadores)
  applicatorsPerBox: 10,
  maxLesionsPerApplicator: 3,
  marginPercentage: 80,
}

export function PricingCalculator() {
  const [numLesions, setNumLesions] = useState(1)

  const applicatorsNeeded = Math.ceil(numLesions / PRICING_DATA.maxLesionsPerApplicator)
  const totalCost = applicatorsNeeded * PRICING_DATA.costPerApplicator
  const totalPrice = numLesions * PRICING_DATA.pricePerLesion
  const totalMargin = totalPrice - totalCost
  const marginPercentage = ((totalMargin / totalCost) * 100).toFixed(1)

  const boxesNeeded = Math.ceil(applicatorsNeeded / PRICING_DATA.applicatorsPerBox)
  const totalBoxCost = boxesNeeded * PRICING_DATA.costPerBox

  return (
    <div className="space-y-6">
      <Card className="border-[#00D9FF]/20 bg-white/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#00D9FF]" />
            Calculadora de Arancel Curodont
          </CardTitle>
          <CardDescription className="text-base">
            Calcula costos, precios y márgenes según número de lesiones tratadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input de lesiones */}
          <div className="space-y-2">
            <Label htmlFor="numLesions" className="text-base font-medium">
              Número de Lesiones a Tratar
            </Label>
            <Input
              id="numLesions"
              type="number"
              min="1"
              max="30"
              value={numLesions}
              onChange={(e) => setNumLesions(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="text-lg h-12 border-[#00D9FF]/30 focus:border-[#00D9FF]"
            />
            <p className="text-sm text-gray-600">
              Cada aplicador puede tratar hasta {PRICING_DATA.maxLesionsPerApplicator} lesiones
            </p>
          </div>

          <Separator />

          {/* Costos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-[#00D9FF]" />
              Costos de Insumos
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Aplicadores Necesarios</p>
                <p className="text-2xl font-bold text-gray-900">{applicatorsNeeded}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Boxes Requeridos</p>
                <p className="text-2xl font-bold text-gray-900">{boxesNeeded}</p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg col-span-2">
                <p className="text-sm text-red-600 mb-1">Costo Total Insumos</p>
                <p className="text-3xl font-bold text-red-700">${totalCost.toLocaleString("es-CL")} CLP</p>
                <p className="text-xs text-red-600 mt-1">
                  ({applicatorsNeeded} aplicador{applicatorsNeeded > 1 ? "es" : ""} × $
                  {PRICING_DATA.costPerApplicator.toLocaleString("es-CL")})
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Precio al paciente */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Precio al Paciente
            </h3>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <p className="text-sm text-green-700 mb-2">Precio Total del Tratamiento</p>
              <p className="text-4xl font-bold text-green-800">${totalPrice.toLocaleString("es-CL")} CLP</p>
              <p className="text-sm text-green-600 mt-2">
                {numLesions} lesion{numLesions > 1 ? "es" : ""} × ${PRICING_DATA.pricePerLesion.toLocaleString("es-CL")}{" "}
                CLP
              </p>
            </div>
          </div>

          <Separator />

          {/* Margen */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00D9FF]" />
              Análisis de Rentabilidad
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#00D9FF]/5 rounded-lg border border-[#00D9FF]/20">
                <p className="text-sm text-gray-600 mb-1">Margen Bruto</p>
                <p className="text-2xl font-bold text-[#00D9FF]">${totalMargin.toLocaleString("es-CL")}</p>
              </div>

              <div className="p-4 bg-[#00D9FF]/5 rounded-lg border border-[#00D9FF]/20">
                <p className="text-sm text-gray-600 mb-1">% Margen</p>
                <p className="text-2xl font-bold text-[#00D9FF]">{marginPercentage}%</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> El margen de {PRICING_DATA.marginPercentage}% sobre costo de insumos es
                competitivo considerando que el tratamiento es no invasivo, sin anestesia, y requiere menor tiempo
                clínico que una restauración tradicional.
              </p>
            </div>
          </div>

          <Separator />

          {/* Comparación con tratamientos tradicionales */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">Comparación con Arancel Tradicional</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Resina Simple (tradicional)</span>
                <div className="text-right">
                  <span className="font-semibold">~$28,500 CLP</span>
                  <p className="text-xs text-gray-500">Con anestesia y fresado</p>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span>Resina Compuesta (tradicional)</span>
                <div className="text-right">
                  <span className="font-semibold">~$35,000 CLP</span>
                  <p className="text-xs text-gray-500">Con anestesia y fresado</p>
                </div>
              </div>
              <div className="flex justify-between p-3 bg-[#00D9FF]/10 rounded border-2 border-[#00D9FF]/30">
                <span className="font-semibold">Curodont (no invasivo)</span>
                <div className="text-right">
                  <span className="font-bold text-[#00D9FF]">$60,000 CLP</span>
                  <p className="text-xs text-[#00D9FF] font-semibold">SIN inyecciones NI fresado</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-[#00D9FF]/10 to-green-50 rounded-lg border-2 border-[#00D9FF]/30">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00D9FF] flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-2">Tratamiento Premium 100% No Invasivo</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <strong>SIN INYECCIONES</strong> - Cero dolor, cero anestesia
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <strong>SIN FRESADO MECÁNICO</strong> - Preserva 100% estructura dental
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Tratamiento en 15 minutos vs 45 min tradicional
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Ideal para pacientes con fobia dental
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabla de referencia rápida */}
          <Card className="border-[#00D9FF]/20">
            <CardHeader>
              <CardTitle className="text-lg">Referencia Rápida de Costos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Lesiones</th>
                      <th className="p-3 text-right">Aplicadores</th>
                      <th className="p-3 text-right">Costo</th>
                      <th className="p-3 text-right">Precio</th>
                      <th className="p-3 text-right">Margen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 5, 10].map((lesions) => {
                      const apps = Math.ceil(lesions / PRICING_DATA.maxLesionsPerApplicator)
                      const cost = apps * PRICING_DATA.costPerApplicator
                      const price = lesions * PRICING_DATA.pricePerLesion
                      const margin = price - cost

                      return (
                        <tr key={lesions} className="border-t hover:bg-gray-50">
                          <td className="p-3">{lesions}</td>
                          <td className="p-3 text-right">{apps}</td>
                          <td className="p-3 text-right">${cost.toLocaleString("es-CL")}</td>
                          <td className="p-3 text-right font-semibold">${price.toLocaleString("es-CL")}</td>
                          <td className="p-3 text-right text-green-600 font-semibold">
                            ${margin.toLocaleString("es-CL")}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

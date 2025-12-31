import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Zero Caries | Detección Temprana de Caries con IA - Clínica Miro",
  description:
    "Análisis instantáneo de radiografías dentales con Inteligencia Artificial. Descubre si eres candidato para tratamiento Curodont sin taladro ni dolor.",
  keywords: ["caries", "detección", "IA", "Curodont", "radiografía dental", "bitewing", "sin taladro", "Clínica Miro"],
  authors: [{ name: "Clínica Miro" }],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Zero Caries | Detección con IA",
    description: "Detecta caries antes de sentirlas. Tratamiento sin taladro ni dolor.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

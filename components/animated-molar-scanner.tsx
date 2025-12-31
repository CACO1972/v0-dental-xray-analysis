"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function AnimatedMolarScanner({ className = "" }: { className?: string }) {
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedLesions, setDetectedLesions] = useState<{ x: number; y: number; size: number; delay: number }[]>([])

  useEffect(() => {
    // Animated scan progress
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 40)

    // Simulate lesion detection at different stages
    const lesionTimeout = setTimeout(() => {
      setDetectedLesions([
        { x: 70, y: 85, size: 10, delay: 0 },
        { x: 130, y: 75, size: 8, delay: 0.5 },
        { x: 100, y: 110, size: 6, delay: 1 },
      ])
    }, 1500)

    return () => {
      clearInterval(interval)
      clearTimeout(lesionTimeout)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Shadow and lighting effects */}
          <filter id="molar-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="12" stdDeviation="20" floodColor="#000" floodOpacity="0.2" />
          </filter>

          {/* Realistic tooth gradient */}
          <radialGradient id="molar-gradient" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fafbfc" />
            <stop offset="70%" stopColor="#f1f3f5" />
            <stop offset="100%" stopColor="#e3e6e9" />
          </radialGradient>

          {/* Scanner beam gradient */}
          <linearGradient id="scanner-beam" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </linearGradient>

          {/* Lesion highlight gradient */}
          <radialGradient id="lesion-glow">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </radialGradient>

          {/* Molar clip path */}
          <clipPath id="molar-clip">
            <path d="M60 40 C 50 40, 40 50, 40 65 L 35 90 C 32 110, 35 130, 40 145 L 45 165 C 48 180, 55 195, 70 205 L 85 215 C 92 218, 108 218, 115 215 L 130 205 C 145 195, 152 180, 155 165 L 160 145 C 165 130, 168 110, 165 90 L 160 65 C 160 50, 150 40, 140 40 L 120 35 C 115 33, 105 30, 100 30 C 95 30, 85 33, 80 35 Z" />
          </clipPath>
        </defs>

        {/* Main molar body with realistic shape */}
        <g filter="url(#molar-shadow)">
          {/* Molar crown (top wider part) */}
          <path
            d="M60 40 C 50 40, 40 50, 40 65 L 35 90 C 32 110, 35 130, 40 145 L 45 165 C 48 180, 55 195, 70 205 L 85 215 C 92 218, 108 218, 115 215 L 130 205 C 145 195, 152 180, 155 165 L 160 145 C 165 130, 168 110, 165 90 L 160 65 C 160 50, 150 40, 140 40 L 120 35 C 115 33, 105 30, 100 30 C 95 30, 85 33, 80 35 Z"
            fill="url(#molar-gradient)"
            stroke="#d8dde2"
            strokeWidth="2"
          />

          {/* Occlusal surface details (chewing surface) */}
          <g opacity="0.6">
            {/* Central fossa */}
            <ellipse cx="100" cy="70" rx="25" ry="20" fill="#e8ebed" />

            {/* Cusps (raised points) */}
            <circle cx="75" cy="60" r="15" fill="#f5f7f9" />
            <circle cx="125" cy="60" r="15" fill="#f5f7f9" />
            <circle cx="75" cy="90" r="12" fill="#f5f7f9" />
            <circle cx="125" cy="90" r="12" fill="#f5f7f9" />

            {/* Grooves between cusps */}
            <path d="M65 65 Q 100 75 135 65" stroke="#d0d5da" strokeWidth="2" fill="none" />
            <path d="M65 85 Q 100 95 135 85" stroke="#d0d5da" strokeWidth="2" fill="none" />
            <path d="M85 55 L 85 100" stroke="#d0d5da" strokeWidth="1.5" />
            <path d="M115 55 L 115 100" stroke="#d0d5da" strokeWidth="1.5" />
          </g>

          {/* Anatomical details - pits and fissures */}
          <path d="M75 70 Q 100 78 125 70" stroke="#c8ced3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M80 85 Q 100 92 120 85" stroke="#c8ced3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>

        {/* AI Scanner beam sweeping */}
        <g clipPath="url(#molar-clip)">
          <motion.rect
            x="30"
            width="140"
            height="50"
            fill="url(#scanner-beam)"
            animate={{ y: [0, 230, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Grid overlay for scanning effect */}
          <motion.g
            opacity="0.3"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="30"
                y1={30 + i * 25}
                x2="170"
                y2={30 + i * 25}
                stroke="#00D9FF"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={40 + i * 25}
                y1="30"
                x2={40 + i * 25}
                y2="220"
                stroke="#00D9FF"
                strokeWidth="0.5"
              />
            ))}
          </motion.g>
        </g>

        {/* Detected lesion markers */}
        {detectedLesions.map((lesion, index) => (
          <motion.g key={index}>
            {/* Pulsing circle */}
            <motion.circle
              cx={lesion.x}
              cy={lesion.y}
              r={lesion.size}
              fill="url(#lesion-glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: lesion.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
            />
            {/* Ring indicator */}
            <motion.circle
              cx={lesion.x}
              cy={lesion.y}
              r={lesion.size}
              fill="none"
              stroke="#00D9FF"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                delay: lesion.delay,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
          </motion.g>
        ))}

        {/* Scan progress indicator */}
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <rect x="50" y="225" width="100" height="8" rx="4" fill="#e9ecef" />
          <motion.rect
            x="50"
            y="225"
            height="8"
            rx="4"
            fill="#00D9FF"
            animate={{ width: [0, 100, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.g>

        {/* AI label */}
        <motion.text
          x="100"
          y="15"
          textAnchor="middle"
          fill="#00D9FF"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
        >
          AI SCANNING
        </motion.text>
      </svg>

      {/* Floating detection labels */}
      <motion.div
        className="absolute top-12 left-0 px-3 py-1.5 bg-white rounded-lg shadow-lg border border-[#00D9FF]/30"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs font-semibold text-black">E1 Detectada</span>
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-0 px-3 py-1.5 bg-[#00D9FF] rounded-lg shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs font-bold text-black">3 Lesiones</span>
      </motion.div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"

export function AnimatedMolarScanner({ className = "" }: { className?: string }) {
  const lesions = [
    { x: 75, y: 65, label: "E1" },
    { x: 125, y: 70, label: "E2" },
    { x: 100, y: 95, label: "D1" },
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Main container with glow effect */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#00D9FF]/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <svg
          viewBox="0 0 200 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          <defs>
            {/* Tooth gradient - more realistic */}
            <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8F9FA" />
              <stop offset="100%" stopColor="#E9ECEF" />
            </linearGradient>

            {/* Scanner beam */}
            <linearGradient id="scanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
              <stop offset="40%" stopColor="#00D9FF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#00D9FF" stopOpacity="1" />
              <stop offset="60%" stopColor="#00D9FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
            </linearGradient>

            {/* Lesion glow */}
            <radialGradient id="lesionGlow">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="70%" stopColor="#00D9FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
            </radialGradient>

            {/* Drop shadow */}
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#000" floodOpacity="0.15" />
            </filter>

            {/* Clip path for tooth shape */}
            <clipPath id="toothClip">
              <path d="M50 50 C 35 50, 25 70, 30 100 L 35 140 C 38 160, 45 180, 55 195 L 70 215 C 80 228, 95 235, 100 235 C 105 235, 120 228, 130 215 L 145 195 C 155 180, 162 160, 165 140 L 170 100 C 175 70, 165 50, 150 50 L 130 45 C 120 42, 110 40, 100 40 C 90 40, 80 42, 70 45 Z" />
            </clipPath>
          </defs>

          {/* Background circle */}
          <circle cx="100" cy="130" r="95" fill="#F8F9FA" opacity="0.5" />

          {/* Main tooth shape */}
          <g filter="url(#dropShadow)">
            {/* Tooth body */}
            <path
              d="M50 50 C 35 50, 25 70, 30 100 L 35 140 C 38 160, 45 180, 55 195 L 70 215 C 80 228, 95 235, 100 235 C 105 235, 120 228, 130 215 L 145 195 C 155 180, 162 160, 165 140 L 170 100 C 175 70, 165 50, 150 50 L 130 45 C 120 42, 110 40, 100 40 C 90 40, 80 42, 70 45 Z"
              fill="url(#toothGradient)"
              stroke="#DEE2E6"
              strokeWidth="2"
            />

            {/* Crown surface details */}
            <g opacity="0.4">
              <ellipse cx="100" cy="75" rx="35" ry="20" fill="#E9ECEF" />
              <circle cx="70" cy="65" r="12" fill="#F1F3F5" />
              <circle cx="130" cy="65" r="12" fill="#F1F3F5" />
              <circle cx="80" cy="90" r="8" fill="#F1F3F5" />
              <circle cx="120" cy="90" r="8" fill="#F1F3F5" />
            </g>

            {/* Fissures */}
            <path d="M65 70 Q 100 85 135 70" stroke="#CED4DA" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M75 85 Q 100 95 125 85" stroke="#CED4DA" strokeWidth="1" fill="none" strokeLinecap="round" />
          </g>

          {/* Scanner beam - animated */}
          <g clipPath="url(#toothClip)">
            <motion.rect
              x="20"
              width="160"
              height="60"
              fill="url(#scanBeam)"
              animate={{ y: [-60, 260, -60] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Scan grid lines */}
            <motion.g
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line
                  key={`h${i}`}
                  x1="20"
                  y1={40 + i * 25}
                  x2="180"
                  y2={40 + i * 25}
                  stroke="#00D9FF"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={`v${i}`}
                  x1={40 + i * 25}
                  y1="30"
                  x2={40 + i * 25}
                  y2="240"
                  stroke="#00D9FF"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              ))}
            </motion.g>
          </g>

          {/* Detected lesions with pulsing effect */}
          {lesions.map((lesion, i) => (
            <g key={i}>
              {/* Outer pulse ring */}
              <motion.circle
                cx={lesion.x}
                cy={lesion.y}
                r="12"
                fill="none"
                stroke="#00D9FF"
                strokeWidth="2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
              {/* Inner filled circle */}
              <motion.circle
                cx={lesion.x}
                cy={lesion.y}
                r="8"
                fill="url(#lesionGlow)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.3 }}
              />
              {/* Center dot */}
              <motion.circle
                cx={lesion.x}
                cy={lesion.y}
                r="3"
                fill="#00D9FF"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 + i * 0.3 }}
              />
            </g>
          ))}

          {/* Progress bar */}
          <g>
            <rect x="50" y="248" width="100" height="6" rx="3" fill="#E9ECEF" />
            <motion.rect
              x="50"
              y="248"
              height="6"
              rx="3"
              fill="#00D9FF"
              animate={{ width: [0, 100, 100, 0] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
            />
          </g>

          {/* Status text */}
          <motion.text
            x="100"
            y="22"
            textAnchor="middle"
            fill="#00D9FF"
            fontSize="11"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ANALIZANDO CON IA
          </motion.text>
        </svg>
      </div>

      {/* Floating labels */}
      <motion.div
        className="absolute top-8 -left-2 flex items-center gap-2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="px-3 py-1.5 bg-white rounded-full shadow-lg border border-[#00D9FF]/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
          <span className="text-xs font-semibold text-gray-800">Lesión E1</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-20 -right-2 flex items-center gap-2"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.3, duration: 0.5 }}
      >
        <div className="px-3 py-1.5 bg-white rounded-full shadow-lg border border-[#00D9FF]/20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
          <span className="text-xs font-semibold text-gray-800">Lesión E2</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.5 }}
      >
        <div className="px-4 py-2 bg-[#00D9FF] rounded-full shadow-lg flex items-center gap-2">
          <span className="text-sm font-bold text-black">Elegible Curodont</span>
        </div>
      </motion.div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function AnimatedTooth3D({ className = "" }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        rotateY: isHovered ? 15 : 0,
        rotateX: isHovered ? -10 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <filter id="tooth-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#000" floodOpacity="0.15" />
          </filter>
          <linearGradient id="tooth-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8f9fa" />
            <stop offset="100%" stopColor="#e9ecef" />
          </linearGradient>
          <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#00D9FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </linearGradient>
          <clipPath id="tooth-clip">
            <path d="M100 20 C 55 20, 30 50, 30 90 C 30 120, 40 150, 50 180 C 60 210, 75 250, 100 250 C 125 250, 140 210, 150 180 C 160 150, 170 120, 170 90 C 170 50, 145 20, 100 20 Z" />
          </clipPath>
        </defs>

        {/* Main tooth shape */}
        <path
          d="M100 20 C 55 20, 30 50, 30 90 C 30 120, 40 150, 50 180 C 60 210, 75 250, 100 250 C 125 250, 140 210, 150 180 C 160 150, 170 120, 170 90 C 170 50, 145 20, 100 20 Z"
          fill="url(#tooth-gradient)"
          filter="url(#tooth-shadow)"
          stroke="#e0e0e0"
          strokeWidth="2"
        />

        {/* Tooth surface details */}
        <path d="M70 60 Q 100 80 130 60" fill="none" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" />
        <path d="M75 75 Q 100 90 125 75" fill="none" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" />

        {/* Scanning line effect */}
        <g clipPath="url(#tooth-clip)">
          <motion.rect
            x="25"
            width="150"
            height="40"
            fill="url(#scan-gradient)"
            animate={{ y: [0, 260, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </g>

        {/* Caries detection points */}
        <motion.circle
          cx="75"
          cy="70"
          r="8"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        />
        <motion.circle
          cx="120"
          cy="85"
          r="6"
          fill="none"
          stroke="#00D9FF"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />

        {/* AI analysis indicator */}
        <motion.g animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <text x="100" y="140" textAnchor="middle" fill="#00D9FF" fontSize="12" fontFamily="monospace">
            ANALIZANDO
          </text>
          <text x="100" y="155" textAnchor="middle" fill="#00D9FF" fontSize="10" fontFamily="monospace">
            {scanProgress}%
          </text>
        </motion.g>
      </svg>
    </motion.div>
  )
}

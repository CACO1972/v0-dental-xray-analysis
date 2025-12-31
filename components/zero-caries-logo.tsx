"use client"

import { motion } from "framer-motion"

export function ZeroCaresLogo({
  className = "w-12 h-12",
  animated = false,
}: {
  className?: string
  animated?: boolean
}) {
  const MotionWrapper = animated ? motion.div : "div"

  return (
    <MotionWrapper
      {...(animated && {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      })}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Zero Caries Logo"
      >
        {/* Glow effect */}
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#0096FF" />
          </linearGradient>
        </defs>

        {/* Tooth shape - black fill */}
        <path
          d="M50 12 C 32 12, 20 24, 20 42 C 20 54, 24 66, 30 76 C 36 86, 42 90, 50 90 C 58 90, 64 86, 70 76 C 76 66, 80 54, 80 42 C 80 24, 68 12, 50 12 Z"
          fill="currentColor"
          className="text-black"
        />

        {/* Zero symbol - neon blue with glow */}
        <ellipse
          cx="50"
          cy="48"
          rx="14"
          ry="20"
          fill="none"
          stroke="url(#neon-gradient)"
          strokeWidth="5"
          filter="url(#neon-glow)"
        />

        {/* Inner highlight */}
        <ellipse cx="50" cy="48" rx="8" ry="14" fill="none" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />

        {/* Sparkles */}
        <circle cx="35" cy="28" r="2.5" fill="#00D9FF" filter="url(#neon-glow)" />
        <circle cx="65" cy="30" r="2" fill="#00D9FF" filter="url(#neon-glow)" />
        <circle cx="42" cy="72" r="1.5" fill="#00D9FF" filter="url(#neon-glow)" />
        <circle cx="58" cy="70" r="1.5" fill="#00D9FF" filter="url(#neon-glow)" />
      </svg>
    </MotionWrapper>
  )
}

export function ZeroCaresLogotype({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ZeroCaresLogo className="w-14 h-14" animated />
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-black">
          Zero <span className="text-[#00D9FF] neon-text">Caries</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
          by Clínica Miro
        </span>
      </div>
    </div>
  )
}

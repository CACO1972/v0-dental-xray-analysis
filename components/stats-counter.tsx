"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface StatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
}

function AnimatedStat({ value, suffix = "", prefix = "", label, duration = 2 }: StatProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const incrementTime = (duration * 1000) / end
      const timer = setInterval(
        () => {
          start += 1
          setCount(start)
          if (start >= end) clearInterval(timer)
        },
        Math.max(incrementTime, 10),
      )
      return () => clearInterval(timer)
    }
  }, [isInView, value, duration])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="text-4xl md:text-5xl font-bold text-black tabular-nums">
        {prefix}
        <span className="text-[#00D9FF]">{count}</span>
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2 uppercase tracking-wide">{label}</div>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
      <AnimatedStat value={93} suffix="%" label="Éxito Clínico" />
      <AnimatedStat value={6} suffix=" años" label="Seguimiento" />
      <AnimatedStat value={30} suffix=" seg" label="Análisis IA" />
      <AnimatedStat value={0} prefix="" suffix="" label="Inyecciones" />
    </div>
  )
}

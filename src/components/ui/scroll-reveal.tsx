"use client"

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "motion/react"

import { cn } from "@/src/lib/utils"

const ease = [0.21, 0.47, 0.32, 0.98] as const

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
  y?: number
  immediate?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  once = true,
  amount = 0.2,
  y = 28,
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const isVisible = immediate || isInView

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealGroupProps {
  children: ReactNode
  className?: string
  staggerChildren?: number
  delayChildren?: number
  once?: boolean
  amount?: number
  immediate?: boolean
}

export function ScrollRevealGroup({
  children,
  className,
  staggerChildren = 0.12,
  delayChildren = 0,
  once = true,
  amount = 0.15,
  immediate = false,
}: ScrollRevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const isVisible = immediate || isInView

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealItemProps {
  children: ReactNode
  className?: string
  duration?: number
  y?: number
}

export function ScrollRevealItem({
  children,
  className,
  duration = 0.55,
  y = 24,
}: ScrollRevealItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

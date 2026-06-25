'use client'

import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'

type SmoothScrollProviderProps = {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion !== false) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}

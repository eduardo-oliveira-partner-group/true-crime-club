'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'
import { useEffect } from 'react'

type SmoothScrollProviderProps = {
  children: React.ReactNode
}

function LenisScrollLockSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const syncLock = () => {
      if (document.body.hasAttribute('data-scroll-locked')) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }

    syncLock()

    const observer = new MutationObserver(syncLock)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-scroll-locked'],
    })

    return () => {
      observer.disconnect()
      lenis.start()
    }
  }, [lenis])

  return null
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
        prevent: (node) =>
          node.hasAttribute('data-lenis-prevent') ||
          node.closest(
            '[data-slot="alert-dialog-content"], [data-slot="select-content"], [data-slot="sheet-content"], [data-slot="dropdown-menu-content"], [data-radix-select-viewport]',
          ) !== null,
      }}
    >
      <LenisScrollLockSync />
      {children}
    </ReactLenis>
  )
}

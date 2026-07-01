'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export const JsReadyContext = createContext(false)

export function useRevealClasses(shown: boolean) {
  const jsReady = useContext(JsReadyContext)
  const visible = shown || !jsReady
  return `[transition:opacity_0.6s_ease,translate_0.6s_cubic-bezier(0.22,1,0.36,1),transform_0.6s_cubic-bezier(0.22,1,0.36,1)] [will-change:opacity,translate,transform] motion-reduce:[transition:none] motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
    visible ? 'opacity-100 translate-y-0' : 'translate-y-4 opacity-0'
  }`
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${useRevealClasses(shown)} ${className ?? ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  delayMs: number,
) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return {
    ref,
    revealClassName: useRevealClasses(shown),
    style: { transitionDelay: `${delayMs}ms` },
  }
}

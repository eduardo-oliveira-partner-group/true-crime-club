'use client'

import { motion, stagger, useAnimate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/src/lib/utils'

interface TextGenerateEffectProps {
  words: string
  className?: string
  textClassName?: string
  filter?: boolean
  duration?: number
  staggerDelay?: number
  once?: boolean
  amount?: number
  immediate?: boolean
}

export function TextGenerateEffect({
  words,
  className,
  textClassName,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.08,
  once = true,
  amount = 0.4,
  immediate = false,
}: TextGenerateEffectProps) {
  const [scope, animate] = useAnimate()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once, amount })
  const shouldAnimate = immediate || isInView
  const wordsArray = words.split(' ')

  useEffect(() => {
    if (!shouldAnimate) return

    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration,
        delay: stagger(staggerDelay),
      },
    )
  }, [shouldAnimate, animate, filter, duration, staggerDelay])

  return (
    <div ref={containerRef} className={cn(className)}>
      <motion.div ref={scope} className={cn(textClassName)}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="opacity-0"
            style={{
              filter: filter ? 'blur(10px)' : 'none',
            }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

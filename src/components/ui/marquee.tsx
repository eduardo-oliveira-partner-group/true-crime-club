'use client'

import React from 'react'

import { cn } from '@/src/lib/utils'

interface MarqueeProps {
  grayscale?: boolean
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  fade?: boolean
  /** Animation duration in seconds for one full loop */
  duration?: number
  children?: React.ReactNode
  className?: string
}

export function Marquee({
  grayscale = false,
  direction = 'left',
  pauseOnHover = true,
  fade = true,
  duration = 20,
  children,
  className,
}: MarqueeProps) {
  const content = React.Children.toArray(children)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      container.scrollLeft = 0
    }
    container.addEventListener('scroll', preventScroll, { passive: false })
    container.addEventListener('wheel', preventScroll, { passive: false })
    container.addEventListener('touchmove', preventScroll, { passive: false })
    return () => {
      container.removeEventListener('scroll', preventScroll)
      container.removeEventListener('wheel', preventScroll)
      container.removeEventListener('touchmove', preventScroll)
    }
  }, [])

  const animationClass =
    direction === 'left' ? 'marquee-inner' : 'marquee-inner-reverse'

  return (
    <div className="relative overflow-hidden">
      <style jsx global>{`
        .marquee-container::-webkit-scrollbar {
          display: none;
        }

        .marquee-inner {
          animation: marquee-anim var(--marquee-duration, 20s) linear infinite;
        }

        .marquee-inner-reverse {
          animation: marquee-anim-reverse var(--marquee-duration, 20s) linear
            infinite;
        }

        .marquee-container:hover .marquee-inner,
        .marquee-container:hover .marquee-inner-reverse {
          animation-play-state: paused !important;
        }

        @keyframes marquee-anim {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-anim-reverse {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      <div
        ref={containerRef}
        className={cn(
          'marquee-container flex w-full cursor-default p-2 select-none [--gap:3rem]',
          grayscale &&
            'opacity-80 brightness-0 grayscale transition-opacity dark:invert',
          className,
        )}
        style={{
          maskImage: fade
            ? 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)'
            : 'none',
          WebkitMaskImage: fade
            ? 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,1) 92%, transparent 100%)'
            : 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          pointerEvents: pauseOnHover ? 'auto' : 'none',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          className={cn(
            'flex shrink-0 items-center will-change-transform',
            animationClass,
          )}
          style={
            {
              '--marquee-duration': `${duration}s`,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-(--gap) pr-(--gap)"
            >
              {content.map((item, index) => (
                <div
                  key={index}
                  className="flex shrink-0 items-center justify-center"
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

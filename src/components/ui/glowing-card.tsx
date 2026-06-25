import type { ReactNode } from 'react'

import { GlowingEffect } from '@/src/components/ui/glowing-effect'
import { cn } from '@/src/lib/utils'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  innerClassName?: string
}

export function GlowingCard({
  children,
  className,
  innerClassName,
}: GlowingCardProps) {
  return (
    <div
      className={cn(
        'relative h-full border border-[#fffaf0]/14 p-px',
        className,
      )}
    >
      <GlowingEffect
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div
        className={cn(
          'relative flex h-full flex-col bg-[#171211] p-5',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface GlowingFeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
  innerClassName?: string
}

export function GlowingFeatureCard({
  icon,
  title,
  description,
  className,
  innerClassName,
}: GlowingFeatureCardProps) {
  return (
    <GlowingCard className={className} innerClassName={innerClassName}>
      <div className="flex size-10 items-center justify-center bg-[#d84132] text-white">
        {icon}
      </div>
      <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">{description}</p>
    </GlowingCard>
  )
}

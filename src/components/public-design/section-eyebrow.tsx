import type { ReactNode } from 'react'

import { fontType } from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

type SectionEyebrowProps = {
  children: ReactNode
  variant?: 'red' | 'yellow'
  className?: string
}

export function SectionEyebrow({
  children,
  variant = 'red',
  className,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        `mb-4 inline-flex items-center gap-2 text-[13px] leading-none font-bold tracking-[0.12em] uppercase before:inline-block before:h-px before:w-[22px] before:shrink-0 before:bg-current before:content-[''] ${fontType}`,
        variant === 'yellow' ? 'text-(--yellow)' : 'text-(--red)',
        className,
      )}
    >
      {children}
    </div>
  )
}

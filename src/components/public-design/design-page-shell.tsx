import type { ReactNode } from 'react'

import { DesignOverlays } from '@/src/components/public-design/design-overlays'
import { paperPageClass } from '@/src/lib/design/classes'
import { designTokens } from '@/src/lib/design/tokens'
import { cn } from '@/src/lib/utils'

type DesignPageShellProps = {
  children: ReactNode
  fontClassName?: string
  className?: string
  showOverlays?: boolean
}

/** Paper-first page wrapper with design tokens and optional texture overlays. */
export function DesignPageShell({
  children,
  fontClassName,
  className,
  showOverlays = true,
}: DesignPageShellProps) {
  return (
    <div
      className={cn(paperPageClass, fontClassName, className)}
      style={designTokens}
    >
      {showOverlays ? <DesignOverlays /> : null}
      {children}
    </div>
  )
}

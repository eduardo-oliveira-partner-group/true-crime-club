import type { ReactNode } from 'react'

import {
  cardShadowBase,
  dossierCardSurface,
  fontType,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

type DossierCardProps = {
  children: ReactNode
  className?: string
  tabLabel?: ReactNode
  tabCode?: string
  pinColor?: string
  showPin?: boolean
}

/** Standard dossier card with optional tab and board pin. */
export function DossierCard({
  children,
  className,
  tabLabel,
  tabCode,
  pinColor = 'var(--red)',
  showPin = false,
}: DossierCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        dossierCardSurface,
        cardShadowBase,
        "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(var(--paper-soft)_0,var(--paper-soft)_31px,rgba(33,28,24,0.05)_31px,rgba(33,28,24,0.05)_32px)] before:opacity-40 before:content-['']",
        className,
      )}
    >
      {tabLabel || tabCode ? (
        <div
          className={`absolute -top-px left-8 inline-flex -translate-y-full items-center gap-[10px] rounded-t-[10px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-[18px] py-[9px] pb-[11px] text-[11px] tracking-[0.14em] text-(--ink) uppercase ${fontType}`}
        >
          {tabCode ? (
            <span className="font-bold text-(--red)">{tabCode}</span>
          ) : null}
          {tabLabel}
        </div>
      ) : null}
      {showPin ? (
        <span
          className="absolute top-[22px] right-8 size-[14px] rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)]"
          style={{ '--pin': pinColor } as React.CSSProperties}
          aria-hidden="true"
        />
      ) : null}
      <div className="relative z-1">{children}</div>
    </div>
  )
}

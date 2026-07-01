import type { CSSProperties } from 'react'

import { ribbonItems } from '@/src/app/(front-office)/_landing/content'
import { fontHeading } from '@/src/lib/design/classes'

export function RibbonMarquee() {
  const items = [...ribbonItems, ...ribbonItems]

  return (
    <div className="marquee-group relative overflow-hidden border-y border-[rgba(33,28,24,0.15)] bg-(--ink) whitespace-nowrap text-(--paper)">
      <div
        className={`animate-marquee py-[15px] text-[23px] font-semibold tracking-[0.01em] motion-reduce:animate-none ${fontHeading}`}
        style={{ '--marquee-duration': '40s' } as CSSProperties}
      >
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className="inline-flex items-center"
          >
            <span className="px-7">{item.label}</span>
            <span
              className="px-7 align-middle text-[14px]"
              style={{ color: item.color }}
              aria-hidden="true"
            >
              ✶
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

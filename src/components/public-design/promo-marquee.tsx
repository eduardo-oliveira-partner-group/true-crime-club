import type { CSSProperties } from 'react'

import { promoItems } from '@/src/app/(front-office)/_landing/content'
import { fontType } from '@/src/lib/design/classes'

export function PublicPromoMarquee() {
  const items = [...promoItems, ...promoItems]

  return (
    <div
      className={`marquee-group relative overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--red) whitespace-nowrap text-[#fbf9f6] before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] before:bg-size-[8px_12px] before:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-2 after:-scale-x-100 after:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] after:bg-size-[8px_12px] after:content-['']`}
    >
      <div
        className={`animate-marquee py-[9px] text-[13px] tracking-[0.06em] ${fontType} motion-reduce:animate-none`}
        style={{ '--marquee-duration': '32s' } as CSSProperties}
      >
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex">
            <span className="pr-[42px]">{item}</span>
            <span className="pr-[42px] text-white/55" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

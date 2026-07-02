import { promoItems } from '@/src/app/(front-office)/_landing/content'
import { Marquee } from '@/src/components/ui/marquee'
import { fontType } from '@/src/lib/design/classes'

export function PublicPromoMarquee() {
  return (
    <div className="relative overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] before:absolute before:inset-y-0 before:left-0 before:w-2 before:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] before:bg-size-[8px_12px] before:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-2 after:-scale-x-100 after:bg-[radial-gradient(circle_at_4px_6px,transparent_3px,rgba(33,28,24,0.18)_3.2px,transparent_4px)] after:bg-size-[8px_12px] after:content-['']">
      <Marquee
        grayscale={false}
        fade={false}
        duration={64}
        className="p-0 [--gap:0]"
      >
        {promoItems.map((item) => (
          <span
            key={item}
            className={`inline-flex py-[9px] text-[13px] tracking-[0.06em] whitespace-nowrap ${fontType}`}
          >
            <span className="pr-[42px]">{item}</span>
            <span className="pr-[42px] text-white/55" aria-hidden="true">
              ●
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  )
}

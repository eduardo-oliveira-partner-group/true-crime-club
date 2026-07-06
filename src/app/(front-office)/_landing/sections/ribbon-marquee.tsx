import { ribbonItems } from '@/src/app/(front-office)/_landing/content'
import { Marquee } from '@/src/components/ui/marquee'
import { fontHeading } from '@/src/lib/design/classes'

export function RibbonMarquee({
  items = ribbonItems,
}: {
  items?: { label: string; color?: string }[]
} = {}) {
  return (
    <div className="relative overflow-hidden border-y border-[rgba(33,28,24,0.15)] bg-(--ink) text-(--paper)">
      <Marquee
        grayscale={false}
        fade={false}
        duration={80}
        className="p-0 [--gap:0]"
      >
        {items.map((item) => (
          <span
            key={item.label}
            className={`inline-flex items-center py-[15px] text-[23px] font-semibold tracking-[0.01em] whitespace-nowrap ${fontHeading}`}
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
      </Marquee>
    </div>
  )
}

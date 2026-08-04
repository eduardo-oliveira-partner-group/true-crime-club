import { fontHeading, fontMono } from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export function CheckoutSection({
  title,
  eyebrow,
  code,
  children,
}: {
  title: string
  eyebrow: string
  code: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 border-b border-dashed border-[rgba(33,28,24,0.12)] pb-3">
        <div>
          <p
            className={cn(
              fontMono,
              'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
            )}
          >
            {eyebrow}
          </p>
          <h2
            className={cn(
              fontHeading,
              'mt-1 text-lg font-semibold text-(--ink)',
            )}
          >
            {title}
          </h2>
        </div>
        <p
          className={cn(
            fontMono,
            'text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase',
          )}
        >
          {code}
        </p>
      </div>
      {children}
    </section>
  )
}

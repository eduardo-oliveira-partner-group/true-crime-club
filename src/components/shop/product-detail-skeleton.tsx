import { sectionFrame } from '@/src/lib/design/classes'

export function ProductDetailSkeleton() {
  return (
    <div
      className="bg-(--paper) text-(--ink)"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--paper)">
        <div className={`${sectionFrame} relative z-10 py-10 lg:py-16`}>
          <div className="mb-8 h-4 w-48 animate-pulse rounded-[2px] bg-(--ink)/10" />

          <div className="overflow-hidden rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] lg:grid lg:grid-cols-2">
            <div className="border-b border-[rgba(33,28,24,0.15)] lg:border-r lg:border-b-0">
              <div className="aspect-square animate-pulse bg-(--paper-soft)" />
              <div className="hidden space-y-4 border-t border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-6 lg:block">
                <div className="h-8 w-32 animate-pulse rounded-[2px] bg-(--ink)/10" />
                <div className="h-12 w-full animate-pulse rounded-[9px] bg-(--red)/15" />
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="h-4 w-32 animate-pulse rounded-[2px] bg-(--ink)/10" />
              <div className="h-10 w-4/5 animate-pulse rounded-[2px] bg-(--ink)/10" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded-[2px] bg-(--ink)/8" />
                <div className="h-4 w-11/12 animate-pulse rounded-[2px] bg-(--ink)/8" />
                <div className="h-4 w-2/3 animate-pulse rounded-[2px] bg-(--ink)/8" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

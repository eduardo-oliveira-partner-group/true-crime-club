export function ProductDetailSkeleton() {
  return (
    <div
      className="bg-[#090807] text-[#fffaf0]"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#090807]">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <div className="mb-8 h-4 w-48 animate-pulse bg-[#fffaf0]/10" />

          <div className="overflow-hidden border border-[#fffaf0]/10 bg-[#0b0908]/60 lg:grid lg:grid-cols-2">
            <div className="border-b border-[#fffaf0]/10 lg:border-r lg:border-b-0">
              <div className="aspect-square animate-pulse bg-[#171211]/60" />
              <div className="hidden space-y-4 border-t border-[#fffaf0]/10 p-6 lg:block">
                <div className="h-8 w-32 animate-pulse bg-[#fffaf0]/10" />
                <div className="h-12 w-full animate-pulse bg-[#d84132]/20" />
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="h-4 w-32 animate-pulse bg-[#fffaf0]/10" />
              <div className="h-10 w-4/5 animate-pulse bg-[#fffaf0]/10" />
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse bg-[#fffaf0]/8" />
                <div className="h-4 w-11/12 animate-pulse bg-[#fffaf0]/8" />
                <div className="h-4 w-2/3 animate-pulse bg-[#fffaf0]/8" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

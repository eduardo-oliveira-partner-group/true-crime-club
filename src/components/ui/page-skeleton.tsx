export function PageSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="space-y-6">
        <div className="h-4 w-32 animate-pulse rounded-[9px] bg-(--ink)/10" />
        <div className="h-10 w-3/4 max-w-xl animate-pulse rounded-[9px] bg-(--ink)/10" />
        <div className="h-4 w-2/3 max-w-2xl animate-pulse rounded-[9px] bg-(--ink)/8" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[14px] border border-(--ink)/10 bg-(--card)/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

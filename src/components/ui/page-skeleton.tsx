import { Skeleton } from '@/src/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-32 rounded-[9px] bg-(--ink)/10" />
        <Skeleton className="h-10 w-3/4 max-w-xl rounded-[9px] bg-(--ink)/10" />
        <Skeleton className="h-4 w-2/3 max-w-2xl rounded-[9px] bg-(--ink)/8" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-40 rounded-[14px] border border-(--ink)/10 bg-(--card)/60"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

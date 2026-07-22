import { Skeleton } from '@/src/components/ui/skeleton'

function Block({ className }: { className: string }) {
  return (
    <Skeleton
      className={`rounded-[9px] bg-(--ink)/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export function OrdersListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="mt-8 space-y-4"
      aria-busy="true"
      aria-label="Carregando pedidos"
    >
      <span className="sr-only">Carregando pedidos...</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-[14px_14px_16px_16px] border border-(--ink)/15 bg-(--card) p-5 shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)]"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <Block className="h-6 w-28 rounded-[2px]" />
                <Block className="h-4 w-28" />
              </div>
              <Block className="mt-4 h-6 w-52 max-w-full" />
              <Block className="mt-2 h-4 w-4/5 max-w-88" />
            </div>
            <div className="flex min-w-36 items-end justify-between gap-5 border-t border-dashed border-(--ink)/12 pt-4 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
              <div>
                <Block className="ml-auto h-3 w-20" />
                <Block className="mt-2 ml-auto h-6 w-24" />
              </div>
              <Block className="h-4 w-20 sm:mt-5 sm:ml-auto" />
            </div>
          </div>
          <div className="mt-5 flex gap-4 border-t border-dashed border-(--ink)/12 pt-4">
            <Block className="h-4 w-32" />
            <Block className="hidden h-4 w-28 sm:block" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OrderDetailSkeleton() {
  return (
    <div className="pb-4" aria-busy="true" aria-label="Carregando pedido">
      <span className="sr-only">Carregando pedido...</span>
      <Block className="h-4 w-32" />

      <div className="mt-8 border-b border-dashed border-(--ink)/15 pb-6">
        <div>
          <Block className="h-3 w-28" />
          <Block className="mt-4 h-10 w-64 max-w-full" />
          <Block className="mt-4 h-4 w-44" />
        </div>
      </div>

      <section className="mt-8 rounded-[14px_14px_16px_16px] border border-(--ink)/15 bg-(--card) p-5 shadow-[0_18px_40px_-18px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] sm:p-7">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Block className="h-3 w-20" />
              <Block className="mt-3 h-7 w-24 rounded-[2px]" />
            </div>
            <div className="flex flex-col items-end">
              <Block className="h-3 w-12" />
              <Block className="mt-3 h-6 w-24" />
            </div>
          </div>

          <div className="mt-7 w-full space-y-5 sm:flex sm:items-start sm:space-y-0 sm:pb-7">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative flex min-w-0 items-start sm:h-8 sm:flex-1 sm:last:flex-none"
              >
                <div className="relative z-1 flex shrink-0 items-center sm:block">
                  <Block className="size-8" />
                  <Block
                    className={`ml-3 h-3 w-28 sm:absolute sm:top-10 sm:left-1/2 sm:ml-0 sm:-translate-x-1/2 ${
                      index === 0
                        ? 'sm:left-0 sm:translate-x-0'
                        : index === 3
                          ? 'sm:right-0 sm:left-auto sm:translate-x-0'
                          : ''
                    }`}
                  />
                </div>
                {index < 3 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-8 -bottom-5 left-4 w-px bg-(--ink)/10 sm:static sm:mt-4 sm:ml-0 sm:h-0.5 sm:w-auto sm:min-w-0 sm:flex-1"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[16px] border border-(--ink)/12 bg-(--card) p-5 sm:p-7">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <Block className="h-3 w-36" />
            <Block className="mt-2 h-6 w-40" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-[14px] border border-(--ink)/12 bg-(--card) p-4 sm:p-5"
                >
                  <Block className="size-20 shrink-0 sm:size-24" />
                  <div className="flex-1">
                    <Block className="h-3 w-28" />
                    <Block className="mt-3 h-5 w-4/5" />
                    <Block className="mt-3 h-3 w-20" />
                  </div>
                  <Block className="mt-auto h-5 w-20 sm:my-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="self-start overflow-hidden rounded-[14px] border border-(--ink)/12 bg-(--paper-soft)">
            <div className="p-5">
              <Block className="h-3 w-16" />
              <Block className="mt-5 h-4 w-full" />
              <Block className="mt-3 h-4 w-full" />
              <Block className="mt-5 h-7 w-28" />
            </div>
            <div className="border-t border-dashed border-(--ink)/15 p-5">
              <Block className="h-3 w-28" />
              <Block className="mt-5 h-4 w-full" />
              <Block className="mt-3 h-4 w-4/5" />
              <Block className="mt-6 h-4 w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function CustomerListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="mt-8 space-y-3"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-[14px] border border-(--ink)/10 bg-(--card) p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <Block className="h-4 w-28" />
            <Block className="h-5 w-20" />
          </div>
          <Block className="mt-5 h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

export function CustomerDetailSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Carregando conteúdo"
    >
      <Block className="h-4 w-24" />
      <Block className="h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[14px] border border-(--ink)/10 bg-(--card) p-5"
          >
            <Block className="h-4 w-24" />
            <Block className="mt-5 h-7 w-36" />
          </div>
        ))}
      </div>
      <div className="rounded-[14px] border border-(--ink)/10 bg-(--card) p-5">
        <Block className="h-4 w-28" />
        <Block className="mt-5 h-4 w-full" />
        <Block className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}

export function CartSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6"
      aria-busy="true"
      aria-label="Carregando carrinho"
    >
      <Block className="h-4 w-32" />
      <Block className="mt-4 h-12 w-52" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-44 rounded-[14px] border border-(--ink)/10 bg-(--card)"
            />
          ))}
        </div>
        <div className="h-80 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
      </div>
    </div>
  )
}

export function CheckoutSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-label="Carregando checkout"
    >
      <Block className="h-4 w-24" />
      <Block className="mt-4 h-10 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
        <div className="h-96 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
        <div className="h-72 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
      </div>
    </div>
  )
}

export function ConfirmationSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
      aria-busy="true"
      aria-label="Carregando confirmação"
    >
      <Block className="h-4 w-32" />
      <Block className="mt-5 h-12 w-3/4" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div className="space-y-5">
          <div className="h-32 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
          <div className="h-64 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
        </div>
        <div className="h-48 rounded-[14px] border border-(--ink)/10 bg-(--card)" />
      </div>
    </div>
  )
}

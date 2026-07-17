function Block({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-[9px] bg-(--ink)/10 ${className}`} />
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

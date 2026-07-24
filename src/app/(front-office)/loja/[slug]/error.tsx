'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { fontHeading } from '@/src/lib/design/classes'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-(--ink) sm:px-6">
      <span className="mx-auto flex size-12 items-center justify-center rounded-[10px] border border-(--red)/25 bg-(--card) text-(--red)">
        <IconAlertTriangle className="size-6" />
      </span>
      <h1
        className={`mt-5 text-2xl font-semibold tracking-tight text-(--ink) sm:text-3xl ${fontHeading}`}
      >
        Não foi possível abrir este item
      </h1>
      <p className="mt-3 text-sm/6 text-(--ink-mute)">
        Ocorreu um erro ao carregar este produto. Tente novamente.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
        >
          Tentar novamente
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-[9px] border-[rgba(33,28,24,0.18)] bg-(--paper-soft) text-(--ink) hover:border-(--red)/45 hover:bg-(--red)/10 hover:text-(--red)"
        >
          <Link href="/loja">Voltar à loja</Link>
        </Button>
      </div>
    </div>
  )
}

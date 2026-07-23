'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/src/components/ui/button'
import { fontHeading, fontMono } from '@/src/lib/design/classes'

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
        Falha ao carregar este arquivo
      </h1>
      <p className="mt-3 text-sm/6 text-(--ink-mute)">
        Algo deu errado ao montar esta página. Tente novamente em instantes.
      </p>
      {error.digest ? (
        <p
          className={`mt-2 text-xs tracking-wide text-(--ink-mute)/70 uppercase ${fontMono}`}
        >
          Referência: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
        >
          Tentar novamente
        </Button>
        <Button asChild variant="outline" className="rounded-[9px]">
          <Link href="/">Voltar à home</Link>
        </Button>
      </div>
    </div>
  )
}

'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/src/components/ui/button'

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
    <div className="mx-auto max-w-2xl px-4 py-16 text-center text-[#fffaf0] sm:px-6">
      <span className="mx-auto flex size-12 items-center justify-center border border-[#d84132]/40 bg-[#171211] text-[#d84132]">
        <IconAlertTriangle className="size-6" />
      </span>
      <h1 className="mt-5 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        Não foi possível abrir este item
      </h1>
      <p className="mt-3 text-sm/6 text-[#d7c9b5]">
        Ocorreu um erro ao carregar este produto. Tente novamente.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button
          type="button"
          onClick={() => unstable_retry()}
          className="bg-[#d84132] text-white hover:bg-[#b93227]"
        >
          Tentar novamente
        </Button>
        <Button asChild variant="outline">
          <Link href="/loja">Voltar à loja</Link>
        </Button>
      </div>
    </div>
  )
}

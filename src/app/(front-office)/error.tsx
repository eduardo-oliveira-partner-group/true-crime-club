'use client'

import { useEffect } from 'react'

import { LoadErrorState } from '@/src/components/ui/load-error-state'

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
    <LoadErrorState
      code="Arquivo interrompido"
      title="Falha ao carregar este arquivo"
      description="Algo deu errado ao montar esta página. Tente novamente em instantes."
      onRetry={unstable_retry}
      className="min-h-[min(760px,calc(100svh-110px))]"
      details={error.digest ? <>Referência: {error.digest}</> : undefined}
      secondaryLink={{ href: '/', label: 'Voltar à home' }}
    />
  )
}

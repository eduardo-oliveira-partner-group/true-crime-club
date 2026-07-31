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
      code="Área temporariamente fechada"
      title="Falha ao carregar a área do cliente"
      description="Não foi possível montar esta seção. Tente novamente em instantes."
      onRetry={unstable_retry}
      className="min-h-[min(640px,calc(100svh-180px))] py-8 sm:py-12"
      details={error.digest ? <>Referência: {error.digest}</> : undefined}
      secondaryLink={{ href: '/', label: 'Voltar à home' }}
    />
  )
}

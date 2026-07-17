'use client'

import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { fontHeading, fontMono } from '@/src/lib/design/classes'
import {
  cancelSubscription,
  getSubscription,
} from '@/src/lib/domain/repositories'
import { formatSubscriptionStatus } from '@/src/lib/formatters'

export default function CancelarAssinaturaPage() {
  const [subscription, setSubscription] =
    useState<Awaited<ReturnType<typeof getSubscription>>>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false))
  }, [])

  const cancel = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await cancelSubscription()
      setSubscription(await getSubscription())
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível cancelar a assinatura.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading)
    return <p className="text-sm text-(--ink-mute)">Carregando assinatura…</p>

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className={`mb-6 h-auto gap-1 rounded-[9px] p-0 text-(--ink-mute) hover:bg-transparent hover:text-(--red)`}
      >
        <Link href="/cliente/assinatura">
          <IconArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Ação irreversível
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Cancelar assinatura
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Simulação de cancelamento — nenhuma ação real será executada.
      </p>

      {subscription ? (
        <div className="mt-5 rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-5 text-sm">
          <p className="text-(--ink-soft)">
            Plano atual:{' '}
            <span className={`font-semibold text-(--ink) ${fontHeading}`}>
              {subscription.planName}
            </span>{' '}
            ({formatSubscriptionStatus(subscription.status)})
          </p>
        </div>
      ) : null}

      <div className="mt-6">
        {error ? <p className="mb-3 text-sm text-(--red)">{error}</p> : null}
        <Button
          type="button"
          disabled={submitting}
          onClick={cancel}
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
        >
          {submitting ? 'Cancelando…' : 'Confirmar cancelamento'}
        </Button>
      </div>
    </div>
  )
}

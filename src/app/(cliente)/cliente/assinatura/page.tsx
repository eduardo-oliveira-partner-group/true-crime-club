'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { CustomerDetailSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
} from '@/src/lib/design/classes'
import { getSubscription } from '@/src/lib/domain/repositories'
import type { Subscription } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatSubscriptionStatus,
} from '@/src/lib/formatters'

export default function AssinaturaClientePage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <CustomerDetailSkeleton />
  }

  if (!subscription) {
    return (
      <div className="rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8 text-center">
        <p className={`text-lg font-semibold text-(--ink-soft) ${fontHeading}`}>
          Nenhuma assinatura encontrada
        </p>
        <p className="mt-2 text-sm text-(--ink-mute)">
          O arquivo desta conta ainda não foi aberto.
        </p>
        <Button
          asChild
          className="mt-5 rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
        >
          <Link href="/assinatura">
            Conhecer planos
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Minha assinatura
      </h1>

      <div className="mt-6 space-y-4">
        <div
          className={`${dossierCardSurface} ${cardShadowBase} border-2 border-(--purple)/30 p-5`}
        >
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Plano ativo
            </h3>
          </div>
          <div className="mt-4">
            <p className={`mt-2 text-xl font-bold text-(--ink) ${fontHeading}`}>
              {subscription.planName}
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-dashed border-(--ink)/10 pt-3">
              <span
                className={`text-xs tracking-wide text-(--ink-mute) uppercase ${fontMono}`}
              >
                Status
              </span>
              <span
                className={`text-sm font-semibold text-(--teal) ${fontHeading}`}
              >
                {formatSubscriptionStatus(subscription.status)}
              </span>
            </div>
          </div>
        </div>

        <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Próxima cobrança
            </h3>
          </div>
          <div className="mt-4">
            <p
              className={`mt-2 text-lg font-semibold text-(--ink) ${fontHeading}`}
            >
              {formatDate(subscription.nextBillingDate)}
            </p>
            <p
              className={`mt-1 text-base font-semibold text-(--red) ${fontHeading}`}
            >
              {formatCurrency(subscription.nextBillingAmount)}
            </p>
          </div>
        </div>

        {subscription.currentCycleBoxName ? (
          <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
            <div className="border-b border-dashed border-(--ink)/10 pb-3">
              <h3
                className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
              >
                Box do ciclo atual
              </h3>
            </div>
            <div className="mt-4">
              <p
                className={`mt-2 text-lg font-semibold text-(--ink) ${fontHeading}`}
              >
                {subscription.currentCycleBoxName}
              </p>
            </div>
          </div>
        ) : null}

        {subscription.canCancel ? (
          <Button
            asChild
            variant="outline"
            className={`rounded-[9px] border-(--red)/30 text-(--red) ${transitionBgColor} hover:bg-(--red)/8 hover:text-(--red-deep)`}
          >
            <Link href="/cliente/assinatura/cancelar">
              Cancelar assinatura
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

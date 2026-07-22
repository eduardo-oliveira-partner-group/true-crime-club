'use client'

import { IconArrowRight, IconCalendar } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { Skeleton } from '@/src/components/ui/skeleton'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
} from '@/src/lib/design/classes'
import { getSubscription } from '@/src/lib/domain/repositories'
import type { Subscription, SubscriptionStatus } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatSubscriptionStatus,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const statusTone: Record<SubscriptionStatus, string> = {
  active: 'border-(--teal)/30 bg-(--teal)/10 text-(--teal-deep)',
  pending_payment: 'border-(--amber)/35 bg-(--amber)/12 text-[#8a5c00]',
  cancelled: 'border-(--ink)/15 bg-(--ink)/5 text-(--ink-mute)',
  paused: 'border-(--purple)/30 bg-(--purple)/10 text-(--purple-deep)',
  past_due: 'border-(--red)/25 bg-(--red)/8 text-(--red)',
}

function SubscriptionLoadingSkeleton() {
  return (
    <div className="mt-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando dados da assinatura...</span>
      <div
        aria-hidden="true"
        className={`${dossierCardSurface} ${cardShadowBase} p-5`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-28 rounded-[2px] bg-(--ink)/10" />
              <Skeleton className="h-4 w-28 bg-(--ink)/10" />
            </div>
            <Skeleton className="mt-4 h-6 w-52 max-w-full bg-(--ink)/10" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-88 bg-(--ink)/10" />
          </div>
          <div className="flex min-w-36 items-end justify-between gap-5 border-t border-dashed border-(--ink)/12 pt-4 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
            <div>
              <Skeleton className="ml-auto h-3 w-20 bg-(--ink)/10" />
              <Skeleton className="mt-2 ml-auto h-6 w-24 bg-(--ink)/10" />
            </div>
            <Skeleton className="h-4 w-20 bg-(--ink)/10 sm:mt-5 sm:ml-auto" />
          </div>
        </div>
        <div className="mt-5 flex gap-4 border-t border-dashed border-(--ink)/12 pt-4">
          <Skeleton className="h-4 w-32 bg-(--ink)/10" />
          <Skeleton className="hidden h-4 w-28 bg-(--ink)/10 sm:block" />
        </div>
      </div>
    </div>
  )
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <article className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className={cn(
                `inline-flex rounded-[2px] border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${fontMono}`,
                statusTone[subscription.status],
              )}
            >
              {formatSubscriptionStatus(subscription.status)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-(--ink-mute)">
              <IconCalendar className="size-3.5" />
              {formatDate(subscription.nextBillingDate)}
            </span>
          </div>
          <h2
            className={`mt-4 text-lg/tight font-semibold tracking-[-0.02em] text-(--ink) sm:text-xl/tight ${fontHeading}`}
          >
            {subscription.planName}
          </h2>
          {subscription.currentCycleBoxName ? (
            <p className="mt-1.5 line-clamp-1 text-sm text-(--ink-mute)">
              {subscription.currentCycleBoxName}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-(--ink-mute)">Plano ativo</p>
          )}
        </div>

        <div className="flex shrink-0 items-end justify-between gap-5 border-t border-dashed border-(--ink)/12 pt-4 sm:block sm:min-w-36 sm:border-t-0 sm:pt-0 sm:text-right">
          <div>
            <p
              className={`text-[10px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
            >
              Próxima cobrança
            </p>
            <p
              className={`mt-1 text-xl font-bold tracking-tight text-(--red) ${fontHeading}`}
            >
              {formatCurrency(subscription.nextBillingAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-(--ink)/12 pt-4 text-xs/5 text-(--ink-mute)">
        <p>
          Desde{' '}
          <span className="font-medium text-(--ink-soft)">
            {formatDate(subscription.startedAt)}
          </span>
        </p>
        {subscription.canCancel ? (
          <>
            <span className="hidden size-1 rounded-full bg-(--ink)/25 sm:block" />
            <Link
              href="/cliente/assinatura/cancelar"
              className="inline-flex items-center gap-1.5 font-semibold text-(--red) transition-colors duration-200 hover:text-(--red-deep)"
            >
              Cancelar assinatura
              <IconArrowRight className="size-3.5" />
            </Link>
          </>
        ) : null}
      </div>
    </article>
  )
}

export default function AssinaturaClientePage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false))
  }, [])

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
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Consulte o plano ativo, a próxima cobrança e o status da assinatura no
        mesmo lugar.
      </p>

      {loading ? (
        <SubscriptionLoadingSkeleton />
      ) : !subscription ? (
        <section
          className={`mt-10 rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 text-center sm:p-10`}
        >
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <h2
              className={`text-xl font-semibold tracking-tight text-(--ink) ${fontHeading}`}
            >
              Nenhuma assinatura encontrada
            </h2>
            <p className="mt-2 text-sm/6 text-(--ink-mute)">
              O arquivo desta conta ainda não foi aberto.
            </p>
            <Button
              asChild
              className="mt-6 rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
            >
              <Link href="/assinatura">
                Conhecer planos
                <IconArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <section className="mt-8" aria-label="Assinatura ativa">
          <SubscriptionCard subscription={subscription} />
        </section>
      )}
    </div>
  )
}

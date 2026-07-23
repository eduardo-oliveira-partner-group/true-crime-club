'use client'

import {
  IconAlertCircle,
  IconArrowRight,
  IconCalendar,
  IconTicket,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { Skeleton } from '@/src/components/ui/skeleton'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
} from '@/src/lib/design/classes'
import {
  cancelSubscription,
  getSubscription,
} from '@/src/lib/domain/repositories'
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

function SubscriptionCard({
  subscription,
  onCancelClick,
}: {
  subscription: Subscription
  onCancelClick: () => void
}) {
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
            <button
              type="button"
              onClick={onCancelClick}
              className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-(--red) transition-colors duration-200 hover:text-(--red-deep)"
            >
              Cancelar assinatura
              <IconArrowRight className="size-3.5" />
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}

export default function AssinaturaClientePage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getSubscription()
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelSubscription = async () => {
    setCancelling(true)
    setError(null)
    try {
      await cancelSubscription()
      setSubscription(await getSubscription())
      setConfirmOpen(false)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível cancelar a assinatura.',
      )
      setConfirmOpen(false)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Gestão da assinatura
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

      {error ? (
        <Alert variant="destructive" className="mt-4">
          <IconAlertCircle />
          <AlertTitle>Erro ao cancelar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <SubscriptionLoadingSkeleton />
      ) : !subscription ? (
        <Empty className="mt-10 border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 sm:p-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconTicket />
            </EmptyMedia>
            <EmptyTitle className="text-xl">
              Nenhuma assinatura encontrada
            </EmptyTitle>
            <EmptyDescription>
              O arquivo desta conta ainda não foi aberto.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              asChild
              className={`group rounded-[9px] bg-(--red) px-4 py-3 text-xs font-bold tracking-[0.04em] text-[#fbf9f6] uppercase shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] [transition:background-color_0.2s_ease,translate_0.24s_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${fontMono}`}
            >
              <Link href="/assinatura">
                Conhecer planos
                <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="mt-8" aria-label="Assinatura ativa">
          <SubscriptionCard
            subscription={subscription}
            onCancelClick={() => {
              setError(null)
              setConfirmOpen(true)
            }}
          />
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancelar assinatura"
        description="Simulação de cancelamento — nenhuma ação real será executada."
        confirmLabel="Confirmar cancelamento"
        confirmingLabel="Cancelando…"
        confirming={cancelling}
        onConfirm={handleCancelSubscription}
      >
        {subscription ? (
          <div className="rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-4 text-sm">
            <p
              className={`text-[11px] font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
            >
              Ação irreversível
            </p>
            <p className="mt-2 text-(--ink-soft)">
              Plano atual:{' '}
              <span className={`font-semibold text-(--ink) ${fontHeading}`}>
                {subscription.planName}
              </span>{' '}
              ({formatSubscriptionStatus(subscription.status)})
            </p>
            <p className="mt-2 text-xs/5 text-(--ink-mute)">
              Você perderá o acesso aos benefícios do ciclo atual após a
              confirmação.
            </p>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  )
}

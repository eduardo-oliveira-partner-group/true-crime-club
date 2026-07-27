'use client'

import { useEffect, useState } from 'react'

import { SubscriptionPlansGrid } from '@/src/components/home/plan-dossier-card'
import { fontHeading } from '@/src/lib/design/classes'
import { listPlans } from '@/src/lib/domain/repositories'
import type { BillingInterval, SubscriptionPlan } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

type SubscriptionPlansFromApiProps = {
  /** When set, keeps only plans with these billing intervals. */
  intervals?: readonly BillingInterval[]
  className?: string
}

/**
 * Client-side loader for `GET /planos`, shared by the landing and `/assinatura`.
 * Renders `SubscriptionPlansGrid` after the browser fetch.
 */
export function SubscriptionPlansFromApi({
  intervals,
  className,
}: SubscriptionPlansFromApiProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalsKey = intervals?.join(',') ?? ''

  useEffect(() => {
    let cancelled = false
    const allowed = intervalsKey
      ? (intervalsKey.split(',') as BillingInterval[])
      : null

    listPlans()
      .then((data) => {
        if (cancelled) return
        setPlans(
          allowed
            ? data.filter((plan) => allowed.includes(plan.billingInterval))
            : data,
        )
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching plans:', err)
        if (cancelled) return
        setError('Não foi possível carregar os planos de assinatura.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [intervalsKey])

  if (loading) {
    return (
      <div
        className={cn(
          'mx-auto grid max-w-[840px] grid-cols-2 items-start gap-6 max-[860px]:grid-cols-1',
          className,
        )}
        aria-busy="true"
        aria-label="Carregando planos"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[280px] animate-pulse rounded-[16px] border border-[rgba(33,28,24,0.15)] bg-(--card)"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p
        className={cn(
          fontHeading,
          'text-center text-lg font-semibold text-(--red)',
          className,
        )}
      >
        {error}
      </p>
    )
  }

  if (plans.length === 0) {
    return (
      <p
        className={cn(
          fontHeading,
          'text-center text-lg font-semibold text-(--ink-soft)',
          className,
        )}
      >
        Nenhum plano disponível no momento.
      </p>
    )
  }

  return <SubscriptionPlansGrid plans={plans} className={className} />
}

'use client'

import { useEffect, useState } from 'react'

import { SubscriptionPlansGrid } from '@/src/components/home/plan-dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading, sectionFrame } from '@/src/lib/design/classes'
import { listPlans } from '@/src/lib/domain/repositories'
import type { SubscriptionPlan } from '@/src/lib/domain/types'

export function PlanCards() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listPlans()
      .then((data) => {
        setPlans(
          data.filter(
            (plan) =>
              plan.billingInterval === 'monthly' ||
              plan.billingInterval === 'annual',
          ),
        )
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching plans:', err)
        setError('Não foi possível carregar os planos de assinatura.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
        <div className="mb-12 text-center">
          <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
          <h2
            className={`m-0 mx-auto max-w-[580px] animate-pulse text-[clamp(30px,3.8vw,48px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
          >
            Buscando planos de investigação...
          </h2>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
        <div className="mb-12 text-center">
          <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
          <h2
            className={`m-0 mx-auto max-w-[580px] text-[clamp(24px,3vw,36px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--red) ${fontHeading}`}
          >
            {error}
          </h2>
        </div>
      </section>
    )
  }

  if (plans.length === 0) {
    return (
      <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
        <div className="mb-12 text-center">
          <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
          <h2
            className={`m-0 mx-auto max-w-[580px] text-[clamp(24px,3vw,36px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--ink-soft) ${fontHeading}`}
          >
            Nenhum plano disponível no momento.
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section id="planos" className={`${sectionFrame} pt-24 pb-6`}>
      <div className="mb-12 text-center">
        <SectionEyebrow>04 — Escolha seu plano</SectionEyebrow>
        <h2
          className={`m-0 mx-auto max-w-[580px] text-[clamp(30px,3.8vw,48px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
        >
          Entre pro clube. O próximo caso já está te esperando.
        </h2>
      </div>
      <SubscriptionPlansGrid plans={plans} />
    </section>
  )
}

'use client'

import { SubscriptionPlansFromApi } from '@/src/components/home/subscription-plans-from-api'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading, sectionFrame } from '@/src/lib/design/classes'
import type { BillingInterval } from '@/src/lib/domain/types'

const LANDING_PLAN_INTERVALS: BillingInterval[] = ['monthly', 'annual']

export function PlanCards() {
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
      <SubscriptionPlansFromApi intervals={LANDING_PLAN_INTERVALS} />
    </section>
  )
}

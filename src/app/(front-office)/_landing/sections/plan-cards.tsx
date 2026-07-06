import { IconArrowRight, IconCheck, IconStarFilled } from '@tabler/icons-react'
import Link from 'next/link'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  arrowIconClass,
  fontHeading,
  fontMono,
  fontType,
  sectionFrame,
  transitionBgColor,
} from '@/src/lib/design/classes'
import { listPlans } from '@/src/lib/domain/repositories'
import type { SubscriptionPlan } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

export function PlanCards() {
  const plans = listPlans().filter(
    (plan) => plan.billingInterval === 'monthly' || plan.billingInterval === 'annual',
  )
  const monthlyPlan = plans.find((plan) => plan.billingInterval === 'monthly')
  const annualPlan = plans.find((plan) => plan.billingInterval === 'annual')

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
      <div className="mx-auto grid max-w-[840px] grid-cols-2 items-start gap-6 max-[860px]:grid-cols-1">
        {monthlyPlan ? <MonthlyPlanCard plan={monthlyPlan} /> : null}
        {annualPlan ? <AnnualPlanCard plan={annualPlan} /> : null}
      </div>
    </section>
  )
}

function MonthlyPlanCard({ plan }: { plan: SubscriptionPlan }) {
  const displayPrice = plan.pricePerMonth ?? plan.price

  return (
    <article className="relative mt-[26px] rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100px)] px-[30px] pt-[34px] pb-[30px] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)]">
      <div
        className={`absolute -top-px left-[26px] -translate-y-full rounded-t-[9px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-4 py-[7px] pb-[9px] text-[10.5px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontType}`}
      >
        MENSAL
      </div>
      <div
        className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-(--ink-mute) uppercase ${fontType}`}
      >
        {plan.name}
      </div>
      <div className="mb-1.5 flex items-end gap-1.5">
        <strong
          className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
        >
          {formatCurrency(displayPrice)}
        </strong>
        <span className={`pb-1.5 text-[13px] text-(--ink-mute) ${fontType}`}>
          /mês
        </span>
      </div>
      <p className="m-0 mb-[22px] text-[14px] text-(--ink-mute)">
        {plan.description}
      </p>
      <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(33,28,24,0.18)_0,rgba(33,28,24,0.18)_5px,transparent_5px,transparent_9px)]" />
      <FeatureList color="#1AA587" items={plan.features} />
      <Link
        href={`/assinatura?plano=${plan.slug}`}
        className={`flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-(--ink) hover:text-[#fbf9f6] ${fontMono}`}
      >
        Assinar mensal
      </Link>
    </article>
  )
}

function AnnualPlanCard({ plan }: { plan: SubscriptionPlan }) {
  const displayPrice = plan.pricePerMonth ?? plan.price

  return (
    <article className="relative mt-[26px] self-start">
      <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[-2.5deg] rounded-2xl bg-(--purple-deep) shadow-[0_16px_30px_-16px_rgba(33,28,24,0.4)]" />
      <div
        className={`absolute top-[-29px] left-[30px] z-0 inline-flex origin-bottom-left rotate-[-2.5deg] items-center gap-[7px] rounded-t-[10px] bg-(--purple-deep) px-5 pt-[7px] pb-[26px] text-[11.5px] font-bold tracking-[0.06em] text-[#fbf4e3] uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontType}`}
      >
        <IconStarFilled size={14} aria-hidden />
        <span>MAIS VANTAJOSO</span>
      </div>
      <div className="relative z-1 rounded-[14px_14px_16px_16px] bg-(--purple) px-[30px] pt-[34px] pb-[30px] text-[#f4efe6] shadow-[0_20px_40px_-14px_rgba(74,69,128,0.55)]">
        <div className="mb-[18px] flex items-center justify-between">
          <span
            className={`text-[12.5px] tracking-[0.08em] text-[#f4cf5a] uppercase ${fontType}`}
          >
            {plan.name}
          </span>
          {plan.isRecommended ? (
            <span
              className={`inline-flex items-center rounded-full bg-[#10b981] px-[14px] py-2 text-[12.5px] leading-none font-bold tracking-[0.04em] text-white uppercase ${fontType}`}
            >
              20% OFF
            </span>
          ) : null}
        </div>
        <div className="mb-1.5 flex items-end gap-1.5">
          <strong
            className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
          >
            {formatCurrency(displayPrice)}
          </strong>
          <span className={`pb-1.5 text-[13px] text-[#d8d6ea] ${fontType}`}>
            /mês
          </span>
        </div>
        <p className="m-0 mb-[22px] min-h-[40px] text-[14px] text-[#d8d6ea]">
          {plan.description}
        </p>
        <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0,rgba(255,255,255,0.28)_5px,transparent_5px,transparent_9px)]" />
        <FeatureList color="#F4CF5A" items={plan.features} />
        <Link
          href={`/assinatura?plano=${plan.slug}`}
          className={`group flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--yellow) px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionBgColor} hover:bg-[#fbf4e3] hover:text-(--purple) ${fontMono}`}
        >
          Escolher plano{' '}
          <IconArrowRight
            size={16}
            stroke={2}
            className={arrowIconClass}
            aria-hidden
          />
        </Link>
      </div>
    </article>
  )
}

function FeatureList({ items, color }: { items: string[]; color: string }) {
  return (
    <ul className="m-0 mb-[26px] flex list-none flex-col gap-[13px] p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[11px] text-[15px] leading-[1.4]"
        >
          <IconCheck
            size={16}
            stroke={2.5}
            className="mt-0.5 flex-none"
            style={{ color }}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

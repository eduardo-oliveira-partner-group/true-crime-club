import { IconArrowRight, IconCheck, IconStarFilled } from '@tabler/icons-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { SubscriptionPlan } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

interface PlanDossierCardProps {
  plan: SubscriptionPlan
}

const fontHeading =
  '[font-family:var(--design-font-heading),system-ui,sans-serif]'
const fontMono = '[font-family:var(--design-font-mono),monospace]'

export function PlanDossierCard({ plan }: PlanDossierCardProps) {
  const isRecommended = plan.isRecommended === true

  if (plan.billingInterval === 'annual') {
    // Annual Recommended Card Style
    const priceFormatted = plan.pricePerMonth
      ? formatCurrency(plan.pricePerMonth)
      : formatCurrency(plan.price)

    return (
      <article className="relative mt-[26px] self-start h-full flex flex-col justify-end w-full">
        <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[-2.5deg] rounded-2xl bg-(--purple-deep) shadow-[0_16px_30px_-16px_rgba(33,28,24,0.4)]" />
        <div
          className={`absolute top-[-29px] left-[30px] z-0 inline-flex origin-bottom-left rotate-[-2.5deg] items-center gap-[7px] rounded-t-[10px] bg-(--purple-deep) px-5 pt-[7px] pb-[26px] text-[11.5px] font-bold tracking-[0.06em] text-[#fbf4e3] uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontMono}`}
        >
          <IconStarFilled size={14} aria-hidden />
          <span>MAIS VANTAJOSO</span>
        </div>
        <div className="relative z-1 rounded-[14px_14px_16px_16px] bg-(--purple) px-[30px] pt-[34px] pb-[30px] text-[#f4efe6] shadow-[0_20px_40px_-14px_rgba(74,69,128,0.55)] flex flex-col h-full justify-between">
          <div>
            <div
              className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-[#f4cf5a] uppercase ${fontMono}`}
            >
              {plan.name}
            </div>
            <div className="mb-1.5 flex items-end gap-1.5">
              <strong
                className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
              >
                {priceFormatted}
              </strong>
              <span className={`pb-1.5 text-[13px] text-[#d8d6ea] ${fontMono}`}>
                /mês
              </span>
            </div>
            <p className="m-0 mb-[22px] text-[14px] text-[#d8d6ea]">
              {plan.description}
            </p>
            <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0,rgba(255,255,255,0.28)_5px,transparent_5px,transparent_9px)]" />
            
            <ul className="m-0 mb-[26px] flex list-none flex-col gap-[13px] p-0">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-[11px] text-[15px] leading-[1.4] text-[#f4efe6]"
                >
                  <IconCheck
                    size={16}
                    stroke={2.5}
                    className="mt-0.5 flex-none text-[#F4CF5A]"
                    aria-hidden
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={`/checkout?plano=${plan.slug}`}
            className={`group flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--yellow) px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline [transition:background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease] hover:bg-[#fbf4e3] hover:text-(--purple) ${fontMono}`}
          >
            Escolher plano
            <IconArrowRight
              size={16}
              stroke={2}
              className="inline-flex items-center leading-none [transition:translate_0.25s_cubic-bezier(0.22,1,0.36,1),transform_0.25s_cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </article>
    )
  }

  // Monthly / One Time Card Style
  const isOneTime = plan.billingInterval === 'one_time'
  const tabLabel = isOneTime ? 'CASO ISOLADO' : 'MENSAL'
  const priceFormatted = plan.pricePerMonth
    ? `${formatCurrency(plan.pricePerMonth)}`
    : formatCurrency(plan.price)

  return (
    <article className="relative mt-[26px] rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_100px)] px-[30px] pt-[34px] pb-[30px] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)] flex flex-col h-full justify-between">
      <div>
        <div
          className={`absolute -top-px left-[26px] -translate-y-full rounded-t-[9px] border border-b-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-4 py-[7px] pb-[9px] text-[10.5px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
        >
          {tabLabel}
        </div>
        <div
          className={`mb-[18px] text-[12.5px] tracking-[0.08em] text-(--ink-mute) uppercase ${fontMono}`}
        >
          {plan.name}
        </div>
        <div className="mb-1.5 flex items-end gap-1.5">
          <strong
            className={`text-[48px] leading-[0.9] font-semibold ${fontHeading}`}
          >
            {priceFormatted}
          </strong>
          {!isOneTime && (
            <span className={`pb-1.5 text-[13px] text-(--ink-mute) ${fontMono}`}>
              /mês
            </span>
          )}
        </div>
        <p className="m-0 mb-[22px] text-[14px] text-(--ink-mute)">
          {plan.description}
        </p>
        <div className="mb-[22px] h-[1.5px] [background:repeating-linear-gradient(90deg,rgba(33,28,24,0.18)_0,rgba(33,28,24,0.18)_5px,transparent_5px,transparent_9px)]" />
        
        <ul className="m-0 mb-[26px] flex list-none flex-col gap-[13px] p-0">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-[11px] text-[15px] leading-[1.4] text-(--ink)"
            >
              <IconCheck
                size={16}
                stroke={2.5}
                className="mt-0.5 flex-none text-(--teal)"
                aria-hidden
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href={`/checkout?plano=${plan.slug}`}
        className={`flex w-full items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-4 py-[15px] text-[14px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase no-underline [transition:background-color_0.2s_ease,border-color_0.2s_ease,color_0.2s_ease] hover:bg-(--ink) hover:text-[#fbf9f6] ${fontMono}`}
      >
        Escolher plano
      </Link>
    </article>
  )
}

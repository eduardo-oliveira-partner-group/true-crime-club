import {
  IconArchive,
  IconArrowRight,
  IconAward,
  IconRefresh,
} from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import type { SubscriptionPlan } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

interface PlanDossierMeta {
  tabLabel: string
  caseRef: string
  microcopy: string
  Icon: typeof IconRefresh
}

function getPlanDossierMeta(plan: SubscriptionPlan): PlanDossierMeta {
  switch (plan.billingInterval) {
    case 'monthly':
      return {
        tabLabel: 'Entrada recorrente',
        caseRef: 'REF-M001',
        microcopy: 'Cancele quando quiser',
        Icon: IconRefresh,
      }
    case 'annual':
      return {
        tabLabel: 'Arquivo completo',
        caseRef: 'REF-A012',
        microcopy: plan.commitmentMonths
          ? `Permanência de ${plan.commitmentMonths} meses`
          : 'Compromisso anual',
        Icon: IconAward,
      }
    case 'one_time':
      return {
        tabLabel: 'Caso isolado',
        caseRef: 'REF-X001',
        microcopy: 'Sem recorrência',
        Icon: IconArchive,
      }
  }
}

interface PlanDossierCardProps {
  plan: SubscriptionPlan
}

export function PlanDossierCard({ plan }: PlanDossierCardProps) {
  const meta = getPlanDossierMeta(plan)
  const PlanIcon = meta.Icon
  const isRecommended = plan.isRecommended === true

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col border bg-[#0c0a09]/90 shadow-[0_20px_48px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1',
        isRecommended
          ? 'border-[#d7b56d]/55 shadow-[0_24px_56px_rgba(0,0,0,0.42),0_0_0_1px_rgba(215,181,109,0.12)_inset]'
          : plan.billingInterval === 'one_time'
            ? 'dashed border-[#fffaf0]/10'
            : 'border-[#fffaf0]/16',
      )}
    >
      {isRecommended ? (
        <span className="absolute top-0 right-5 z-10 -translate-y-1/2 border border-[#d7b56d]/45 bg-[#171211] px-2.5 py-1 font-heading text-[0.62rem] leading-none font-black tracking-[0.14em] text-[#d7b56d] uppercase shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          Melhor escolha
        </span>
      ) : null}

      <div
        className={cn(
          'relative border-b px-5 py-3.5 sm:px-6',
          isRecommended
            ? 'border-[#d7b56d]/30 bg-[linear-gradient(90deg,rgba(215,181,109,0.14)_0%,rgba(215,181,109,0.04)_100%)]'
            : plan.billingInterval === 'one_time'
              ? 'border-[#fffaf0]/8 bg-[#090807]/80'
              : 'border-[#fffaf0]/10 bg-[#171211]/72',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center',
                isRecommended
                  ? 'bg-[#d7b56d]/18 text-[#d7b56d]'
                  : plan.billingInterval === 'one_time'
                    ? 'bg-[#fffaf0]/6 text-[#a89a88]'
                    : 'bg-[#d84132]/18 text-[#ffb0a5]',
              )}
            >
              <PlanIcon className="size-4" />
            </span>
            <p
              className={cn(
                'text-[0.68rem] font-semibold tracking-[0.22em] uppercase',
                isRecommended ? 'text-[#d7b56d]' : 'text-[#d7c9b5]',
              )}
            >
              {meta.tabLabel}
            </p>
          </div>
          <p className="shrink-0 font-mono text-[0.62rem] tracking-[0.18em] text-[#fffaf0]/28 uppercase">
            {meta.caseRef}
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-5 py-6 sm:px-6">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
            isRecommended
              ? 'bg-[radial-gradient(circle_at_80%_0%,rgba(215,181,109,0.12),transparent_34%)]'
              : 'bg-[radial-gradient(circle_at_80%_0%,rgba(216,65,50,0.1),transparent_34%)]',
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.025)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.025)_1px,transparent_1px)] bg-size-[28px_28px] opacity-40"
        />

        <div className="relative">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-[#fffaf0] sm:text-[1.35rem]">
            {plan.name}
          </h3>
          <p className="mt-3 min-h-12 text-sm leading-6 text-[#d7c9b5]">
            {plan.description}
          </p>
        </div>

        <div className="relative mt-6 shrink-0 border-y border-[#fffaf0]/10 py-5">
          <p
            className={cn(
              'font-heading text-3xl font-black tracking-tight',
              isRecommended ? 'text-[#f0e8dd]' : 'text-[#fffaf0]',
            )}
          >
            {plan.pricePerMonth
              ? `${formatCurrency(plan.pricePerMonth)}/mês`
              : formatCurrency(plan.price)}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-[#d7b56d]/85 uppercase">
            {meta.microcopy}
          </p>
        </div>

        <ul className="relative mt-5 min-h-[8.25rem] flex-1 space-y-3 text-sm text-[#e5d8c4]">
          {plan.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex gap-3">
              <span
                aria-hidden="true"
                className={cn(
                  'mt-[0.55rem] size-1.5 shrink-0 rounded-full',
                  isRecommended ? 'bg-[#d7b56d]' : 'bg-[#d84132]',
                )}
              />
              <span className="leading-6">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="relative mt-auto shrink-0 pt-6">
          <Button
            asChild
            className={cn(
              'w-full',
              isRecommended
                ? 'bg-[#d7b56d] text-[#171211] shadow-[0_0_24px_rgba(215,181,109,0.28)] hover:bg-[#e5c47d]'
                : 'bg-[#d84132] text-white hover:bg-[#b93227]',
            )}
          >
            <Link href={`/checkout?plano=${plan.slug}`}>
              Escolher
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

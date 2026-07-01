import type { TablerIcon } from '@tabler/icons-react'

import { cn } from '@/src/lib/utils'

interface StepDossierMeta {
  tabLabel: string
  caseRef: string
  phaseLabel: string
  accent: 'red' | 'neutral' | 'gold'
}

const STEP_DOSSIER_META: StepDossierMeta[] = [
  {
    tabLabel: 'Registro de entrada',
    caseRef: 'PROC-01',
    phaseLabel: 'Assinatura',
    accent: 'red',
  },
  {
    tabLabel: 'Despacho da caixa',
    caseRef: 'PROC-02',
    phaseLabel: 'Entrega',
    accent: 'neutral',
  },
  {
    tabLabel: 'Abertura da pista',
    caseRef: 'PROC-03',
    phaseLabel: 'Investigação',
    accent: 'gold',
  },
]

interface HowItWorksStepCardProps {
  icon: TablerIcon
  title: string
  description: string
  stepIndex: number
}

export function HowItWorksStepCard({
  icon: StepIcon,
  title,
  description,
  stepIndex,
}: HowItWorksStepCardProps) {
  const meta = STEP_DOSSIER_META[stepIndex] ?? STEP_DOSSIER_META[0]
  const isGold = meta.accent === 'gold'
  const isNeutral = meta.accent === 'neutral'

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col border bg-[#0c0a09]/90 shadow-[0_20px_48px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1',
        isGold
          ? 'border-[#d7b56d]/55 shadow-[0_24px_56px_rgba(0,0,0,0.42),0_0_0_1px_rgba(215,181,109,0.12)_inset]'
          : isNeutral
            ? 'border-[#fffaf0]/12'
            : 'border-[#fffaf0]/16',
      )}
    >
      <div
        className={cn(
          'relative border-b px-5 py-3.5 sm:px-6',
          isGold
            ? 'border-[#d7b56d]/30 bg-[linear-gradient(90deg,rgba(215,181,109,0.14)_0%,rgba(215,181,109,0.04)_100%)]'
            : isNeutral
              ? 'border-[#fffaf0]/8 bg-[#090807]/80'
              : 'border-[#fffaf0]/10 bg-[#171211]/72',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center',
                isGold
                  ? 'bg-[#d7b56d]/18 text-[#d7b56d]'
                  : isNeutral
                    ? 'bg-[#fffaf0]/6 text-[#a89a88]'
                    : 'bg-[#d84132]/18 text-[#ffb0a5]',
              )}
            >
              <StepIcon className="size-4" />
            </span>
            <p
              className={cn(
                'text-[0.68rem] font-semibold tracking-[0.22em] uppercase',
                isGold ? 'text-[#d7b56d]' : 'text-[#d7c9b5]',
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
            isGold
              ? 'bg-[radial-gradient(circle_at_80%_0%,rgba(215,181,109,0.12),transparent_34%)]'
              : 'bg-[radial-gradient(circle_at_80%_0%,rgba(216,65,50,0.1),transparent_34%)]',
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.025)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.025)_1px,transparent_1px)] bg-size-[28px_28px] opacity-40"
        />

        <div className="relative shrink-0 border-b border-[#fffaf0]/10 pb-5">
          <p
            className={cn(
              'font-heading text-4xl font-black tracking-tight',
              isGold ? 'text-[#f0e8dd]' : 'text-[#fffaf0]',
            )}
          >
            0{stepIndex + 1}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-[#d7b56d]/85 uppercase">
            {meta.phaseLabel}
          </p>
        </div>

        <div className="relative mt-6 flex flex-1 flex-col">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-[#fffaf0] sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-3 min-h-18 text-sm/6 text-[#d7c9b5]">
            {description}
          </p>
        </div>

        <div className="relative mt-6 shrink-0 pt-2">
          <div
            className={cn(
              'h-px w-full bg-linear-to-r to-transparent opacity-55 transition-opacity group-hover:opacity-100',
              isGold
                ? 'from-[#d7b56d]/60 via-[#d7b56d]/25'
                : 'from-[#d84132]/60 via-[#d7b56d]/35',
            )}
          />
        </div>
      </div>
    </article>
  )
}

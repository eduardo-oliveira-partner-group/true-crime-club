import type { TablerIcon } from '@tabler/icons-react'

import { cn } from '@/src/lib/utils'

type DossierAccent = 'red' | 'neutral' | 'gold'

export type FeatureDossierVariant = 'club' | 'box'

interface FeatureDossierMeta {
  tabLabel: string
  caseRef: string
  highlightLabel: string
}

const CLUB_DOSSIER_META: FeatureDossierMeta[] = [
  {
    tabLabel: 'Entrega mensal',
    caseRef: 'CLUB-01',
    highlightLabel: 'Experiência',
  },
  {
    tabLabel: 'Narrativa coletiva',
    caseRef: 'CLUB-02',
    highlightLabel: 'Investigação',
  },
  {
    tabLabel: 'Conteúdo reservado',
    caseRef: 'CLUB-03',
    highlightLabel: 'Exclusividade',
  },
  {
    tabLabel: 'Coleção especial',
    caseRef: 'CLUB-04',
    highlightLabel: 'Coleção',
  },
]

const BOX_DOSSIER_META: FeatureDossierMeta[] = [
  {
    tabLabel: 'Evidência catalogada',
    caseRef: 'EVID-01',
    highlightLabel: 'Colecionável',
  },
  {
    tabLabel: 'Material de campo',
    caseRef: 'EVID-02',
    highlightLabel: 'Papelaria',
  },
  {
    tabLabel: 'Item de arquivo',
    caseRef: 'EVID-03',
    highlightLabel: 'Decoração',
  },
  {
    tabLabel: 'Peça de identidade',
    caseRef: 'EVID-04',
    highlightLabel: 'Moda',
  },
  {
    tabLabel: 'Conteúdo reservado',
    caseRef: 'EVID-05',
    highlightLabel: 'Digital',
  },
]

function getDossierAccent(index: number, total: number): DossierAccent {
  if (index === total - 1 && total >= 3) return 'gold'
  return index % 2 === 1 ? 'neutral' : 'red'
}

function getFeatureMeta(
  variant: FeatureDossierVariant,
  index: number,
): FeatureDossierMeta {
  const metaList = variant === 'club' ? CLUB_DOSSIER_META : BOX_DOSSIER_META
  return metaList[index] ?? metaList[0]
}

interface FeatureDossierCardProps {
  icon: TablerIcon
  title: string
  description: string
  index: number
  variant: FeatureDossierVariant
  total: number
}

export function FeatureDossierCard({
  icon: FeatureIcon,
  title,
  description,
  index,
  variant,
  total,
}: FeatureDossierCardProps) {
  const meta = getFeatureMeta(variant, index)
  const accent = getDossierAccent(index, total)
  const isGold = accent === 'gold'
  const isNeutral = accent === 'neutral'

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
          <div className="flex min-w-0 items-center gap-2.5">
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
              <FeatureIcon className="size-4" />
            </span>
            <p
              className={cn(
                'text-[0.68rem] leading-tight font-semibold tracking-[0.22em] uppercase',
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
            0{index + 1}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-[#d7b56d]/85 uppercase">
            {meta.highlightLabel}
          </p>
        </div>

        <div className="relative mt-6 flex flex-1 flex-col">
          <h3
            className={cn(
              'font-heading font-semibold tracking-tight text-[#fffaf0]',
              variant === 'box'
                ? 'text-base/snug sm:text-lg'
                : 'text-lg sm:text-xl',
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              'mt-3 flex-1 text-sm/6 text-[#d7c9b5]',
              variant === 'club' ? 'min-h-21' : 'min-h-18',
            )}
          >
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

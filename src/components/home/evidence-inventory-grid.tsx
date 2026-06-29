import type { TablerIcon } from '@tabler/icons-react'

import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import { cn } from '@/src/lib/utils'

interface BoxCategory {
  icon: TablerIcon
  title: string
  description: string
}

interface EvidenceInventoryGridProps {
  categories: BoxCategory[]
}

const CATEGORY_META = [
  {
    code: 'EVID-ITEM-001',
    classification: 'COLECIONÁVEL FÍSICO',
    tagColor: 'text-[#d7b56d] border-[#d7b56d]/30',
  },
  {
    code: 'EVID-ITEM-002',
    classification: 'PAPELARIA TÁTICA',
    tagColor: 'text-[#d84132] border-[#d84132]/30',
  },
  {
    code: 'EVID-ITEM-003',
    classification: 'ARQUIVO DE AMBIENTE',
    tagColor: 'text-[#1aa587] border-[#1aa587]/30',
  },
  {
    code: 'EVID-ITEM-004',
    classification: 'PEÇA DE IDENTIDADE',
    tagColor: 'text-[#5e5ea2] border-[#5e5ea2]/30',
  },
  {
    code: 'EVID-ITEM-005',
    classification: 'ARQUIVO CONFIDENCIAL',
    tagColor: 'text-[#d7b56d] border-[#d7b56d]/30',
  },
]

export function EvidenceInventoryGrid({
  categories,
}: EvidenceInventoryGridProps) {
  return (
    <div className="relative">
      {/* Global CSS injection for the laser scanning animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan-laser {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-laser {
          animation: scan-laser 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `,
        }}
      />

      <ScrollRevealGroup
        className="grid grid-cols-1 gap-5 sm:grid-cols-6"
        staggerChildren={0.08}
      >
        {categories.map((category, index) => {
          const FeatureIcon = category.icon
          const meta = CATEGORY_META[index] ?? CATEGORY_META[0]

          // Determine grid span based on Bento rules
          // Row 1: 3 + 3 = 6 cols
          // Row 2: 2 + 2 + 2 = 6 cols
          const spanClass = index < 2 ? 'sm:col-span-3' : 'sm:col-span-2'

          return (
            <ScrollRevealItem
              key={category.title}
              className={cn('h-full', spanClass)}
            >
              <article className="group relative flex h-full flex-col overflow-hidden border border-[#fffaf0]/12 bg-[#0c0a09] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300 hover:border-[#fffaf0]/25 hover:shadow-[0_24px_56px_rgba(216,65,50,0.15)]">
                {/* Laser scan animation overlay */}
                <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="animate-scan-laser absolute inset-x-0 h-[2px] bg-linear-to-r from-transparent via-[#d84132] to-transparent shadow-[0_0_12px_#d84132]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,65,50,0.04),transparent_60%)]" />
                </div>

                {/* Technical blueprint background overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(216,65,50,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(216,65,50,0.015)_1px,transparent_1px)] bg-size-[16px_16px] opacity-40"
                />

                {/* Card Header (Technical Meta) */}
                <div className="relative z-10 mb-5 flex items-center justify-between border-b border-[#fffaf0]/8 pb-3.5 font-mono text-[10px] tracking-wider text-[#d7c9b5]/60">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-1.5 animate-pulse rounded-full bg-[#d84132]" />
                    <span>{meta.code}</span>
                  </div>
                  <span
                    className={cn(
                      'border px-2 py-0.5 text-[9px] leading-none font-semibold',
                      meta.tagColor,
                    )}
                  >
                    {meta.classification}
                  </span>
                </div>

                {/* Card Body */}
                <div className="relative z-10 flex flex-1 flex-col">
                  {/* Floating Icon with Tech Border */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex size-10 items-center justify-center border border-[#fffaf0]/15 bg-[#171211]/80 text-[#d7b56d] transition-all duration-300 group-hover:scale-105 group-hover:border-[#d84132]/40 group-hover:text-[#f0e8dd]">
                      <FeatureIcon className="size-5" />
                    </div>
                    {/* Index inside the grid */}
                    <span className="font-heading text-xl font-bold tracking-tight text-[#fffaf0]/20 select-none">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold tracking-tight text-[#fffaf0] transition-colors duration-300 group-hover:text-[#d7b56d]">
                    {category.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm/6 text-[#d7c9b5]/90">
                    {category.description}
                  </p>
                </div>

                {/* Card Footer (Dotted lines & Fake Barcode decoration) */}
                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-[#fffaf0]/8 pt-3.5 font-mono text-[9px] text-[#d7c9b5]/30 select-none">
                  <span>DEP: FLO-W2</span>
                  <span className="font-light tracking-[0.15em]">
                    ||| |||| | || |||| |
                  </span>
                </div>
              </article>
            </ScrollRevealItem>
          )
        })}
      </ScrollRevealGroup>
    </div>
  )
}

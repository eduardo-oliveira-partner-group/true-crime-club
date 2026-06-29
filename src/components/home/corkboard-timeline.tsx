'use client'

import { IconChecklist, IconCreditCard, IconPackage } from '@tabler/icons-react'
import { motion } from 'motion/react'
import { useState } from 'react'

import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import { cn } from '@/src/lib/utils'

interface HowItWorksStep {
  title: string
  description: string
}

interface CorkboardTimelineProps {
  steps: HowItWorksStep[]
}

const STEP_META = [
  { tabLabel: 'Fase I: Adesão', code: 'REG-01', stamp: 'DEFERIDO' },
  { tabLabel: 'Fase II: Logística', code: 'LOG-02', stamp: 'EMBALADO' },
  { tabLabel: 'Fase III: Solução', code: 'INV-03', stamp: 'CONFIDENCIAL' },
]

const CARD_ROTATIONS = [-1.5, 1.2, -1]

const STEP_COLORS = ['#C5271F', '#EFBC18', '#1AA587']
const STEP_ICONS = [IconCreditCard, IconPackage, IconChecklist]

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 85,
  damping: 13,
  mass: 0.7,
} as const

export function CorkboardTimeline({ steps }: CorkboardTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* 
        Horizontal Connecting String (Desktop)
        Points: 16.6% (Card 1 Center), 50% (Card 2 Center), 83.3% (Card 3 Center)
        Adjusts dynamically based on hovered card translations and rotations.
      */}
      <svg
        width="100%"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-1 overflow-visible opacity-45 md:block"
        aria-hidden="true"
      >
        <motion.line
          animate={{
            x1: `calc(16.6% - ${hoveredIndex === 0 ? 0 : 4}px)`,
            y1: hoveredIndex === 0 ? '-0.625rem' : '0rem',
            x2: `calc(50% + ${hoveredIndex === 1 ? 0 : 3}px)`,
            y2: hoveredIndex === 1 ? '-0.625rem' : '0rem',
          }}
          transition={SPRING_TRANSITION}
          stroke="#C5271F"
          strokeWidth="2"
          strokeDasharray="7 4"
        />
        <motion.line
          animate={{
            x1: `calc(50% + ${hoveredIndex === 1 ? 0 : 3}px)`,
            y1: hoveredIndex === 1 ? '-0.625rem' : '0rem',
            x2: `calc(83.4% - ${hoveredIndex === 2 ? 0 : 3}px)`,
            y2: hoveredIndex === 2 ? '-0.625rem' : '0rem',
          }}
          transition={SPRING_TRANSITION}
          stroke="#C5271F"
          strokeWidth="2"
          strokeDasharray="7 4"
        />
      </svg>

      {/* Pins Rendered in Parent (Desktop only, layered above SVG line at z-20) */}
      {steps.map((step, index) => {
        const stepColor = STEP_COLORS[index] ?? '#C5271F'
        const x =
          index === 0
            ? `calc(16.6% - ${hoveredIndex === 0 ? 0 : 4}px)`
            : index === 1
              ? `calc(50% + ${hoveredIndex === 1 ? 0 : 3}px)`
              : `calc(83.4% - ${hoveredIndex === 2 ? 0 : 3}px)`
        const y = hoveredIndex === index ? '-0.625rem' : '0rem'

        return (
          <motion.div
            key={`pin-${index}`}
            className="pointer-events-none absolute z-20 hidden size-3.5 rounded-full md:block"
            animate={{
              left: x,
              top: y,
            }}
            transition={SPRING_TRANSITION}
            style={{
              marginLeft: '-7px',
              marginTop: '-7px',
              background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.7) 0%, ${stepColor} 55%, rgba(0, 0, 0, 0.4) 100%)`,
              boxShadow:
                '0 3px 5px rgba(33, 28, 24, 0.45), inset 0 -2px 3px rgba(0, 0, 0, 0.3)',
            }}
            aria-hidden="true"
          />
        )
      })}

      <ScrollRevealGroup
        className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8"
        staggerChildren={0.15}
      >
        {steps.map((step, index) => {
          const StepIcon = STEP_ICONS[index] ?? IconCreditCard
          const meta = STEP_META[index] ?? STEP_META[0]
          const stepColor = STEP_COLORS[index] ?? '#C5271F'

          return (
            <ScrollRevealItem key={step.title} className="h-full">
              <motion.article
                animate={{
                  y: hoveredIndex === index ? '-0.625rem' : '0rem',
                  rotate:
                    hoveredIndex === index ? 0 : (CARD_ROTATIONS[index] ?? 0),
                }}
                transition={SPRING_TRANSITION}
                className={cn(
                  'group relative flex h-full flex-col border border-[#fffaf0]/12 bg-[#130f0e] p-6 pt-8',
                  'shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 ease-out',
                  'hover:border-[#d84132]/45 hover:shadow-[0_24px_56px_rgba(216,65,50,0.22)]',
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Round Pin using radial-gradient conforming to design v3 (Mobile only) */}
                <div
                  className="pointer-events-none absolute top-0 left-1/2 z-30 size-3.5 -translate-1/2 rounded-full md:hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.7) 0%, ${stepColor} 55%, rgba(0, 0, 0, 0.4) 100%)`,
                    boxShadow:
                      '0 3px 5px rgba(33, 28, 24, 0.45), inset 0 -2px 3px rgba(0, 0, 0, 0.3)',
                  }}
                  aria-hidden="true"
                />

                {/* Technical Dossier Tab Header */}
                <div className="mb-5 flex items-center justify-between border-b border-[#fffaf0]/8 pb-3 font-mono text-[10px] tracking-wider text-[#d7c9b5]/40">
                  <span>{meta.tabLabel}</span>
                  <span>{meta.code}</span>
                </div>

                {/* Holographic Watermark / Ink Stamp Effect inside the card background */}
                <div
                  className={cn(
                    'pointer-events-none absolute right-4 bottom-14 -rotate-12 border-2 px-3 py-1 font-heading text-4xl font-black tracking-widest opacity-[0.03] transition-opacity duration-300 select-none group-hover:opacity-[0.06]',
                    index === 0
                      ? 'border-[#1aa587] text-[#1aa587]'
                      : index === 1
                        ? 'border-[#5e5ea2] text-[#5e5ea2]'
                        : 'border-[#d84132] text-[#d84132]',
                  )}
                >
                  {meta.stamp}
                </div>

                {/* Card Main Info */}
                <div className="relative z-20 flex flex-1 flex-col">
                  {/* Pinned Card Icon */}
                  <div className="mb-4 inline-flex size-11 items-center justify-center border border-[#fffaf0]/8 bg-[#211c18] text-[#d7b56d] transition-all duration-300 group-hover:border-[#d84132]/30 group-hover:bg-[#d84132]/10 group-hover:text-[#ffb0a5]">
                    <StepIcon className="size-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                  </div>

                  <h3 className="font-heading text-lg font-bold tracking-tight text-[#fffaf0] transition-colors duration-300 group-hover:text-[#d84132]">
                    {index + 1}. {step.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm/6 text-[#d7c9b5]/90">
                    {step.description}
                  </p>
                </div>

                {/* Step indicator in footer */}
                <div className="mt-6 flex items-center justify-between border-t border-[#fffaf0]/8 pt-3 font-mono text-[9px] text-[#d7c9b5]/20">
                  <span>CONFIDENTIALITY ASSURED</span>
                  <span className="font-semibold text-[#d84132]/40">
                    PASSO 0{index + 1}
                  </span>
                </div>
              </motion.article>
            </ScrollRevealItem>
          )
        })}
      </ScrollRevealGroup>
    </div>
  )
}

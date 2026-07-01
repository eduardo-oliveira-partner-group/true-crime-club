'use client'

import type { CSSProperties } from 'react'

import { steps } from '@/src/app/(front-office)/_landing/content'
import { useReveal } from '@/src/app/(front-office)/_landing/reveal'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading, sectionFrame } from '@/src/lib/design/classes'

export function HowItWorks() {
  return (
    <section id="funciona" className={`${sectionFrame} pt-[84px] pb-6`}>
      <SectionEyebrow>03 — Como funciona</SectionEyebrow>
      <h2
        className={`m-0 mb-[30px] max-w-[580px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        Três passos entre você e o próximo caso.
      </h2>
      <div className="relative grid grid-cols-3 overflow-hidden rounded-2xl border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_120px)] shadow-[0_16px_34px_-12px_rgba(33,28,24,0.2),inset_0_0_0_1px_rgba(255,255,255,0.5)] max-[860px]:grid-cols-1">
        <div
          aria-hidden="true"
          className="absolute inset-x-[16%] top-[30px] z-0 h-0.5 bg-[repeating-linear-gradient(90deg,var(--red)_0,var(--red)_7px,transparent_7px,transparent_11px)] opacity-45 max-[860px]:hidden"
        />
        {steps.map((step, index) => (
          <StepItem
            key={step.number}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  )
}

function StepItem({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[number]
  index: number
  isLast: boolean
}) {
  const { ref, revealClassName, style } = useReveal(index * 90)
  return (
    <article
      ref={ref}
      className={`relative z-1 px-[26px] pt-[26px] pb-6 ${isLast ? '' : 'border-r border-dashed border-[rgba(33,28,24,0.18)] max-[860px]:border-r-0 max-[860px]:border-b'} ${revealClassName}`}
      style={style}
    >
      <span
        className="absolute top-[22px] left-1/2 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)]"
        style={{ '--pin': step.color } as CSSProperties}
        aria-hidden="true"
      />
      <div
        className={`mt-[26px] mb-[14px] text-center text-[44px] leading-none font-bold ${fontHeading}`}
        style={{ color: step.color }}
      >
        {step.number}
      </div>
      <h3
        className={`m-0 mb-[9px] text-center text-[22px] font-semibold ${fontHeading}`}
      >
        {step.title}
      </h3>
      <p className="m-0 text-center text-[15px] leading-[1.55]">
        {step.description}
      </p>
    </article>
  )
}

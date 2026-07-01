'use client'

import { motion } from 'motion/react'
import { type CSSProperties, useState } from 'react'

import {
  boardPinOffsets,
  boxItems,
  SPRING_TRANSITION,
} from '@/src/app/(front-office)/_landing/content'
import { useReveal } from '@/src/app/(front-office)/_landing/reveal'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { fontHeading, fontType, sectionFrame } from '@/src/lib/design/classes'

export function BoxContents() {
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null)

  return (
    <section className={`${sectionFrame} pt-[84px] pb-6`}>
      <SectionEyebrow>02 — Dentro da caixa</SectionEyebrow>
      <h2
        className={`m-0 mb-11 max-w-[640px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        Cada caixa é uma cena montada pra você desvendar.
      </h2>
      <div className="relative">
        <div className="relative grid grid-cols-4 gap-5 max-[860px]:grid-cols-2 max-[540px]:grid-cols-1">
          <svg
            width="100%"
            className="pointer-events-none absolute inset-x-0 top-0 z-2 hidden h-16 overflow-visible opacity-60 md:block"
            aria-hidden="true"
          >
            {[0, 1, 2].map((i) => (
              <motion.line
                key={i}
                animate={{
                  x1: boardPinOffsets[i],
                  y1: hoveredBoxIndex === i ? '19px' : '29px',
                  x2: boardPinOffsets[i + 1],
                  y2: hoveredBoxIndex === i + 1 ? '19px' : '29px',
                }}
                transition={SPRING_TRANSITION}
                stroke="var(--red)"
                strokeWidth="2"
                strokeDasharray="7 4"
              />
            ))}
          </svg>
          {boxItems.map((item, index) => (
            <FeatureCardItem
              key={item.code}
              item={item}
              index={index}
              hoveredBoxIndex={hoveredBoxIndex}
              onMouseEnter={() => setHoveredBoxIndex(index)}
              onMouseLeave={() => setHoveredBoxIndex(null)}
            />
          ))}
          {boxItems.map((item, index) => (
            <motion.span
              key={`${item.code}-board-pin`}
              className="pointer-events-none absolute top-[22px] z-4 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)] max-[860px]:hidden"
              animate={{ y: hoveredBoxIndex === index ? -10 : 0 }}
              transition={SPRING_TRANSITION}
              style={
                {
                  '--pin': item.color,
                  left: boardPinOffsets[index],
                } as CSSProperties
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCardItem({
  item,
  index,
  hoveredBoxIndex,
  onMouseEnter,
  onMouseLeave,
}: {
  item: (typeof boxItems)[number]
  index: number
  hoveredBoxIndex: number | null
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const Icon = item.icon
  const { ref, revealClassName, style } = useReveal(index * 80)
  const isHovered = hoveredBoxIndex === index

  return (
    <div
      ref={ref}
      className={`relative ${revealClassName}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <motion.article
        animate={{
          y: isHovered ? -10 : 0,
          rotate: isHovered ? 0 : index % 2 ? 1.4 : -1.4,
        }}
        transition={SPRING_TRANSITION}
        className="relative z-1 flex flex-col rounded-[4px_4px_10px_10px] border border-[rgba(33,28,24,0.15)] bg-(--card) bg-[linear-gradient(180deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_80px)] px-6 pt-[30px] pb-[26px] shadow-[0_14px_30px_-14px_rgba(33,28,24,0.22),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-shadow duration-300 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]"
      >
        <div className="mt-2 mb-[18px] flex items-center justify-between gap-3">
          <Icon color={item.color} size={40} stroke={1.5} aria-hidden />
          <span
            className={`flex-none rounded-[2px] border border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-3 py-1 pb-[5px] text-[10.5px] tracking-widest whitespace-nowrap text-(--ink-mute) uppercase ${fontType}`}
          >
            {item.code}
          </span>
        </div>
        <h3
          className={`m-0 mb-2 text-[20px] leading-[1.1] font-semibold ${fontHeading}`}
        >
          {item.title}
        </h3>
        <p className="m-0 text-[14.5px] leading-normal text-[#4a423a]">
          {item.description}
        </p>
      </motion.article>
      <span
        className="absolute top-[22px] left-1/2 z-3 size-[14px] -translate-x-1/2 rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--pin,var(--red))_55%,rgba(0,0,0,0.4)_100%)] md:hidden"
        style={{ '--pin': item.color } as CSSProperties}
        aria-hidden="true"
      />
    </div>
  )
}

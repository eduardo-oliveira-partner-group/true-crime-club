'use client'

import { IconHeart, IconQuote } from '@tabler/icons-react'

import { testimonials } from '@/src/app/(front-office)/_landing/content'
import { useReveal } from '@/src/app/(front-office)/_landing/reveal'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  fontHeading,
  fontType,
  sectionFrame,
  transitionPolaroid,
} from '@/src/lib/design/classes'

export function Testimonials({
  items = testimonials,
}: {
  items?: typeof testimonials
} = {}) {
  return (
    <section className={`${sectionFrame} pt-[84px] pb-6`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Depoimentos · @oficialtruecrime.club</SectionEyebrow>
          <h2
            className={`m-0 max-w-[620px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
          >
            O que os investigadores andam falando.
          </h2>
        </div>
        <div
          className={`rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-[14px] py-2 text-[11.5px] tracking-[0.06em] text-(--ink-mute) uppercase ${fontType}`}
        >
          comentários reais do Instagram
        </div>
      </div>
      <div className="grid grid-cols-4 gap-[22px] max-[860px]:grid-cols-2 max-[540px]:flex max-[540px]:[scroll-snap-type:x_mandatory] max-[540px]:grid-cols-none max-[540px]:gap-[14px] max-[540px]:overflow-x-auto max-[540px]:mask-[linear-gradient(90deg,#000_80%,transparent_100%)] max-[540px]:pb-1.5 max-[540px]:[-webkit-overflow-scrolling:touch]">
        {items.map((testimonial, index) => (
          <TestimonialCardItem
            key={testimonial.user}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function TestimonialCardItem({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number]
  index: number
}) {
  const { ref, revealClassName, style } = useReveal(index * 80)
  const tilt = index % 2 ? 'rotate-[1.8deg]' : 'rotate-[-1.8deg]'
  return (
    <article
      ref={ref}
      className={`relative flex flex-col rounded-[3px] border border-[rgba(33,28,24,0.14)] bg-(--card) px-[22px] pt-[26px] pb-[18px] shadow-[0_12px_26px_-12px_rgba(33,28,24,0.28),inset_0_0_0_1px_rgba(255,255,255,0.6)] ${transitionPolaroid} ${tilt} hover:shadow-[0_22px_40px_-16px_rgba(33,28,24,0.34),inset_0_0_0_1px_rgba(255,255,255,0.7)] max-[540px]:flex-[0_0_80%] max-[540px]:snap-start ${revealClassName}`}
      style={style}
    >
      <span
        aria-hidden="true"
        className="absolute top-[-10px] left-1/2 h-[22px] w-[64px] -translate-x-1/2 -rotate-2 border-x border-dashed border-[rgba(33,28,24,0.18)] bg-[rgba(239,188,24,0.55)] shadow-[0_2px_4px_rgba(33,28,24,0.15)]"
      />
      <IconQuote
        color={testimonial.color}
        size={26}
        stroke={1.5}
        className="mb-3 opacity-90"
        aria-hidden
      />
      <p className="m-0 mb-[18px] line-clamp-5 flex-1 overflow-hidden text-[15px] leading-[1.55] text-(--ink) italic">
        {testimonial.text}
      </p>
      <div
        className={`flex items-center gap-2 border-t border-dashed border-[rgba(33,28,24,0.2)] pt-3 text-[11.5px] tracking-[0.02em] text-(--ink-mute) ${fontType}`}
      >
        <span
          className="size-2 flex-none rounded-full"
          style={{ background: testimonial.color }}
        />
        <strong className="font-bold text-(--ink)">{testimonial.user}</strong>
        <em className="ml-auto inline-flex items-center gap-1 not-italic">
          <IconHeart size={12} stroke={2} aria-hidden />
          {testimonial.likes}
        </em>
      </div>
    </article>
  )
}

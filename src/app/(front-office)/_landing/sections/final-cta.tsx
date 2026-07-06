import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  arrowIconClass,
  ctaButtonBase,
  fontHeading,
  fontType,
  sectionFrame,
} from '@/src/lib/design/classes'

export function FinalCta({
  eyebrow = 'A caixa deste mês fecha dia 28',
  title = 'Pronto pra descobrir do que as pessoas são capazes?',
  ctaText = 'Entrar no clube',
  ctaHref = '/assinatura',
  footerText = 'PRAZO FINAL · 28/JUN · 23H59',
  stampText = ['ABERTO PRA', 'INVESTIGAÇÃO'],
}: {
  eyebrow?: string
  title?: string
  ctaText?: string
  ctaHref?: string
  footerText?: string
  stampText?: string[]
} = {}) {
  return (
    <section
      id="cta-final"
      className={`${sectionFrame} relative py-[104px] text-center`}
    >
      {stampText && stampText.length > 0 && (
        <div
          aria-hidden="true"
          className={`relative mx-auto mb-[26px] inline-flex -rotate-3 flex-col gap-0.5 border-[3px] border-(--red) px-[26px] pt-[14px] pb-4 text-[18px] font-bold tracking-[0.16em] text-(--red) uppercase opacity-90 shadow-[inset_0_0_0_1px_rgba(197,39,31,0.4)] ${fontType}`}
        >
          <span>{stampText[0]}</span>
          {stampText[1] && <span className="text-[15px]">{stampText[1]}</span>}
        </div>
      )}
      <SectionEyebrow className="mb-[18px] justify-center">
        {eyebrow}
      </SectionEyebrow>
      <h2
        className={`m-0 mx-auto mb-7 max-w-[780px] text-[clamp(34px,5vw,64px)] leading-none font-semibold tracking-[-0.015em] ${fontHeading}`}
      >
        {title}
      </h2>
      <Link
        href={ctaHref}
        className={`group ${ctaButtonBase} gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)]`}
      >
        {ctaText}{' '}
        <IconArrowRight
          size={16}
          stroke={2}
          className={arrowIconClass}
          aria-hidden
        />
      </Link>
      {footerText && (
        <p
          className={`m-0 mt-[22px] text-[12px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontType}`}
        >
          {footerText}
        </p>
      )}
    </section>
  )
}

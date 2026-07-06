import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

import heroImage from '@/src/assets/images/design-sugerido/hero.jpg'
import {
  arrowIconClass,
  ctaButtonBase,
  fontHeading,
  fontType,
  heroRevealBase,
} from '@/src/lib/design/classes'

export function Hero({
  badge = 'O primeiro Clube de True Crime do Brasil',
  titleLines = ['Um único caso.', 'Doze caixas.', 'Um ano de investigação.'],
  description = 'A cada mês, uma caixa traz mais um capítulo do mesmo mistério: itens exclusivos, colecionáveis e novas pistas. Ao longo de 12 caixas você junta tudo e decide quem foi.',
  ctaText = 'Quero assinar',
  ctaHref = '/assinatura',
  secondaryCtaText = 'Como funciona',
  secondaryCtaHref = '#funciona',
  statsText = 'Mais de 1000 investigadores ativos no clube',
  activeCaseBadge = 'CASO EM CURSO · CAIXA 03/12',
  activeCaseName = 'O Caso Victória Monteiro',
}: {
  badge?: string
  titleLines?: string[]
  description?: string
  ctaText?: string
  ctaHref?: string
  secondaryCtaText?: string
  secondaryCtaHref?: string
  statsText?: string
  activeCaseBadge?: string
  activeCaseName?: string
} = {}) {
  return (
    <section
      id="topo"
      className="relative min-h-[620px] overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--night) bg-cover bg-position-[72%_center] bg-no-repeat max-[540px]:flex max-[540px]:min-h-[620px] max-[540px]:flex-col max-[540px]:justify-end"
      style={{ backgroundImage: `url(${heroImage.src})` }}
    >
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(15,11,9,0.96)_0%,rgba(15,11,9,0.86)_32%,rgba(15,11,9,0.46)_55%,rgba(15,11,9,0.06)_76%,rgba(15,11,9,0)_100%)] max-[540px]:[background:linear-gradient(180deg,rgba(15,11,9,0.3)_0%,rgba(15,11,9,0.1)_30%,rgba(15,11,9,0.6)_64%,rgba(15,11,9,0.95)_100%)]" />
      <div className="absolute inset-0 [background:linear-gradient(0deg,rgba(15,11,9,0.6)_0%,rgba(15,11,9,0)_34%)]" />
      <div className="relative z-4 mx-auto max-w-[1180px] px-8 pt-24 pb-[108px] max-[860px]:px-[22px] max-[540px]:flex max-[540px]:flex-col max-[540px]:pt-[30px] max-[540px]:pb-[34px]">
        <div className="max-w-[580px]">
          <div
            className={`mb-[22px] inline-flex items-center gap-[9px] rounded-[2px] border border-white/28 bg-white/8 px-[14px] py-2 text-[12px] leading-none font-bold tracking-[0.12em] text-[#f4ecdc] uppercase backdrop-blur-xs ${fontType} ${heroRevealBase}`}
            style={{ animationDelay: '0.05s' }}
          >
            <span className="size-2 shrink-0 rounded-full bg-[#ff6e50] shadow-[0_0_8px_rgba(255,110,80,0.8)]" />
            {badge}
          </div>
          <h1
            className={`m-0 mb-[22px] text-[clamp(42px,5.8vw,74px)] leading-[0.98] font-semibold tracking-[-0.02em] text-[#fdf8ef] [text-shadow:0_2px_24px_rgba(0,0,0,0.5)] ${fontHeading}`}
          >
            {titleLines.map((line, idx) => (
              <span
                key={idx}
                className={`block ${idx === titleLines.length - 1 ? 'text-[#ff6e50]' : ''} ${heroRevealBase}`}
                style={{ animationDelay: `${0.12 + idx * 0.08}s` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p
            className={`mb-[14px] max-w-[440px] text-[19px] leading-normal text-[#eae2d6] [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] ${heroRevealBase}`}
            style={{ animationDelay: `${0.12 + titleLines.length * 0.08}s` }}
          >
            {description}
          </p>
          <div
            className={`flex flex-wrap items-center gap-[14px] ${heroRevealBase} max-[540px]:flex-col max-[540px]:items-stretch`}
            style={{ animationDelay: `${0.2 + titleLines.length * 0.08}s` }}
          >
            <Link
              href={ctaHref}
              className={`group ${ctaButtonBase} gap-2 border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:-translate-y-0.5 hover:bg-(--red-deep) hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] max-[540px]:w-full`}
            >
              {ctaText}{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </Link>
            <a
              href={secondaryCtaHref}
              className={`${ctaButtonBase} border border-white/40 bg-transparent text-[#f4ecdc] hover:bg-[#fbf9f6] hover:text-(--ink) max-[540px]:w-full`}
            >
              {secondaryCtaText}
            </a>
          </div>
          <div
            className={`mt-[30px] flex items-center gap-[18px] text-[12.5px] leading-none tracking-[0.02em] text-[#c9bfb0] ${fontType} ${heroRevealBase}`}
            style={{ animationDelay: `${0.28 + titleLines.length * 0.08}s` }}
          >
            <div className="flex" aria-hidden="true">
              <span className="size-7 rounded-full border border-white/40 bg-(--yellow)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--purple)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--teal)" />
              <span className="ml-[-9px] size-7 rounded-full border border-white/40 bg-(--red)" />
            </div>
            {statsText}
          </div>
        </div>
        <div
          className={`absolute right-8 bottom-[26px] z-4 flex items-center gap-3 border border-l-[3px] border-white/18 border-l-(--yellow) bg-[rgba(15,11,9,0.55)] px-[14px] py-[10px] backdrop-blur-[6px] ${heroRevealBase} max-[860px]:right-[22px] max-[540px]:static max-[540px]:right-auto max-[540px]:bottom-auto max-[540px]:mt-[22px] max-[540px]:flex-wrap max-[540px]:justify-center`}
          style={{ animationDelay: `${0.36 + titleLines.length * 0.08}s` }}
        >
          <span
            className={`text-[10.5px] tracking-[0.08em] text-(--yellow) ${fontType}`}
          >
            {activeCaseBadge}
          </span>
          <i
            aria-hidden="true"
            className="inline-block h-[13px] w-px bg-white/30"
          />
          <strong
            className={`text-[14px] font-semibold text-[#fbf9f6] ${fontHeading}`}
          >
            {activeCaseName}
          </strong>
        </div>
      </div>
    </section>
  )
}

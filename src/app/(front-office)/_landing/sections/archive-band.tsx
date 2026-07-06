'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  getLandingArchiveItems,
  type LandingArchiveItem,
} from '@/src/app/(front-office)/_landing/landing-products'
import { useReveal } from '@/src/app/(front-office)/_landing/reveal'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  fontHeading,
  fontMono,
  fontType,
  transitionBgColor,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { getProductImage } from '@/src/lib/product-images'

export function ArchiveBand() {
  const archiveItems = getLandingArchiveItems()

  return (
    <section
      id="arquivos"
      className="relative mt-[88px] border-y border-[rgba(33,28,24,0.15)] text-(--paper) [background:radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_82%_88%,rgba(255,255,255,0.06)_0%,transparent_45%),var(--purple)] before:pointer-events-none before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.04)_0,rgba(255,255,255,0.04)_2px,transparent_2px,transparent_22px)] before:content-['']"
    >
      <div className="relative mx-auto max-w-[1180px] px-8 py-[68px] max-[860px]:px-[22px]">
        <div className="mb-11">
          <SectionEyebrow variant="yellow">
            06 — Arquivos do clube
          </SectionEyebrow>
          <h2
            className={`m-0 text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--paper) ${fontHeading}`}
          >
            Caixas que já passaram — leve avulsas quando quiser.
          </h2>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-[30px] max-[860px]:grid-cols-2 max-[540px]:grid-cols-1">
          {archiveItems.map((box, index) => (
            <ArchiveCard key={box.href} box={box} index={index} />
          ))}
        </div>
        <div className="mt-[46px] text-center">
          <Link
            href="/loja"
            className={`group inline-flex items-center justify-center rounded-[9px] border border-white/35 bg-transparent px-[22px] py-[13px] text-[13px] leading-none font-bold tracking-[0.04em] text-(--paper) uppercase no-underline ${transitionBgColor} hover:border-white/60 hover:bg-white/10 ${fontMono}`}
          >
            Acessar todos os arquivos{' '}
            <IconArrowRight
              size={16}
              stroke={2}
              className="inline-flex items-center leading-none transition group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ArchiveCard({
  box,
  index,
}: {
  box: LandingArchiveItem
  index: number
}) {
  const { ref, revealClassName, style } = useReveal(index * 80)
  const image = getProductImage(box.imagePath)

  return (
    <article
      ref={ref}
      className={`group relative ${revealClassName}`}
      style={style}
    >
      <div className="absolute inset-0 z-0 translate-y-[-3px] rotate-[2.5deg] rounded-[10px] bg-(--yellow) shadow-[0_14px_26px_-14px_rgba(33,28,24,0.4)]" />
      <div
        className={`absolute top-[-25px] right-4 z-0 inline-flex origin-bottom-right rotate-[2.5deg] items-center gap-2 rounded-t-[8px] bg-(--yellow) px-[15px] pt-1.5 pb-6 text-[9.5px] tracking-wider text-(--ink) uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontType}`}
      >
        <span className="font-bold text-(--red)">{box.box}</span>Caso Victória
        Monteiro
      </div>
      <div
        className={`relative z-1 flex flex-col overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) shadow-[0_9px_22px_-8px_rgba(33,28,24,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)] ${transitionCardHover} group-hover:translate-y-[-5px] group-hover:shadow-[0_20px_36px_-14px_rgba(33,28,24,0.45),inset_0_0_0_1px_rgba(255,255,255,0.6)]`}
      >
        <div
          aria-hidden="true"
          className={`absolute top-[10px] right-[10px] z-2 rotate-[-9deg] border-2 border-[rgba(94,94,162,0.85)] bg-[rgba(251,249,246,0.65)] px-[9px] py-[5px] pb-1.5 text-[9.5px] font-bold tracking-[0.14em] text-[rgba(94,94,162,0.95)] uppercase shadow-[inset_0_0_0_1px_rgba(94,94,162,0.4)] backdrop-blur-[2px] ${fontType}`}
        >
          ARQUIVADO
        </div>
        <div className="relative aspect-square overflow-hidden border-b border-[rgba(33,28,24,0.15)]">
          {image ? (
            <Image
              src={image}
              alt={box.alt}
              fill
              sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, 25vw"
              style={{ objectPosition: box.objectPosition }}
              className="block object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-4 pt-4 pb-[18px]">
          <div
            className={`mb-[5px] text-[10.5px] tracking-[0.06em] text-(--ink-mute) ${fontType}`}
          >
            {box.box}
          </div>
          <h3
            className={`m-0 mb-4 text-[16.5px] leading-[1.12] font-semibold ${fontHeading}`}
          >
            {box.title}
          </h3>
          <div className="mt-auto flex items-center justify-between gap-[10px]">
            <strong className={`text-[17px] font-semibold ${fontHeading}`}>
              {box.price}
            </strong>
            <Link
              href={box.href}
              className={`inline-flex items-center justify-center rounded-lg bg-(--ink) px-[13px] py-[9px] text-[11px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline ${transitionBgColor} hover:bg-(--red) ${fontMono}`}
            >
              Comprar
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

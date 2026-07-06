import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { getLandingStandaloneProduct } from '@/src/app/(front-office)/_landing/landing-products'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
  arrowIconClass,
  fontHeading,
  fontMono,
  fontType,
  sectionFrame,
  transitionLift,
} from '@/src/lib/design/classes'
import { formatCurrency } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'

export function StandaloneEdition() {
  const product = getLandingStandaloneProduct()
  if (!product) return null

  const productImage = getProductImage(product.images[0] ?? '')
  const fileLabel = product.editionMonth ?? product.slug

  return (
    <section id="avulsas" className={`${sectionFrame} pt-[84px] pb-6`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionEyebrow>05 — Edições especiais · avulsas</SectionEyebrow>
          <h2
            className={`m-0 mb-[14px] max-w-[620px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] ${fontHeading}`}
          >
            Casos curtos que fecham numa única caixa.
          </h2>
          <p className="m-0 max-w-[540px] text-[16px] leading-normal">
            Lançamos uma edição especial por vez — um tema à parte do caso
            principal, que você compra avulsa, sem assinar. As anteriores ficam
            nos arquivos.
          </p>
        </div>
      </div>
      <article className="relative grid grid-cols-[1.05fr_0.95fr] overflow-hidden rounded-2xl border border-[rgba(33,28,24,0.15)] bg-(--card) shadow-[0_18px_38px_-14px_rgba(33,28,24,0.18),inset_0_0_0_1px_rgba(255,255,255,0.5)] max-[860px]:grid-cols-1">
        <div className="relative min-h-[360px] overflow-hidden border-r border-[rgba(33,28,24,0.15)] max-[860px]:border-r-0 max-[860px]:border-b">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              sizes="(max-width: 860px) 100vw, 620px"
              className="block object-cover object-center"
            />
          ) : null}
          <div
            className={`absolute top-[22px] right-[22px] z-1 flex rotate-[8deg] flex-col gap-[3px] border-2 border-(--red) bg-[rgba(251,249,246,0.7)] px-[14px] py-[10px] pb-[11px] text-center text-[13px] font-bold tracking-[0.14em] text-(--red) uppercase shadow-[inset_0_0_0_1px_rgba(197,39,31,0.4)] backdrop-blur-[2px] ${fontType}`}
          >
            <span>EM CARTAZ</span>
            <span className="text-[9.5px] tracking-widest opacity-80">
              EDIÇÃO LIMITADA
            </span>
          </div>
          <div
            className={`absolute bottom-[18px] left-[18px] z-1 flex items-center gap-2 border border-white/50 bg-[rgba(15,11,9,0.55)] px-[11px] py-[7px] text-[10px] tracking-widest text-[#f4ecdc] uppercase backdrop-blur-xs ${fontType}`}
          >
            <span>FILE Nº</span>
            <i className="font-bold text-(--yellow) not-italic">{fileLabel}</i>
          </div>
        </div>
        <div className="flex flex-col justify-center px-10 py-11">
          <div
            className={`mb-[14px] text-[12px] tracking-widest text-(--red) uppercase ${fontType}`}
          >
            Edição especial em cartaz
          </div>
          <h3
            className={`m-0 mb-3 text-[32px] leading-[1.05] font-semibold ${fontHeading}`}
          >
            {product.name}
          </h3>
          <p className="m-0 mb-[26px] max-w-[440px] text-[15.5px] leading-[1.55]">
            {product.description}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <strong className={`text-[32px] font-semibold ${fontHeading}`}>
              {formatCurrency(product.price)}
            </strong>
            <Link
              href={`/loja/${product.slug}`}
              className={`inline-flex items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-[22px] py-[14px] text-[13px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] ${transitionLift} hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(33,28,24,0.22)] ${fontMono} group`}
            >
              Comprar agora{' '}
              <IconArrowRight
                size={16}
                stroke={2}
                className={arrowIconClass}
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </article>
      <div
        className={`mt-[18px] flex items-center gap-2 text-[12.5px] tracking-[0.02em] text-(--ink-mute) ${fontType}`}
      >
        <span className="size-1.5 rounded-full bg-(--teal) shadow-[0_0_8px_rgba(26,165,135,0.6)]" />
        <a
          href="#arquivos"
          className="group font-bold text-(--red) no-underline"
        >
          ver edições anteriores nos arquivos{' '}
          <IconArrowRight
            size={14}
            stroke={2}
            className={arrowIconClass}
            aria-hidden
          />
        </a>
      </div>
    </section>
  )
}

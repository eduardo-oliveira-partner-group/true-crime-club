import { IconSparkles } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { DossierCard } from '@/src/components/public-design/dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { ShopCatalog } from '@/src/components/shop/shop-catalog'
import {
  AvailabilityBadge,
  PriceBlock,
} from '@/src/components/ui/product-quick-view'
import { ScrollReveal } from '@/src/components/ui/scroll-reveal'
import {
  arrowIconClass,
  cardShadowHover,
  ctaButtonBase,
  fontHeading,
  fontType,
  sectionFrame,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { getSeoEntry, listProducts } from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { getProductImage } from '@/src/lib/product-images'
import { buildMetadata } from '@/src/lib/seo'
import { cn } from '@/src/lib/utils'

export const metadata = buildMetadata({
  path: '/loja',
  entry: getSeoEntry('/loja'),
})

const caseNotes = [
  { label: 'Arquivo', value: 'boxes anteriores e itens extras' },
  { label: 'Clube', value: 'preço de assinante quando houver plano ativo' },
  {
    label: 'Estoque',
    value: 'compra liberada enquanto a peça estiver disponível',
  },
]

export default async function LojaPage() {
  const products: Product[] = listProducts()

  const boxProducts = products.filter((product) => product.type === 'box')
  const extraProducts = products.filter((product) => product.type !== 'box')
  const featuredBox =
    boxProducts.find((product) => product.availability === 'limited') ??
    boxProducts.find((product) => product.inStock) ??
    boxProducts[0]

  return (
    <DesignPageShell showOverlays={false}>
      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--paper)">
        <div
          className={`${sectionFrame} relative z-10 grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-[0.88fr_1.12fr] lg:py-20`}
        >
          <div className="max-w-2xl space-y-6">
            <ScrollReveal>
              <SectionEyebrow>LOJA — arquivos liberados</SectionEyebrow>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h1
                className={`text-wrap-balance max-w-[680px] text-[clamp(42px,5.8vw,74px)] leading-[0.98] font-bold tracking-[-0.02em] text-(--ink) ${fontHeading}`}
              >
                Arquivos abertos para colecionadores.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="max-w-xl text-[18px] leading-[1.65] text-(--ink-soft) sm:text-[19px]">
                Boxes anteriores, edições avulsas e itens complementares do True
                Crime Club continuam disponíveis enquanto houver estoque.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid max-w-xl gap-2 sm:grid-cols-3">
                {caseNotes.map((note) => (
                  <div
                    key={note.label}
                    className="min-w-0 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) p-3 shadow-[0_12px_26px_-18px_rgba(33,28,24,0.22)] sm:p-4"
                  >
                    <p
                      className={`text-[10.5px] tracking-[0.14em] text-(--red) uppercase ${fontType}`}
                    >
                      {note.label}
                    </p>
                    <p className="mt-2 text-sm/snug text-(--ink-soft)">
                      {note.value}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {featuredBox ? (
            <ScrollReveal delay={0.16}>
              <FeaturedProductCase product={featuredBox} />
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      <ShopCatalog boxProducts={boxProducts} extraProducts={extraProducts} />
    </DesignPageShell>
  )
}

function FeaturedProductCase({ product }: { product: Product }) {
  const productImage = getProductImage(product.images[0] ?? '')

  return (
    <Link
      href={`/loja/${product.slug}`}
      className={cn(
        'group block focus-visible:ring-2 focus-visible:ring-(--yellow) focus-visible:outline-none',
        transitionCardHover,
        'hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      <DossierCard
        tabCode="EVID"
        tabLabel="arquivo em destaque"
        showPin
        pinColor="var(--yellow)"
        className={cn('p-4 sm:p-5', cardShadowHover)}
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-[4px_4px_10px_10px] border border-[rgba(33,28,24,0.15)] bg-(--card)">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <EvidencePlaceholder product={product} />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,16,20,0.02)_0%,rgba(14,16,20,0.56)_100%)]" />
          <AvailabilityBadge
            product={product}
            className="absolute top-4 left-4"
          />
        </div>
        <div className="grid gap-5 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p
              className={`text-[11px] tracking-[0.14em] text-(--red) uppercase ${fontType}`}
            >
              Arquivo em destaque
            </p>
            <h2
              className={`mt-3 text-2xl/tight font-semibold text-(--ink) ${fontHeading}`}
            >
              {product.name}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm/6 text-(--ink-soft)">
              {product.shortDescription}
            </p>
          </div>
          <div className="grid gap-3 sm:justify-items-end">
            <PriceBlock product={product} />
            <span
              className={`${ctaButtonBase} border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6]`}
            >
              Ver dossiê <span className={arrowIconClass}>→</span>
            </span>
          </div>
        </div>
      </DossierCard>
    </Link>
  )
}

function EvidencePlaceholder({ product }: { product: Product }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-(--card)">
      <div className="absolute inset-6 border border-[rgba(33,28,24,0.15)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(197,39,31,0.08),transparent_28%),radial-gradient(circle_at_48%_58%,rgba(239,188,24,0.06),transparent_32%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <IconSparkles className="size-9 text-(--red)" />
        <p className="mt-3 max-w-44 text-xs font-semibold tracking-[0.18em] text-(--ink) uppercase">
          {product.categories[0] ?? 'item'} do arquivo
        </p>
      </div>
    </div>
  )
}

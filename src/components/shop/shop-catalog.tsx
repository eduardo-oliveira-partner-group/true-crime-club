'use client'

import { useState } from 'react'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { ProductArchiveCard } from '@/src/components/shop/product-archive-card'
import { ProductQuickView } from '@/src/components/ui/product-quick-view'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import { fontHeading, sectionFrame } from '@/src/lib/design/classes'
import type { AvailabilityStatus, Product } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

interface ShopCatalogProps {
  boxProducts: Product[]
  extraProducts: Product[]
}

/** Reveals product cards as soon as 5% of the grid enters the viewport. */
const productRevealAmount = 0.05

/** Prioridade na listagem: disponíveis → em breve → esgotados. */
const availabilitySortOrder: Record<AvailabilityStatus, number> = {
  available: 0,
  limited: 0,
  coming_soon: 1,
  out_of_stock: 2,
}

/** Esgotado de verdade — não inclui "em breve" (também vem com emEstoque: false). */
function isOutOfStock(product: Product) {
  return (
    product.availability === 'out_of_stock' ||
    (!product.inStock && product.availability !== 'coming_soon')
  )
}

/** Esgotados e "em breve" ficam com opacidade reduzida na grade. */
function isDimmed(product: Product) {
  return isOutOfStock(product) || product.availability === 'coming_soon'
}

function sortAvailableFirst(products: Product[]) {
  return [...products].sort((a, b) => {
    const byAvailability =
      availabilitySortOrder[a.availability] -
      availabilitySortOrder[b.availability]
    if (byAvailability !== 0) return byAvailability
    return Number(isOutOfStock(a)) - Number(isOutOfStock(b))
  })
}

export function ShopCatalog({ boxProducts, extraProducts }: ShopCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const sortedBoxProducts = sortAvailableFirst(boxProducts)
  const sortedExtraProducts = sortAvailableFirst(extraProducts)

  return (
    <>
      {sortedBoxProducts.length > 0 ? (
        <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card)">
          <div
            className={`${sectionFrame} relative z-10 py-12 sm:py-14 lg:py-20`}
          >
            <SectionHeader
              eyebrow="01 — Boxes avulsas"
              title="Edições anteriores ainda em investigação."
              description="Cada caixa carrega um recorte da coleção: pistas, objetos e conteúdos preparados para quem quer completar o arquivo ou entrar pelo caso que mais chama atenção."
            />

            <ScrollRevealGroup
              className="grid grid-cols-2 items-stretch gap-x-4 gap-y-7 sm:gap-[30px] lg:grid-cols-3"
              staggerChildren={0.08}
              amount={productRevealAmount}
            >
              {sortedBoxProducts.map((product) => {
                const dimmed = isDimmed(product)
                return (
                  <ScrollRevealItem
                    key={product.id}
                    className={cn('h-full', dimmed && 'grayscale-[0.25]')}
                    opacity={dimmed ? 0.45 : 1}
                  >
                    <ProductArchiveCard
                      product={product}
                      variant="box"
                      onOpen={() => setSelectedProduct(product)}
                    />
                  </ScrollRevealItem>
                )
              })}
            </ScrollRevealGroup>
          </div>
        </section>
      ) : null}

      {sortedExtraProducts.length > 0 ? (
        <section className="relative isolate overflow-hidden bg-(--paper-soft)">
          <div
            className={`${sectionFrame} relative z-10 py-12 sm:py-14 lg:py-20`}
          >
            <SectionHeader
              eyebrow="02 — Itens complementares"
              title="Ferramentas para montar sua própria mesa de evidências."
              description="Produtos extras para registrar teorias, decorar o espaço e manter a experiência ativa entre uma box e outra."
            />

            <ScrollRevealGroup
              className="grid grid-cols-2 items-stretch gap-x-4 gap-y-7 sm:gap-[30px] lg:grid-cols-3"
              staggerChildren={0.08}
              amount={productRevealAmount}
            >
              {sortedExtraProducts.map((product) => {
                const dimmed = isDimmed(product)
                return (
                  <ScrollRevealItem
                    key={product.id}
                    className={cn('h-full', dimmed && 'grayscale-[0.25]')}
                    opacity={dimmed ? 0.45 : 1}
                  >
                    <ProductArchiveCard
                      product={product}
                      variant="extra"
                      onOpen={() => setSelectedProduct(product)}
                    />
                  </ScrollRevealItem>
                )
              })}
            </ScrollRevealGroup>
          </div>
        </section>
      ) : null}

      <ProductQuickView
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null)
        }}
      />
    </>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-7 max-w-3xl space-y-3 text-left sm:mb-10 sm:space-y-4">
      <ScrollReveal>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <h2
          className={`text-wrap-balance max-w-[720px] text-[clamp(28px,3.4vw,44px)] leading-[1.02] font-semibold tracking-[-0.015em] text-(--ink) ${fontHeading}`}
        >
          {title}
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <p className="max-w-2xl text-[15px] leading-[1.55] text-(--ink-soft) sm:text-[16px]">
          {description}
        </p>
      </ScrollReveal>
    </div>
  )
}

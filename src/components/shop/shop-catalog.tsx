'use client'

import {
  IconArrowRight,
  IconCalendarEvent,
  IconClipboardText,
  IconFingerprint,
  IconPackage,
  IconSparkles,
} from '@tabler/icons-react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
import Image from 'next/image'
import { useId, useLayoutEffect, useRef, useState } from 'react'

import { GlowingCard } from '@/src/components/ui/glowing-card'
import {
  AvailabilityBadge,
  DetailDatum,
  PriceBlock,
  ProductQuickView,
} from '@/src/components/ui/product-quick-view'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import type { Product } from '@/src/lib/domain/types'
import { formatEditionMonth } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'

interface ShopCatalogProps {
  boxProducts: Product[]
  extraProducts: Product[]
}

export function ShopCatalog({ boxProducts, extraProducts }: ShopCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const layoutGroupId = useId()
  const dialogTitleId = useId()
  const openScrollYRef = useRef(0)

  useLayoutEffect(() => {
    if (!selectedProduct) {
      return
    }

    const previousBodyPaddingRight = document.body.style.paddingRight
    const previousDocumentOverflow = document.documentElement.style.overflow
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.documentElement.style.overflow = 'hidden'
    document.body.style.paddingRight =
      scrollbarWidth > 0 ? `${scrollbarWidth}px` : previousBodyPaddingRight
    window.scrollTo(0, openScrollYRef.current)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProduct(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.paddingRight = previousBodyPaddingRight
      document.documentElement.style.overflow = previousDocumentOverflow
      window.scrollTo(0, openScrollYRef.current)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProduct])

  const openProduct = (product: Product) => {
    openScrollYRef.current = window.scrollY
    setSelectedProduct(product)
  }

  return (
    <LayoutGroup id={layoutGroupId}>
      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card)">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_8%,rgba(216,65,50,0.12),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(215,181,109,0.12),transparent_28%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[auto,auto,56px_56px,56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <SectionHeader
            eyebrow="Boxes avulsas"
            title="Edições anteriores ainda em investigação."
            description="Cada caixa carrega um recorte da coleção: pistas, objetos e conteúdos preparados para quem quer completar o arquivo ou entrar pelo caso que mais chama atenção."
          />

          {boxProducts.length === 0 ? (
            <EmptyCatalog />
          ) : (
            <ScrollRevealGroup
              className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6"
              staggerChildren={0.08}
            >
              {boxProducts.map((product) => (
                <ScrollRevealItem key={product.id} className="h-full">
                  <ProductArchiveCard
                    product={product}
                    variant="box"
                    onOpen={() => openProduct(product)}
                  />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          )}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-(--paper-soft)">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <SectionHeader
            eyebrow="Itens complementares"
            title="Ferramentas para montar sua própria mesa de evidências."
            description="Produtos extras para registrar teorias, decorar o espaço e manter a experiência ativa entre uma box e outra."
          />

          {extraProducts.length === 0 ? (
            <EmptyCatalog />
          ) : (
            <ScrollRevealGroup
              className="grid items-stretch gap-5 sm:grid-cols-2"
              staggerChildren={0.08}
            >
              {extraProducts.map((product) => (
                <ScrollRevealItem key={product.id} className="h-full">
                  <ProductArchiveCard
                    product={product}
                    variant="extra"
                    onOpen={() => openProduct(product)}
                  />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct ? (
          <ProductQuickView
            key={selectedProduct.id}
            product={selectedProduct}
            titleId={dialogTitleId}
            reduceMotion={Boolean(shouldReduceMotion)}
            onClose={() => setSelectedProduct(null)}
          />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
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
    <div className="mb-10 max-w-3xl space-y-4 text-left">
      <ScrollReveal>
        <div className="flex items-center gap-4">
          <p className="text-xs font-semibold tracking-[0.22em] text-(--red) uppercase">
            {eyebrow}
          </p>
          <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
        </div>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <h2 className="font-heading text-3xl/tight font-semibold tracking-tight text-(--ink) sm:text-4xl">
          {title}
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <p className="max-w-2xl text-sm/6 text-(--ink-soft)">{description}</p>
      </ScrollReveal>
    </div>
  )
}

interface ProductArchiveCardProps {
  product: Product
  variant: 'box' | 'extra'
  onOpen: () => void
}

function ProductArchiveCard({
  product,
  variant,
  onOpen,
}: ProductArchiveCardProps) {
  const productImage = getProductImage(product.images[0] ?? '')
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')

  return (
    <motion.button
      type="button"
      layoutId={`box-shell-${product.id}`}
      onClick={onOpen}
      className="block size-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090807] focus-visible:outline-none"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <GlowingCard
        className="group h-full shadow-[0_18px_40px_rgba(33,28,24,0.24)] transition hover:border-[#d7b56d]/35"
        innerClassName="relative flex h-full flex-col overflow-hidden bg-(--paper) p-0"
      >
        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative aspect-4/3 h-auto w-full shrink-0 self-start overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card)"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 560px"
              className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <EvidencePlaceholder product={product} />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.05)_0%,rgba(9,8,7,0.62)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[34px_34px]" />

          {variant === 'box' ? (
            <div className="absolute top-4 left-4 border border-[rgba(33,28,24,0.15)] bg-(--paper)/82 px-3 py-2 backdrop-blur-sm">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-(--red) uppercase">
                Caixa
              </p>
              <p className="font-heading text-2xl leading-none font-semibold text-(--ink)">
                {evidenceNumber}
              </p>
            </div>
          ) : (
            <div className="absolute top-4 left-4 flex size-11 items-center justify-center border border-[rgba(33,28,24,0.15)] bg-(--paper)/82 text-(--red) backdrop-blur-sm">
              <IconClipboardText className="size-5" />
            </div>
          )}

          <AvailabilityBadge
            product={product}
            className="absolute right-4 bottom-4"
          />
        </motion.div>

        <div className="relative z-20 flex w-full flex-1 flex-col p-5 sm:p-6">
          <div className="grid w-full gap-3 border-b border-[rgba(33,28,24,0.15)] pb-4 text-sm text-(--ink-soft) sm:grid-cols-2">
            {product.editionMonth ? (
              <DetailDatum
                icon={<IconCalendarEvent className="size-4" />}
                label="Edição"
                value={formatEditionMonth(product.editionMonth)}
              />
            ) : (
              <DetailDatum
                icon={<IconFingerprint className="size-4" />}
                label="Categoria"
                value={product.categories[0] ?? 'produto'}
              />
            )}
            <DetailDatum
              icon={<IconPackage className="size-4" />}
              label="Tipo"
              value={variant === 'box' ? 'Box avulsa' : 'Produto extra'}
            />
          </div>

          <motion.h3
            layoutId={`box-title-${product.id}`}
            className="mt-5 line-clamp-2 min-h-[2lh] overflow-hidden font-heading text-2xl/tight font-semibold tracking-wide text-(--ink) uppercase"
          >
            {product.name}
          </motion.h3>
          <p className="mt-3 line-clamp-2 min-h-[2lh] overflow-hidden text-sm/6 text-(--ink-soft)">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex w-full items-end justify-between gap-4 border-t border-[rgba(33,28,24,0.15)] pt-5">
            <PriceBlock product={product} compact />
            <div className="inline-flex h-10 items-center justify-center rounded-none border border-[rgba(33,28,24,0.15)] bg-(--card)/6 px-4 py-2 text-sm font-medium text-(--ink) transition group-hover:bg-(--card)/12">
              Ver detalhes
              <IconArrowRight className="ml-2 size-4" />
            </div>
          </div>
        </div>
      </GlowingCard>
    </motion.button>
  )
}

function EvidencePlaceholder({ product }: { product: Product }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#120f0d]">
      <div className="absolute inset-6 border border-[#d7b56d]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(216,65,50,0.16),transparent_28%),radial-gradient(circle_at_48%_58%,rgba(215,181,109,0.12),transparent_32%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <IconSparkles className="size-9 text-(--red)" />
        <p className="mt-3 max-w-44 text-xs font-semibold tracking-[0.18em] text-(--ink) uppercase">
          {product.categories[0] ?? 'item'} do arquivo
        </p>
      </div>
    </div>
  )
}

function EmptyCatalog() {
  return (
    <div className="border border-dashed border-[rgba(33,28,24,0.15)] bg-(--paper)/72 p-8 text-center text-(--ink-soft)">
      Nenhum produto disponível no momento.
    </div>
  )
}

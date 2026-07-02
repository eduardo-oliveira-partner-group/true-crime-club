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

import { DossierCard } from '@/src/components/public-design/dossier-card'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
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
import {
  arrowIconClass,
  cardShadowHover,
  fontHeading,
  fontMono,
  fontType,
  sectionFrame,
  transitionCardHover,
} from '@/src/lib/design/classes'
import type { Product } from '@/src/lib/domain/types'
import { formatEditionMonth } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

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
        <div className={`${sectionFrame} relative z-10 py-14 lg:py-20`}>
          <SectionHeader
            eyebrow="01 — Boxes avulsas"
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
        <div className={`${sectionFrame} relative z-10 py-14 lg:py-20`}>
          <SectionHeader
            eyebrow="02 — Itens complementares"
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
        <p className="max-w-2xl text-[16px] leading-[1.55] text-(--ink-soft)">
          {description}
        </p>
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
      className={cn(
        'block size-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:ring-2 focus-visible:ring-(--red) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) focus-visible:outline-none',
        transitionCardHover,
        'hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <DossierCard
        tabCode={variant === 'box' ? `BOX-${evidenceNumber}` : 'ITEM'}
        tabLabel={variant === 'box' ? 'arquivo avulso' : 'peça extra'}
        showPin
        pinColor={variant === 'box' ? 'var(--red)' : 'var(--teal)'}
        className={cn('group h-full overflow-hidden p-0', cardShadowHover)}
      >
        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative aspect-4/3 h-auto w-full shrink-0 self-start overflow-hidden rounded-t-[14px] border-b border-[rgba(33,28,24,0.15)] bg-(--card)"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 560px"
              className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <EvidencePlaceholder product={product} />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,236,220,0.045)_1px,transparent_1px),linear-gradient(rgba(244,236,220,0.045)_1px,transparent_1px)] bg-size-[34px_34px]" />

          {variant === 'box' ? (
            <div className="absolute top-4 left-4 rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper)/88 px-3 py-2 backdrop-blur-[2px]">
              <p
                className={`text-[0.65rem] tracking-[0.16em] text-(--red) uppercase ${fontType}`}
              >
                Caixa
              </p>
              <p
                className={`text-2xl leading-none font-semibold text-(--ink) ${fontHeading}`}
              >
                {evidenceNumber}
              </p>
            </div>
          ) : (
            <div className="absolute top-4 left-4 flex size-11 items-center justify-center rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper)/88 text-(--teal) backdrop-blur-[2px]">
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
            className={`mt-5 line-clamp-2 min-h-[2lh] overflow-hidden text-2xl/tight font-semibold text-(--ink) ${fontHeading}`}
          >
            {product.name}
          </motion.h3>
          <p className="mt-3 line-clamp-2 min-h-[2lh] overflow-hidden text-sm/6 text-(--ink-soft)">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex w-full items-end justify-between gap-4 border-t border-[rgba(33,28,24,0.15)] pt-5">
            <PriceBlock product={product} compact />
            <div
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-4 py-2 text-[12px] font-bold tracking-[0.04em] text-[#fbf9f6] uppercase ${fontMono}`}
            >
              Ver detalhes
              <IconArrowRight className={cn('size-4', arrowIconClass)} />
            </div>
          </div>
        </div>
      </DossierCard>
    </motion.button>
  )
}

function EvidencePlaceholder({ product }: { product: Product }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-(--card)">
      <div className="absolute inset-6 border border-[rgba(33,28,24,0.15)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(197,39,31,0.1),transparent_28%),radial-gradient(circle_at_48%_58%,rgba(26,165,135,0.08),transparent_32%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <IconSparkles className="size-9 text-(--red)" />
        <p
          className={`mt-3 max-w-44 text-xs tracking-[0.14em] text-(--ink) uppercase ${fontType}`}
        >
          {product.categories[0] ?? 'item'} do arquivo
        </p>
      </div>
    </div>
  )
}

function EmptyCatalog() {
  return (
    <div className="rounded-[14px_14px_16px_16px] border border-dashed border-[rgba(33,28,24,0.18)] bg-(--card) p-8 text-center text-(--ink-soft)">
      Nenhum produto disponível no momento.
    </div>
  )
}

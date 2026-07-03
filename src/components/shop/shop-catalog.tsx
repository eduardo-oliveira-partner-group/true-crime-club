'use client'

import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
import Image from 'next/image'
import { useId, useLayoutEffect, useRef, useState } from 'react'

import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import {
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
  fontHeading,
  fontMono,
  fontType,
  sectionFrame,
  transitionCardHover,
} from '@/src/lib/design/classes'
import type { Product } from '@/src/lib/domain/types'
import { formatAvailability, formatEditionMonth } from '@/src/lib/formatters'
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
              className="grid items-stretch gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
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
              className="grid items-stretch gap-[30px] sm:grid-cols-2 lg:grid-cols-3"
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
  const tabCode = variant === 'box' ? `BOX ${evidenceNumber}` : 'ITEM'
  const tabLabel = variant === 'box' ? 'Arquivo avulso' : 'Peça extra'
  const detailLabel = product.editionMonth
    ? formatEditionMonth(product.editionMonth)
    : (product.categories[0] ?? 'produto')
  const backingRotation =
    variant === 'box' ? 'rotate-[2.5deg]' : 'rotate-[-2.2deg]'
  const tabRotation =
    variant === 'box'
      ? 'rotate-[2.5deg] origin-bottom-right right-4'
      : 'rotate-[-2.5deg] origin-bottom-left left-4'

  return (
    <motion.button
      type="button"
      layoutId={`box-shell-${product.id}`}
      onClick={onOpen}
      className={cn(
        'group relative block size-full cursor-pointer appearance-none border-0 bg-transparent p-0 pt-[25px] text-left text-inherit focus-visible:ring-2 focus-visible:ring-(--red) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) focus-visible:outline-none',
        transitionCardHover,
        'motion-reduce:transition-none',
      )}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-[25px] bottom-0 z-0 translate-y-[-3px] rounded-[10px] bg-(--yellow) shadow-[0_14px_26px_-14px_rgba(33,28,24,0.4)]',
          backingRotation,
        )}
      >
        <span className="sr-only">folha de arquivo</span>
      </div>

      <div
        className={cn(
          `absolute top-0 z-0 inline-flex items-center gap-2 rounded-t-[8px] bg-(--yellow) px-[15px] pt-1.5 pb-6 text-[9.5px] tracking-wider text-(--ink) uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] ${fontType}`,
          tabRotation,
        )}
      >
        <span className="font-bold text-(--red)">{tabCode}</span>
        {tabLabel}
      </div>

      <div
        className={cn(
          'relative z-10 flex h-full flex-col overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) shadow-[0_9px_22px_-8px_rgba(33,28,24,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)]',
          transitionCardHover,
          'group-hover:translate-y-[-5px] group-hover:shadow-[0_20px_36px_-14px_rgba(33,28,24,0.45),inset_0_0_0_1px_rgba(255,255,255,0.6)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
        )}
      >
        <div
          aria-hidden="true"
          className={`absolute top-[10px] right-[10px] z-20 rotate-[-9deg] border-2 border-[rgba(94,94,162,0.85)] bg-[rgba(251,249,246,0.65)] px-[9px] py-[5px] pb-1.5 text-[9.5px] font-bold tracking-[0.14em] text-[rgba(94,94,162,0.95)] uppercase shadow-[inset_0_0_0_1px_rgba(94,94,162,0.4)] backdrop-blur-[2px] ${fontType}`}
        >
          {formatAvailability(product.availability)}
        </div>

        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative aspect-square w-full shrink-0 overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card)"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <EvidencePlaceholder product={product} />
          )}
        </motion.div>

        <div className="relative z-20 flex w-full flex-1 flex-col px-4 pt-4 pb-[18px]">
          <div
            className={`mb-[5px] text-[10.5px] tracking-[0.06em] text-(--ink-mute) uppercase ${fontType}`}
          >
            {detailLabel}
          </div>
          <motion.h3
            layoutId={`box-title-${product.id}`}
            className={`m-0 mb-3 line-clamp-2 min-h-[2.24em] overflow-hidden text-[16.5px] leading-[1.12] font-semibold text-(--ink) ${fontHeading}`}
          >
            {product.name}
          </motion.h3>
          <p className="line-clamp-2 min-h-[3em] overflow-hidden text-[13px] leading-normal text-(--ink-soft)">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex w-full items-center justify-between gap-[10px] pt-5">
            <PriceBlock product={product} compact />
            <div
              className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-(--ink) px-[13px] py-[9px] text-[11px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase ${fontMono} group-hover:bg-(--red)`}
            >
              Ver
              <IconArrowRight className={cn('size-4', arrowIconClass)} />
            </div>
          </div>
        </div>
      </div>
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

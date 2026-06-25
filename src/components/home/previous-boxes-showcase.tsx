'use client'

import {
  IconCalendarEvent,
  IconPackage,
  IconShoppingBag,
  IconX,
} from '@tabler/icons-react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from 'motion/react'
import Image from 'next/image'
import { type ReactNode, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/src/components/ui/button'
import { GlowingCard } from '@/src/components/ui/glowing-card'
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import type { Product } from '@/src/lib/domain/types'
import {
  formatAvailability,
  formatCurrency,
  formatEditionMonth,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

interface PreviousBoxesShowcaseProps {
  products: Product[]
}

function getAvailabilityTone(availability: Product['availability']) {
  if (availability === 'available') {
    return 'border-[#d7b56d]/45 bg-[#2d2415]/80 text-[#f4d891]'
  }
  if (availability === 'limited') {
    return 'border-[#d84132]/45 bg-[#2c1713]/80 text-[#ffb0a5]'
  }
  if (availability === 'coming_soon') {
    return 'border-[#fffaf0]/24 bg-[#fffaf0]/10 text-[#fffaf0]'
  }
  return 'border-[#fffaf0]/18 bg-[#fffaf0]/8 text-[#d7c9b5]'
}

export function PreviousBoxesShowcase({
  products,
}: PreviousBoxesShowcaseProps) {
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
      <ScrollRevealGroup
        className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6"
        staggerChildren={0.1}
      >
        {products.map((product) => (
          <ScrollRevealItem key={product.id} className="h-full">
            <PreviousBoxCard
              product={product}
              onOpen={() => openProduct(product)}
            />
          </ScrollRevealItem>
        ))}
      </ScrollRevealGroup>

      <AnimatePresence>
        {selectedProduct ? (
          <ProductDetailModal
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

interface PreviousBoxCardProps {
  product: Product
  onOpen: () => void
}

function PreviousBoxCard({ product, onOpen }: PreviousBoxCardProps) {
  const productImage = getProductImage(product.images[0] ?? '')
  const displayPrice = product.subscriberPrice ?? product.price
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')

  return (
    <motion.button
      type="button"
      layoutId={`box-shell-${product.id}`}
      onClick={onOpen}
      className="block h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171211] focus-visible:outline-none"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <GlowingCard
        className="group h-full shadow-[0_22px_48px_rgba(0,0,0,0.28)]"
        innerClassName="relative flex h-full min-h-[300px] flex-col overflow-hidden bg-[#0b0908] p-0 md:flex-row"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[34px_34px]" />
        {/* <div className="pointer-events-none absolute top-0 right-6 z-20 h-12 w-10 border-x border-b border-[#d7b56d]/28 bg-[#d7b56d]/14" /> */}

        {productImage ? (
          <motion.div
            layoutId={`box-image-${product.id}`}
            className="relative aspect-square shrink-0 overflow-hidden border-b border-[#fffaf0]/14 bg-[#171211] md:w-[42%] md:border-r md:border-b-0"
          >
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.08)_0%,rgba(9,8,7,0.48)_100%)]" />
            <div className="absolute top-4 left-4 border border-[#fffaf0]/20 bg-[#090807]/82 px-3 py-2 backdrop-blur-sm">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                Caixa
              </p>
              <p className="font-heading text-2xl leading-none font-semibold text-[#fffaf0]">
                {evidenceNumber}
              </p>
            </div>
          </motion.div>
        ) : null}

        <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6">
          <ProductKicker product={product} showAvailability={false} />

          <motion.h3
            layoutId={`box-title-${product.id}`}
            className="mt-5 line-clamp-2 min-h-[2lh] overflow-hidden font-heading text-2xl leading-tight font-semibold tracking-wide text-[#fffaf0] uppercase"
          >
            {product.name}
          </motion.h3>

          <p className="mt-3 line-clamp-2 min-h-[2lh] overflow-hidden text-sm leading-6 text-[#d7c9b5]">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#fffaf0]/10 pt-5">
            <PriceBlock product={product} compact />
            <AvailabilityBadge product={product} />
          </div>

          <p className="sr-only">
            Preço exibido: {formatCurrency(displayPrice)}
          </p>
        </div>
      </GlowingCard>
    </motion.button>
  )
}

interface ProductDetailModalProps {
  product: Product
  titleId: string
  reduceMotion: boolean
  onClose: () => void
}

function ProductDetailModal({
  product,
  titleId,
  reduceMotion,
  onClose,
}: ProductDetailModalProps) {
  const productImage = getProductImage(product.images[0] ?? '')
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-x-hidden overflow-y-auto p-3 py-8 sm:p-6 lg:items-center lg:overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
    >
      <motion.button
        type="button"
        className="absolute inset-0 cursor-default bg-[#090807]/82 backdrop-blur-md"
        onClick={onClose}
        aria-label="Fechar detalhes do produto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.article
        layoutId={`box-shell-${product.id}`}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden border border-[#fffaf0]/16 bg-[#0b0908] text-[#fffaf0] shadow-[0_32px_90px_rgba(0,0,0,0.58)] lg:max-h-[calc(100vh-3rem)] lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[38px_38px]" />
        <button
          type="button"
          onClick={onClose}
          className="fixed top-10 right-8 z-30 flex size-10 items-center justify-center border border-[#fffaf0]/18 bg-[#090807]/76 text-[#fffaf0] backdrop-blur-sm transition hover:border-[#d84132]/55 hover:bg-[#d84132]/20 focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:outline-none sm:absolute sm:top-4 sm:right-4"
          aria-label="Fechar"
        >
          <IconX className="size-5" />
        </button>

        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative min-h-[260px] overflow-hidden bg-[#171211] sm:min-h-[360px] lg:min-h-[620px]"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-center"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.02)_0%,rgba(9,8,7,0.52)_100%)]" />
          <div className="absolute bottom-5 left-5 z-20 border border-[#fffaf0]/20 bg-[#090807]/82 px-4 py-3 backdrop-blur-sm">
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
              Arquivo
            </p>
            <p className="font-heading text-4xl leading-none font-semibold text-[#fffaf0]">
              {evidenceNumber}
            </p>
          </div>
        </motion.div>

        <div className="relative z-20 flex flex-col p-5 pb-32 sm:p-7 sm:pb-32 lg:min-h-0 lg:overflow-y-auto lg:p-9">
          <div className="pr-14 sm:pr-16">
            <ProductKicker product={product} showAvailability={false} />
          </div>

          <motion.h2
            id={titleId}
            layoutId={`box-title-${product.id}`}
            className="mt-6 font-heading text-3xl leading-tight font-semibold tracking-wide text-[#fffaf0] uppercase sm:text-4xl"
          >
            {product.name}
          </motion.h2>

          <div className="mt-5 grid gap-3 border-y border-[#fffaf0]/10 py-5 text-sm text-[#d7c9b5] sm:grid-cols-2">
            {product.editionMonth ? (
              <DetailDatum
                icon={<IconCalendarEvent className="size-4" />}
                label="Edição"
                value={formatEditionMonth(product.editionMonth)}
              />
            ) : null}
            <DetailDatum
              icon={<IconPackage className="size-4" />}
              label="Tipo"
              value={product.type === 'box' ? 'Box avulsa' : 'Produto'}
            />
          </div>

          <p className="mt-5 text-base leading-7 text-[#d7c9b5]">
            {product.description}
          </p>

          {product.includedItems?.length ? (
            <div className="mt-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                Conteúdo do arquivo
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#d7c9b5]">
                {product.includedItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 bg-[#d84132]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 hidden flex-col gap-4 border-t border-[#fffaf0]/10 pt-6 lg:flex lg:flex-row lg:items-end lg:justify-between">
            <PriceBlock product={product} />
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                disabled={!product.inStock}
                className="rounded-none bg-[#d84132] px-5 text-white hover:bg-[#b83227]"
              >
                <IconShoppingBag className="size-4" />
                {product.inStock ? 'Adicionar ao carrinho' : 'Esgotado'}
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-3 bottom-3 z-40 border border-[#fffaf0]/16 bg-[#090807]/92 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-md lg:hidden">
          <div className="flex items-end justify-between gap-3">
            <PriceBlock product={product} compact />
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                size="icon"
                disabled={!product.inStock}
                className="rounded-none bg-[#d84132] text-white hover:bg-[#b83227]"
                aria-label={
                  product.inStock ? 'Adicionar ao carrinho' : 'Produto esgotado'
                }
              >
                <IconShoppingBag className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  )
}

function ProductKicker({
  product,
  showAvailability = true,
}: {
  product: Product
  showAvailability?: boolean
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <p className="border-l-2 border-[#d84132] pl-3 text-xs font-semibold tracking-[0.2em] text-[#ffb0a5] uppercase">
        Arquivo avulso
      </p>
      {showAvailability ? <AvailabilityBadge product={product} /> : null}
    </div>
  )
}

function AvailabilityBadge({ product }: { product: Product }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase',
        getAvailabilityTone(product.availability),
      )}
    >
      {formatAvailability(product.availability)}
    </span>
  )
}

function PriceBlock({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  const displayPrice = product.subscriberPrice ?? product.price

  if (product.subscriberPrice) {
    return (
      <div className={cn('min-w-0', compact ? 'space-y-1.5' : 'space-y-2')}>
        <p className="text-xs text-[#d7c9b5]/68 line-through decoration-[#ffb0a5]/70 decoration-2">
          de {formatCurrency(product.price)}
        </p>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#d7b56d] uppercase">
          Assinante
        </p>
        <p
          className={cn(
            'font-heading leading-none font-semibold text-[#fffaf0]',
            compact ? 'text-xl' : 'text-3xl',
          )}
        >
          {formatCurrency(product.subscriberPrice)}
        </p>
      </div>
    )
  }

  return (
    <p
      className={cn(
        'font-heading font-semibold text-[#fffaf0]',
        compact ? 'text-lg' : 'text-3xl',
      )}
    >
      {formatCurrency(displayPrice)}
    </p>
  )
}

function DetailDatum({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center border border-[#fffaf0]/14 bg-[#fffaf0]/7 text-[#d7b56d]">
        {icon}
      </div>
      <div>
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-[#fffaf0]">{value}</p>
      </div>
    </div>
  )
}

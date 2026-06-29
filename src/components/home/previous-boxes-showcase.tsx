'use client'

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
  PriceBlock,
  ProductKicker,
  ProductQuickView,
} from '@/src/components/ui/product-quick-view'
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import type { Product } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'

interface PreviousBoxesShowcaseProps {
  products: Product[]
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
      className="block size-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left text-inherit focus-visible:ring-2 focus-visible:ring-[#9a662a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e9dfcf] focus-visible:outline-none dark:focus-visible:ring-[#d7b56d] dark:focus-visible:ring-offset-[#171211]"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <GlowingCard
        className="group h-full shadow-[0_10px_20px_rgba(63,46,34,0.07)] dark:shadow-[0_22px_48px_rgba(0,0,0,0.28)]"
        innerClassName="relative flex h-full min-h-[300px] flex-col overflow-hidden bg-[#fffaf2] p-0 md:flex-row dark:bg-[#0b0908]"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(33,28,24,0.022)_1px,transparent_1px),linear-gradient(rgba(33,28,24,0.022)_1px,transparent_1px)] bg-size-[34px_34px] dark:bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)]" />

        {productImage ? (
          <motion.div
            layoutId={`box-image-${product.id}`}
            className="relative aspect-square shrink-0 overflow-hidden border-b border-[#211c18]/14 bg-[#efe4d4] md:w-[42%] md:border-r md:border-b-0 dark:border-[#fffaf0]/14 dark:bg-[#171211]"
          >
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 480px"
              className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,241,236,0.02)_0%,rgba(33,28,24,0.28)_100%)] dark:bg-[linear-gradient(180deg,rgba(9,8,7,0.08)_0%,rgba(9,8,7,0.48)_100%)]" />
            <div className="absolute top-4 left-4 border border-[#211c18]/16 bg-[#fffaf2]/86 px-3 py-2 backdrop-blur-sm dark:border-[#fffaf0]/20 dark:bg-[#090807]/82">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
                Caixa
              </p>
              <p className="font-heading text-2xl leading-none font-semibold text-[#211c18] dark:text-[#fffaf0]">
                {evidenceNumber}
              </p>
            </div>
          </motion.div>
        ) : null}

        <div className="relative z-20 flex flex-1 flex-col p-5 sm:p-6">
          <ProductKicker product={product} showAvailability={false} />

          <motion.h3
            layoutId={`box-title-${product.id}`}
            className="mt-5 line-clamp-2 min-h-[2lh] overflow-hidden font-heading text-2xl/tight font-semibold tracking-wide text-[#211c18] uppercase dark:text-[#fffaf0]"
          >
            {product.name}
          </motion.h3>

          <p className="mt-3 line-clamp-2 min-h-[2lh] overflow-hidden text-sm/6 text-[#5f5147] dark:text-[#d7c9b5]">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#211c18]/10 pt-5 dark:border-[#fffaf0]/10">
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

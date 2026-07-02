'use client'

import {
  IconCalendarEvent,
  IconExternalLink,
  IconPackage,
  IconShoppingBag,
  IconX,
} from '@tabler/icons-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'
import { createPortal } from 'react-dom'

import { handleAddToCart } from '@/src/app/actions'
import { Button } from '@/src/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip'
import type { Product } from '@/src/lib/domain/types'
import {
  formatAvailability,
  formatCurrency,
  formatEditionMonth,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

export function getAvailabilityTone(availability: Product['availability']) {
  if (availability === 'available') {
    return 'border-[#9a662a]/38 bg-[#9a662a]/10 text-[#7c5323] dark:border-[#d7b56d]/45 dark:bg-[#2d2415]/80 dark:text-[#f4d891]'
  }
  if (availability === 'limited') {
    return 'border-[#b5332a]/42 bg-[#b5332a]/10 text-[#9f2d25] dark:border-[#d84132]/45 dark:bg-[#2c1713]/80 dark:text-[#ffb0a5]'
  }
  if (availability === 'coming_soon') {
    return 'border-[#211c18]/20 bg-[#211c18]/7 text-[#4f433b] dark:border-[#fffaf0]/24 dark:bg-[#fffaf0]/10 dark:text-[#fffaf0]'
  }
  return 'border-[#211c18]/16 bg-[#211c18]/6 text-[#5f5147] dark:border-[#fffaf0]/18 dark:bg-[#fffaf0]/8 dark:text-[#d7c9b5]'
}

export function AvailabilityBadge({
  product,
  className,
}: {
  product: Product
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase backdrop-blur-sm',
        getAvailabilityTone(product.availability),
        className,
      )}
    >
      {formatAvailability(product.availability)}
    </span>
  )
}

export function PriceBlock({
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
        <p className="text-xs text-[#5f5147]/70 line-through decoration-[#b5332a]/55 decoration-2 dark:text-[#d7c9b5]/68 dark:decoration-[#ffb0a5]/70">
          de {formatCurrency(product.price)}
        </p>
        <p className="text-xs font-semibold tracking-[0.16em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
          Assinante
        </p>
        <p
          className={cn(
            'font-heading leading-none font-semibold text-[#211c18] dark:text-[#fffaf0]',
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
        'font-heading leading-none font-semibold text-[#211c18] dark:text-[#fffaf0]',
        compact ? 'text-xl' : 'text-3xl',
      )}
    >
      {formatCurrency(displayPrice)}
    </p>
  )
}

export function DetailDatum({
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
      <div className="flex size-9 shrink-0 items-center justify-center border border-[#211c18]/14 bg-[#211c18]/7 text-[#8f6126] dark:border-[#fffaf0]/14 dark:bg-[#fffaf0]/7 dark:text-[#d7b56d]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-[#211c18] capitalize dark:text-[#fffaf0]">
          {value}
        </p>
      </div>
    </div>
  )
}

export function ProductKicker({
  product,
  showAvailability = true,
}: {
  product: Product
  showAvailability?: boolean
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <p className="border-l-2 border-[#b5332a] pl-3 text-xs font-semibold tracking-[0.2em] text-[#9f2d25] uppercase dark:border-[#d84132] dark:text-[#ffb0a5]">
        {product.type === 'box' ? 'Arquivo avulso' : 'Item especial'}
      </p>
      {showAvailability ? <AvailabilityBadge product={product} /> : null}
    </div>
  )
}

interface ProductQuickViewProps {
  product: Product
  titleId: string
  reduceMotion: boolean
  onClose: () => void
}

export function ProductQuickView({
  product,
  titleId,
  reduceMotion,
  onClose,
}: ProductQuickViewProps) {
  const productImage = getProductImage(product.images[0] ?? '')
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')
  const [isAdding, setIsAdding] = useState(false)

  const onAddToCart = async () => {
    if (!product.inStock || isAdding) return
    setIsAdding(true)
    try {
      await handleAddToCart(product.id)
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-100 flex items-start justify-center overflow-x-hidden overflow-y-auto p-3 py-8 sm:p-6 lg:items-center lg:overflow-hidden"
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
        className="absolute inset-0 cursor-default bg-[#211c18]/34 backdrop-blur-md dark:bg-[#090807]/82"
        onClick={onClose}
        aria-label="Fechar detalhes do produto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
      />

      <motion.article
        layoutId={`box-shell-${product.id}`}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden border border-[#211c18]/16 bg-[#fffaf2] text-[#211c18] shadow-[0_32px_90px_rgba(63,46,34,0.28)] lg:max-h-[calc(100vh-3rem)] lg:grid-cols-[0.9fr_1.1fr] dark:border-[#fffaf0]/16 dark:bg-[#0b0908] dark:text-[#fffaf0] dark:shadow-[0_32px_90px_rgba(0,0,0,0.58)]"
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }
        }
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(33,28,24,0.04)_1px,transparent_1px),linear-gradient(rgba(33,28,24,0.04)_1px,transparent_1px)] bg-size-[38px_38px] dark:bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)]" />
        <button
          type="button"
          onClick={onClose}
          className="fixed top-10 right-8 z-30 flex size-10 items-center justify-center border border-[#211c18]/18 bg-[#fffaf2]/82 text-[#211c18] backdrop-blur-sm transition hover:border-[#b5332a]/55 hover:bg-[#b5332a]/10 focus-visible:ring-2 focus-visible:ring-[#9a662a] focus-visible:outline-none sm:absolute sm:top-4 sm:right-4 dark:border-[#fffaf0]/18 dark:bg-[#090807]/76 dark:text-[#fffaf0] dark:hover:border-[#d84132]/55 dark:hover:bg-[#d84132]/20 dark:focus-visible:ring-[#d7b56d]"
          aria-label="Fechar"
        >
          <IconX className="size-5" />
        </button>

        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative min-h-[260px] overflow-hidden bg-[#efe4d4] sm:min-h-[360px] lg:min-h-[620px] dark:bg-[#171211]"
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 380, damping: 34, mass: 0.9 }
          }
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,241,236,0.02)_0%,rgba(33,28,24,0.34)_100%)] dark:bg-[linear-gradient(180deg,rgba(9,8,7,0.02)_0%,rgba(9,8,7,0.52)_100%)]" />
          <div className="absolute bottom-5 left-5 z-20 border border-[#211c18]/20 bg-[#fffaf2]/86 px-4 py-3 backdrop-blur-sm dark:border-[#fffaf0]/20 dark:bg-[#090807]/82">
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
              {product.type === 'box' ? 'Arquivo' : 'Item'}
            </p>
            <p className="font-heading text-4xl leading-none font-semibold text-[#211c18] dark:text-[#fffaf0]">
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
            className="mt-6 font-heading text-3xl/tight font-semibold tracking-wide text-[#211c18] uppercase sm:text-4xl dark:text-[#fffaf0]"
          >
            {product.name}
          </motion.h2>

          <div className="mt-5 grid gap-3 border-y border-[#211c18]/10 py-5 text-sm text-[#5f5147] sm:grid-cols-2 dark:border-[#fffaf0]/10 dark:text-[#d7c9b5]">
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

          <p className="mt-5 text-base/7 text-[#5f5147] dark:text-[#d7c9b5]">
            {product.description}
          </p>

          {product.includedItems?.length ? (
            <div className="mt-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8f6126] uppercase dark:text-[#d7b56d]">
                Conteúdo do arquivo
              </p>
              <ul className="mt-3 grid gap-2 text-sm/6 text-[#5f5147] dark:text-[#d7c9b5]">
                {product.includedItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 bg-[#b5332a] dark:bg-[#d84132]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 hidden flex-col gap-4 border-t border-[#211c18]/10 pt-6 lg:flex xl:flex-row xl:items-end xl:justify-between dark:border-[#fffaf0]/10">
            <PriceBlock product={product} />
            <div className="flex w-full gap-3 xl:w-auto xl:min-w-88">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="rounded-none border-[#211c18]/22 bg-[#211c18]/6 text-[#211c18] hover:bg-[#211c18]/10 hover:text-[#211c18] dark:border-[#fffaf0]/22 dark:bg-[#fffaf0]/6 dark:text-[#fffaf0] dark:hover:bg-[#fffaf0]/12 dark:hover:text-[#fffaf0]"
                    >
                      <Link
                        href={`/design-sugerido/loja/${product.slug}`}
                        aria-label="Ver página completa"
                      >
                        <IconExternalLink />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Ver página completa
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                disabled={!product.inStock || isAdding}
                onClick={onAddToCart}
                className="flex-1 rounded-none bg-[#b5332a] px-5 text-white hover:bg-[#982820] disabled:opacity-50 dark:bg-[#d84132] dark:hover:bg-[#b83227]"
              >
                <IconShoppingBag data-icon="inline-start" />
                {isAdding
                  ? 'Adicionando...'
                  : product.inStock
                    ? 'Adicionar ao carrinho'
                    : 'Esgotado'}
              </Button>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-3 bottom-3 z-40 border border-[#211c18]/16 bg-[#fffaf2]/94 p-3 shadow-[0_18px_48px_rgba(63,46,34,0.22)] backdrop-blur-md lg:hidden dark:border-[#fffaf0]/16 dark:bg-[#090807]/92 dark:shadow-[0_18px_48px_rgba(0,0,0,0.45)]">
          <div className="flex items-end justify-between gap-3">
            <PriceBlock product={product} compact />
            <div className="flex shrink-0 gap-2">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="rounded-none border-[#211c18]/22 bg-[#211c18]/6 text-[#211c18] hover:bg-[#211c18]/10 hover:text-[#211c18] dark:border-[#fffaf0]/22 dark:bg-[#fffaf0]/6 dark:text-[#fffaf0] dark:hover:bg-[#fffaf0]/12 dark:hover:text-[#fffaf0]"
                    >
                      <Link
                        href={`/design-sugerido/loja/${product.slug}`}
                        aria-label="Ver página completa"
                      >
                        <IconExternalLink />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Ver página completa
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                size="icon"
                disabled={!product.inStock || isAdding}
                onClick={onAddToCart}
                className="rounded-none bg-[#b5332a] text-white hover:bg-[#982820] disabled:opacity-50 dark:bg-[#d84132] dark:hover:bg-[#b83227]"
                aria-label={
                  isAdding
                    ? 'Adicionando ao carrinho'
                    : product.inStock
                      ? 'Adicionar ao carrinho'
                      : 'Produto esgotado'
                }
              >
                <IconShoppingBag />
              </Button>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  )
}

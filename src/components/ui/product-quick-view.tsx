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

import { Button } from '@/src/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip'
import {
  cardShadowBase,
  fontHeading,
  fontMono,
  fontType,
} from '@/src/lib/design/classes'
import { designTokens } from '@/src/lib/design/tokens'
import { addCartItem } from '@/src/lib/domain/repositories'
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
    return 'border-[#9a662a]/38 bg-[#9a662a]/10 text-[#7c5323]'
  }
  if (availability === 'limited') {
    return 'border-[#b5332a]/42 bg-[#b5332a]/10 text-[#9f2d25]'
  }
  if (availability === 'coming_soon') {
    return 'border-[#211c18]/20 bg-[#211c18]/7 text-[#4f433b]'
  }
  return 'border-[#211c18]/16 bg-[#211c18]/6 text-(--ink-soft)'
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
        `inline-flex shrink-0 items-center rounded-[2px] border px-3 py-1 text-xs tracking-[0.14em] uppercase backdrop-blur-[2px] ${fontType}`,
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
        <p className="text-xs text-(--ink-soft)/70 line-through decoration-[#b5332a]/55 decoration-2">
          de {formatCurrency(product.price)}
        </p>
        <p className="text-xs font-semibold tracking-[0.16em] text-(--amber) uppercase">
          Assinante
        </p>
        <p
          className={cn(
            `leading-none font-semibold text-(--ink) ${fontHeading}`,
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
        `leading-none font-semibold text-(--ink) ${fontHeading}`,
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
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-[#211c18]/14 bg-[#211c18]/7 text-(--amber)">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-(--amber) uppercase">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-[#211c18] capitalize">
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
      <p
        className={`inline-flex items-center gap-2 text-xs tracking-[0.16em] text-[#9f2d25] uppercase before:h-px before:w-5 before:bg-current before:content-[''] ${fontType}`}
      >
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
      await addCartItem({ productId: product.id })
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
      transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
      style={designTokens}
    >
      <motion.button
        type="button"
        className="absolute inset-0 cursor-default bg-[#211c18]/34 backdrop-blur-md"
        onClick={onClose}
        aria-label="Fechar detalhes do produto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
      />

      <motion.article
        layoutId={`box-shell-${product.id}`}
        className={`relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.16)] bg-(--card) text-(--ink) ${cardShadowBase} lg:max-h-[calc(100vh-3rem)] lg:grid-cols-[0.9fr_1.1fr]`}
        initial={reduceMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
        exit={reduceMotion ? {} : { opacity: 0, scale: 0.95 }}
        transition={
          reduceMotion
            ? { duration: 0.01 }
            : { type: 'tween', duration: 0.3, ease: 'easeOut' }
        }
      >
        <div
          className={`absolute top-0 left-8 z-30 inline-flex -translate-y-px items-center gap-[10px] rounded-b-[10px] border border-t-0 border-[rgba(33,28,24,0.18)] bg-(--paper-soft) px-[18px] py-[9px] pt-[11px] text-[11px] tracking-[0.14em] text-(--ink) uppercase ${fontType}`}
        >
          <span className="font-bold text-(--red)">
            {product.type === 'box' ? `BOX-${evidenceNumber}` : 'ITEM'}
          </span>
          ficha rápida
        </div>
        <span
          className="absolute top-[22px] right-20 z-30 size-[14px] rounded-full shadow-[0_3px_5px_rgba(33,28,24,0.45),inset_0_-2px_3px_rgba(0,0,0,0.3)] [background:radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.7)_0%,var(--red)_55%,rgba(0,0,0,0.4)_100%)]"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={onClose}
          className="fixed top-10 right-8 z-30 flex size-10 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.18)] bg-(--card)/88 text-(--ink) backdrop-blur-[2px] transition hover:border-(--red)/55 hover:bg-(--red)/10 focus-visible:ring-2 focus-visible:ring-(--amber) focus-visible:outline-none sm:absolute sm:top-4 sm:right-4"
          aria-label="Fechar"
        >
          <IconX className="size-5" />
        </button>

        <motion.div
          layoutId={`box-image-${product.id}`}
          className="relative min-h-[260px] overflow-hidden bg-(--paper-soft) sm:min-h-[360px] lg:min-h-[620px]"
          transition={
            reduceMotion
              ? { duration: 0.01 }
              : { type: 'tween', duration: 0.3, ease: 'easeOut' }
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,241,236,0.02)_0%,rgba(33,28,24,0.22)_100%)]" />
          <div className="absolute bottom-5 left-5 z-20 rounded-[10px] border border-[rgba(33,28,24,0.2)] bg-(--paper-soft)/90 px-4 py-3 backdrop-blur-[2px]">
            <p
              className={`text-[0.68rem] tracking-[0.18em] text-(--amber) uppercase ${fontType}`}
            >
              {product.type === 'box' ? 'Arquivo' : 'Item'}
            </p>
            <p
              className={`text-4xl leading-none font-semibold text-(--ink) ${fontHeading}`}
            >
              {evidenceNumber}
            </p>
          </div>
        </motion.div>

        <div className="relative z-20 flex flex-col bg-(--card) p-5 pb-32 sm:p-7 sm:pb-32 lg:h-full lg:min-h-0 lg:p-0">
          <div className="min-h-0 flex-1 lg:overflow-y-auto lg:p-9 lg:pb-6">
            <div className="pr-14 sm:pr-16">
              <ProductKicker product={product} showAvailability={false} />
            </div>

            <motion.h2
              id={titleId}
              layoutId={`box-title-${product.id}`}
              className={`mt-6 text-3xl/tight font-semibold tracking-[-0.015em] text-(--ink) sm:text-4xl ${fontHeading}`}
              transition={
                reduceMotion
                  ? { duration: 0.01 }
                  : { type: 'tween', duration: 0.3, ease: 'easeOut' }
              }
            >
              {product.name}
            </motion.h2>

            <div className="mt-5 grid gap-3 border-y border-[rgba(33,28,24,0.1)] py-5 text-sm text-(--ink-soft) sm:grid-cols-2">
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

            <p className="mt-5 text-base/7 text-(--ink-soft)">
              {product.description}
            </p>

            {product.includedItems?.length ? (
              <div className="mt-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-(--amber) uppercase">
                  Conteúdo do arquivo
                </p>
                <ul className="mt-3 grid gap-2 text-sm/6 text-(--ink-soft)">
                  {product.includedItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 bg-[#b5332a]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-auto hidden shrink-0 flex-col gap-4 border-t border-[rgba(33,28,24,0.1)] px-9 pt-6 pb-9 lg:flex xl:flex-row xl:items-end xl:justify-between">
            <PriceBlock product={product} />
            <div className="flex w-full gap-3 xl:w-auto xl:min-w-88">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      size="icon"
                      variant="outline"
                      className="rounded-[10px] border-[rgba(33,28,24,0.22)] bg-[rgba(33,28,24,0.06)] text-(--ink) hover:bg-[rgba(33,28,24,0.1)] hover:text-(--ink)"
                    >
                      <Link
                        href={`/loja/${product.slug}`}
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
                className={`flex-1 rounded-[10px] bg-[#b5332a] px-5 text-white hover:bg-[#982820] disabled:opacity-50 ${fontMono}`}
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

        <div className="fixed inset-x-3 bottom-3 z-40 rounded-[14px_14px_16px_16px] border border-[rgba(33,28,24,0.16)] bg-(--card)/94 p-3 shadow-[0_18px_48px_rgba(63,46,34,0.22)] backdrop-blur-md lg:hidden">
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
                      className="rounded-[10px] border-[rgba(33,28,24,0.22)] bg-[rgba(33,28,24,0.06)] text-(--ink) hover:bg-[rgba(33,28,24,0.1)] hover:text-(--ink)"
                    >
                      <Link
                        href={`/loja/${product.slug}`}
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
                className="rounded-[10px] bg-[#b5332a] text-white hover:bg-[#982820] disabled:opacity-50"
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

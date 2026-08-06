'use client'

import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
import Image from 'next/image'

import { PriceBlock } from '@/src/components/ui/product-quick-view'
import {
  arrowIconClass,
  fontHeading,
  fontMono,
  fontType,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { getPrimaryProductImageUrl, type Product } from '@/src/lib/domain/types'
import { formatAvailability, formatEditionMonth } from '@/src/lib/formatters'
import {
  isStaticProductImage,
  resolveProductImageSrc,
} from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

export interface ProductArchiveCardProps {
  product: Product
  variant: 'box' | 'extra'
  onOpen: () => void
}

export function ProductArchiveCard({
  product,
  variant,
  onOpen,
}: ProductArchiveCardProps) {
  const productImage = resolveProductImageSrc(getPrimaryProductImageUrl(product))
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')
  const tabCode = variant === 'box' ? `BOX ${evidenceNumber}` : 'ITEM'
  const tabLabel = variant === 'box' ? 'Arquivo avulso' : 'Peça extra'
  const detailLabel = product.editionMonth
    ? formatEditionMonth(product.editionMonth)
    : (product.categories[0] ?? 'produto')
  const mobileDetailLabel = product.editionMonth
    ? `${product.editionMonth.slice(5, 7)}/${product.editionMonth.slice(0, 4)}`
    : detailLabel
  const backingRotation =
    variant === 'box' ? 'rotate-[2.5deg]' : 'rotate-[-2.2deg]'
  const tabRotation =
    variant === 'box'
      ? 'rotate-[2.5deg] origin-bottom-right right-4'
      : 'rotate-[-2.5deg] origin-bottom-left left-4'

  return (
    <article
      className={cn(
        'group relative block size-full pt-5 sm:pt-[25px]',
        transitionCardHover,
        'motion-reduce:transition-none',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-x-0 top-5 bottom-0 z-0 translate-y-[-3px] rounded-[10px] bg-(--yellow) shadow-[0_14px_26px_-14px_rgba(33,28,24,0.4)] sm:top-[25px]',
          backingRotation,
        )}
      >
        <span className="sr-only">folha de arquivo</span>
      </div>

      <div
        className={cn(
          `absolute top-0 z-0 inline-flex items-center gap-1.5 rounded-t-[8px] bg-(--yellow) px-3 pt-1.5 pb-5 text-[8.5px] tracking-wider text-(--ink) uppercase shadow-[0_6px_14px_-8px_rgba(33,28,24,0.4)] sm:gap-2 sm:px-[15px] sm:pb-6 sm:text-[9.5px] ${fontType}`,
          tabRotation,
        )}
      >
        <span className="font-bold text-(--red)">{tabCode}</span>
        <span className="hidden sm:inline">{tabLabel}</span>
      </div>

      <div
        className={cn(
          'relative z-10 flex h-full flex-col overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) shadow-[0_9px_22px_-8px_rgba(33,28,24,0.35),inset_0_0_0_1px_rgba(255,255,255,0.5)]',
          transitionCardHover,
          'group-hover:translate-y-[-5px] group-hover:shadow-[0_20px_36px_-14px_rgba(33,28,24,0.45),inset_0_0_0_1px_rgba(255,255,255,0.6)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
        )}
      >
        <button
          type="button"
          onClick={onOpen}
          className="absolute inset-0 z-10 cursor-pointer appearance-none border-0 bg-transparent focus-visible:ring-2 focus-visible:ring-(--red) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper) focus-visible:outline-none"
          aria-label={`Ver detalhes de ${product.name}`}
        />

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-2 right-2 z-20 rotate-[-9deg] border-2 border-[rgba(94,94,162,0.85)] bg-[rgba(251,249,246,0.65)] px-2 py-1 pb-1.5 text-[9px] font-bold tracking-[0.12em] text-[rgba(94,94,162,0.95)] uppercase shadow-[inset_0_0_0_1px_rgba(94,94,162,0.4)] backdrop-blur-[2px] sm:top-[10px] sm:right-[10px] sm:px-[9px] sm:py-[5px] sm:pb-1.5 sm:text-[9.5px] sm:tracking-[0.14em] ${fontType}`}
        >
          {formatAvailability(product.availability)}
        </div>

        <div className="pointer-events-none relative aspect-square w-full shrink-0 overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card)">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              unoptimized={!isStaticProductImage(productImage)}
              placeholder={
                isStaticProductImage(productImage) ? 'blur' : undefined
              }
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <EvidencePlaceholder product={product} />
          )}
        </div>

        <div className="pointer-events-none relative z-20 flex w-full flex-1 flex-col px-3 pt-3 pb-3.5 sm:px-4 sm:pt-4 sm:pb-[18px]">
          <div
            className={`mb-1 text-[9px] leading-tight tracking-wider text-(--ink-mute) uppercase sm:mb-[5px] sm:text-[10.5px] sm:tracking-[0.06em] ${fontType}`}
          >
            <span className="sm:hidden">{mobileDetailLabel}</span>
            <span className="hidden sm:inline">{detailLabel}</span>
          </div>
          <h3
            className={`m-0 mb-2 line-clamp-2 overflow-hidden text-[15px] leading-[1.15] font-semibold text-(--ink) sm:mb-3 sm:min-h-[2.24em] sm:text-[16.5px] sm:leading-[1.12] ${fontHeading}`}
          >
            {product.name}
          </h3>
          <p className="line-clamp-2 overflow-hidden text-[13px] leading-normal text-(--ink-soft) sm:min-h-[3em]">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex w-full flex-col gap-2.5 pt-4 min-[480px]:flex-row min-[480px]:items-end min-[480px]:justify-between min-[480px]:gap-[10px] min-[480px]:pt-5">
            <div className="[&_p:last-child]:text-[17px] min-[480px]:[&_p:last-child]:text-xl">
              <PriceBlock product={product} compact />
            </div>
            <div className="pointer-events-auto relative z-30 flex w-full shrink-0 min-[480px]:w-auto">
              <button
                type="button"
                onClick={onOpen}
                className={`inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[rgba(33,28,24,0.18)] bg-(--yellow) px-3 text-[10px] leading-none font-bold tracking-[0.04em] text-(--ink) uppercase transition hover:bg-(--amber) focus-visible:ring-2 focus-visible:ring-(--red) focus-visible:outline-none min-[480px]:min-h-0 min-[480px]:w-auto min-[480px]:px-[13px] min-[480px]:py-[9px] min-[480px]:text-[11px] ${fontMono}`}
              >
                Ver
                <IconArrowRight className={cn('size-4', arrowIconClass)} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
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

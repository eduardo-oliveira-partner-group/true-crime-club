'use client'

import {
  IconChevronLeft,
  IconChevronRight,
  IconSparkles,
} from '@tabler/icons-react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { fontType, transitionBgColor } from '@/src/lib/design/classes'
import { getPrimaryProductImageUrl, type Product } from '@/src/lib/domain/types'
import {
  isStaticProductImage,
  resolveProductImageSrc,
} from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

interface ProductDetailGalleryProps {
  product: Product
  /** Layout compacto para o quick view do card. */
  variant?: 'detail' | 'quick-view'
}

export function ProductDetailGallery({
  product,
  variant = 'detail',
}: ProductDetailGalleryProps) {
  const images = product.images
  const initialIndex = Math.max(
    0,
    images.findIndex(
      (image) => image.url === getPrimaryProductImageUrl(product),
    ),
  )
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex === -1 ? 0 : initialIndex,
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const [mainRef, mainApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
  })
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const syncState = useCallback(() => {
    if (!mainApi) return
    const index = mainApi.selectedScrollSnap()
    setSelectedIndex(index)
    setCanScrollPrev(mainApi.canScrollPrev())
    setCanScrollNext(mainApi.canScrollNext())
    thumbsApi?.scrollTo(index)
  }, [mainApi, thumbsApi])

  useEffect(() => {
    const nextIndex = Math.max(
      0,
      images.findIndex(
        (image) => image.url === getPrimaryProductImageUrl(product),
      ),
    )
    setSelectedIndex(nextIndex === -1 ? 0 : nextIndex)
    mainApi?.scrollTo(nextIndex === -1 ? 0 : nextIndex, true)
  }, [product, images, mainApi])

  useEffect(() => {
    if (!mainApi) return
    syncState()
    mainApi.on('select', syncState)
    mainApi.on('reInit', syncState)
    return () => {
      mainApi.off('select', syncState)
      mainApi.off('reInit', syncState)
    }
  }, [mainApi, syncState])

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi])
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi])

  const onThumbClick = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index)
      setSelectedIndex(index)
    },
    [mainApi],
  )

  const isQuickView = variant === 'quick-view'
  const hasMultiple = images.length > 1

  return (
    <div
      className={cn(
        isQuickView
          ? 'relative flex h-full min-h-[320px] min-w-0 flex-col overflow-hidden bg-(--paper-soft) sm:min-h-[400px] lg:min-h-[620px]'
          : 'relative',
      )}
    >
      <div
        className={cn(
          'relative min-h-0 overflow-hidden bg-(--card)',
          isQuickView
            ? 'flex-1'
            : 'aspect-square rounded-t-[14px] border-b border-[rgba(33,28,24,0.15)] lg:rounded-tr-none lg:rounded-bl-[14px] lg:border-b-0',
        )}
      >
        <div ref={mainRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {images.length > 0 ? (
              images.map((productImage, index) => {
                const src = resolveProductImageSrc(productImage.url)

                return (
                  <div
                    key={productImage.url}
                    className="relative h-full min-w-0 shrink-0 grow-0 basis-full"
                  >
                    {src ? (
                      <Image
                        src={src}
                        alt={`${product.name} — imagem ${index + 1}`}
                        fill
                        priority={index === 0}
                        placeholder={
                          isStaticProductImage(src) ? 'blur' : undefined
                        }
                        sizes={
                          isQuickView
                            ? '(max-width: 1024px) 100vw, 520px'
                            : '(max-width: 1024px) 100vw, 560px'
                        }
                        className="object-cover object-center"
                      />
                    ) : (
                      <EvidencePlaceholder product={product} />
                    )}
                  </div>
                )
              })
            ) : (
              <div className="relative h-full min-w-0 shrink-0 grow-0 basis-full">
                <EvidencePlaceholder product={product} />
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(33,28,24,0.01)_0%,rgba(33,28,24,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[34px_34px]" />

        {hasMultiple ? (
          <>
            <CarouselNavButton
              direction="prev"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute top-1/2 left-3 z-20 -translate-y-1/2"
            />
            <CarouselNavButton
              direction="next"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute top-1/2 right-3 z-20 -translate-y-1/2"
            />
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <ProductImageThumbnails
          product={product}
          selectedIndex={selectedIndex}
          onSelect={onThumbClick}
          thumbsRef={thumbsRef}
          isQuickView={isQuickView}
        />
      ) : null}
    </div>
  )
}

function ProductImageThumbnails({
  product,
  selectedIndex,
  onSelect,
  thumbsRef,
  isQuickView,
}: {
  product: Product
  selectedIndex: number
  onSelect: (index: number) => void
  thumbsRef: ReturnType<typeof useEmblaCarousel>[0]
  isQuickView: boolean
}) {
  return (
    <div
      className={cn(
        // Mobile: abaixo da imagem principal
        'relative mt-3',
        isQuickView ? 'shrink-0 px-3 pb-3' : 'mb-4 px-4 sm:px-5 md:mb-0',
        // Desktop+: overlay sobre a imagem
        'md:absolute md:inset-x-4 md:bottom-4 md:z-20 md:mt-0 md:rounded-[10px] md:border md:border-[rgba(33,28,24,0.12)] md:bg-(--paper)/45 md:p-2 md:backdrop-blur-[3px]',
      )}
    >
      <div ref={thumbsRef} className="overflow-hidden">
        <div className="flex gap-2">
          {product.images.map((productImage, index) => {
            const image = resolveProductImageSrc(productImage.url)
            if (!image) return null

            const selected = index === selectedIndex

            return (
              <button
                key={productImage.url}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                aria-pressed={selected}
                className={cn(
                  'relative size-12 shrink-0 overflow-hidden rounded-[9px] border bg-(--card)/90 focus-visible:ring-2 focus-visible:ring-(--amber) focus-visible:outline-none sm:size-14',
                  transitionBgColor,
                  selected
                    ? 'border-(--red) ring-2 ring-(--red)/25'
                    : 'border-[rgba(33,28,24,0.15)] hover:border-(--red)/45',
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} — imagem ${index + 1}`}
                  fill
                  placeholder={isStaticProductImage(image) ? 'blur' : undefined}
                  sizes="56px"
                  className="object-cover object-center"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CarouselNavButton({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  const Icon = direction === 'prev' ? IconChevronLeft : IconChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Imagem anterior' : 'Próxima imagem'}
      className={cn(
        'flex size-9 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.18)] bg-(--paper)/88 text-(--ink) backdrop-blur-[2px] transition hover:border-(--red)/55 hover:bg-(--red)/10 focus-visible:ring-2 focus-visible:ring-(--amber) focus-visible:outline-none disabled:pointer-events-none disabled:opacity-35',
        className,
      )}
    >
      <Icon className="size-4" />
    </button>
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

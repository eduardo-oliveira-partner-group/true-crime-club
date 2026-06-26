import { IconSparkles } from '@tabler/icons-react'
import Image from 'next/image'

import type { Product } from '@/src/lib/domain/types'
import { getProductImage } from '@/src/lib/product-images'

interface ProductDetailGalleryProps {
  product: Product
}

export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
  const primaryImage = getProductImage(product.images[0] ?? '')
  const evidenceNumber = String(product.cycleNumber ?? 0).padStart(2, '0')

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden border-b border-[#fffaf0]/14 bg-[#171211] lg:border-b-0">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            priority
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover object-center"
          />
        ) : (
          <EvidencePlaceholder product={product} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.02)_0%,rgba(9,8,7,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[34px_34px]" />

        {product.type === 'box' ? (
          <div className="absolute top-5 left-5 border border-[#fffaf0]/20 bg-[#090807]/82 px-4 py-3 backdrop-blur-sm">
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
              Arquivo
            </p>
            <p className="font-heading text-4xl leading-none font-semibold text-[#fffaf0]">
              {evidenceNumber}
            </p>
          </div>
        ) : null}
      </div>

      {product.images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {product.images.slice(0, 4).map((imagePath, index) => {
            const image = getProductImage(imagePath)
            if (!image) return null

            return (
              <div
                key={imagePath}
                className="relative aspect-square overflow-hidden border border-[#fffaf0]/14 bg-[#171211]"
              >
                <Image
                  src={image}
                  alt={`${product.name} — imagem ${index + 1}`}
                  fill
                  placeholder="blur"
                  sizes="120px"
                  className="object-cover object-center"
                />
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function EvidencePlaceholder({ product }: { product: Product }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#120f0d]">
      <div className="absolute inset-6 border border-[#d7b56d]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(216,65,50,0.16),transparent_28%),radial-gradient(circle_at_48%_58%,rgba(215,181,109,0.12),transparent_32%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <IconSparkles className="size-9 text-[#d7b56d]" />
        <p className="mt-3 max-w-44 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] uppercase">
          {product.categories[0] ?? 'item'} do arquivo
        </p>
      </div>
    </div>
  )
}

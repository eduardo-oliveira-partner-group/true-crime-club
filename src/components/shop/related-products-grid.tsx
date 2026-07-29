'use client'

import { useState } from 'react'

import { ProductArchiveCard } from '@/src/components/shop/product-archive-card'
import { ProductQuickView } from '@/src/components/ui/product-quick-view'
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import type { Product } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

interface RelatedProductsGridProps {
  products: Product[]
}

function isOutOfStock(product: Product) {
  return (
    product.availability === 'out_of_stock' ||
    (!product.inStock && product.availability !== 'coming_soon')
  )
}

function isDimmed(product: Product) {
  return isOutOfStock(product) || product.availability === 'coming_soon'
}

export function RelatedProductsGrid({ products }: RelatedProductsGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (products.length === 0) return null

  return (
    <>
      <ScrollRevealGroup
        className="grid grid-cols-2 items-stretch gap-x-4 gap-y-7 sm:gap-[30px] lg:grid-cols-3"
        staggerChildren={0.08}
        amount={0.05}
      >
        {products.map((product) => {
          const dimmed = isDimmed(product)
          return (
            <ScrollRevealItem
              key={product.id}
              className={cn('h-full', dimmed && 'grayscale-[0.25]')}
              opacity={dimmed ? 0.45 : 1}
            >
              <ProductArchiveCard
                product={product}
                variant={product.type === 'box' ? 'box' : 'extra'}
                onOpen={() => setSelectedProduct(product)}
              />
            </ScrollRevealItem>
          )
        })}
      </ScrollRevealGroup>

      <ProductQuickView
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null)
        }}
      />
    </>
  )
}

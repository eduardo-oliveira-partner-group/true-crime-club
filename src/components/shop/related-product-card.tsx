import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { DossierCard } from '@/src/components/public-design/dossier-card'
import {
  AvailabilityBadge,
  PriceBlock,
} from '@/src/components/ui/product-quick-view'
import {
  arrowIconClass,
  fontHeading,
  fontType,
  transitionCardHover,
} from '@/src/lib/design/classes'
import type { Product } from '@/src/lib/domain/types'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

interface RelatedProductCardProps {
  product: Product
}

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const productImage = getProductImage(product.images[0] ?? '')

  return (
    <Link
      href={`/loja/${product.slug}`}
      className={cn(
        'group block focus-visible:ring-2 focus-visible:ring-(--red) focus-visible:outline-none',
        transitionCardHover,
        'hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      <DossierCard
        tabCode={product.type === 'box' ? 'BOX' : 'ITEM'}
        tabLabel="relacionado"
        showPin
        pinColor={product.type === 'box' ? 'var(--red)' : 'var(--teal)'}
        className="overflow-hidden p-0"
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-t-[14px] border-b border-[rgba(33,28,24,0.15)] bg-(--card)">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 bg-(--card)" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,16,20,0.03)_0%,rgba(14,16,20,0.55)_100%)]" />
          <AvailabilityBadge
            product={product}
            className="absolute right-4 bottom-4"
          />
        </div>
        <div className="p-5">
          <p
            className={`text-[0.65rem] tracking-[0.14em] text-(--red) uppercase ${fontType}`}
          >
            {product.type === 'box' ? 'Box avulsa' : 'Item complementar'}
          </p>
          <h3
            className={`mt-2 line-clamp-2 text-xl/tight font-semibold text-(--ink) ${fontHeading}`}
          >
            {product.name}
          </h3>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-[rgba(33,28,24,0.15)] pt-4">
            <PriceBlock product={product} compact />
            <span className="inline-flex size-10 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--red) text-[#fbf9f6] transition group-hover:bg-(--red-deep)">
              <IconArrowRight className={cn('size-4', arrowIconClass)} />
            </span>
          </div>
        </div>
      </DossierCard>
    </Link>
  )
}

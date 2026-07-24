import { IconArrowRight, IconSparkles } from '@tabler/icons-react'
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
          )}
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

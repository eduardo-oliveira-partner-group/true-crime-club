import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import {
  AvailabilityBadge,
  PriceBlock,
} from '@/src/components/ui/product-quick-view'
import type { Product } from '@/src/lib/domain/types'
import { getProductImage } from '@/src/lib/product-images'

interface RelatedProductCardProps {
  product: Product
}

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const productImage = getProductImage(product.images[0] ?? '')

  return (
    <Link
      href={`${typeof window !== 'undefined' && window.location.pathname.startsWith('/design-sugerido') ? '/design-sugerido' : ''}/loja/${product.slug}`}
      className="group block border border-[#fffaf0]/14 bg-[#090807] p-0 shadow-[0_20px_48px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-[#d7b56d]/35 focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:outline-none"
    >
      <div className="relative aspect-4/3 overflow-hidden border-b border-[#fffaf0]/14 bg-[#171211]">
        {productImage ? (
          <Image
            src={productImage}
            alt={product.name}
            fill
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-[#120f0d]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.05)_0%,rgba(9,8,7,0.62)_100%)]" />
        <AvailabilityBadge
          product={product}
          className="absolute right-4 bottom-4"
        />
      </div>
      <div className="p-5">
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
          {product.type === 'box' ? 'Box avulsa' : 'Item complementar'}
        </p>
        <h3 className="mt-2 line-clamp-2 font-heading text-xl/tight font-semibold tracking-wide text-[#fffaf0] uppercase">
          {product.name}
        </h3>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#fffaf0]/10 pt-4">
          <PriceBlock product={product} compact />
          <span className="inline-flex size-10 items-center justify-center border border-[#fffaf0]/22 bg-[#fffaf0]/6 text-[#fffaf0] transition group-hover:bg-[#fffaf0]/12">
            <IconArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

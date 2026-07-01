import Link from 'next/link'

import { PriceBlock } from '@/src/components/ui/product-quick-view'
import type { Product } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

interface ProductDetailPricingProps {
  product: Product
  className?: string
  variant?: 'panel' | 'inline'
}

export function ProductDetailPricing({
  product,
  className,
  variant = 'panel',
}: ProductDetailPricingProps) {
  return (
    <div
      className={cn(
        variant === 'panel' &&
          'border border-[rgba(33,28,24,0.15)] bg-(--paper-soft)/92 p-5 shadow-[0_18px_40px_rgba(33,28,24,0.32)] sm:p-6',
        variant === 'inline' && 'border-t border-[rgba(33,28,24,0.15)] pt-6',
        className,
      )}
    >
      {variant === 'panel' ? (
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
          Valor do arquivo
        </p>
      ) : null}
      <PriceBlock product={product} />
      {product.subscriberPrice ? (
        <p className="mt-4 text-sm/6 text-(--ink-soft)">
          Assinantes do clube têm preço reduzido.{' '}
          <Link
            href="/assinatura"
            className="font-medium text-(--red) underline-offset-4 transition hover:text-[#f4d891] hover:underline"
          >
            Conheça os planos
          </Link>
          .
        </p>
      ) : null}
    </div>
  )
}

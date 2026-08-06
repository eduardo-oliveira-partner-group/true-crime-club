import { IconPackage } from '@tabler/icons-react'
import Image from 'next/image'

import type { CheckoutOrderSummaryItem } from '@/src/components/checkout/checkout-flow/types'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { formatCurrency } from '@/src/lib/formatters'
import {
  isStaticProductImage,
  resolveProductImageSrc,
} from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

interface OrderSummaryProps {
  isSubscriptionFlow: boolean
  isAnnualSubscription: boolean
  planName?: string
  planPrice?: number
  items: CheckoutOrderSummaryItem[]
  subtotalAmount: number
  discountAmount: number
  shippingPrice: number
  shippingLoading: boolean
  shippingQuoted: boolean
  totalAmount: number
  installmentsCount: number
  installmentValue: number
}

export function CheckoutOrderSummary({
  isSubscriptionFlow,
  isAnnualSubscription,
  planName,
  planPrice,
  items,
  subtotalAmount,
  discountAmount,
  shippingPrice,
  shippingLoading,
  shippingQuoted,
  totalAmount,
  installmentsCount,
  installmentValue,
}: OrderSummaryProps) {
  const hasItems = (isSubscriptionFlow && planName != null) || items.length > 0
  const shippingValueLabel = shippingLoading
    ? 'Calculando…'
    : shippingQuoted
      ? formatCurrency(shippingPrice)
      : 'A calcular'

  return (
    <section
      className={cn(
        dossierCardSurface,
        warmShadowClass,
        'overflow-hidden bg-(--card)',
      )}
    >
      <div className="border-b border-dashed border-[rgba(33,28,24,0.18)] p-5 sm:p-6">
        <p
          className={cn(
            fontMono,
            'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
          )}
        >
          Resumo do pedido
        </p>
      </div>

      <div className="space-y-5 p-5 text-sm sm:p-6">
        <div className="space-y-3">
          {hasItems ? (
            <ul className="space-y-2.5 text-(--ink-soft)">
              {isSubscriptionFlow && planName ? (
                <li className="flex flex-col gap-0.5">
                  <div className="flex justify-between gap-4">
                    <span className="min-w-0 truncate text-(--ink)">
                      {planName}
                    </span>
                    <span className="shrink-0 font-medium text-(--ink)">
                      {formatCurrency(planPrice ?? 0)}
                      {isAnnualSubscription ? (
                        <span className="text-(--ink-mute)">/mês</span>
                      ) : null}
                    </span>
                  </div>
                  <span className="text-xs text-(--ink-mute)">
                    Assinatura
                    {isAnnualSubscription ? ' · cobrada anualmente' : ''}
                  </span>
                </li>
              ) : null}
              {items.map((item) => {
                const productImage = resolveProductImageSrc(item.image ?? '')

                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-[8px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft)">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt=""
                          fill
                          unoptimized={!isStaticProductImage(productImage)}
                          placeholder={
                            isStaticProductImage(productImage)
                              ? 'blur'
                              : undefined
                          }
                          sizes="48px"
                          className="object-cover object-center"
                        />
                      ) : (
                        <IconPackage
                          className="absolute inset-0 m-auto size-5 text-(--red)/50"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-(--ink)">
                      {item.label}
                    </span>
                    <span className="shrink-0 font-medium text-(--ink)">
                      {item.value}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-(--ink-soft)">Nenhum item selecionado.</p>
          )}
        </div>

        <div className="space-y-2.5 border-t border-dashed border-[rgba(33,28,24,0.18)] pt-4 text-(--ink-soft)">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span className="text-(--ink)">
              {formatCurrency(subtotalAmount)}
            </span>
          </div>

          {discountAmount > 0 ? (
            <div className="flex justify-between gap-4 rounded-[8px] border border-[rgba(26,165,135,0.18)] bg-[rgba(26,165,135,0.06)] px-2.5 py-2 font-semibold text-(--teal-deep)">
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-(--teal)"
                  aria-hidden
                />
                <span className="truncate">Desconto</span>
              </span>
              <span className="shrink-0">
                − {formatCurrency(discountAmount)}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between gap-4">
            <span>Frete</span>
            <span
              className={cn(
                'text-(--ink)',
                !shippingQuoted && !shippingLoading && 'text-(--ink-mute)',
              )}
            >
              {shippingValueLabel}
            </span>
          </div>
        </div>

        <div className="border-t border-[rgba(33,28,24,0.15)] pt-4">
          {installmentsCount > 1 ? (
            <div className="space-y-2">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-0.5">
                  <span
                    className={cn(
                      fontMono,
                      'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                    )}
                  >
                    Parcelas
                  </span>
                  <p className="text-[0.7rem] text-(--ink-mute)">
                    {installmentsCount}x sem juros
                    {!shippingQuoted && !shippingLoading ? ' · sem frete' : ''}
                  </p>
                </div>
                <span
                  className={cn(
                    fontHeading,
                    'text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-(--ink)',
                  )}
                >
                  {formatCurrency(installmentValue)}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-[rgba(33,28,24,0.18)] pt-2 text-xs text-(--ink-mute)">
                <span>Total à vista</span>
                <span className="font-semibold text-(--ink-soft)">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-0.5">
                <span
                  className={cn(
                    fontMono,
                    'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                  )}
                >
                  Total
                </span>
                {!shippingQuoted && !shippingLoading ? (
                  <p className="text-[0.7rem] text-(--ink-mute)">
                    Sem frete ainda
                  </p>
                ) : null}
              </div>
              <span
                className={cn(
                  fontHeading,
                  'text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-(--ink)',
                )}
              >
                {formatCurrency(totalAmount)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

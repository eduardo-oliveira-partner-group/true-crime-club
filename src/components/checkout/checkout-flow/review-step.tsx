import { IconCircleCheck } from '@tabler/icons-react'

import { CheckoutSection } from '@/src/components/checkout/checkout-flow/checkout-section'
import type {
  CheckoutPaymentOption,
  CheckoutShippingOption,
  SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-flow/types'
import { fontMono } from '@/src/lib/design/classes'
import type { Address } from '@/src/lib/domain/types'
import { formatBusinessDays, formatCurrency } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

interface ReviewStepProps {
  address?: Address
  shipping?: CheckoutShippingOption
  payment?: CheckoutPaymentOption
  preferences: SubscriberPreferencesValue
  installments: number
  totalAmount: number
  error: string | null
}

export function ReviewStep({
  address,
  shipping,
  payment,
  preferences,
  installments,
  totalAmount,
  error,
}: ReviewStepProps) {
  const preferenceSummary =
    [
      preferences.shirtSize ? `Camiseta ${preferences.shirtSize}` : null,
      preferences.shoeSize ? `Calçado ${preferences.shoeSize}` : null,
      preferences.notes ? 'Notas informadas' : null,
    ]
      .filter(Boolean)
      .join(' · ') || 'Sem preferências informadas'
  const paymentSummary = payment
    ? `${payment.label}${
        payment.type === 'credit_card' && installments > 1
          ? ` (${installments}x de ${formatCurrency(Math.round(totalAmount / installments))})`
          : ''
      }`
    : '—'

  return (
    <CheckoutSection title="Revisão final" eyebrow="Confirmação" code="STEP-06">
      <ReviewItem
        label="Endereço"
        value={address?.label ?? '—'}
        detail={
          address
            ? `${address.street}, ${address.number} — ${address.city}/${address.state}`
            : undefined
        }
      />
      <ReviewItem
        label="Frete"
        value={shipping?.label ?? '—'}
        detail={
          shipping
            ? [
                shipping.carrier,
                formatBusinessDays(shipping.estimatedDays),
                formatCurrency(shipping.price),
              ]
                .filter(Boolean)
                .join(' · ')
            : undefined
        }
      />
      <ReviewItem label="Pagamento" value={paymentSummary} />
      <ReviewItem label="Preferências" value={preferenceSummary} />
      {error ? (
        <p className="mt-4 rounded-[10px] border border-(--red)/45 bg-(--red)/10 px-3 py-2 text-sm text-(--ink)">
          {error}
        </p>
      ) : null}
    </CheckoutSection>
  )
}

function ReviewItem({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-[rgba(33,28,24,0.12)] py-3 last:border-0">
      <div>
        <p
          className={cn(
            fontMono,
            'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
          )}
        >
          {label}
        </p>
        <p className="mt-1 font-medium text-(--ink)">{value}</p>
        {detail ? <p className="text-(--ink-soft)">{detail}</p> : null}
      </div>
      <IconCircleCheck className="size-5 text-(--teal)" />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

import {
  CheckoutStepper,
  type SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-stepper'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { Button } from '@/src/components/ui/button'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  sectionFrame,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { getPlanBySlug, getSeoEntry } from '@/src/lib/domain/repositories'
import type { CartItem } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { buildMetadata } from '@/src/lib/seo'
import {
  calculateShipping,
  createOrder,
  getCartWithTotals,
} from '@/src/lib/server/cart'
import {
  getCustomerProfile,
  updateCustomerProfile,
} from '@/src/lib/server/customer'
import { cn } from '@/src/lib/utils'

export const metadata: Metadata = buildMetadata({
  path: '/checkout',
  entry: getSeoEntry('/checkout'),
  noindex: true,
})

interface CheckoutPageProps {
  searchParams: Promise<{ plano?: string }>
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { plano } = await searchParams
  const plan = plano ? await getPlanBySlug(plano) : null
  const isSubscriptionFlow = Boolean(plan)

  const cart = await getCartWithTotals()
  const totals = cart

  const profile = await getCustomerProfile()

  const customer = profile.customer
  const addresses = profile.addresses || []
  const paymentMethods = profile.paymentMethods || []

  let shipping = { price: 0, estimatedDays: '5-8 dias úteis', region: '' }
  if (addresses[0]?.zipCode) {
    shipping = await calculateShipping(addresses[0].zipCode)
  }

  const shippingOptions = [
    {
      id: 'standard',
      label: 'Envio padrão',
      price: shipping.price,
      estimatedDays: shipping.estimatedDays,
    },
  ]

  const paymentOptions = paymentMethods.map((method) => ({
    id: method.id,
    label: method.label,
    type: method.type,
  }))

  let discountAmount = 0
  let subtotalAmount = totals.subtotal

  if (isSubscriptionFlow && plan) {
    if (plan.slug === 'anual') {
      const monthlyPlan = await getPlanBySlug('mensal')
      const monthlyPrice = monthlyPlan ? monthlyPlan.price : 14990
      const commitment = plan.commitmentMonths || 12
      subtotalAmount = monthlyPrice * commitment
      discountAmount = subtotalAmount - plan.price
    } else {
      subtotalAmount = plan.price
      discountAmount = 0
    }
  } else {
    discountAmount = totals.discount
  }

  const total =
    (isSubscriptionFlow && plan ? plan.price : totals.total) + shipping.price

  // let installmentsCount = 1
  // let installmentValue = total

  // if (isSubscriptionFlow && plan) {
  //   if (plan.slug === 'anual') {
  //     installmentsCount = 12
  //     installmentValue = plan.pricePerMonth ?? plan.price
  //   } else {
  //     installmentsCount = 1
  //     installmentValue = plan.price
  //   }
  // } else {
  //   if (total > 10000) {
  //     installmentsCount = 3
  //     installmentValue = Math.round(total / 3)
  //   } else {
  //     installmentsCount = 1
  //     installmentValue = total
  //   }
  // }

  return (
    <DesignPageShell className="overflow-hidden">
      <div className={cn(sectionFrame, 'relative z-10 py-12 lg:py-16')}>
        <header className="flex flex-col gap-5 border-b border-[rgba(33,28,24,0.15)] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionEyebrow className="mb-0">Checkout</SectionEyebrow>
            <p
              className={cn(
                fontMono,
                'text-[0.65rem] tracking-[0.14em] text-(--ink-mute) uppercase',
              )}
            >
              PROC-07 · sessão segura
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <h1
                className={cn(
                  fontHeading,
                  'max-w-2xl text-3xl/tight font-semibold tracking-[-0.015em] text-balance text-(--ink) sm:text-4xl',
                )}
              >
                Finalize seu ingresso no clube
              </h1>
              <p className="max-w-xl text-sm/6 text-(--ink-soft)">
                Fluxo de validação — nenhum pagamento real será processado.
                Confira dados, frete e pagamento antes de confirmar.
              </p>
            </div>
            {plan ? (
              <div
                className={cn(
                  dossierCardSurface,
                  warmShadowClass,
                  'rounded-[14px] px-4 py-3',
                )}
              >
                <p
                  className={cn(
                    fontMono,
                    'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
                  )}
                >
                  Assinatura selecionada
                </p>
                <p
                  className={cn(
                    fontHeading,
                    'mt-1.5 flex items-baseline gap-2 text-sm font-semibold text-(--ink)',
                  )}
                >
                  {plan.name}
                  <span className="text-(--red)">
                    {formatCurrency(plan.price)}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        </header>

        {!isSubscriptionFlow && cart.items.length === 0 ? (
          <div className="mt-10 rounded-[14px] border border-dashed border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-10 text-center">
            <p
              className={cn(
                fontMono,
                'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
              )}
            >
              Arquivo vazio
            </p>
            <p className="mt-3 text-sm text-(--ink-soft)">
              Seu carrinho está vazio. Explore a loja e adicione uma box para
              iniciar o checkout.
            </p>
            <Button
              asChild
              className={cn(
                fontMono,
                'mt-6 h-11 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-5 text-(--ink) hover:bg-(--ink) hover:text-[#fbf9f6]',
              )}
            >
              <Link href="/loja">Ir para a loja</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <CheckoutStepper
              customer={
                customer ? { name: customer.name, email: customer.email } : null
              }
              addresses={addresses.map((a) => ({
                id: a.id,
                label: a.label,
                street: a.street,
                number: a.number,
                city: a.city,
                state: a.state,
                zipCode: a.zipCode,
              }))}
              paymentOptions={paymentOptions}
              shippingOptions={shippingOptions}
              isSubscriptionFlow={isSubscriptionFlow}
              planName={plan?.name}
              planPrice={
                isSubscriptionFlow && plan?.slug === 'anual'
                  ? plan.pricePerMonth
                  : plan?.price
              }
              cartItems={cart.items.map((item: CartItem) => ({
                id: item.id,
                label: `${item.productName} × ${item.quantity}`,
                value: formatCurrency(item.unitPrice * item.quantity),
              }))}
              subtotalAmount={subtotalAmount}
              discountAmount={discountAmount}
              shippingPrice={shipping.price}
              totalAmount={total}
              onSavePreferences={savePreferences}
              onCreateOrder={submitOrder}
            />
          </div>
        )}
      </div>
    </DesignPageShell>
  )
}

async function savePreferences(preferences: SubscriberPreferencesValue) {
  'use server'
  await updateCustomerProfile({ preferences })
}

async function submitOrder() {
  'use server'
  await createOrder()
}

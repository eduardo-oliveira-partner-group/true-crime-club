import type { Metadata } from 'next'
import Link from 'next/link'

import {
  CheckoutStepper,
  type SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-stepper'
import { Button } from '@/src/components/ui/button'
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
  const plan = plano ? getPlanBySlug(plano) : null
  const isSubscriptionFlow = Boolean(plan)

  const cart = getCartWithTotals()
  const totals = cart

  const profile = getCustomerProfile()

  const customer = profile.customer
  const addresses = profile.addresses || []
  const paymentMethods = profile.paymentMethods || []

  let shipping = { price: 0, estimatedDays: '5-8 dias úteis', region: '' }
  if (addresses[0]?.zipCode) {
    shipping = calculateShipping(addresses[0].zipCode)
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

  const total =
    (isSubscriptionFlow && plan ? plan.price : totals.total) + shipping.price

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-(--paper) text-(--ink)">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[42px_42px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(216,65,50,0.1),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <header className="flex flex-col gap-5 border-b border-[rgba(33,28,24,0.15)] pb-8">
          <div className="flex items-center gap-4">
            <p className="text-xs font-semibold tracking-[0.28em] text-(--red) uppercase">
              Checkout
            </p>
            <span className="h-px flex-1 bg-[#d7b56d]/40" />
            <p className="font-mono text-[0.65rem] tracking-[0.18em] text-(--ink)/45 uppercase">
              PROC-07 · sessão segura
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <h1 className="font-heading text-3xl font-black tracking-tight text-(--ink) uppercase sm:text-4xl">
                Finalize seu ingresso no clube
              </h1>
              <p className="max-w-xl text-sm/6 text-(--ink-soft)">
                Fluxo de validação — nenhum pagamento real será processado.
                Confira dados, frete e pagamento antes de confirmar.
              </p>
            </div>
            {plan ? (
              <div className="border border-[#d7b56d]/40 bg-(--card)/80 px-4 py-3 backdrop-blur-sm">
                <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-(--red) uppercase">
                  Assinatura selecionada
                </p>
                <p className="mt-1.5 flex items-baseline gap-2 font-heading text-sm font-semibold text-(--ink)">
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
          <div className="mt-10 border border-dashed border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-10 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
              Arquivo vazio
            </p>
            <p className="mt-3 text-sm text-(--ink-soft)">
              Seu carrinho está vazio. Explore a loja e adicione uma box para
              iniciar o checkout.
            </p>
            <Button
              asChild
              className="mt-6 h-11 border border-[#d7b56d]/50 bg-transparent px-5 text-(--red) hover:bg-[#d7b56d]/12 hover:text-[#f0e8dd]"
            >
              <Link href="/loja">Ir para a loja</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="order-2 lg:order-1">
              <CheckoutStepper
                customer={
                  customer
                    ? { name: customer.name, email: customer.email }
                    : null
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
                onSavePreferences={savePreferences}
                onCreateOrder={submitOrder}
              />
            </div>

            <aside className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <OrderSummary
                  isSubscriptionFlow={isSubscriptionFlow}
                  planName={plan?.name}
                  planPrice={plan?.price}
                  items={cart.items.map((item: CartItem) => ({
                    id: item.id,
                    label: `${item.productName} × ${item.quantity}`,
                    value: formatCurrency(item.unitPrice * item.quantity),
                  }))}
                  subtotal={formatCurrency(
                    isSubscriptionFlow && plan ? plan.price : totals.subtotal,
                  )}
                  shipping={formatCurrency(shipping.price)}
                  total={formatCurrency(total)}
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

interface OrderSummaryItem {
  id: string
  label: string
  value: string
}

function OrderSummary({
  isSubscriptionFlow,
  planName,
  planPrice,
  items,
  subtotal,
  shipping,
  total,
}: {
  isSubscriptionFlow: boolean
  planName?: string
  planPrice?: number
  items: OrderSummaryItem[]
  subtotal: string
  shipping: string
  total: string
}) {
  const hasItems = (isSubscriptionFlow && planName != null) || items.length > 0

  return (
    <section className="border border-[rgba(33,28,24,0.15)] bg-(--card) p-5 shadow-[0_18px_40px_rgba(33,28,24,0.38)] sm:p-6">
      <div className="flex items-center justify-between border-b border-[rgba(33,28,24,0.15)] pb-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
          Resumo do pedido
        </p>
        <p className="font-mono text-[0.6rem] tracking-[0.16em] text-(--ink)/40 uppercase">
          DOSS-07
        </p>
      </div>

      {hasItems ? (
        <ul className="mt-4 space-y-2.5 text-sm text-(--ink-soft)">
          {isSubscriptionFlow && planName ? (
            <li className="flex justify-between gap-4">
              <span>{planName} (assinatura)</span>
              <span className="font-medium text-[#f0e8dd]">
                {formatCurrency(planPrice ?? 0)}
              </span>
            </li>
          ) : null}
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4">
              <span>{item.label}</span>
              <span className="font-medium text-[#f0e8dd]">{item.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-(--ink-soft)">
          Nenhum item selecionado.
        </p>
      )}

      <div className="mt-5 space-y-2 border-t border-[rgba(33,28,24,0.15)] pt-4 text-sm text-(--ink-soft)">
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span className="text-[#f0e8dd]">{subtotal}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Frete</span>
          <span className="text-[#f0e8dd]">{shipping}</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#d7b56d]/30 pt-4">
        <span className="text-xs font-semibold tracking-[0.18em] text-(--red) uppercase">
          Total
        </span>
        <span className="font-heading text-2xl font-black text-(--ink)">
          {total}
        </span>
      </div>

      <p className="mt-4 text-[0.7rem]/5 text-(--ink-mute)">
        Ambiente de validação — nenhum pagamento real será processado. O dossiê
        do pedido é gerado ao finalizar.
      </p>
    </section>
  )
}

async function savePreferences(preferences: SubscriberPreferencesValue) {
  'use server'
  updateCustomerProfile({ preferences })
}

async function submitOrder() {
  'use server'
  createOrder()
}

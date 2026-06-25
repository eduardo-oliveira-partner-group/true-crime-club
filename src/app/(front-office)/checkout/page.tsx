import type { Metadata } from 'next'
import Link from 'next/link'

import {
  CheckoutStepper,
  type SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-stepper'
import { Button } from '@/src/components/ui/button'
import {
  calculateShipping,
  createOrder,
  getCart,
  getCartTotals,
  getCurrentCustomer,
  getPlanBySlug,
  getSeoEntry,
  listAddresses,
  listPaymentMethods,
  updateSubscriberPreferences,
} from '@/src/lib/domain/repositories'
import { formatCurrency } from '@/src/lib/formatters'
import { buildMetadata } from '@/src/lib/seo'

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

  const cart = getCart()
  const totals = getCartTotals(cart)
  const customer = getCurrentCustomer()
  const addresses = listAddresses()
  const paymentMethods = listPaymentMethods()
  const shipping = calculateShipping(addresses[0]?.zipCode ?? '')

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fluxo mockado — nenhum pagamento real será processado.
          </p>
        </div>
        {plan ? (
          <p className="rounded-md border border-brand-accent/40 bg-brand-muted/30 px-3 py-1.5 text-sm">
            Assinatura: <strong>{plan.name}</strong> ·{' '}
            {formatCurrency(plan.price)}
          </p>
        ) : null}
      </div>

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
        onSavePreferences={savePreferences}
        onCreateOrder={submitOrder}
      />

      {!isSubscriptionFlow && cart.items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Seu carrinho está vazio.
          </p>
          <Button asChild className="mt-4">
            <Link href="/loja">Ir para a loja</Link>
          </Button>
        </div>
      ) : null}

      <section className="mt-10 rounded-xl border border-border p-5">
        <h2 className="font-medium">Resumo do pedido</h2>
        {isSubscriptionFlow && plan ? (
          <ul className="mt-3 space-y-1 text-sm">
            <li className="flex justify-between gap-4">
              <span>{plan.name} (assinatura)</span>
              <span>{formatCurrency(plan.price)}</span>
            </li>
          </ul>
        ) : cart.items.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhum item selecionado.
          </p>
        )}
        <div className="mt-3 border-t border-border pt-3 text-sm">
          <p>
            Subtotal:{' '}
            {formatCurrency(
              isSubscriptionFlow && plan ? plan.price : totals.subtotal,
            )}
          </p>
          <p>Frete: {formatCurrency(shipping.price)}</p>
          <p className="mt-2 font-semibold">
            Total:{' '}
            {formatCurrency(
              (isSubscriptionFlow && plan ? plan.price : totals.total) +
                shipping.price,
            )}
          </p>
        </div>
      </section>
    </div>
  )
}

async function savePreferences(preferences: SubscriberPreferencesValue) {
  'use server'
  updateSubscriberPreferences(preferences)
}

async function submitOrder() {
  'use server'
  createOrder()
}

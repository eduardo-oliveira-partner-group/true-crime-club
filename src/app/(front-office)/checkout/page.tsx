import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import {
  createOrder,
  getCart,
  getCartTotals,
  getCurrentCustomer,
  listAddresses,
  listPaymentMethods,
} from '@/src/lib/domain/repositories'
import { formatCurrency } from '@/src/lib/formatters'

export default function CheckoutPage() {
  const cart = getCart()
  const totals = getCartTotals(cart)
  const customer = getCurrentCustomer()
  const addresses = listAddresses()
  const paymentMethods = listPaymentMethods()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Fluxo mockado — nenhum pagamento real será processado.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="font-medium">Conta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {customer?.name} — {customer?.email}
            </p>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/login">Alterar conta</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h2 className="font-medium">Endereço</h2>
            {addresses.map((address) => (
              <p
                key={address.id}
                className="mt-2 text-sm text-muted-foreground"
              >
                {address.street}, {address.number} — {address.city}/
                {address.state}
              </p>
            ))}
          </div>

          <div className="rounded-xl border border-border p-4">
            <h2 className="font-medium">Pagamento</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {paymentMethods.map((method) => (
                <li key={method.id}>{method.label}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-border p-4">
          <h2 className="font-medium">Resumo</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>{item.productName}</span>
                <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4 text-sm">
            <p>Total: {formatCurrency(totals.total)}</p>
          </div>

          <form
            className="mt-6"
            action={async () => {
              'use server'
              createOrder()
            }}
          >
            <Button
              type="submit"
              className="w-full"
              disabled={cart.items.length === 0}
            >
              Finalizar pedido mockado
            </Button>
          </form>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/checkout/confirmacao">Ver confirmação de exemplo</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

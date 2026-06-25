import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import {
  applyCoupon,
  calculateShipping,
  getCart,
  getCartTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'
import { formatCurrency } from '@/src/lib/formatters'

export default function CarrinhoPage() {
  const cart = getCart()
  const totals = getCartTotals(cart)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold">Carrinho</h1>

      {cart.items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Button asChild className="mt-4">
            <Link href="/loja">Ir para a loja</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form
                  action={async (formData) => {
                    'use server'
                    const qty = Number(formData.get('quantity'))
                    updateCartItemQuantity(item.id, qty)
                  }}
                >
                  <input
                    type="hidden"
                    name="quantity"
                    value={item.quantity + 1}
                  />
                  <Button type="submit" variant="outline" size="sm">
                    +
                  </Button>
                </form>
                <form
                  action={async () => {
                    'use server'
                    removeCartItem(item.id)
                  }}
                >
                  <Button type="submit" variant="ghost" size="sm">
                    Remover
                  </Button>
                </form>
              </div>
            </div>
          ))}

          <form
            className="flex gap-2"
            action={async (formData) => {
              'use server'
              applyCoupon(String(formData.get('coupon') ?? ''))
            }}
          >
            <input
              name="coupon"
              placeholder="Cupom"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
            <Button type="submit" variant="outline">
              Aplicar
            </Button>
          </form>

          <div className="rounded-xl bg-muted/40 p-4 text-sm">
            <p>Subtotal: {formatCurrency(totals.subtotal)}</p>
            <p>Desconto: {formatCurrency(totals.discount)}</p>
            <p className="font-semibold">
              Total: {formatCurrency(totals.total)}
            </p>
            <p className="mt-2 text-muted-foreground">
              Frete estimado (05435-020):{' '}
              {formatCurrency(calculateShipping('05435020').price)}
            </p>
          </div>

          <Button asChild size="lg">
            <Link href="/checkout">Ir para checkout</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

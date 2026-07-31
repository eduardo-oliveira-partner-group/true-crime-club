import { describe, expect, it } from 'vitest'

import { getCartTotals } from '@/src/lib/domain/repository/domains/cart'
import type { Cart } from '@/src/lib/domain/types'

function createCart(overrides: Partial<Cart> = {}): Cart {
  return {
    id: 'cart-test',
    items: [
      {
        id: 'item-test',
        productId: 'product-test',
        productSlug: 'arquivo-teste',
        productName: 'Arquivo teste',
        productType: 'box',
        quantity: 2,
        unitPrice: 1000,
      },
    ],
    ...overrides,
  }
}

describe('getCartTotals', () => {
  it('soma itens, desconto e frete em centavos', () => {
    const totals = getCartTotals(
      createCart({ couponDiscount: 300, shippingEstimate: 500 }),
    )

    expect(totals).toEqual({
      subtotal: 2000,
      discount: 300,
      shipping: 500,
      total: 2200,
    })
  })

  it('nunca devolve total negativo', () => {
    const totals = getCartTotals(createCart({ couponDiscount: 3000 }))

    expect(totals.total).toBe(0)
  })
})

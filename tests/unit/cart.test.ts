import { describe, expect, it } from 'vitest'

import {
  getCartTotals,
  resolveMerchandiseTotals,
} from '@/src/lib/domain/repository/domains/cart'
import type { Cart, SubscriptionPlan } from '@/src/lib/domain/types'

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

function createAnnualPlan(
  overrides: Partial<SubscriptionPlan> = {},
): SubscriptionPlan {
  return {
    id: 'plan-annual',
    slug: 'anual',
    name: 'Anual',
    description: 'Plano anual',
    billingInterval: 'annual',
    price: 155880,
    pricePerMonth: 12990,
    features: [],
    commitmentMonths: 12,
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

describe('resolveMerchandiseTotals', () => {
  it('usa soma dos itens quando não há assinatura', () => {
    const totals = resolveMerchandiseTotals({
      cart: createCart({ couponDiscount: 300 }),
    })

    expect(totals).toEqual({
      isSubscriptionFlow: false,
      isAnnualSubscription: false,
      subtotal: 2000,
      discount: 300,
      merchandiseTotal: 1700,
    })
  })

  it('não inventa desconto anual no front — só usa desconto da API', () => {
    const monthlyPlan: SubscriptionPlan = {
      id: 'plan-monthly',
      slug: 'mensal',
      name: 'Mensal',
      description: 'Plano mensal',
      billingInterval: 'monthly',
      price: 14990,
      features: [],
    }

    const totals = resolveMerchandiseTotals({
      cart: createCart({
        items: [
          {
            id: 'plan-item',
            productId: '',
            planId: 'plan-annual',
            productSlug: 'anual',
            productName: 'Anual',
            productType: 'subscription',
            quantity: 1,
            unitPrice: 12990,
          },
          {
            id: 'box-item',
            productId: 'box-1',
            productSlug: 'caixa-01',
            productName: 'TCC - CAIXA 01',
            productType: 'box',
            quantity: 1,
            unitPrice: 4999,
          },
        ],
      }),
      plan: createAnnualPlan(),
      monthlyPlan,
    })

    expect(totals).toEqual({
      isSubscriptionFlow: true,
      isAnnualSubscription: true,
      subtotal: 155880,
      discount: 0,
      merchandiseTotal: 155880,
    })
  })

  it('exibe desconto de cupom da API no fluxo de assinatura', () => {
    const totals = resolveMerchandiseTotals({
      cart: {
        ...createCart(),
        discount: 5000,
        couponCode: 'PROMO',
      },
      plan: createAnnualPlan(),
    })

    expect(totals.discount).toBe(5000)
    expect(totals.merchandiseTotal).toBe(150880)
  })

  it('usa preço do plano mensal sem desconto inventado', () => {
    const monthlyPlan: SubscriptionPlan = {
      id: 'plan-monthly',
      slug: 'mensal',
      name: 'Mensal',
      description: 'Plano mensal',
      billingInterval: 'monthly',
      price: 14990,
      features: [],
    }

    const totals = resolveMerchandiseTotals({
      cart: createCart(),
      plan: monthlyPlan,
    })

    expect(totals).toEqual({
      isSubscriptionFlow: true,
      isAnnualSubscription: false,
      subtotal: 14990,
      discount: 0,
      merchandiseTotal: 14990,
    })
  })
})

import { apiClient } from '@/src/lib/api-client'

import type { Cart, CouponResult, SubscriptionPlan } from '../../types'
import { emptyCart, isUnauthorizedError } from '../core/helpers'

type CartWithTotals = Cart & {
  subtotal?: number
  discount?: number
  total?: number
}

export async function getCart(): Promise<Cart> {
  try {
    return await apiClient.cart.get()
  } catch (error) {
    // Build/SSR sem cookie de sessão: a API responde 401.
    // Carrinho vazio evita quebrar prerender do header e páginas públicas.
    if (isUnauthorizedError(error)) {
      return emptyCart()
    }
    throw error
  }
}

export async function addCartItem(input: {
  productId?: string
  planoId?: string
  quantity?: number
}): Promise<Cart> {
  return await apiClient.cart.addItem({
    productId: input.productId,
    planoId: input.planoId,
    quantity: input.quantity ?? 1,
  })
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  return await apiClient.cart.updateQuantity(itemId, quantity)
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  return await apiClient.cart.removeItem(itemId)
}

export async function applyCoupon(code: string): Promise<CouponResult> {
  const apiResult = await apiClient.cart.applyCoupon(code)
  return {
    valid: apiResult.valido ?? apiResult.valid ?? false,
    code: apiResult.codigo ?? apiResult.code ?? code,
    discount: apiResult.desconto ?? apiResult.discount ?? 0,
    message: apiResult.mensagem ?? apiResult.message ?? '',
  }
}

export function getCartTotals(cart: CartWithTotals) {
  const subtotal =
    cart.subtotal ??
    cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const discount = cart.discount ?? cart.couponDiscount ?? 0
  const shipping = cart.shippingEstimate ?? 0
  const total = cart.total ?? Math.max(subtotal - discount + shipping, 0)

  return { subtotal, discount, shipping, total }
}

/**
 * Totais de mercadoria alinhados ao checkout.
 * Em fluxo de assinatura, o valor cobrado é o preço do plano (anual = compromisso),
 * não a soma linear dos itens do carrinho.
 * Desconto exibido/aplicado no resumo só quando a API envia `desconto`/`descontoCupom`.
 */
export function resolveMerchandiseTotals(input: {
  cart: CartWithTotals
  plan?: SubscriptionPlan | null
  monthlyPlan?: SubscriptionPlan | null
}): {
  isSubscriptionFlow: boolean
  isAnnualSubscription: boolean
  subtotal: number
  discount: number
  merchandiseTotal: number
} {
  const totals = getCartTotals(input.cart)
  const plan = input.plan ?? null
  const apiDiscount = input.cart.discount ?? input.cart.couponDiscount ?? 0

  if (!plan) {
    return {
      isSubscriptionFlow: false,
      isAnnualSubscription: false,
      subtotal: totals.subtotal,
      discount: apiDiscount,
      merchandiseTotal: Math.max(totals.subtotal - apiDiscount, 0),
    }
  }

  const isAnnualSubscription = plan.billingInterval === 'annual'

  return {
    isSubscriptionFlow: true,
    isAnnualSubscription,
    // Preço do plano. Economia anual vs mensal não é campo da API.
    subtotal: plan.price,
    discount: apiDiscount,
    merchandiseTotal: Math.max(plan.price - apiDiscount, 0),
  }
}

import { apiClient } from '@/src/lib/api-client'

import type { Cart, CouponResult } from '../../types'
import { emptyCart, isUnauthorizedError } from '../core/helpers'

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
  productId: string
  quantity?: number
}): Promise<Cart> {
  return await apiClient.cart.addItem(input.productId, input.quantity ?? 1)
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

export function getCartTotals(cart: Cart) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const discount = cart.couponDiscount ?? 0
  const shipping = cart.shippingEstimate ?? 0
  const total = Math.max(subtotal - discount + shipping, 0)

  return { subtotal, discount, shipping, total }
}

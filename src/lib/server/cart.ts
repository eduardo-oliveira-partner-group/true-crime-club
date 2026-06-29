import {
  addCartItem,
  applyCoupon,
  calculateShipping,
  createOrder,
  getCart,
  getCartTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'
import type { Cart } from '@/src/lib/domain/types'

export type CartWithTotals = Cart & {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

function withTotals(cart: Cart): CartWithTotals {
  return { ...cart, ...getCartTotals(cart) }
}

export function getCartWithTotals(): CartWithTotals {
  return withTotals(getCart())
}

export function addCartItemWithTotals(input: {
  productId: string
  quantity?: number
}): CartWithTotals {
  return withTotals(addCartItem(input))
}

export function updateCartItemQuantityWithTotals(
  itemId: string,
  quantity: number,
): CartWithTotals {
  return withTotals(updateCartItemQuantity(itemId, quantity))
}

export function removeCartItemWithTotals(itemId: string): CartWithTotals {
  return withTotals(removeCartItem(itemId))
}

export { applyCoupon, calculateShipping, createOrder }

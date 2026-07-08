import {
  addCartItem,
  applyCoupon,
  calculateShipping as repoCalculateShipping,
  createOrder as repoCreateOrder,
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

export async function getCartWithTotals(): Promise<CartWithTotals> {
  return withTotals(await getCart())
}

export async function addCartItemWithTotals(input: {
  productId: string
  quantity?: number
}): Promise<CartWithTotals> {
  return withTotals(await addCartItem(input))
}

export async function updateCartItemQuantityWithTotals(
  itemId: string,
  quantity: number,
): Promise<CartWithTotals> {
  return withTotals(await updateCartItemQuantity(itemId, quantity))
}

export async function removeCartItemWithTotals(
  itemId: string,
): Promise<CartWithTotals> {
  return withTotals(await removeCartItem(itemId))
}

export async function calculateShipping(zipCode: string) {
  return repoCalculateShipping(zipCode)
}

export async function createOrder(
  input?: Parameters<typeof repoCreateOrder>[0],
) {
  return repoCreateOrder(input)
}

export { applyCoupon }

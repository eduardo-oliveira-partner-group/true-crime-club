import type { Cart } from '@/src/lib/domain/types'

export const CART_UPDATED_EVENT = 'tcc:cart-updated'

export type CartUpdatedDetail = {
  itemCount: number
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0)
}

/** Notifica a UI (header, etc.) que o carrinho mudou. */
export function notifyCartUpdated(cart: Cart): void {
  if (typeof window === 'undefined') return

  const detail: CartUpdatedDetail = {
    itemCount: getCartItemCount(cart),
  }

  window.dispatchEvent(
    new CustomEvent<CartUpdatedDetail>(CART_UPDATED_EVENT, { detail }),
  )
}

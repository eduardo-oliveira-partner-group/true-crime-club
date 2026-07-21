import { apiClient } from '@/src/lib/api-client'

import { mockProducts, VALID_COUPONS } from '../../mock-data'
import { isScenario } from '../../scenarios'
import type { Cart, CartItem, CouponResult } from '../../types'
import {
  emptyCart,
  generateId,
  isLocalMockMode,
  isUnauthorizedError,
  throwIfError,
} from '../core/helpers'
import { cartState } from '../core/state'

export async function getCart(): Promise<Cart> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return structuredClone(cartState)
}

export async function addCartItem(input: {
  productId: string
  quantity?: number
}): Promise<Cart> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.cart.addItem(input.productId, input.quantity ?? 1)
  }

  const product = mockProducts.find((p) => p.id === input.productId)
  if (!product) {
    throw new Error('Produto não encontrado.')
  }
  if (!product.inStock || isScenario('product_unavailable')) {
    throw new Error('Produto indisponível no momento.')
  }

  const quantity = input.quantity ?? 1
  const unitPrice = product.subscriberPrice ?? product.price
  const existing = cartState.items.find((i) => i.productId === product.id)

  if (existing) {
    existing.quantity += quantity
  } else {
    const item: CartItem = {
      id: generateId('ci'),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.type,
      quantity,
      unitPrice,
      image: product.images[0],
    }
    cartState.items.push(item)
  }

  return await getCart()
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<Cart> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.cart.updateQuantity(itemId, quantity)
  }

  const item = cartState.items.find((i) => i.id === itemId)
  if (!item) {
    throw new Error('Item não encontrado no carrinho.')
  }
  if (quantity <= 0) {
    cartState.items = cartState.items.filter((i) => i.id !== itemId)
  } else {
    item.quantity = quantity
  }
  return await getCart()
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.cart.removeItem(itemId)
  }

  cartState.items = cartState.items.filter((i) => i.id !== itemId)
  return await getCart()
}

export async function applyCoupon(code: string): Promise<CouponResult> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiResult = await apiClient.cart.applyCoupon(code)
    return {
      valid: apiResult.valido ?? apiResult.valid ?? false,
      code: apiResult.codigo ?? apiResult.code ?? code,
      discount: apiResult.desconto ?? apiResult.discount ?? 0,
      message: apiResult.mensagem ?? apiResult.message ?? '',
    }
  }

  const normalized = code.trim().toUpperCase()
  const discount = VALID_COUPONS[normalized]

  if (!discount) {
    cartState.couponCode = undefined
    cartState.couponDiscount = undefined
    return {
      valid: false,
      code: normalized,
      discount: 0,
      message: 'Cupom inválido ou expirado.',
    }
  }

  cartState.couponCode = normalized
  cartState.couponDiscount = discount

  return {
    valid: true,
    code: normalized,
    discount,
    message: 'Cupom aplicado com sucesso.',
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

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

export type CreateOrderInput = {
  enderecoId: string
  pagamentoMetodoId: string
  subscription?: {
    id: string
    name: string
    price: number
  }
}

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

export async function createOrder(input?: CreateOrderInput) {
  if (isExplicitLocalMockMode()) {
    return repoCreateOrder(input)
  }

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) throw new Error('Faça login para finalizar o pedido.')

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/finalizacao/pedido`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        idEndereco: input?.enderecoId,
        idMetodoPagamento: input?.pagamentoMetodoId,
        simulacaoAssinatura: Boolean(input?.subscription),
        planoId: input?.subscription?.id,
        planoNome: input?.subscription?.name,
        planoPreco: input?.subscription?.price,
      }),
    },
  )

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      mensagem?: string
    }
    throw new Error(data.mensagem ?? 'Não foi possível simular o pedido.')
  }

  return response.json()
}

export { applyCoupon }
import 'server-only'

import { cookies } from 'next/headers'

import { getApiBaseUrl, isExplicitLocalMockMode } from '@/src/lib/api-mode'

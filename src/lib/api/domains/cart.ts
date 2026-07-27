import type { Cart } from '@/src/lib/domain/types'

import { fetcher } from '../core/fetcher'
import { toCart } from '../mappers/cart'

/** Evita GET /carrinho duplicado quando header e página disparam juntos. */
let inflightGet: Promise<Cart> | null = null

function invalidateGetCache() {
  inflightGet = null
}

export const cartApi = {
  get: () => {
    if (!inflightGet) {
      inflightGet = fetcher('/carrinho')
        .then(toCart)
        .finally(() => {
          inflightGet = null
        })
    }
    return inflightGet
  },
  addItem: (input: {
    productId?: string
    planoId?: string
    quantity?: number
  }) => {
    invalidateGetCache()
    const quantity = input.quantity ?? 1
    const body = input.planoId
      ? { planoId: input.planoId, quantidade: quantity }
      : { idProduto: input.productId, quantidade: quantity }
    return fetcher('/carrinho/itens', {
      method: 'POST',
      body: JSON.stringify(body),
    }).then(toCart)
  },
  updateQuantity: (itemId: string, quantity: number) => {
    invalidateGetCache()
    return fetcher(`/carrinho/itens/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade: quantity }),
    }).then(toCart)
  },
  removeItem: (itemId: string) => {
    invalidateGetCache()
    return fetcher(`/carrinho/itens/${itemId}`, {
      method: 'DELETE',
    }).then(toCart)
  },
  applyCoupon: (code: string) => {
    invalidateGetCache()
    return fetcher('/carrinho/cupom', {
      method: 'POST',
      body: JSON.stringify({ codigo: code }),
    })
  },
}

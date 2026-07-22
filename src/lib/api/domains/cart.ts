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
  addItem: (productId: string, quantity: number = 1) => {
    invalidateGetCache()
    return fetcher('/carrinho/itens', {
      method: 'POST',
      body: JSON.stringify({ idProduto: productId, quantidade: quantity }),
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

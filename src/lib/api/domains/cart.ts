import { fetcher } from '../core/fetcher'
import { toCart } from '../mappers/cart'

export const cartApi = {
  get: () => fetcher('/carrinho').then(toCart),
  addItem: (productId: string, quantity: number = 1) =>
    fetcher('/carrinho/itens', {
      method: 'POST',
      body: JSON.stringify({ idProduto: productId, quantidade: quantity }),
    }).then(toCart),
  updateQuantity: (itemId: string, quantity: number) =>
    fetcher(`/carrinho/itens/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade: quantity }),
    }).then(toCart),
  removeItem: (itemId: string) =>
    fetcher(`/carrinho/itens/${itemId}`, {
      method: 'DELETE',
    }).then(toCart),
  applyCoupon: (code: string) =>
    fetcher('/carrinho/cupom', {
      method: 'POST',
      body: JSON.stringify({ codigo: code }),
    }),
}

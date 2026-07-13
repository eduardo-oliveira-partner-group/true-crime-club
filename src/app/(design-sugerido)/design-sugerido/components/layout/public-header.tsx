import { getCart } from '@/src/lib/domain/repositories'

import { PublicHeaderContent } from './public-header-content'

export async function PublicHeader() {
  let itemCount = 0

  try {
    const cart = await getCart()
    itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  } catch (error) {
    console.error(
      'Não foi possível carregar o carrinho no cabeçalho público.',
      { error },
    )
  }

  return <PublicHeaderContent itemCount={itemCount} />
}

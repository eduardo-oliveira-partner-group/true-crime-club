import { getCart } from '@/src/lib/domain/repositories'

import { PublicHeaderContent } from './public-header-content'

export async function PublicHeader() {
  const cart = await getCart()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return <PublicHeaderContent itemCount={itemCount} />
}

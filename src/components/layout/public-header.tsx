import { getCart } from '@/src/lib/domain/repositories'

import { PublicHeaderContent } from './public-header-content'

export function PublicHeader() {
  const cart = getCart()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return <PublicHeaderContent itemCount={itemCount} />
}

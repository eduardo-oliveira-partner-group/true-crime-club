import { getCart } from '@/src/lib/domain/repositories'
import type { CartItem } from '@/src/lib/domain/types'

import { PublicHeaderContent } from './public-header-content'

export async function PublicHeader() {
  const cart = await getCart()
  const itemCount = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  )

  return <PublicHeaderContent itemCount={itemCount} />
}

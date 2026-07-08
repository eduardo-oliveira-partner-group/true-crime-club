'use server'

import { revalidatePath } from 'next/cache'

import { addCartItemWithTotals } from '@/src/lib/server/cart'

export async function handleAddToCart(productId: string) {
  await addCartItemWithTotals({ productId })
  revalidatePath('/carrinho')
  revalidatePath('/loja')
  revalidatePath('/')
}

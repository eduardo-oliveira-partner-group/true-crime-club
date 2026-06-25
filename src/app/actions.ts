'use server'

import { revalidatePath } from 'next/cache'

import { addCartItem } from '@/src/lib/domain/repositories'

export async function handleAddToCart(productId: string) {
  addCartItem({ productId })
  revalidatePath('/carrinho')
  revalidatePath('/loja')
  revalidatePath('/')
}

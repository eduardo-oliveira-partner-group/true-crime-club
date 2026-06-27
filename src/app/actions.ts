'use server'

import { revalidatePath } from 'next/cache'

import { apiClient } from '@/src/lib/api-client'

export async function handleAddToCart(productId: string) {
  await apiClient.cart.addItem(productId)
  revalidatePath('/carrinho')
  revalidatePath('/loja')
  revalidatePath('/')
}

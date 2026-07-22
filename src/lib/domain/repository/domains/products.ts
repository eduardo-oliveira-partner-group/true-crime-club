import { apiClient } from '@/src/lib/api-client'

import type { Product } from '../../types'
import { isNotFoundError } from '../core/helpers'
import { mapApiProductToDomain } from '../mappers/product'

export async function listProducts(options?: {
  featured?: boolean
  category?: string
}): Promise<Product[]> {
  const apiProducts = await apiClient.products.list({
    featured: options?.featured,
    category: options?.category,
  })
  return apiProducts.map(mapApiProductToDomain)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const apiProduct = await apiClient.products.getBySlug(slug)
    return mapApiProductToDomain(apiProduct)
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

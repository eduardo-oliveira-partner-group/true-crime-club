import { apiClient } from '@/src/lib/api-client'

import { mockProducts } from '../../mock-data'
import { isScenario, shouldReturnEmpty } from '../../scenarios'
import type { Product } from '../../types'
import { isLocalMockMode, isNotFoundError, throwIfError } from '../core/helpers'
import { mapApiProductToDomain } from '../mappers/product'

export async function listProducts(options?: {
  featured?: boolean
  category?: string
}): Promise<Product[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiProducts = await apiClient.products.list({
      featured: options?.featured,
      category: options?.category,
    })
    return apiProducts.map(mapApiProductToDomain)
  }

  let products = [...mockProducts]

  if (options?.featured) {
    products = products.filter((p) => p.featured)
  }
  if (options?.category) {
    products = products.filter((p) => p.categories.includes(options.category!))
  }

  if (isScenario('product_unavailable')) {
    products = products.map((p) => ({
      ...p,
      inStock: false,
      availability: 'out_of_stock' as const,
    }))
  }

  const result = shouldReturnEmpty(products)
  return result ?? products
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  const product = mockProducts.find((p) => p.slug === slug) ?? null
  if (!product && isScenario('empty')) {
    return null
  }
  if (isScenario('product_unavailable') && product) {
    return { ...product, inStock: false, availability: 'out_of_stock' }
  }
  return product
}

import type { AvailabilityStatus, Product, ProductType } from '../../types'

export type ApiProduct = {
  id: string
  identificador: string
  nome: string
  descricao?: string
  descricaoCurta?: string
  tipo?: string
  preco: number
  precoAssinante?: number
  imagens?: string[]
  categorias?: string[]
  emEstoque?: boolean
  disponibilidade?: string
  destaque?: boolean
  itensInclusos?: string[]
  relacionados?: string[]
  mesEdicao?: string
  ciclo?: number
}

export function mapApiProductToDomain(apiProduct: ApiProduct): Product {
  const availabilityMap: Record<string, AvailabilityStatus> = {
    disponivel: 'available',
    limitado: 'limited',
    esgotado: 'out_of_stock',
    em_breve: 'coming_soon',
  }

  const typeMap: Record<string, ProductType> = {
    caixa: 'box',
    produto: 'product',
  }

  return {
    id: apiProduct.id,
    slug: apiProduct.identificador,
    name: apiProduct.nome,
    description: apiProduct.descricao ?? '',
    shortDescription: apiProduct.descricaoCurta ?? '',
    type: typeMap[apiProduct.tipo ?? ''] ?? 'product',
    price: apiProduct.preco,
    subscriberPrice: apiProduct.precoAssinante,
    images: apiProduct.imagens ?? [],
    categories: apiProduct.categorias ?? [],
    inStock: apiProduct.emEstoque ?? false,
    availability:
      availabilityMap[apiProduct.disponibilidade ?? ''] ?? 'available',
    featured:
      apiProduct.categorias?.includes('destaque') ||
      apiProduct.destaque ||
      false,
    includedItems: apiProduct.itensInclusos,
    relatedProductIds: apiProduct.relacionados,
    editionMonth: apiProduct.mesEdicao,
    cycleNumber: apiProduct.ciclo,
  }
}

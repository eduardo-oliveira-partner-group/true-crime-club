import type {
  AvailabilityStatus,
  Product,
  ProductImage,
  ProductType,
} from '../../types'

export type ApiProductImage = {
  url: string
  principal?: boolean
}

export type ApiProduct = {
  id: string
  identificador: string
  nome: string
  descricao?: string
  descricaoCurta?: string
  tipo?: string
  preco: number
  precoAssinante?: number
  imagens?: ApiProductImage[]
  categorias?: string[]
  emEstoque?: boolean
  disponibilidade?: string
  destaque?: boolean
  itensInclusos?: string[]
  relacionados?: string[]
  mesEdicao?: string
  ciclo?: number
}

function mapApiProductImages(
  imagens: ApiProductImage[] | undefined,
): ProductImage[] {
  if (!imagens?.length) return []

  const hasPrimary = imagens.some((image) => image.principal)

  return imagens.map((image, index) => ({
    url: image.url,
    isPrimary: image.principal ?? (!hasPrimary && index === 0),
  }))
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

  const disponibilidade = (apiProduct.disponibilidade ?? '')
    .trim()
    .toLowerCase()

  return {
    id: apiProduct.id,
    slug: apiProduct.identificador,
    name: apiProduct.nome,
    description: apiProduct.descricao ?? '',
    shortDescription: apiProduct.descricaoCurta ?? '',
    type: typeMap[apiProduct.tipo ?? ''] ?? 'product',
    price: apiProduct.preco,
    subscriberPrice: apiProduct.precoAssinante,
    images: mapApiProductImages(apiProduct.imagens),
    categories: apiProduct.categorias ?? [],
    inStock: apiProduct.emEstoque ?? false,
    availability: availabilityMap[disponibilidade] ?? 'available',
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

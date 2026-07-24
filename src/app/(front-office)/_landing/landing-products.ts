import { listProducts } from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

const LANDING_PRODUCT_CATEGORIES = {
  archive: 'arquivos',
  standaloneEdition: 'edicoes-especiais',
} as const

const LANDING_ARCHIVE_LIMIT = 4

export type LandingArchiveItem = {
  box: string
  title: string
  price: string
  href: string
  imageUrl: string
  alt: string
}

function parseBoxProductName(name: string): { box: string; title: string } {
  const boxMatch = name.match(/^(?:Box|TCC\s*-\s*CAIXA)\s*(\d+)/i)
  if (boxMatch) {
    const number = boxMatch[1].padStart(2, '0')
    const rest = name
      .slice(boxMatch[0].length)
      .replace(/^\s*[—–-]\s*/, '')
      .trim()
    return {
      box: `BOX ${number}`,
      title: rest || name,
    }
  }
  return { box: 'BOX', title: name }
}

export function toLandingArchiveItem(product: Product): LandingArchiveItem {
  const { box, title } = parseBoxProductName(product.name)

  return {
    box,
    title,
    price: formatCurrency(product.price),
    href: `/loja/${product.slug}`,
    imageUrl: product.images[0] ?? '',
    alt: product.name,
  }
}

async function listArchivedBoxes(): Promise<Product[]> {
  const products = await listProducts()
  return products.filter(
    (product) =>
      product.type === 'box' &&
      product.categories.includes(LANDING_PRODUCT_CATEGORIES.archive),
  )
}

export async function getLandingArchiveItems(): Promise<LandingArchiveItem[]> {
  const products = await listArchivedBoxes()
  return products
    .sort((a, b) => (a.cycleNumber ?? 0) - (b.cycleNumber ?? 0))
    .slice(0, LANDING_ARCHIVE_LIMIT)
    .map(toLandingArchiveItem)
}

export async function getLandingStandaloneProduct(): Promise<Product | null> {
  const products = await listProducts()
  return (
    products.find(
      (product) =>
        product.type === 'box' &&
        product.categories.includes(
          LANDING_PRODUCT_CATEGORIES.standaloneEdition,
        ),
    ) ?? null
  )
}

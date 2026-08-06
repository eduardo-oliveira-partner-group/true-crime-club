import { listProducts } from '@/src/lib/domain/repositories'
import { getPrimaryProductImageUrl, type Product } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

/** Categorias legadas/opcionais — a API atual usa `box` + `destaque`. */
const ARCHIVE_CATEGORIES = new Set(['arquivos', 'arquivada'])
const STANDALONE_CATEGORIES = new Set(['edicoes-especiais', 'edicao-especial'])

const LANDING_ARCHIVE_LIMIT = 4

let landingProductsPromise: Promise<Product[]> | null = null

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

function hasCategory(product: Product, categories: Set<string>): boolean {
  return product.categories.some((category) => categories.has(category))
}

function isStandaloneEdition(product: Product): boolean {
  if (product.type !== 'box') return false
  if (hasCategory(product, STANDALONE_CATEGORIES)) return true
  if (hasCategory(product, ARCHIVE_CATEGORIES)) return false
  return product.featured === true
}

function isArchivedBox(product: Product): boolean {
  if (product.type !== 'box') return false
  if (isStandaloneEdition(product)) return false
  if (hasCategory(product, ARCHIVE_CATEGORIES)) return true
  // API atual: todas as caixas vêm com categoria `box`; arquivos = não destaque.
  return !product.featured
}

export function toLandingArchiveItem(product: Product): LandingArchiveItem {
  const { box, title } = parseBoxProductName(product.name)

  return {
    box,
    title,
    price: formatCurrency(product.price),
    href: `/loja/${product.slug}`,
    imageUrl: getPrimaryProductImageUrl(product),
    alt: product.name,
  }
}

async function getLandingProducts(): Promise<Product[]> {
  if (!landingProductsPromise) {
    landingProductsPromise = listProducts().catch((error: unknown) => {
      landingProductsPromise = null
      throw error
    })
  }

  return landingProductsPromise
}

async function listArchivedBoxes(): Promise<Product[]> {
  const products = await getLandingProducts()
  return products.filter(isArchivedBox)
}

export async function getLandingArchiveItems(): Promise<LandingArchiveItem[]> {
  const products = await listArchivedBoxes()
  return products
    .sort((a, b) => (a.cycleNumber ?? 0) - (b.cycleNumber ?? 0))
    .slice(0, LANDING_ARCHIVE_LIMIT)
    .map(toLandingArchiveItem)
}

export async function getLandingStandaloneProduct(): Promise<Product | null> {
  const products = await getLandingProducts()
  return products.find(isStandaloneEdition) ?? null
}

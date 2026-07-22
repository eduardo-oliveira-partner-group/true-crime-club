import { listProducts } from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

/** Imagens locais usadas quando a API ainda não envia `imagens`. */
const ARCHIVE_IMAGE_BY_CYCLE: Record<number, string> = {
  1: 'design-sugerido/box-01.png',
  2: 'design-sugerido/box-02.png',
  3: 'design-sugerido/box-03.png',
  4: 'design-sugerido/box-04.png',
}

const ARCHIVE_IMAGE_POSITIONS: Record<number, string> = {
  1: '42% 38%',
}

/** Edição especial ainda não catalogada na API com `edicao-especial`. */
const STANDALONE_EDITION_MOCK: Product = {
  id: 'prod-007',
  slug: 'edicao-copa-do-mundo',
  name: 'Edição Copa do Mundo',
  description:
    'Um mistério nos bastidores do maior evento do futebol — itens temáticos e um caso completo que você resolve numa única caixa. Edição limitada, sem assinatura.',
  shortDescription:
    'Caso completo da Copa do Mundo em uma caixa avulsa exclusiva.',
  type: 'box',
  price: 16990,
  images: ['design-sugerido/edicao-copa.png'],
  categories: ['box', 'avulsa', 'edicao-especial'],
  inStock: true,
  availability: 'limited',
  featured: true,
  editionMonth: '2026-06',
  cycleNumber: 5,
  includedItems: [
    'Caso completo em edição avulsa',
    'Itens temáticos da Copa do Mundo',
    'Compra sem assinatura',
    'Estoque limitado',
  ],
}

const LANDING_ARCHIVE_LIMIT = 4

export type LandingArchiveItem = {
  box: string
  title: string
  price: string
  href: string
  imagePath: string
  alt: string
  objectPosition: string
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

function resolveArchiveImage(product: Product): string {
  if (product.images[0]) return product.images[0]
  const cycle = product.cycleNumber ?? 0
  return ARCHIVE_IMAGE_BY_CYCLE[cycle] ?? ARCHIVE_IMAGE_BY_CYCLE[1] ?? ''
}

export function toLandingArchiveItem(product: Product): LandingArchiveItem {
  const { box, title } = parseBoxProductName(product.name)
  const cycle = product.cycleNumber ?? 0

  return {
    box,
    title,
    price: formatCurrency(product.price),
    href: `/loja/${product.slug}`,
    imagePath: resolveArchiveImage(product),
    alt: product.name,
    objectPosition: ARCHIVE_IMAGE_POSITIONS[cycle] ?? 'center',
  }
}

async function listArchivedBoxes(): Promise<Product[]> {
  const byCategory = await listProducts({ category: 'arquivada' })
  if (byCategory.length > 0) {
    return byCategory
  }

  // A API ainda não marca caixas como "arquivada"; usa boxes do catálogo.
  const all = await listProducts()
  return all.filter((product) => product.type === 'box')
}

export async function getLandingArchiveItems(): Promise<LandingArchiveItem[]> {
  const products = await listArchivedBoxes()
  return products
    .sort((a, b) => (a.cycleNumber ?? 0) - (b.cycleNumber ?? 0))
    .slice(0, LANDING_ARCHIVE_LIMIT)
    .map(toLandingArchiveItem)
}

export async function getLandingStandaloneProduct(): Promise<Product | null> {
  const products = await listProducts({ category: 'edicao-especial' })
  const fromApi = products.find((product) => product.type === 'box')
  if (fromApi) {
    return fromApi
  }

  // Categoria ainda ausente na API — mantém a edição especial mockada.
  return STANDALONE_EDITION_MOCK
}

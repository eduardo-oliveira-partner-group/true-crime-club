import { listProducts } from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'

const ARCHIVE_IMAGE_POSITIONS: Record<number, string> = {
  1: '42% 38%',
}

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
  const match = name.match(/^Box (\d+) — (.+)$/i)
  if (match) {
    return {
      box: `BOX ${match[1].padStart(2, '0')}`,
      title: match[2],
    }
  }
  return { box: 'BOX', title: name }
}

export function toLandingArchiveItem(product: Product): LandingArchiveItem {
  const { box, title } = parseBoxProductName(product.name)
  const cycle = product.cycleNumber ?? 0

  return {
    box,
    title,
    price: formatCurrency(product.price),
    href: `/loja/${product.slug}`,
    imagePath: product.images[0] ?? '',
    alt: product.name,
    objectPosition: ARCHIVE_IMAGE_POSITIONS[cycle] ?? 'center',
  }
}

export function getLandingArchiveItems(): LandingArchiveItem[] {
  return listProducts({ category: 'arquivada' })
    .sort((a, b) => (a.cycleNumber ?? 0) - (b.cycleNumber ?? 0))
    .map(toLandingArchiveItem)
}

export function getLandingStandaloneProduct(): Product | null {
  return (
    listProducts({ category: 'edicao-especial' }).find(
      (product) => product.type === 'box',
    ) ?? null
  )
}

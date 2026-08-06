import type { Metadata } from 'next'

import { getProductBySlug, getSeoEntry } from '@/src/lib/domain/repositories'
import { getPrimaryProductImageUrl } from '@/src/lib/domain/types'
import { buildMetadata } from '@/src/lib/seo'

import { ProductDetailPageClient } from './product-detail-page-client'

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return buildMetadata({
      path: `/loja/${slug}`,
      entry: getSeoEntry('/loja'),
      noindex: true,
    })
  }

  return buildMetadata({
    path: `/loja/${slug}`,
    title: `${product.name} — Loja`,
    entry: getSeoEntry('/loja'),
    image: getPrimaryProductImageUrl(product) || undefined,
    ogType: 'website',
  })
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params

  return <ProductDetailPageClient slug={slug} />
}

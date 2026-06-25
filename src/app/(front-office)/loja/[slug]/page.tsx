import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/src/components/seo/breadcrumbs'
import { ProductJsonLd } from '@/src/components/seo/product-json-ld'
import { Button } from '@/src/components/ui/button'
import {
  addCartItem,
  getProductBySlug,
  getSeoEntry,
  listProducts,
} from '@/src/lib/domain/repositories'
import {
  formatAvailability,
  formatCurrency,
  formatEditionMonth,
} from '@/src/lib/formatters'
import { buildMetadata } from '@/src/lib/seo'

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

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
    image: product.images[0],
    ogType: 'website',
  })
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = listProducts().filter(
    (p) => product.relatedProductIds?.includes(p.id) && p.id !== product.id,
  )

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Loja', path: '/loja' },
    { name: product.name, path: `/loja/${product.slug}` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <ProductJsonLd product={product} path={`/loja/${product.slug}`} />

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-brand-muted/40" />

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {formatAvailability(product.availability)}
          </p>
          <h1 className="font-heading text-3xl font-semibold">
            {product.name}
          </h1>
          {product.editionMonth ? (
            <p className="text-sm text-muted-foreground">
              Edição de {formatEditionMonth(product.editionMonth)}
            </p>
          ) : null}
          <p className="text-muted-foreground">{product.description}</p>
          <p className="text-2xl font-semibold">
            {formatCurrency(product.price)}
          </p>
          {product.subscriberPrice ? (
            <p className="text-sm text-muted-foreground">
              Preço assinante: {formatCurrency(product.subscriberPrice)}
            </p>
          ) : null}

          {product.includedItems?.length ? (
            <ul className="list-inside list-disc text-sm text-muted-foreground">
              {product.includedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          <form
            action={async () => {
              'use server'
              addCartItem({ productId: product.id })
            }}
          >
            <Button type="submit" disabled={!product.inStock}>
              {product.inStock ? 'Adicionar ao carrinho' : 'Indisponível'}
            </Button>
          </form>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-heading text-xl font-semibold">Relacionados</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/loja/${item.slug}`}
                className="rounded-xl border border-border p-4 hover:bg-muted/40"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

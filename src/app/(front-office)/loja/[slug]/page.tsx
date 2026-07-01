import {
  IconCalendarEvent,
  IconFingerprint,
  IconPackage,
} from '@tabler/icons-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/src/components/seo/breadcrumbs'
import { ProductJsonLd } from '@/src/components/seo/product-json-ld'
import { ProductDetailActions } from '@/src/components/shop/product-detail-actions'
import { ProductDetailGallery } from '@/src/components/shop/product-detail-gallery'
import { ProductDetailIncludedPreview } from '@/src/components/shop/product-detail-included-preview'
import { ProductDetailPricing } from '@/src/components/shop/product-detail-pricing'
import { RelatedProductCard } from '@/src/components/shop/related-product-card'
import {
  DetailDatum,
  ProductKicker,
} from '@/src/components/ui/product-quick-view'
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from '@/src/components/ui/scroll-reveal'
import {
  getProductBySlug,
  getSeoEntry,
  listProducts,
} from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { formatEditionMonth } from '@/src/lib/formatters'
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

function getReferenceCode(product: Product) {
  if (product.type === 'box' && product.cycleNumber) {
    return `EVID-${String(product.cycleNumber).padStart(2, '0')}`
  }

  return product.id.replace('prod-', 'ITEM-').toUpperCase()
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const productsList: Product[] = listProducts()

  const related = productsList.filter(
    (item) =>
      product.relatedProductIds?.includes(item.id) && item.id !== product.id,
  )

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Loja', path: '/loja' },
    { name: product.name, path: `/loja/${product.slug}` },
  ]

  return (
    <div className="bg-(--paper) text-(--ink)">
      <ProductJsonLd product={product} path={`/loja/${product.slug}`} />

      <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--paper)">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(216,65,50,0.12),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(215,181,109,0.1),transparent_28%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[auto,auto,42px_42px,42px_42px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
          <ScrollReveal>
            <Breadcrumbs items={breadcrumbItems} className="mb-8" />
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <article className="relative overflow-hidden border border-[rgba(33,28,24,0.15)] bg-(--paper-soft)/92 shadow-[0_18px_40px_rgba(33,28,24,0.38)] lg:grid lg:grid-cols-2 lg:items-stretch">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[38px_38px]" />

              <div className="relative z-10 flex flex-col border-b border-[rgba(33,28,24,0.15)] lg:border-r lg:border-b-0">
                <ProductDetailGallery product={product} />

                <div className="hidden flex-col gap-4 border-t border-[rgba(33,28,24,0.15)] bg-(--card) p-5 sm:p-6 lg:mt-auto lg:flex">
                  <ProductDetailPricing
                    product={product}
                    variant="inline"
                    className="border-0 pt-0"
                  />
                  <ProductDetailActions
                    productId={product.id}
                    inStock={product.inStock}
                  />
                </div>
              </div>

              <div className="relative z-10 flex flex-col">
                <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(33,28,24,0.15)] p-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center border border-[rgba(33,28,24,0.15)] bg-(--card)/7 text-(--red)">
                      <IconPackage className="size-5" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-(--red) uppercase">
                        Ficha do arquivo
                      </p>
                      <p className="font-mono text-xs text-(--ink)/45">
                        {getReferenceCode(product)}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-8">
                  <div className="space-y-6">
                    <ProductKicker product={product} />

                    <h1 className="font-heading text-3xl/tight font-semibold tracking-wide text-(--ink) uppercase sm:text-4xl">
                      {product.name}
                    </h1>

                    <div className="grid gap-3 border-y border-[rgba(33,28,24,0.15)] py-5 text-sm text-(--ink-soft) sm:grid-cols-2">
                      {product.editionMonth ? (
                        <DetailDatum
                          icon={<IconCalendarEvent className="size-4" />}
                          label="Edição"
                          value={formatEditionMonth(product.editionMonth)}
                        />
                      ) : (
                        <DetailDatum
                          icon={<IconFingerprint className="size-4" />}
                          label="Categoria"
                          value={product.categories[0] ?? 'produto'}
                        />
                      )}
                      <DetailDatum
                        icon={<IconPackage className="size-4" />}
                        label="Tipo"
                        value={
                          product.type === 'box'
                            ? 'Box avulsa'
                            : 'Produto extra'
                        }
                      />
                    </div>

                    <p className="text-base/7 text-(--ink-soft)">
                      {product.description}
                    </p>
                  </div>

                  {product.includedItems?.length ? (
                    <ProductDetailIncludedPreview
                      items={product.includedItems}
                      className="mt-6 hidden lg:block"
                    />
                  ) : (
                    <div className="mt-auto hidden border-t border-[rgba(33,28,24,0.15)] pt-5 lg:block">
                      <p className="text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
                        Nota do arquivo
                      </p>
                      <p className="mt-2 text-sm/6 text-(--ink-soft)">
                        Peça curada pelo True Crime Club para ampliar a coleção
                        e manter a experiência investigativa entre entregas.
                      </p>
                    </div>
                  )}

                  <div className="mt-auto space-y-6 pt-6 lg:hidden">
                    <ProductDetailPricing product={product} variant="inline" />
                    <ProductDetailActions
                      productId={product.id}
                      inStock={product.inStock}
                    />
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {product.includedItems?.length ? (
        <section className="relative isolate overflow-hidden border-b border-[rgba(33,28,24,0.15)] bg-(--card) lg:hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <ScrollReveal>
              <div className="mb-8 max-w-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-semibold tracking-[0.22em] text-(--red) uppercase">
                    Conteúdo do arquivo
                  </p>
                  <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
                </div>
                <h2 className="font-heading text-2xl/tight font-semibold tracking-tight text-(--ink) sm:text-3xl">
                  O que compõe esta entrega.
                </h2>
                <p className="text-sm/6 text-(--ink-soft)">
                  Cada item foi curado para ampliar a experiência investigativa
                  e manter o valor percebido da coleção.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="border border-[rgba(33,28,24,0.15)] bg-(--card) p-6 shadow-[0_18px_40px_rgba(33,28,24,0.32)] sm:p-8">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.includedItems?.map((item: string) => (
                    <li
                      key={item}
                      className="flex gap-3 border border-[rgba(33,28,24,0.15)] bg-(--paper)/72 px-4 py-3 text-sm/6 text-(--ink-soft)"
                    >
                      <span className="mt-2 size-1.5 shrink-0 bg-[#d84132]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      <section className="relative isolate overflow-hidden bg-(--paper-soft)">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.03)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.03)_1px,transparent_1px)] bg-size-[56px_56px]" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <ScrollReveal>
            <div className="border border-[rgba(33,28,24,0.15)] bg-(--card) p-6 shadow-[0_18px_40px_rgba(33,28,24,0.32)] sm:p-8">
              <p className="text-xs font-semibold tracking-[0.22em] text-(--red) uppercase">
                Regras de compra
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold text-(--ink) sm:text-2xl">
                Antes de adicionar ao carrinho
              </h2>
              <ul className="mt-5 grid gap-3 text-sm/6 text-(--ink-soft) sm:grid-cols-2">
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-[#d7b56d]" />
                  <span>
                    Boxes avulsas são enviadas conforme disponibilidade de
                    estoque e prazo informado no checkout.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-[#d7b56d]" />
                  <span>
                    Preços de assinante exigem plano ativo no True Crime Club.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-[#d7b56d]" />
                  <span>
                    Itens esgotados ou indisponíveis não podem ser adicionados
                    ao carrinho.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 bg-[#d7b56d]" />
                  <span>
                    Frete e formas de pagamento são confirmados na etapa final
                    da compra.
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="relative isolate overflow-hidden border-t border-[rgba(33,28,24,0.15)] bg-(--card)">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_8%,rgba(216,65,50,0.1),transparent_30%),linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[auto,56px_56px,56px_56px]" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <ScrollReveal>
              <div className="mb-10 max-w-2xl space-y-4">
                <div className="flex items-center gap-4">
                  <p className="text-xs font-semibold tracking-[0.22em] text-(--red) uppercase">
                    Arquivos relacionados
                  </p>
                  <span className="hidden h-px flex-1 bg-[#d7b56d]/45 sm:block" />
                </div>
                <h2 className="font-heading text-2xl/tight font-semibold tracking-tight text-(--ink) sm:text-3xl">
                  Continue montando o dossie.
                </h2>
                <p className="text-sm/6 text-(--ink-soft)">
                  Outras peças do arquivo que complementam esta entrega ou
                  ajudam a completar a coleção.
                </p>
              </div>
            </ScrollReveal>

            <ScrollRevealGroup
              className="grid gap-5 sm:grid-cols-2"
              staggerChildren={0.08}
            >
              {related.map((item) => (
                <ScrollRevealItem key={item.id}>
                  <RelatedProductCard product={item} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealGroup>
          </div>
        </section>
      ) : null}
    </div>
  )
}

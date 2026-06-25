import { IconSparkles } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import previousBoxesBanner from '@/src/assets/images/home/previous-boxes-banner.png'
import { ShopCatalog } from '@/src/components/shop/shop-catalog'
import {
  AvailabilityBadge,
  PriceBlock,
} from '@/src/components/ui/product-quick-view'
import { ScrollReveal } from '@/src/components/ui/scroll-reveal'
import { listProducts } from '@/src/lib/domain/repositories'
import type { Product } from '@/src/lib/domain/types'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

const stats = [
  { label: 'boxes no arquivo', value: '04' },
  { label: 'preço assinante', value: 'R$159' },
  { label: 'curadoria TCC', value: '100%' },
]

export default function LojaPage() {
  const products = listProducts()
  const boxProducts = products.filter((product) => product.type === 'box')
  const extraProducts = products.filter((product) => product.type !== 'box')
  const featuredBox =
    boxProducts.find((product) => product.availability === 'limited') ??
    boxProducts.find((product) => product.inStock) ??
    boxProducts[0]

  return (
    <div className="bg-[#090807] text-[#fffaf0]">
      <section className="relative isolate overflow-hidden border-b border-[#fffaf0]/10 bg-[#090807]">
        <Image
          src={previousBoxesBanner}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover object-[68%_center] brightness-[0.74] saturate-[0.86]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,8,7,0.98)_0%,rgba(9,8,7,0.86)_42%,rgba(9,8,7,0.42)_72%,rgba(9,8,7,0.34)_100%),linear-gradient(180deg,rgba(9,8,7,0.58)_0%,rgba(9,8,7,0.94)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.04)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.04)_1px,transparent_1px)] bg-size-[42px_42px]" />

        <div className="relative z-10 mx-auto grid min-h-[560px] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="max-w-2xl space-y-6">
            <ScrollReveal>
              <div className="flex items-center gap-4">
                <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                  Loja oficial
                </p>
                <span className="h-px flex-1 bg-[#d7b56d]/45" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h1 className="max-w-[20rem] font-heading text-3xl leading-[1.06] font-black text-[#fffaf0] uppercase sm:max-w-2xl sm:text-5xl lg:text-6xl">
                Arquivos abertos para colecionadores.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.14}>
              <p className="max-w-xl text-base/7 text-[#d7c9b5] sm:text-lg/8">
                Boxes anteriores, edições avulsas e itens complementares do True
                Crime Club continuam disponíveis enquanto houver estoque.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid max-w-xl grid-cols-3 border border-[#fffaf0]/14 bg-[#090807]/72 backdrop-blur-sm">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={cn(
                      'min-w-0 p-3 sm:p-5',
                      index > 0 ? 'border-l border-[#fffaf0]/14' : '',
                    )}
                  >
                    <p className="font-heading text-xl leading-none font-black text-[#fffaf0] sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[0.58rem]/4 font-semibold tracking-[0.12em] text-[#d7b56d] uppercase sm:text-[0.65rem] sm:tracking-[0.16em]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {featuredBox ? (
            <ScrollReveal delay={0.16}>
              <FeaturedProductCase product={featuredBox} />
            </ScrollReveal>
          ) : null}
        </div>
      </section>

      <ShopCatalog boxProducts={boxProducts} extraProducts={extraProducts} />
    </div>
  )
}

function FeaturedProductCase({ product }: { product: Product }) {
  const productImage = getProductImage(product.images[0] ?? '')

  return (
    <Link
      href={`/loja/${product.slug}`}
      className="group block border border-[#d7b56d]/28 bg-[#090807]/82 p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42)] backdrop-blur-sm transition hover:border-[#d7b56d]/48 focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:outline-none sm:p-5"
    >
      <div className="relative aspect-4/3 overflow-hidden border border-[#fffaf0]/12 bg-[#171211]">
        {productImage ? (
          <Image
            src={productImage}
            alt={product.name}
            fill
            placeholder="blur"
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <EvidencePlaceholder product={product} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.02)_0%,rgba(9,8,7,0.58)_100%)]" />
        <AvailabilityBadge
          product={product}
          className="absolute top-4 left-4"
        />
      </div>
      <div className="grid gap-5 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="border-l-2 border-[#d84132] pl-3 text-xs font-semibold tracking-[0.2em] text-[#ffb0a5] uppercase">
            Arquivo em destaque
          </p>
          <h2 className="mt-3 font-heading text-2xl/tight font-semibold tracking-wide text-[#fffaf0] uppercase">
            {product.name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm/6 text-[#d7c9b5]">
            {product.shortDescription}
          </p>
        </div>
        <PriceBlock product={product} />
      </div>
    </Link>
  )
}

function EvidencePlaceholder({ product }: { product: Product }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#120f0d]">
      <div className="absolute inset-6 border border-[#d7b56d]/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(216,65,50,0.16),transparent_28%),radial-gradient(circle_at_48%_58%,rgba(215,181,109,0.12),transparent_32%)]" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <IconSparkles className="size-9 text-[#d7b56d]" />
        <p className="mt-3 max-w-44 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] uppercase">
          {product.categories[0] ?? 'item'} do arquivo
        </p>
      </div>
    </div>
  )
}

import { JsonLd } from '@/src/components/seo/json-ld'
import type { Product } from '@/src/lib/domain/types'
import { siteConfig } from '@/src/lib/site'

interface ProductJsonLdProps {
  product: Product
  /** Caminho absoluto da rota do produto (ex.: "/loja/tcc-caixa-03-avulsa"). */
  path: string
}

export function ProductJsonLd({ product, path }: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.categories.join(', '),
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    image: product.images.map((image) =>
      image.startsWith('http') ? image : `${siteConfig.url}${image}`,
    ),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.subscriberPrice ?? product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}${path}`,
      priceSpecification: product.subscriberPrice
        ? {
            '@type': 'PriceSpecification',
            price: product.price,
            priceCurrency: 'BRL',
          }
        : undefined,
    },
  }

  return <JsonLd data={jsonLd} />
}

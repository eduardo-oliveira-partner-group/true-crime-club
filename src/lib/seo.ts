import type { Metadata } from 'next'

import type { SeoEntry } from '@/src/lib/domain/types'
import { siteConfig } from '@/src/lib/site'

interface BuildMetadataOptions {
  path: string
  entry?: SeoEntry | null
  /**
   * Quando definido, sobrescreve o título dinâmico (ex.: nome do produto).
   * Continua aplicando o template do root layout.
   */
  title?: string
  /** Descrição SEO; sobrescreve `entry.description` quando informada. */
  description?: string
  /** Imagem OG específica (absoluta ou path público). */
  image?: string
  /** Marca a rota como não indexável (ex.: páginas privadas). */
  noindex?: boolean
  /** Tipo Open Graph (website ou article). */
  ogType?: 'website' | 'article'
}

function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.url}${normalized}`
}

function resolveImage(image?: string): string | undefined {
  if (!image) return undefined
  if (image.startsWith('http')) return image
  return absoluteUrl(image)
}

export function buildMetadata({
  path,
  entry,
  title,
  description: descriptionOverride,
  image,
  noindex,
  ogType = 'website',
}: BuildMetadataOptions): Metadata {
  const resolvedTitle = title ?? entry?.title
  const description =
    descriptionOverride ?? entry?.description ?? siteConfig.description
  const canonical = entry?.canonical ?? absoluteUrl(path)
  const ogImage = resolveImage(image ?? entry?.ogImage ?? siteConfig.ogImage)
  const shouldNoindex = noindex ?? entry?.noindex ?? false

  return {
    title: resolvedTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: ogType,
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: resolvedTitle ?? siteConfig.name,
      description,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630 }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter,
      title: resolvedTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: shouldNoindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export { absoluteUrl }

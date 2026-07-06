import type { MetadataRoute } from 'next'

import { listCmsPages, listProducts } from '@/src/lib/domain/repositories'
import { siteConfig } from '@/src/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/loja`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/assinatura`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const productRoutes: MetadataRoute.Sitemap = listProducts().map(
    (product) => ({
      url: `${siteConfig.url}/loja/${product.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  )

  const cmsPages = await listCmsPages()
  const cmsRoutes: MetadataRoute.Sitemap = cmsPages
    .filter((page) => page.rota !== '/' && page.status === 'publicada')
    .map((page) => ({
      url: `${siteConfig.url}${page.rota}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [...staticRoutes, ...productRoutes, ...cmsRoutes]
}

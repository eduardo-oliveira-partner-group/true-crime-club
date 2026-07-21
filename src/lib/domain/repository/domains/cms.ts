import {
  mockCmsMenus,
  mockCmsPages,
  mockDynamicContent,
  mockSeoEntries,
} from '../../mock-data'
import type {
  DynamicContentBlock,
  MenuCms,
  PaginaCms,
  SeoEntry,
} from '../../types'
import { throwIfError } from '../core/helpers'

export function getDynamicContent(key: string): DynamicContentBlock | null {
  throwIfError()
  return mockDynamicContent.find((block) => block.key === key) ?? null
}

export function getDynamicContentByRoute(route: string): DynamicContentBlock[] {
  throwIfError()
  return mockDynamicContent.filter((block) => block.route === route)
}

export function getSeoEntry(path: string): SeoEntry | null {
  throwIfError()
  const cmsPage = mockCmsPages.find((page) => page.rota === path)
  if (cmsPage) {
    return {
      title: cmsPage.seo.titulo,
      description: cmsPage.seo.descricao,
      canonical: cmsPage.seo.urlCanonica,
      ogImage: cmsPage.seo.imagemCompartilhamento,
      noindex: cmsPage.seo.naoIndexar,
    }
  }
  return mockSeoEntries[path] ?? null
}

export async function getCmsPageByRoute(
  route: string,
): Promise<PaginaCms | null> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(
        `${baseUrl}/paginas?rota=${encodeURIComponent(route)}`,
        {
          next: { revalidate: 300 },
        },
      )
      if (!res.ok) return null
      const data = await res.json()
      return Array.isArray(data) ? data[0] : data
    } catch (e) {
      console.error('Error fetching CMS page by route:', e)
    }
  }
  return mockCmsPages.find((p) => p.rota === route) ?? null
}

export async function listCmsPages(): Promise<PaginaCms[]> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/paginas`, {
        next: { revalidate: 300 },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error('Error listing CMS pages:', e)
    }
  }
  return mockCmsPages
}

export async function getCmsMenu(chave: string): Promise<MenuCms | null> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/menus/${encodeURIComponent(chave)}`, {
        next: { revalidate: 300 },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error('Error fetching CMS menu:', e)
    }
  }
  return mockCmsMenus[chave] ?? null
}

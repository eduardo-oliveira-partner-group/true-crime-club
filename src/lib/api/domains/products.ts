import { fetcher } from '../core/fetcher'

export const productsApi = {
  list: (params?: { featured?: boolean; category?: string }) => {
    const q = new URLSearchParams()
    if (params?.featured !== undefined) {
      q.append('destaque', String(params.featured))
    }
    if (params?.category) q.append('categoria', params.category)
    const queryStr = q.toString()
    return fetcher(`/produtos${queryStr ? `?${queryStr}` : ''}`)
  },
  getBySlug: (slug: string) => fetcher(`/produtos/${slug}`),
}

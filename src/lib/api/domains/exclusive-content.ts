import { fetcher } from '../core/fetcher'

export const exclusiveContentApi = {
  list: () => fetcher('/conteudos-exclusivos'),
  getBySlug: (slug: string) => fetcher(`/conteudos-exclusivos/${slug}`),
}

import { fetcher } from '../core/fetcher'

export const plansApi = {
  list: () => fetcher('/planos'),
  getBySlug: (slug: string) => fetcher(`/planos/${slug}`),
}

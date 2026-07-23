import { fetcher } from '../core/fetcher'

export const plansApi = {
  list: () => fetcher('/planos'),
  getById: (id: string) => fetcher(`/planos/${encodeURIComponent(id)}`),
}

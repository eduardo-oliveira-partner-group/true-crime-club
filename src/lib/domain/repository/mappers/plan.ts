import type { BillingInterval, SubscriptionPlan } from '../../types'

export type ApiPlan = {
  id: string
  identificador: string
  nome: string
  descricao?: string
  intervaloCobranca?: string
  preco: number
  precoPorMes?: number
  recomendado?: boolean
  beneficios?: string[]
  mesesCompromisso?: number
}

export function mapApiPlanToDomain(apiPlan: ApiPlan): SubscriptionPlan {
  const billingIntervalMap: Record<string, BillingInterval> = {
    mensal: 'monthly',
    anual: 'annual',
    avulso: 'one_time',
  }

  return {
    id: apiPlan.id,
    slug: apiPlan.identificador,
    name: apiPlan.nome,
    description: apiPlan.descricao ?? '',
    billingInterval:
      billingIntervalMap[apiPlan.intervaloCobranca ?? ''] ?? 'monthly',
    price: apiPlan.preco,
    pricePerMonth: apiPlan.precoPorMes,
    isRecommended: apiPlan.recomendado ?? false,
    features: apiPlan.beneficios ?? [],
    commitmentMonths: apiPlan.mesesCompromisso,
  }
}

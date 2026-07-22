import { apiClient } from '@/src/lib/api-client'

import type { SubscriptionPlan } from '../../types'
import { isNotFoundError } from '../core/helpers'
import { mapApiPlanToDomain } from '../mappers/plan'

export async function listPlans(): Promise<SubscriptionPlan[]> {
  const apiPlans = await apiClient.plans.list()
  return apiPlans.map(mapApiPlanToDomain)
}

export async function getPlanBySlug(
  slug: string,
): Promise<SubscriptionPlan | null> {
  try {
    const apiPlan = await apiClient.plans.getBySlug(slug)
    return mapApiPlanToDomain(apiPlan)
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

import { apiClient } from '@/src/lib/api-client'

import { mockPlans } from '../../mock-data'
import { shouldReturnEmpty } from '../../scenarios'
import type { SubscriptionPlan } from '../../types'
import { isLocalMockMode, isNotFoundError, throwIfError } from '../core/helpers'
import { mapApiPlanToDomain } from '../mappers/plan'

export async function listPlans(): Promise<SubscriptionPlan[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiPlans = await apiClient.plans.list()
    return apiPlans.map(mapApiPlanToDomain)
  }

  const result = shouldReturnEmpty(mockPlans)
  return result ?? mockPlans
}

export async function getPlanBySlug(
  slug: string,
): Promise<SubscriptionPlan | null> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return mockPlans.find((p) => p.slug === slug) ?? null
}

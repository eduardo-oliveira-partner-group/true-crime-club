import { apiClient } from '@/src/lib/api-client'

import type { ExclusiveContent } from '../../types'
import { isNotFoundError } from '../core/helpers'
import { mapApiExclusiveContentToDomain } from '../mappers/exclusive-content'

export async function listExclusiveContent(): Promise<ExclusiveContent[]> {
  const apiContent = await apiClient.exclusiveContent.list()
  return apiContent.map(mapApiExclusiveContentToDomain)
}

export async function getExclusiveContentBySlug(
  slug: string,
): Promise<ExclusiveContent | null> {
  try {
    const apiContent = await apiClient.exclusiveContent.getBySlug(slug)
    return mapApiExclusiveContentToDomain(apiContent)
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

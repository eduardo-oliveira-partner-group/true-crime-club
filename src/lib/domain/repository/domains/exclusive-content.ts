import { apiClient } from '@/src/lib/api-client'

import { mockExclusiveContent } from '../../mock-data'
import { isScenario, shouldReturnEmpty } from '../../scenarios'
import type { ExclusiveContent } from '../../types'
import { isLocalMockMode, isNotFoundError, throwIfError } from '../core/helpers'
import { mapApiExclusiveContentToDomain } from '../mappers/exclusive-content'

export async function listExclusiveContent(): Promise<ExclusiveContent[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiContent = await apiClient.exclusiveContent.list()
    return apiContent.map(mapApiExclusiveContentToDomain)
  }

  return listExclusiveContentMock()
}

export function listExclusiveContentMock(): ExclusiveContent[] {
  throwIfError()

  let content = [...mockExclusiveContent]

  if (isScenario('blocked')) {
    content = content.map((c) =>
      c.status === 'liberado'
        ? c
        : {
            ...c,
            status: 'bloqueado' as const,
            blockedReason: 'Libera no próximo ciclo',
          },
    )
  }

  const result = shouldReturnEmpty(content)
  return result ?? content
}

export async function getExclusiveContentBySlug(
  slug: string,
): Promise<ExclusiveContent | null> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return mockExclusiveContent.find((c) => c.slug === slug) ?? null
}

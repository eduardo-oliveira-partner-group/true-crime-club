import { apiClient } from '@/src/lib/api-client'

import type {
  Case,
  Clue,
  InvestigationFilesByBox,
  SubscriberProgress,
} from '../../types'
import { isNotFoundError, isUnauthorizedError } from '../core/helpers'
import {
  mapApiCaseToDomain,
  mapApiClueToDomain,
  mapApiProgressToDomain,
} from '../mappers/case'
import { mapApiExclusiveContentToDomain } from '../mappers/exclusive-content'

async function fetchCasesBundle(): Promise<{
  activeCase: Case | null
  progress: SubscriberProgress | null
  clues: Clue[]
}> {
  try {
    const data = await apiClient.cases.getData()
    return {
      activeCase: data.casoAtivo ? mapApiCaseToDomain(data.casoAtivo) : null,
      progress: data.progresso ? mapApiProgressToDomain(data.progresso) : null,
      clues: Array.isArray(data.pistas)
        ? data.pistas.map(mapApiClueToDomain)
        : [],
    }
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return { activeCase: null, progress: null, clues: [] }
    }
    throw error
  }
}

export async function listInvestigationFilesByBox(): Promise<
  InvestigationFilesByBox[]
> {
  return await apiClient.cases.listFiles()
}

export async function getActiveCase(): Promise<Case | null> {
  const bundle = await fetchCasesBundle()
  return bundle.activeCase
}

export async function listClues(caseId?: string): Promise<Clue[]> {
  const bundle = await fetchCasesBundle()
  return caseId ? bundle.clues.filter((c) => c.caseId === caseId) : bundle.clues
}

export async function getClueBySlug(slug: string): Promise<Clue | null> {
  const bundle = await fetchCasesBundle()
  const fromBundle = bundle.clues.find((c) => c.slug === slug)
  if (fromBundle) {
    return fromBundle
  }

  try {
    const apiContent = await apiClient.exclusiveContent.getBySlug(slug)
    const mapped = mapApiExclusiveContentToDomain(apiContent)
    return {
      id: mapped.id,
      slug: mapped.slug,
      caseId: bundle.activeCase?.id ?? '',
      title: mapped.title,
      description: mapped.description,
      cycleNumber: mapped.cycleNumber,
      status: mapped.status,
      blockedReason: mapped.blockedReason,
      files: mapped.files ?? [],
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

export async function getSubscriberProgress(
  caseId?: string,
): Promise<SubscriberProgress | null> {
  const bundle = await fetchCasesBundle()
  if (!bundle.progress) {
    return null
  }
  if (caseId && bundle.progress.caseId !== caseId) {
    return null
  }
  return bundle.progress
}

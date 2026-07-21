import { apiClient } from '@/src/lib/api-client'

import {
  mockActiveCase,
  mockClues,
  mockFilesByBox,
  mockSubscriberProgress,
} from '../../mock-data'
import { isScenario, shouldReturnEmpty } from '../../scenarios'
import type {
  Case,
  Clue,
  InvestigationFilesByBox,
  SubscriberProgress,
} from '../../types'
import {
  isLocalMockMode,
  isNotFoundError,
  isUnauthorizedError,
  throwIfError,
} from '../core/helpers'
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
} | null> {
  if (isLocalMockMode()) {
    return null
  }

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
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.cases.listFiles()
  }

  return listInvestigationFilesByBoxMock()
}

export function listInvestigationFilesByBoxMock(): InvestigationFilesByBox[] {
  throwIfError()
  const keys = Object.keys(mockFilesByBox)
  return keys.map((key) => ({
    id: key,
    arquivos: mockFilesByBox[key].arquivos,
    documentos: mockFilesByBox[key].documentos,
  }))
}

export async function getActiveCase(): Promise<Case | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    return bundle.activeCase
  }

  return getActiveCaseMock()
}

export function getActiveCaseMock(): Case | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockActiveCase
}

export async function listClues(caseId?: string): Promise<Clue[]> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    return caseId
      ? bundle.clues.filter((c) => c.caseId === caseId)
      : bundle.clues
  }

  return listCluesMock(caseId)
}

export function listCluesMock(caseId?: string): Clue[] {
  throwIfError()

  let clues = caseId
    ? mockClues.filter((c) => c.caseId === caseId)
    : [...mockClues]

  if (isScenario('blocked')) {
    clues = clues.map((c, index) =>
      index >= 2
        ? {
            ...c,
            status: 'bloqueado' as const,
            blockedReason: 'Libera no próximo ciclo',
          }
        : c,
    )
  }

  const result = shouldReturnEmpty(clues)
  return result ?? clues
}

export async function getClueBySlug(slug: string): Promise<Clue | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    const fromBundle = bundle.clues.find((c) => c.slug === slug)
    if (fromBundle) {
      return fromBundle
    }
  }

  if (!isLocalMockMode()) {
    try {
      const apiContent = await apiClient.exclusiveContent.getBySlug(slug)
      const mapped = mapApiExclusiveContentToDomain(apiContent)
      return {
        id: mapped.id,
        slug: mapped.slug,
        caseId: bundle?.activeCase?.id ?? mockActiveCase.id,
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

  return mockClues.find((c) => c.slug === slug) ?? null
}

export async function getSubscriberProgress(
  caseId?: string,
): Promise<SubscriberProgress | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle?.progress) {
    if (caseId && bundle.progress.caseId !== caseId) {
      return null
    }
    return bundle.progress
  }

  return getSubscriberProgressMock(caseId)
}

export function getSubscriberProgressMock(
  caseId?: string,
): SubscriberProgress | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  if (caseId && mockSubscriberProgress.caseId !== caseId) {
    return null
  }
  return mockSubscriberProgress
}

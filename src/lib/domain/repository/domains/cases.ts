import { apiClient } from '@/src/lib/api-client'

import type {
  CaseDetail,
  CaseSummary,
  InvestigationFilesByBox,
} from '../../types'

export async function listCases(): Promise<CaseSummary[]> {
  return await apiClient.cases.list()
}

export async function getCase(idCaso: string): Promise<CaseDetail> {
  return await apiClient.cases.get(idCaso)
}

export async function listInvestigationFilesByBox(
  idCaso: string,
): Promise<InvestigationFilesByBox[]> {
  return await apiClient.cases.listFiles(idCaso)
}

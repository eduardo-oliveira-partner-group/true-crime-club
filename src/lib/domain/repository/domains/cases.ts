import { apiClient } from '@/src/lib/api-client'

import type {
  CaseDetail,
  CaseSummary,
  InvestigationFilesByBox,
} from '../../types'

export async function listCases(): Promise<CaseSummary[]> {
  return await apiClient.cases.list()
}

export async function getCase(identificador: string): Promise<CaseDetail> {
  return await apiClient.cases.get(identificador)
}

export async function listInvestigationFilesByBox(
  identificador: string,
): Promise<InvestigationFilesByBox[]> {
  return await apiClient.cases.listFiles(identificador)
}

import type { ExclusiveContent } from '../../types'
import { type ApiCaseFile, mapApiCaseFileToDomain } from './case'

export type ApiExclusiveContent = {
  id: string
  identificador: string
  titulo: string
  descricao: string
  status?: string
  numeroCiclo: number
  motivoBloqueio?: string
  tipo?: string
  arquivos?: ApiCaseFile[]
}

export function mapApiExclusiveContentToDomain(
  apiContent: ApiExclusiveContent,
): ExclusiveContent {
  const contentTypeMap: Record<string, ExclusiveContent['type']> = {
    pista: 'clue',
    video: 'video',
    documento: 'document',
    artigo: 'article',
  }

  return {
    id: apiContent.id,
    slug: apiContent.identificador,
    title: apiContent.titulo,
    description: apiContent.descricao,
    status: apiContent.status === 'bloqueado' ? 'bloqueado' : 'liberado',
    cycleNumber: apiContent.numeroCiclo,
    blockedReason: apiContent.motivoBloqueio,
    type: contentTypeMap[apiContent.tipo ?? ''] ?? 'clue',
    files: Array.isArray(apiContent.arquivos)
      ? apiContent.arquivos.map(mapApiCaseFileToDomain)
      : [],
  }
}

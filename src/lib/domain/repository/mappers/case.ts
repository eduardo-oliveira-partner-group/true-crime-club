import type { Case, CaseFile, Clue, SubscriberProgress } from '../../types'

export type ApiCaseFile = {
  id: string
  nome: string
  tipo?: string
  urlDownload: string
  tamanho?: string
}

export type ApiCase = {
  id: string
  identificador: string
  titulo: string
  descricao: string
  ano: number
  totalPistas: number
  dataEventoAoVivo: string
  tituloEventoAoVivo: string
}

export type ApiProgress = {
  idCaso: string
  pistasColetadas: number
  totalPistas: number
  cicloAtual: number
  dataEventoAoVivo: string
  tituloEventoAoVivo: string
  percentualCompleto: number
}

export type ApiClue = {
  id: string
  identificador: string
  idCaso: string
  titulo: string
  descricao: string
  numeroCiclo: number
  status?: string
  motivoBloqueio?: string
  arquivos?: ApiCaseFile[]
  liberadoEm?: string
}

export function mapApiCaseFileToDomain(file: ApiCaseFile): CaseFile {
  const typeMap: Record<string, 'pdf' | 'image' | 'audio' | 'video'> = {
    pdf: 'pdf',
    imagem: 'image',
    audio: 'audio',
    video: 'video',
  }

  return {
    id: file.id,
    name: file.nome,
    type: typeMap[file.tipo ?? ''] ?? 'pdf',
    downloadUrl: file.urlDownload,
    sizeLabel: file.tamanho,
  }
}

export function mapApiCaseToDomain(apiCase: ApiCase): Case {
  return {
    id: apiCase.id,
    slug: apiCase.identificador,
    title: apiCase.titulo,
    description: apiCase.descricao,
    year: apiCase.ano,
    totalClues: apiCase.totalPistas,
    liveEventDate: apiCase.dataEventoAoVivo,
    liveEventTitle: apiCase.tituloEventoAoVivo,
  }
}

export function mapApiProgressToDomain(
  apiProgress: ApiProgress,
): SubscriberProgress {
  return {
    caseId: apiProgress.idCaso,
    collectedClues: apiProgress.pistasColetadas,
    totalClues: apiProgress.totalPistas,
    currentCycle: apiProgress.cicloAtual,
    liveEventDate: apiProgress.dataEventoAoVivo,
    liveEventTitle: apiProgress.tituloEventoAoVivo,
    percentComplete: apiProgress.percentualCompleto,
  }
}

export function mapApiClueToDomain(apiClue: ApiClue): Clue {
  return {
    id: apiClue.id,
    slug: apiClue.identificador,
    caseId: apiClue.idCaso,
    title: apiClue.titulo,
    description: apiClue.descricao,
    cycleNumber: apiClue.numeroCiclo,
    status: apiClue.status === 'bloqueado' ? 'bloqueado' : 'liberado',
    blockedReason: apiClue.motivoBloqueio,
    files: Array.isArray(apiClue.arquivos)
      ? apiClue.arquivos.map(mapApiCaseFileToDomain)
      : [],
    releasedAt: apiClue.liberadoEm,
  }
}

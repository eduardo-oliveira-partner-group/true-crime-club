import type {
  CaseBox,
  CaseDetail,
  CaseSummary,
  InvestigationFilesByBox,
} from '@/src/lib/domain/types'

import { fetcher } from '../core/fetcher'
import {
  asArray,
  asNumber,
  asOptionalNumber,
  asOptionalString,
  asString,
} from '../core/json'
import { toInvestigationFilesByBox } from '../mappers/investigation'

export const casesApi = {
  list: (): Promise<CaseSummary[]> =>
    fetcher('/casos').then((res) => asArray(res).map(toCaseSummary)),
  get: (identificador: string): Promise<CaseDetail> =>
    fetcher(`/casos/${encodeURIComponent(identificador)}`).then(toCaseDetail),
  listFiles: (identificador: string): Promise<InvestigationFilesByBox[]> =>
    fetcher(`/casos/${encodeURIComponent(identificador)}/arquivos`).then(
      (res) => asArray(res.boxes).map(toInvestigationFilesByBox),
    ),
}

function toCaseSummary(
  data: Parameters<typeof toInvestigationFilesByBox>[0],
): CaseSummary {
  return {
    id: asString(data.id),
    identifier: asString(data.identificador),
    title: asString(data.titulo),
    description: asOptionalString(data.descricao),
    year: asOptionalNumber(data.ano),
    liveEventDate: asOptionalString(data.dataEventoAoVivo),
    liveEventTitle: asOptionalString(data.tituloEventoAoVivo),
  }
}

function toCaseDetail(
  data: Parameters<typeof toInvestigationFilesByBox>[0],
): CaseDetail {
  return {
    ...toCaseSummary(data),
    boxes: asArray(data.boxes).map(
      (box): CaseBox => ({
        id: asString(box.id),
        number: asNumber(box.numero),
        name: asString(box.nome),
        description: asOptionalString(box.descricao),
      }),
    ),
  }
}

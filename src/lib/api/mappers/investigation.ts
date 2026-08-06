import type {
  InvestigationFile,
  InvestigationFilesByBox,
  InvestigationFileType,
} from '@/src/lib/domain/types'

import type { JsonObject, JsonValue } from '../core/json'
import { asArray, asNumber, asOptionalString, asString } from '../core/json'

function toInvestigationFileType(
  value: JsonValue | undefined,
): InvestigationFileType {
  if (typeof value !== 'string') return 'text'
  if (value === 'audio' || value.startsWith('audio/')) return 'audio'
  if (value === 'image' || value.startsWith('image/')) return 'image'
  if (value === 'pdf' || value === 'application/pdf') return 'pdf'
  if (
    value === 'sheet' ||
    value.includes('spreadsheet') ||
    value.includes('excel')
  ) {
    return 'sheet'
  }
  return 'text'
}

export function toInvestigationFile(data: JsonObject): InvestigationFile {
  return {
    id: asString(data.id),
    name: asString(data.nome),
    type: toInvestigationFileType(data.tipo),
    modified: asString(data.modificadoEm),
    size: String(data.tamanhoBytes ?? ''),
    storageKey: asOptionalString(data.storageKey),
    downloadUrl: asOptionalString(data.downloadUrl),
    content: asOptionalString(data.conteudo),
    corrupted: data.corrompido === true,
    columns: Array.isArray(data.colunas) ? data.colunas.map(String) : undefined,
    rows: Array.isArray(data.linhas)
      ? data.linhas.map((row) => (Array.isArray(row) ? row.map(String) : []))
      : undefined,
    fragment: asOptionalString(data.fragmento),
  }
}

export function toInvestigationFilesByBox(
  data: JsonObject,
): InvestigationFilesByBox {
  return {
    id: asString(data.id),
    number: asNumber(data.numero),
    name: asOptionalString(data.nome),
    arquivos: asArray(data.arquivos).map(toInvestigationFile),
    documentos: asArray(data.documentos).map(toInvestigationFile),
  }
}

import type {
  InvestigationFile,
  InvestigationFilesByBox,
  InvestigationFileType,
} from '@/src/lib/domain/types'

import type { JsonObject, JsonValue } from '../core/json'
import { asArray, asOptionalString, asString } from '../core/json'

function toInvestigationFileType(
  value: JsonValue | undefined,
): InvestigationFileType {
  return value === 'audio' ||
    value === 'image' ||
    value === 'text' ||
    value === 'sheet'
    ? value
    : 'text'
}

export function toInvestigationFile(data: JsonObject): InvestigationFile {
  return {
    id: asString(data.id),
    name: asString(data.nome),
    type: toInvestigationFileType(data.tipo),
    modified: asString(data.modificadoEm),
    size: asString(data.tamanho),
    downloadUrl: asOptionalString(data.urlDownload),
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
    arquivos: asArray(data.arquivos).map(toInvestigationFile),
    documentos: asArray(data.documentos).map(toInvestigationFile),
  }
}

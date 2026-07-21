import type { Address } from '@/src/lib/domain/types'
import { formatUf, normalizeDigits } from '@/src/lib/formatters'

import type { JsonObject, JsonValue } from '../core/json'
import { asOptionalString, asString } from '../core/json'

/** Converte id/numero da API (number ou string) para string de domínio. */
function asScalarString(value: JsonValue | undefined): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

/**
 * Contrato da API:
 * - /cliente/perfil → enderecos[].id (number)
 * - /clientes/{id}/enderecos → id_endereco (number) em algumas respostas
 * Campos: rotulo, logradouro, numero, complemento, bairro, cidade, estado, cep, padrao
 */
export function toAddress(data: JsonObject): Address {
  return {
    id: asScalarString(data.id ?? data.id_endereco),
    label: asString(data.rotulo),
    street: asString(data.logradouro),
    number: asScalarString(data.numero),
    complement: asOptionalString(data.complemento),
    neighborhood: asString(data.bairro),
    city: asString(data.cidade),
    state: asString(data.estado),
    zipCode: asString(data.cep),
    isDefault: data.padrao === true,
  }
}

export function fromAddress(address: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}) {
  return {
    rotulo: address.label,
    logradouro: address.street,
    numero: address.number.trim(),
    complemento: address.complement?.trim() || undefined,
    bairro: address.neighborhood,
    cidade: address.city,
    estado: formatUf(address.state),
    cep: normalizeDigits(address.zipCode),
    padrao: address.isDefault ?? false,
  }
}

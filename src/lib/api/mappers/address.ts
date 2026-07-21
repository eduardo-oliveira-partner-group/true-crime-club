import type { Address } from '@/src/lib/domain/types'
import { normalizeDigits } from '@/src/lib/formatters'

import type { JsonObject } from '../core/json'
import { asOptionalString, asString } from '../core/json'

export function toAddress(data: JsonObject): Address {
  return {
    id: asString(data.id),
    label: asString(data.rotulo),
    street: asString(data.logradouro),
    number: asString(data.numero),
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
    numero: address.number,
    complemento: address.complement,
    bairro: address.neighborhood,
    cidade: address.city,
    estado: address.state,
    cep: normalizeDigits(address.zipCode),
    padrao: address.isDefault ?? false,
  }
}

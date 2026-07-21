import type { Customer, SubscriberPreferences } from '@/src/lib/domain/types'

import type { JsonObject, JsonValue } from '../core/json'
import { asObject, asOptionalString, asString } from '../core/json'

function asCustomerId(value: JsonValue | undefined): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

export function toCustomer(data: JsonObject): Customer {
  const preferencias = asObject(data.preferencias)

  return {
    id: asCustomerId(data.id_cliente ?? data.idCliente ?? data.id),
    name: asString(data.nome),
    email: asString(data.email),
    phone: asOptionalString(data.telefone),
    document: asOptionalString(data.documento),
    preferences: Object.keys(preferencias).length
      ? {
          shirtSize: asOptionalString(preferencias.tamanhoCamiseta),
          shoeSize: asOptionalString(preferencias.tamanhoCalcado),
          notes: asOptionalString(preferencias.observacoes),
        }
      : undefined,
  }
}

export function fromPreferences(preferences?: Partial<SubscriberPreferences>) {
  if (!preferences) return undefined
  return {
    tamanhoCamiseta: preferences.shirtSize,
    tamanhoCalcado: preferences.shoeSize,
    observacoes: preferences.notes,
  }
}

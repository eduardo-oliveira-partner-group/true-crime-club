import type { PaymentMethod } from '@/src/lib/domain/types'

import type { JsonObject, JsonValue } from '../core/json'
import { asOptionalString, asString } from '../core/json'

function asScalarString(value: JsonValue | undefined): string {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

export function toPaymentMethod(data: JsonObject): PaymentMethod {
  return {
    id: asScalarString(data.id),
    type: data.tipo === 'pix' ? 'pix' : 'credit_card',
    label: asString(data.rotulo),
    lastFour: asOptionalString(data.ultimosQuatro),
    brand: asOptionalString(data.bandeira),
    isDefault: data.padrao === true,
  }
}

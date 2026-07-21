import type { PaymentMethod } from '@/src/lib/domain/types'

import type { JsonObject } from '../core/json'
import { asOptionalString, asString } from '../core/json'

export function toPaymentMethod(data: JsonObject): PaymentMethod {
  return {
    id: asString(data.id),
    type: data.tipo === 'pix' ? 'pix' : 'credit_card',
    label: asString(data.rotulo),
    lastFour: asOptionalString(data.ultimosQuatro),
    brand: asOptionalString(data.bandeira),
    isDefault: data.padrao === true,
  }
}

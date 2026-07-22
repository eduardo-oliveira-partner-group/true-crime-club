import { apiClient } from '@/src/lib/api-client'

import type { Order, ShippingEstimate } from '../../types'
import { mapApiOrderToDomain } from '../mappers/order'

export async function calculateShipping(
  zipCode: string,
): Promise<ShippingEstimate> {
  const apiResult = await apiClient.checkout.calculateShipping(zipCode)
  return {
    region: apiResult.regiao,
    price: Math.round(Number(apiResult.preco ?? 0) * 100),
    estimatedDays: apiResult.prazoEstimado ?? apiResult.prazoDias,
  }
}

export async function createOrder(input?: {
  customerId?: string
  shipping?: number
  enderecoId?: string
  pagamentoMetodoId?: string
}): Promise<Order> {
  const apiOrder = await apiClient.checkout.createOrder({
    enderecoId: input?.enderecoId,
    pagamentoMetodoId: input?.pagamentoMetodoId,
  })
  return mapApiOrderToDomain(apiOrder)
}

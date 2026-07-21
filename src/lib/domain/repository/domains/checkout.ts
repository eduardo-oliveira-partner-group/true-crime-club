import { apiClient } from '@/src/lib/api-client'

import {
  initialCart,
  mockCustomer,
  mockOrders,
  SHIPPING_RATES,
} from '../../mock-data'
import { isScenario } from '../../scenarios'
import type { Order, ShippingEstimate } from '../../types'
import { generateId, isLocalMockMode, throwIfError } from '../core/helpers'
import { cartState, setCartState } from '../core/state'
import { mapApiOrderToDomain } from '../mappers/order'
import { getCartTotals } from './cart'

export async function calculateShipping(
  zipCode: string,
): Promise<ShippingEstimate> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiResult = await apiClient.checkout.calculateShipping(zipCode)
    return {
      region: apiResult.regiao,
      price: apiResult.preco,
      estimatedDays: apiResult.prazoEstimado,
    }
  }

  const normalized = zipCode.replace(/\D/g, '')
  const rate =
    SHIPPING_RATES[normalized] ??
    SHIPPING_RATES[`${normalized.slice(0, 5)}-${normalized.slice(5)}`] ??
    SHIPPING_RATES.default

  return {
    region: normalized ? `CEP ${normalized}` : 'Informe o CEP',
    price: rate.price,
    estimatedDays: rate.days,
  }
}

export async function createOrder(input?: {
  customerId?: string
  shipping?: number
  enderecoId?: string
  pagamentoMetodoId?: string
}): Promise<Order> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiOrder = await apiClient.checkout.createOrder({
      enderecoId: input?.enderecoId,
      pagamentoMetodoId: input?.pagamentoMetodoId,
    })
    const mapped = mapApiOrderToDomain(apiOrder)
    mockOrders.unshift(mapped)
    setCartState(structuredClone(initialCart))
    return mapped
  }

  const cart = structuredClone(cartState)
  const { subtotal, discount, shipping, total } = getCartTotals(cart)
  const now = new Date()

  const order: Order = {
    id: generateId('ord'),
    orderNumber: `TCC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    customerId: input?.customerId ?? mockCustomer.id,
    items: structuredClone(cart.items),
    status: isScenario('pending', 'pix_pending') ? 'pending_payment' : 'paid',
    paymentStatus: isScenario('payment_refused')
      ? 'refused'
      : isScenario('pending', 'pix_pending')
        ? 'pending'
        : 'paid',
    subtotal,
    shipping: input?.shipping ?? shipping,
    discount,
    total,
    createdAt: now.toISOString(),
    billingCycleNote: 'Cobrança processada no mês da compra.',
    shippingCycleNote:
      'Envio previsto para o mês seguinte — o rastreio será enviado por e-mail após o despacho.',
    invoicePlaceholder: 'Nota fiscal disponível após confirmação do pagamento.',
  }

  mockOrders.unshift(order)
  setCartState(structuredClone(initialCart))

  return order
}

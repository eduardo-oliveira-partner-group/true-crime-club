import { apiClient } from '@/src/lib/api-client'
import { formatBusinessDays } from '@/src/lib/formatters'

import type { Order, ShippingEstimate, ShippingOption } from '../../types'
import { mapApiOrderToDomain } from '../mappers/order'

type ApiShippingOption = {
  erro?: boolean
  preco?: number | string
  mensagem?: string | null
  provedor?: string
  descricao?: string
  prazoDias?: number | string
  sessionId?: string
  codigoServico?: string
  transportadora?: string
  codigoTransportadora?: string
}

type ApiShippingEstimate = {
  cep?: string
  preco?: number | string
  opcoes?: ApiShippingOption[]
  regiao?: string
  prazoDias?: number | string
  prazoEstimado?: string
  sessionId?: string
  integracao?: string
  codigoServico?: string
  transportadora?: string
  descricaoServico?: string
  codigoTransportadora?: string
}

function toCents(value: number | string | undefined): number {
  return Math.round(Number(value ?? 0) * 100)
}

function mapShippingOption(option: ApiShippingOption): ShippingOption | null {
  if (option.erro) return null

  const id = String(option.sessionId ?? option.codigoServico ?? '').trim()
  if (!id) return null

  const estimatedDays = Number(option.prazoDias ?? 0)

  return {
    id,
    label: String(option.descricao ?? option.transportadora ?? 'Frete'),
    carrier: String(option.transportadora ?? ''),
    price: toCents(option.preco),
    estimatedDays: Number.isFinite(estimatedDays) ? estimatedDays : 0,
    serviceCode: option.codigoServico
      ? String(option.codigoServico)
      : undefined,
    carrierCode: option.codigoTransportadora
      ? String(option.codigoTransportadora)
      : undefined,
    provider: option.provedor ? String(option.provedor) : undefined,
    sessionId: option.sessionId ? String(option.sessionId) : undefined,
  }
}

export async function calculateShipping(
  zipCode: string,
): Promise<ShippingEstimate> {
  const apiResult = (await apiClient.checkout.calculateShipping(
    zipCode,
  )) as ApiShippingEstimate

  const options = Array.isArray(apiResult.opcoes)
    ? apiResult.opcoes
        .map(mapShippingOption)
        .filter((option): option is ShippingOption => option != null)
    : []

  const preferred =
    options.find((option) => option.sessionId === apiResult.sessionId) ??
    options[0]

  const fallbackDays = apiResult.prazoEstimado
    ? String(apiResult.prazoEstimado)
    : formatBusinessDays(apiResult.prazoDias)

  return {
    region: String(apiResult.regiao ?? ''),
    price: preferred ? preferred.price : toCents(apiResult.preco),
    estimatedDays: preferred
      ? formatBusinessDays(preferred.estimatedDays)
      : fallbackDays,
    options,
    sessionId:
      preferred?.sessionId ??
      (apiResult.sessionId ? String(apiResult.sessionId) : undefined),
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

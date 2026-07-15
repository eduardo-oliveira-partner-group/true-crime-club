import 'server-only'

import { cookies } from 'next/headers'

import { getApiBaseUrl, isExplicitLocalMockMode } from '@/src/lib/api-mode'
import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomerProfile as getCustomerProfileFromRepository,
  getOrderById,
  getSubscription,
  listOrders,
  updateCustomerProfile,
} from '@/src/lib/domain/repositories'
import type { Address, Customer, PaymentMethod } from '@/src/lib/domain/types'

export {
  addCustomerAddress,
  deleteCustomerAddress,
  getOrderById,
  getSubscription,
  listOrders,
  updateCustomerProfile,
}

type ProfilePayload = {
  cliente?: {
    id?: string
    nome?: string
    email?: string
    telefone?: string
    preferencias?: {
      tamanhoCamiseta?: string
      tamanhoCalcado?: string
      observacoes?: string
    }
  }
  enderecos?: Array<{
    id?: string
    rotulo?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
    padrao?: boolean
  }>
  metodosPagamento?: Array<{
    id?: string
    tipo?: string
    rotulo?: string
    ultimosQuatro?: string | null
    bandeira?: string | null
    padrao?: boolean
  }>
}

export async function getCustomerProfile(): Promise<{
  customer: Customer | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}> {
  if (isExplicitLocalMockMode()) {
    return getCustomerProfileFromRepository()
  }

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) {
    return { customer: null, addresses: [], paymentMethods: [] }
  }

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/cliente/perfil`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    return { customer: null, addresses: [], paymentMethods: [] }
  }

  const profile = (await response.json()) as ProfilePayload
  const customer = profile.cliente

  return {
    customer: customer
      ? {
          id: customer.id ?? '',
          name: customer.nome ?? '',
          email: customer.email ?? '',
          phone: customer.telefone,
          preferences: customer.preferencias
            ? {
                shirtSize: customer.preferencias.tamanhoCamiseta,
                shoeSize: customer.preferencias.tamanhoCalcado,
                notes: customer.preferencias.observacoes,
              }
            : undefined,
        }
      : null,
    addresses: (profile.enderecos ?? []).map((address) => ({
      id: address.id ?? '',
      label: address.rotulo ?? '',
      street: address.logradouro ?? '',
      number: address.numero ?? '',
      complement: address.complemento,
      neighborhood: address.bairro ?? '',
      city: address.cidade ?? '',
      state: address.estado ?? '',
      zipCode: address.cep ?? '',
      isDefault: address.padrao ?? false,
    })),
    paymentMethods: (profile.metodosPagamento ?? []).map((method) => ({
      id: method.id ?? '',
      type: method.tipo === 'pix' ? 'pix' : 'credit_card',
      label: method.rotulo ?? '',
      lastFour: method.ultimosQuatro ?? undefined,
      brand: method.bandeira ?? undefined,
      isDefault: method.padrao ?? false,
    })),
  }
}

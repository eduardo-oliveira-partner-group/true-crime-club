import type {
  Address,
  Customer,
  PaymentMethod,
  SubscriberPreferences,
} from '@/src/lib/domain/types'
import { normalizeDigits } from '@/src/lib/formatters'

import { ApiClientError } from '../core/error'
import { fetcher } from '../core/fetcher'
import { asArray, asObject, type JsonValue } from '../core/json'
import { fromAddress, toAddress } from '../mappers/address'
import { fromPreferences, toCustomer } from '../mappers/customer'
import { toPaymentMethod } from '../mappers/payment'

async function getCustomerId(): Promise<string> {
  const customer = toCustomer(await fetcher('/autenticacao/cliente-atual'))
  if (!customer.id) {
    throw new Error('Sessão inválida: não foi possível identificar o cliente')
  }
  return customer.id
}

async function listCustomerAddresses(customerId: string): Promise<Address[]> {
  const items = await fetcher(`/clientes/${customerId}/enderecos`)
  return asArray(items).map(toAddress)
}

/** Aceita lista ou payload sem lista — refetch quando a mutação não devolve endereços. */
async function resolveAddressList(
  customerId: string,
  payload: unknown,
): Promise<Address[]> {
  const list = asArray(payload as JsonValue | undefined).map(toAddress)
  if (list.length > 0) return list
  return listCustomerAddresses(customerId)
}

export const customerApi = {
  getProfile: async (): Promise<{
    customer: Customer
    addresses: Address[]
    paymentMethods: PaymentMethod[]
  }> => {
    try {
      const data = await fetcher('/cliente/perfil')

      return {
        customer: toCustomer(asObject(data.cliente)),
        addresses: asArray(data.enderecos).map(toAddress),
        paymentMethods: asArray(data.metodosPagamento).map(toPaymentMethod),
      }
    } catch (error) {
      // Algumas APIs ainda não expõem /cliente/perfil (404).
      // Compõe o perfil a partir das rotas individuais para não tratar
      // sessão válida como "não autenticado".
      if (!(error instanceof ApiClientError) || error.status !== 404) {
        throw error
      }

      const customer = toCustomer(await fetcher('/autenticacao/cliente-atual'))

      const [addresses, paymentMethods] = await Promise.all([
        customer.id
          ? fetcher(`/clientes/${customer.id}/enderecos`)
              .then((items) => asArray(items).map(toAddress))
              .catch(() => [] as Address[])
          : Promise.resolve([] as Address[]),
        fetcher('/cliente/cartoes')
          .then((items) => asArray(items).map(toPaymentMethod))
          .catch(() => [] as PaymentMethod[]),
      ])

      return { customer, addresses, paymentMethods }
    }
  },
  updateProfile: async (body: {
    name?: string
    email?: string
    phone?: string
    document?: string
    preferences?: Partial<SubscriberPreferences>
  }) => {
    const customerId = await getCustomerId()
    return fetcher(`/clientes/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        nome: body.name,
        email: body.email,
        telefone: body.phone ? normalizeDigits(body.phone) : undefined,
        documento: body.document ? normalizeDigits(body.document) : undefined,
        preferencias: fromPreferences(body.preferences),
      }),
    }).then(toCustomer)
  },
  addAddress: async (body: {
    label: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isDefault?: boolean
  }) => {
    const customerId = await getCustomerId()
    const payload = await fetcher(`/clientes/${customerId}/enderecos`, {
      method: 'POST',
      body: JSON.stringify(fromAddress(body)),
    })
    return resolveAddressList(customerId, payload)
  },
  updateAddress: async (
    id: string,
    body: {
      label: string
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
      isDefault?: boolean
    },
  ) => {
    if (!id.trim()) {
      throw new Error('Endereço inválido: id ausente')
    }
    const customerId = await getCustomerId()
    const payload = await fetcher(`/clientes/${customerId}/enderecos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(fromAddress(body)),
    })
    return resolveAddressList(customerId, payload)
  },
  deleteAddress: async (id: string) => {
    if (!id.trim()) {
      throw new Error('Endereço inválido: id ausente')
    }
    const customerId = await getCustomerId()
    await fetcher(`/clientes/${customerId}/enderecos/${id}`, {
      method: 'DELETE',
    })
    return listCustomerAddresses(customerId)
  },
  listOrders: () => fetcher('/cliente/pedidos'),
  getOrder: (id: string) => fetcher(`/cliente/pedidos/${id}`),
  getSubscription: () => fetcher('/cliente/assinatura'),
  cancelSubscription: () =>
    fetcher('/cliente/assinatura', {
      method: 'POST',
      body: JSON.stringify({ acao: 'cancelar' }),
    }),
  reactivateSubscription: () =>
    fetcher('/cliente/assinatura', {
      method: 'POST',
      body: JSON.stringify({ acao: 'reativar' }),
    }),
  listPayments: () => fetcher('/cliente/pagamentos'),
  getPayment: (id: string) => fetcher(`/cliente/pagamentos/${id}`),
  renewPixPayment: (id: string) =>
    fetcher(`/cliente/pagamentos/${id}/renovar-pix`, {
      method: 'POST',
    }),
  listInvoices: () => fetcher('/cliente/faturas'),
  updateCard: (body: { id: string; padrao: boolean }) =>
    fetcher(`/cliente/cartoes/${body.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ padrao: body.padrao }),
    }).then(toPaymentMethod),
  listCards: () =>
    fetcher('/cliente/cartoes').then((items) =>
      asArray(items).map(toPaymentMethod),
    ),
  addCard: (body: {
    holderName: string
    lastFour: string
    brand: string
    holderDocument: string
    expiryMonth: string
    expiryYear: string
    cardNumber: string
    cvc: string
  }) =>
    fetcher('/cliente/cartoes', {
      method: 'POST',
      body: JSON.stringify({
        nomeImpresso: body.holderName,
        ultimosQuatro: body.lastFour,
        bandeira: body.brand,
        cpfTitular: normalizeDigits(body.holderDocument),
        mesValidade: body.expiryMonth,
        anoValidade: body.expiryYear,
        // A API tokeniza nos gateways; GET /cliente/cartoes devolve a bandeira.
        creditCard: {
          number: normalizeDigits(body.cardNumber),
          ccv: normalizeDigits(body.cvc),
        },
      }),
    }).then(toPaymentMethod),
  deleteCard: (id: string) =>
    fetcher(`/cliente/cartoes/${id}`, {
      method: 'DELETE',
    }),
}

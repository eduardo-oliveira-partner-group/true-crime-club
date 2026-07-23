import { apiClient } from '@/src/lib/api-client'

import type {
  Address,
  Customer,
  Invoice,
  Order,
  Payment,
  PaymentMethod,
  SubscriberPreferences,
  Subscription,
} from '../../types'
import { isNotFoundError, isUnauthorizedError } from '../core/helpers'
import { type ApiOrder, mapApiOrderToDomain } from '../mappers/order'
import {
  mapApiInvoiceToDomain,
  mapApiPaymentToDomain,
} from '../mappers/payment'
import { mapApiSubscriptionToDomain } from '../mappers/subscription'

export async function getCurrentCustomer(): Promise<Customer | null> {
  const profile = await getCustomerProfile()
  return profile.customer
}

export async function getCustomerProfile(): Promise<{
  customer: Customer | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}> {
  try {
    return await apiClient.customer.getProfile()
  } catch (error) {
    // O checkout também é acessível antes do login. Sem cookie de sessão,
    // a API devolve 401; renderize o fluxo com dados vazios em vez de
    // acionar o error boundary da página.
    if (isUnauthorizedError(error)) {
      return { customer: null, addresses: [], paymentMethods: [] }
    }
    throw error
  }
}

export async function updateCustomerProfile(body: {
  name?: string
  email?: string
  phone?: string
  document?: string
  preferences?: Partial<SubscriberPreferences>
}): Promise<Customer> {
  return await apiClient.customer.updateProfile(body)
}

export async function addCustomerAddress(body: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}): Promise<Address[]> {
  return await apiClient.customer.addAddress(body)
}

export async function updateCustomerAddress(
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
): Promise<Address[]> {
  return await apiClient.customer.updateAddress(id, body)
}

export async function deleteCustomerAddress(id: string): Promise<Address[]> {
  return await apiClient.customer.deleteAddress(id)
}

export async function listAddresses(): Promise<Address[]> {
  const profile = await getCustomerProfile()
  return profile.addresses
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  const profile = await getCustomerProfile()
  return profile.paymentMethods
}

export async function listOrders(): Promise<Order[]> {
  try {
    const apiOrders = await apiClient.customer.listOrders()
    return Promise.all(
      apiOrders.map(async (apiOrder: ApiOrder) => {
        const listedOrder = mapApiOrderToDomain(apiOrder)
        if (listedOrder.items.length > 0) return listedOrder

        try {
          return mapApiOrderToDomain(
            await apiClient.customer.getOrder(apiOrder.id),
          )
        } catch {
          return listedOrder
        }
      }),
    )
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return []
    }
    throw error
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const apiOrder = await apiClient.customer.getOrder(id)
    return mapApiOrderToDomain(apiOrder)
  } catch (error) {
    if (isNotFoundError(error)) {
      return null
    }
    throw error
  }
}

export async function getSubscription(): Promise<Subscription | null> {
  try {
    const apiSub = await apiClient.customer.getSubscription()
    return mapApiSubscriptionToDomain(apiSub)
  } catch (error) {
    if (isNotFoundError(error) || isUnauthorizedError(error)) {
      return null
    }
    throw error
  }
}

export async function cancelSubscription(): Promise<Subscription> {
  return mapApiSubscriptionToDomain(
    await apiClient.customer.cancelSubscription(),
  )
}

export async function reactivateSubscription(): Promise<Subscription> {
  return mapApiSubscriptionToDomain(
    await apiClient.customer.reactivateSubscription(),
  )
}

export async function listPayments(): Promise<Payment[]> {
  try {
    const apiPayments = await apiClient.customer.listPayments()
    return apiPayments.map(mapApiPaymentToDomain)
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return []
    }
    throw error
  }
}

export async function listInvoices(): Promise<Invoice[]> {
  try {
    const apiInvoices = await apiClient.customer.listInvoices()
    return apiInvoices.map(mapApiInvoiceToDomain)
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return []
    }
    throw error
  }
}

export async function renewPixPayment(paymentId: string): Promise<Payment> {
  const apiPayment = await apiClient.customer.renewPixPayment(paymentId)
  return mapApiPaymentToDomain(apiPayment)
}

export async function updateCard(input: {
  id: string
  padrao: boolean
}): Promise<PaymentMethod> {
  return await apiClient.customer.updateCard(input)
}

export async function listCards(): Promise<PaymentMethod[]> {
  return await apiClient.customer.listCards()
}

export async function addCard(input: {
  holderName: string
  lastFour: string
  brand: string
  holderDocument: string
  expiryMonth: string
  expiryYear: string
  cardNumber: string
  cvc: string
}): Promise<PaymentMethod> {
  return await apiClient.customer.addCard(input)
}

export async function deleteCard(id: string): Promise<{ sucesso: boolean }> {
  await apiClient.customer.deleteCard(id)
  return { sucesso: true }
}

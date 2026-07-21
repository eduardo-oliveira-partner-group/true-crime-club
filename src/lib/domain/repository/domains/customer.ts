import { apiClient } from '@/src/lib/api-client'

import {
  mockAddresses,
  mockCustomer,
  mockInvoices,
  mockOrders,
} from '../../mock-data'
import { isScenario, shouldReturnEmpty } from '../../scenarios'
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
import {
  generateId,
  isLocalMockMode,
  isNotFoundError,
  isUnauthorizedError,
  throwIfError,
} from '../core/helpers'
import {
  paymentMethodsState,
  paymentsState,
  setPaymentMethodsState,
  setPaymentsState,
  setSubscriptionState,
  subscriptionState,
} from '../core/state'
import { type ApiOrder, mapApiOrderToDomain } from '../mappers/order'
import {
  mapApiInvoiceToDomain,
  mapApiPaymentToDomain,
} from '../mappers/payment'
import { mapApiSubscriptionToDomain } from '../mappers/subscription'

export function getCurrentCustomerMock(): Customer | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockCustomer
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  const profile = await getCustomerProfile()
  return profile.customer
}

export async function getCustomerProfile(): Promise<{
  customer: Customer | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return {
    customer: getCurrentCustomerMock(),
    addresses: listAddressesMock(),
    paymentMethods: listPaymentMethodsMock(),
  }
}

export function createCustomerMock(body: {
  name: string
  email: string
  phone?: string
}): Customer {
  mockCustomer.id = generateId('cust')
  mockCustomer.name = body.name
  mockCustomer.email = body.email
  mockCustomer.phone = body.phone
  return mockCustomer
}

export async function updateCustomerProfile(body: {
  name?: string
  email?: string
  phone?: string
  document?: string
  preferences?: Partial<SubscriberPreferences>
}): Promise<Customer> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.updateProfile(body)
  }

  return updateCustomerProfileMock(body)
}

export function updateCustomerProfileMock(body: {
  name?: string
  email?: string
  phone?: string
  document?: string
  preferences?: Partial<SubscriberPreferences>
}): Customer {
  if (body.name !== undefined) mockCustomer.name = body.name
  if (body.email !== undefined) mockCustomer.email = body.email
  if (body.phone !== undefined) mockCustomer.phone = body.phone
  if (body.document !== undefined) mockCustomer.document = body.document
  if (body.preferences !== undefined) {
    mockCustomer.preferences = {
      ...mockCustomer.preferences,
      ...body.preferences,
    }
  }
  return mockCustomer
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
}): Promise<Address[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.addAddress(body)
  }

  return addCustomerAddressMock(body)
}

export function addCustomerAddressMock(body: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}): Address[] {
  const newAddress: Address = {
    id: `addr-${Date.now()}`,
    label: body.label,
    street: body.street,
    number: body.number,
    complement: body.complement,
    neighborhood: body.neighborhood,
    city: body.city,
    state: body.state,
    zipCode: body.zipCode,
    isDefault: mockAddresses.length === 0,
  }

  mockAddresses.push(newAddress)
  return [...mockAddresses]
}

export async function deleteCustomerAddress(id: string): Promise<Address[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.deleteAddress(id)
  }

  return deleteCustomerAddressMock(id)
}

export function deleteCustomerAddressMock(id: string): Address[] {
  const index = mockAddresses.findIndex((addr) => addr.id === id)
  if (index !== -1) {
    mockAddresses.splice(index, 1)
  }
  return [...mockAddresses]
}

export function updateSubscriberPreferences(
  preferences: SubscriberPreferences,
): Customer {
  throwIfError()
  const updated: Customer = {
    ...mockCustomer,
    preferences: { ...mockCustomer.preferences, ...preferences },
  }
  return updated
}

export function listAddressesMock(): Address[] {
  throwIfError()
  const result = shouldReturnEmpty(mockAddresses)
  return result ?? mockAddresses
}

export function listPaymentMethodsMock(): PaymentMethod[] {
  throwIfError()
  const result = shouldReturnEmpty(paymentMethodsState)
  return result ?? paymentMethodsState
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
  throwIfError()

  if (!isLocalMockMode()) {
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

  return listOrdersMock()
}

export function listOrdersMock(): Order[] {
  throwIfError()
  const result = shouldReturnEmpty(mockOrders)
  return result ?? mockOrders
}

export async function getOrderById(id: string): Promise<Order | null> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return getOrderByIdMock(id)
}

export function getOrderByIdMock(id: string): Order | null {
  return mockOrders.find((o) => o.id === id) ?? null
}

export async function getSubscription(): Promise<Subscription | null> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return getSubscriptionMock()
}

export function getSubscriptionMock(): Subscription | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  if (isScenario('subscription_cancelled')) {
    return {
      ...subscriptionState,
      status: 'cancelled',
      canCancel: false,
      canReactivate: false,
      cancelledAt: new Date().toISOString(),
    }
  }
  if (isScenario('reactivation_available')) {
    return {
      ...subscriptionState,
      status: 'cancelled',
      canCancel: false,
      canReactivate: true,
      cancelledAt: new Date().toISOString(),
    }
  }
  if (isScenario('pending', 'pix_pending', 'payment_refused')) {
    return { ...subscriptionState, status: 'pending_payment' }
  }
  return subscriptionState
}

export async function cancelSubscription(): Promise<Subscription> {
  throwIfError()

  if (!isLocalMockMode()) {
    return mapApiSubscriptionToDomain(
      await apiClient.customer.cancelSubscription(),
    )
  }

  return cancelSubscriptionMock()
}

export function cancelSubscriptionMock(): Subscription {
  setSubscriptionState({
    ...subscriptionState,
    status: 'cancelled',
    canCancel: false,
    canReactivate: true,
    cancelledAt: new Date().toISOString(),
  })
  return subscriptionState
}

export async function reactivateSubscription(): Promise<Subscription> {
  throwIfError()

  if (!isLocalMockMode()) {
    return mapApiSubscriptionToDomain(
      await apiClient.customer.reactivateSubscription(),
    )
  }

  return reactivateSubscriptionMock()
}

export function reactivateSubscriptionMock(): Subscription {
  setSubscriptionState({
    ...subscriptionState,
    status: 'active',
    canCancel: true,
    canReactivate: false,
    cancelledAt: undefined,
  })
  return subscriptionState
}

export async function listPayments(): Promise<Payment[]> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return listPaymentsMock()
}

export function listPaymentsMock(): Payment[] {
  throwIfError()
  let payments = [...paymentsState]

  if (isScenario('payment_refused')) {
    payments = payments.map((p, index) =>
      index === 0
        ? {
            ...p,
            status: 'refused' as const,
            refusalReason: 'Cartão recusado pelo emissor. Tente outro meio.',
          }
        : p,
    )
  }
  if (isScenario('pix_pending')) {
    payments = payments.map((p) =>
      p.method === 'pix' && p.status === 'pending'
        ? p
        : { ...p, status: 'pending' as const },
    )
  }

  const result = shouldReturnEmpty(payments)
  return result ?? payments
}

export async function listInvoices(): Promise<Invoice[]> {
  throwIfError()

  if (!isLocalMockMode()) {
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

  return listInvoicesMock()
}

export function listInvoicesMock(): Invoice[] {
  throwIfError()
  const result = shouldReturnEmpty(mockInvoices)
  return result ?? mockInvoices
}

export async function renewPixPayment(paymentId: string): Promise<Payment> {
  throwIfError()

  if (!isLocalMockMode()) {
    const apiPayment = await apiClient.customer.renewPixPayment(paymentId)
    const mapped = mapApiPaymentToDomain(apiPayment)
    setPaymentsState(
      paymentsState.map((payment) =>
        payment.id === paymentId ? mapped : payment,
      ),
    )
    return mapped
  }

  return renewPixPaymentMock(paymentId)
}

export function renewPixPaymentMock(paymentId: string): Payment {
  throwIfError()
  const payment = paymentsState.find((p) => p.id === paymentId)
  if (!payment) {
    throw new Error('Pagamento não encontrado.')
  }

  const renewed: Payment = {
    ...payment,
    status: 'pending',
    pixQrCode: `00020126580014BR.GOV.BCB.PIX0136mock-renewed-${paymentId}`,
    pixExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    refusalReason: undefined,
  }

  setPaymentsState(paymentsState.map((p) => (p.id === paymentId ? renewed : p)))
  return renewed
}

export async function updateCard(input: {
  holderName: string
  lastFour: string
  brand: string
  token?: string
}): Promise<PaymentMethod> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.updateCard(input)
  }

  return updateCardMock(input)
}

export function updateCardMock(input: {
  holderName: string
  lastFour: string
  brand: string
  token?: string
}): PaymentMethod {
  throwIfError()
  const updated: PaymentMethod = {
    id: 'pm-001',
    type: 'credit_card',
    label: `${input.brand} terminando em ${input.lastFour}`,
    lastFour: input.lastFour,
    brand: input.brand,
    isDefault: true,
  }
  return updated
}

export async function listCards(): Promise<PaymentMethod[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.listCards()
  }

  return listPaymentMethodsMock().filter((pm) => pm.type === 'credit_card')
}

export async function addCard(input: {
  token: string
  holderName: string
  lastFour: string
  brand: string
}): Promise<PaymentMethod> {
  throwIfError()

  if (!isLocalMockMode()) {
    return await apiClient.customer.addCard(input)
  }

  const newCard: PaymentMethod = {
    id: `pm-${Date.now()}`,
    type: 'credit_card',
    label: `${input.brand} terminando em ${input.lastFour}`,
    lastFour: input.lastFour,
    brand: input.brand,
    isDefault:
      paymentMethodsState.filter((pm) => pm.type === 'credit_card').length ===
      0,
  }

  paymentMethodsState.push(newCard)
  return newCard
}

export async function deleteCard(id: string): Promise<{ sucesso: boolean }> {
  throwIfError()

  if (!isLocalMockMode()) {
    await apiClient.customer.deleteCard(id)
    return { sucesso: true }
  }

  setPaymentMethodsState(paymentMethodsState.filter((card) => card.id !== id))
  return { sucesso: true }
}

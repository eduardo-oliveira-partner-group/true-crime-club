import { mockAddresses, mockCustomer } from '@/src/lib/domain/mock-data'
import {
  getCurrentCustomer,
  getOrderById,
  getSubscription,
  listAddresses,
  listOrders,
  listPaymentMethods,
} from '@/src/lib/domain/repositories'
import type {
  Address,
  Customer,
  SubscriberPreferences,
} from '@/src/lib/domain/types'

export function getCustomerProfile() {
  return {
    customer: getCurrentCustomer(),
    addresses: listAddresses(),
    paymentMethods: listPaymentMethods(),
  }
}

export function updateCustomerProfile(body: {
  name?: string
  email?: string
  phone?: string
  preferences?: Partial<SubscriberPreferences>
}): Customer {
  if (body.name !== undefined) mockCustomer.name = body.name
  if (body.email !== undefined) mockCustomer.email = body.email
  if (body.phone !== undefined) mockCustomer.phone = body.phone
  if (body.preferences !== undefined) {
    mockCustomer.preferences = {
      ...mockCustomer.preferences,
      ...body.preferences,
    }
  }
  return mockCustomer
}

export function addCustomerAddress(body: {
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

export function deleteCustomerAddress(id: string): Address[] {
  const index = mockAddresses.findIndex((addr) => addr.id === id)
  if (index !== -1) {
    mockAddresses.splice(index, 1)
  }
  return [...mockAddresses]
}

export { getOrderById, getSubscription, listOrders }

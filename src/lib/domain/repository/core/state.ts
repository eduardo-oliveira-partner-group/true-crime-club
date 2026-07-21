import {
  initialCart,
  mockPaymentMethods,
  mockPayments,
  mockSubscription,
} from '../../mock-data'
import type { Cart, Payment, PaymentMethod, Subscription } from '../../types'

export let cartState: Cart = structuredClone(initialCart)
export let subscriptionState: Subscription = structuredClone(mockSubscription)
export let paymentsState: Payment[] = structuredClone(mockPayments)
export let paymentMethodsState: PaymentMethod[] = [...mockPaymentMethods]

export function setCartState(next: Cart): void {
  cartState = next
}

export function setSubscriptionState(next: Subscription): void {
  subscriptionState = next
}

export function setPaymentsState(next: Payment[]): void {
  paymentsState = next
}

export function setPaymentMethodsState(next: PaymentMethod[]): void {
  paymentMethodsState = next
}

export function resetMockState(): void {
  cartState = structuredClone(initialCart)
  subscriptionState = structuredClone(mockSubscription)
  paymentsState = structuredClone(mockPayments)
}

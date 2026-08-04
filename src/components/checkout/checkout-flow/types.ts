import type { Address } from '@/src/lib/domain/types'

export interface CheckoutPaymentOption {
  id: string
  label: string
  type: 'credit_card' | 'pix'
}

export interface CheckoutShippingOption {
  id: string
  label: string
  carrier: string
  price: number
  estimatedDays: number
  serviceCode?: string
  carrierCode?: string
  provider?: string
  sessionId?: string
}

export interface SubscriberPreferencesValue {
  shirtSize?: string
  shoeSize?: string
  notes?: string
}

export interface CheckoutOrderSummaryItem {
  id: string
  label: string
  value: string
}

export interface CheckoutStepperProps {
  customer: { name: string; email: string } | null
  addresses: Address[]
  paymentOptions: CheckoutPaymentOption[]
  shippingOptions: CheckoutShippingOption[]
  isSubscriptionFlow: boolean
  planId?: string
  planName?: string
  planPrice?: number
  cartItems: CheckoutOrderSummaryItem[]
  subtotalAmount: number
  discountAmount: number
  shippingPrice: number
  totalAmount: number
  /** Preferências já salvas no perfil do cliente (pré-preenche a etapa). */
  initialPreferences?: SubscriberPreferencesValue
  /** Salva preferências para a curadoria das caixas. */
  onSavePreferences: (preferences: SubscriberPreferencesValue) => Promise<void>
  /** Cria o pedido e devolve seu identificador quando disponível. */
  onCreateOrder: (input: {
    enderecoId: string
    pagamentoMetodoId: string
    cep: string
  }) => Promise<string | void>
}

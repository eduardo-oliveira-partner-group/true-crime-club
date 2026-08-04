import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import {
  ADDRESS_STEP_INDEX,
  checkoutSteps,
  PAYMENT_STEP_INDEX,
  SHIPPING_STEP_INDEX,
} from '@/src/components/checkout/checkout-flow/step-definitions'
import type {
  CheckoutPaymentOption,
  CheckoutShippingOption,
  CheckoutStepperProps,
  SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-flow/types'
import { calculateShipping } from '@/src/lib/domain/repositories'
import type {
  Address,
  PaymentMethod,
  ShippingOption,
} from '@/src/lib/domain/types'

function toCheckoutPayment(method: PaymentMethod): CheckoutPaymentOption {
  return {
    id: method.id,
    label:
      method.label ||
      (method.type === 'pix'
        ? 'Pix'
        : `${method.brand ?? 'Cartão'} •••• ${method.lastFour ?? ''}`),
    type: method.type,
  }
}

function toCheckoutShippingOption(
  option: ShippingOption,
): CheckoutShippingOption {
  return {
    id: option.id,
    label: option.label,
    carrier: option.carrier,
    price: option.price,
    estimatedDays: option.estimatedDays,
    serviceCode: option.serviceCode,
    carrierCode: option.carrierCode,
    provider: option.provider,
    sessionId: option.sessionId,
  }
}

type CheckoutFlowOptions = Pick<
  CheckoutStepperProps,
  | 'addresses'
  | 'paymentOptions'
  | 'shippingOptions'
  | 'shippingPrice'
  | 'totalAmount'
  | 'isSubscriptionFlow'
  | 'planId'
  | 'planName'
  | 'initialPreferences'
  | 'onSavePreferences'
  | 'onCreateOrder'
> & {
  hasCustomer: boolean
}

export function useCheckoutFlow({
  addresses: initialAddresses,
  paymentOptions: initialPaymentOptions,
  shippingOptions: initialShippingOptions,
  shippingPrice: initialShippingPrice,
  totalAmount: initialTotalAmount,
  isSubscriptionFlow,
  planId,
  planName,
  initialPreferences,
  onSavePreferences,
  onCreateOrder,
  hasCustomer,
}: CheckoutFlowOptions) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [addresses, setAddresses] = useState(initialAddresses)
  const [paymentOptions, setPaymentOptions] = useState(initialPaymentOptions)
  const [shippingOptions, setShippingOptions] = useState(initialShippingOptions)
  const [shippingPrice, setShippingPrice] = useState(initialShippingPrice)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [selectedAddressId, setSelectedAddressId] = useState(
    initialAddresses[0]?.id ?? '',
  )
  const [selectedShippingId, setSelectedShippingId] = useState(
    initialShippingOptions[0]?.id ?? '',
  )
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    initialPaymentOptions[0]?.id ?? '',
  )
  const [showAddressForm, setShowAddressForm] = useState(
    initialAddresses.length === 0,
  )
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [showCardForm, setShowCardForm] = useState(
    initialPaymentOptions.length === 0,
  )
  const [preferences, setPreferences] = useState<SubscriberPreferencesValue>({
    shirtSize: initialPreferences?.shirtSize ?? '',
    shoeSize: initialPreferences?.shoeSize ?? '',
    notes: initialPreferences?.notes ?? '',
  })
  const isAnnualPlan = Boolean(
    isSubscriptionFlow && planName?.toLowerCase().includes('anual'),
  )
  const [installments, setInstallments] = useState(isAnnualPlan ? 12 : 1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [navigationHint, setNavigationHint] = useState<string | null>(null)
  const [stepperKey, setStepperKey] = useState(0)

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  )
  const selectedShipping = shippingOptions.find(
    (option) => option.id === selectedShippingId,
  )
  const selectedPayment = paymentOptions.find(
    (option) => option.id === selectedPaymentId,
  )
  const selectedZipCode = selectedAddress?.zipCode
  const totalAmount = initialTotalAmount - initialShippingPrice + shippingPrice
  const maxInstallments = isAnnualPlan ? 12 : totalAmount > 10000 ? 6 : 1
  const isLastStep = currentStep === checkoutSteps.length
  const hasSelectedAddress = Boolean(selectedAddressId) && !showAddressForm
  const hasSelectedShipping = !shippingLoading && Boolean(selectedShippingId)
  const hasSelectedPayment = Boolean(selectedPaymentId)
  const canAdvance =
    hasCustomer &&
    !editingAddressId &&
    (currentStep !== ADDRESS_STEP_INDEX || hasSelectedAddress) &&
    (currentStep !== SHIPPING_STEP_INDEX || hasSelectedShipping) &&
    (currentStep !== PAYMENT_STEP_INDEX || hasSelectedPayment) &&
    (!isLastStep ||
      (hasSelectedAddress && hasSelectedShipping && hasSelectedPayment))

  const refreshShipping = useCallback(
    async (zipCode: string) => {
      setShippingLoading(true)
      setShippingError(null)
      try {
        if (isSubscriptionFlow && !planId) {
          setShippingOptions([])
          setSelectedShippingId('')
          setShippingPrice(0)
          setShippingError(
            'Plano da assinatura nao informado para cotar o frete.',
          )
          return
        }
        const shipping = await calculateShipping(zipCode, {
          planoId: isSubscriptionFlow ? planId : undefined,
        })
        const options = shipping.options.map(toCheckoutShippingOption)
        setShippingOptions(options)
        setShippingPrice(shipping.price)
        setSelectedShippingId(options[0]?.id ?? '')
        if (options.length === 0) {
          setShippingError(
            'Nenhuma opção de frete disponível para este CEP. Verifique o endereço.',
          )
        }
      } catch {
        setShippingOptions([])
        setSelectedShippingId('')
        setShippingPrice(0)
        setShippingError(
          'Não foi possível calcular o frete. Tente novamente em instantes.',
        )
      } finally {
        setShippingLoading(false)
      }
    },
    [isSubscriptionFlow, planId],
  )

  useEffect(() => {
    if (!selectedZipCode) return
    void refreshShipping(selectedZipCode)
  }, [refreshShipping, selectedZipCode])

  function canNavigateToStep(targetStep: number, activeStep: number) {
    if (targetStep < activeStep) return true
    if (targetStep !== activeStep + 1) return false

    switch (targetStep) {
      case ADDRESS_STEP_INDEX:
        return hasCustomer
      case SHIPPING_STEP_INDEX:
        return hasSelectedAddress
      case PAYMENT_STEP_INDEX:
        return hasSelectedShipping
      case 5:
        return hasSelectedPayment
      case 6:
        return true
      default:
        return false
    }
  }

  function handleSelectShipping(optionId: string) {
    setSelectedShippingId(optionId)
    const option = shippingOptions.find((item) => item.id === optionId)
    if (option) setShippingPrice(option.price)
  }

  function handleAddressSaved(nextAddresses: Address[]) {
    setAddresses(nextAddresses)
    setShowAddressForm(false)
    setEditingAddressId(null)
    setError(null)

    const preferred =
      nextAddresses.find((address) => address.id === selectedAddressId) ??
      nextAddresses.find((address) => address.isDefault) ??
      nextAddresses[0]

    if (preferred) setSelectedAddressId(preferred.id)
  }

  function resetAddressForm() {
    setShowAddressForm(false)
    setEditingAddressId(null)
  }

  function openNewAddressForm() {
    setEditingAddressId(null)
    setShowAddressForm(true)
  }

  function startEditingAddress(addressId: string) {
    setShowAddressForm(false)
    setEditingAddressId(addressId)
  }

  function handleSelectAddress(addressId: string) {
    if (!editingAddressId) setSelectedAddressId(addressId)
  }

  function handleCardSaved(card: PaymentMethod) {
    const option = toCheckoutPayment(card)
    setPaymentOptions((current) => {
      if (current.some((item) => item.id === option.id)) return current
      return [...current, option]
    })
    setSelectedPaymentId(option.id)
    setShowCardForm(false)
    setError(null)
  }

  async function handleFinalStepCompleted() {
    setError(null)
    setSubmitting(true)
    try {
      await onSavePreferences(preferences)
      const orderId = await onCreateOrder({
        enderecoId: selectedAddressId,
        pagamentoMetodoId: selectedPaymentId,
        cep: selectedAddress?.zipCode ?? '',
      })
      router.push(
        `/checkout/confirmacao${orderId ? `?pedido=${encodeURIComponent(orderId)}` : ''}`,
      )
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Não foi possível finalizar o pedido. Tente novamente.',
      )
      setSubmitting(false)
      setCurrentStep(checkoutSteps.length)
      setStepperKey((current) => current + 1)
    }
  }

  function handleStepChange(step: number) {
    setError(null)
    setNavigationHint(null)
    setCurrentStep(step)
  }

  function handleInvalidStepNavigation(step: number) {
    setNavigationHint(
      `Conclua a etapa atual para acessar ${checkoutSteps[step - 1]?.label ?? 'esta etapa'}.`,
    )
  }

  const showShippingHighlights = shippingOptions.length > 1
  const cheapestShippingPrice = showShippingHighlights
    ? Math.min(...shippingOptions.map((option) => option.price))
    : null
  const fastestShippingDays = showShippingHighlights
    ? (() => {
        const deadlines = shippingOptions
          .map((option) => option.estimatedDays)
          .filter((days) => days > 0)
        return deadlines.length > 0 ? Math.min(...deadlines) : null
      })()
    : null
  const processingMessage =
    selectedPayment?.type === 'pix'
      ? 'Gerando cobrança Pix e preparando o QR Code…'
      : 'Validando cartão e lacrando o pedido…'

  return {
    addresses,
    canAdvance,
    canNavigateToStep,
    cheapestShippingPrice,
    currentStep,
    editingAddressId,
    error,
    fastestShippingDays,
    handleAddressSaved,
    handleCardSaved,
    handleFinalStepCompleted,
    handleInvalidStepNavigation,
    handleSelectAddress,
    handleSelectShipping,
    handleStepChange,
    hasSelectedShipping,
    installments,
    isAnnualPlan,
    isLastStep,
    maxInstallments,
    navigationHint,
    openNewAddressForm,
    paymentOptions,
    preferences,
    processingMessage,
    refreshShipping,
    resetAddressForm,
    selectedAddress,
    selectedAddressId,
    selectedPayment,
    selectedPaymentId,
    selectedShipping,
    selectedShippingId,
    selectedZipCode,
    setInstallments,
    setPreferences,
    setSelectedPaymentId,
    setShowCardForm,
    shippingError,
    shippingLoading,
    shippingOptions,
    shippingPrice,
    showAddressForm,
    showCardForm,
    startEditingAddress,
    stepperKey,
    submitting,
    totalAmount,
  }
}

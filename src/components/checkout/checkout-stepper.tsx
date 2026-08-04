'use client'

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCreditCard,
  IconEdit,
  IconMapPin,
  IconPackage,
  IconPlus,
  IconShirt,
  IconTruck,
  IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { AddressForm } from '@/src/components/customer/address-form'
import { CardForm } from '@/src/components/customer/card-form'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/src/components/ui/field'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/src/components/ui/native-select'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Spinner } from '@/src/components/ui/spinner'
import {
  Step,
  Stepper,
  type StepperStepIndicatorProps,
} from '@/src/components/ui/stepper'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  formInputClass,
  transitionBgColor,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { calculateShipping } from '@/src/lib/domain/repositories'
import type {
  Address,
  PaymentMethod,
  ShippingOption,
} from '@/src/lib/domain/types'
import {
  formatBusinessDays,
  formatCep,
  formatCurrency,
  SHIRT_SIZES,
  SHOE_SIZES,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

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

interface CheckoutStepperProps {
  customer: { name: string; email: string } | null
  addresses: Address[]
  paymentOptions: CheckoutPaymentOption[]
  shippingOptions: CheckoutShippingOption[]
  isSubscriptionFlow: boolean
  planId?: string
  planName?: string
  planPrice?: number
  cartItems: { id: string; label: string; value: string }[]
  subtotalAmount: number
  discountAmount: number
  shippingPrice: number
  totalAmount: number
  /** Preferências já salvas no perfil do cliente (pré-preenche a etapa). */
  initialPreferences?: SubscriberPreferencesValue
  /** Salva preferências para a curadoria das caixas (server action). */
  onSavePreferences: (preferences: SubscriberPreferencesValue) => Promise<void>
  /** Cria o pedido (server action). */
  onCreateOrder: (input: {
    enderecoId: string
    pagamentoMetodoId: string
    cep: string
  }) => Promise<string | void>
}

const steps = [
  { key: 'conta', label: 'Conta', code: '01', Icon: IconUser },
  { key: 'endereco', label: 'Endereço', code: '02', Icon: IconMapPin },
  { key: 'frete', label: 'Frete', code: '03', Icon: IconTruck },
  { key: 'pagamento', label: 'Pagamento', code: '04', Icon: IconCreditCard },
  { key: 'preferencias', label: 'Preferências', code: '05', Icon: IconShirt },
  { key: 'revisao', label: 'Revisão', code: '06', Icon: IconPackage },
] as const

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

export function CheckoutStepper({
  customer,
  addresses: initialAddresses,
  paymentOptions: initialPaymentOptions,
  shippingOptions: initialShippingOptions,
  isSubscriptionFlow,
  planId,
  planName,
  planPrice,
  cartItems,
  subtotalAmount,
  discountAmount,
  shippingPrice: initialShippingPrice,
  totalAmount: initialTotalAmount,
  initialPreferences,
  onSavePreferences,
  onCreateOrder,
}: CheckoutStepperProps) {
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [navigationHint, setNavigationHint] = useState<string | null>(null)
  const [stepperKey, setStepperKey] = useState(0)

  const isAnnualPlan =
    isSubscriptionFlow && planName?.toLowerCase().includes('anual')
  const selectedPayment = paymentOptions.find((p) => p.id === selectedPaymentId)
  const totalAmount = initialTotalAmount - initialShippingPrice + shippingPrice

  const maxInstallments = isAnnualPlan ? 12 : totalAmount > 10000 ? 6 : 1

  const [installments, setInstallments] = useState(isAnnualPlan ? 12 : 1)

  const isLastStep = currentStep === steps.length
  const hasCustomer = Boolean(customer)
  const addressStepIndex = 2
  const shippingStepIndex = 3
  const paymentStepIndex = 4
  const hasSelectedAddress = Boolean(selectedAddressId) && !showAddressForm
  const hasSelectedShipping = !shippingLoading && Boolean(selectedShippingId)
  const hasSelectedPayment = Boolean(selectedPaymentId)
  const canAdvance =
    hasCustomer &&
    !editingAddressId &&
    (currentStep !== addressStepIndex || hasSelectedAddress) &&
    (currentStep !== shippingStepIndex || hasSelectedShipping) &&
    (currentStep !== paymentStepIndex || hasSelectedPayment) &&
    (!isLastStep ||
      (hasSelectedAddress && hasSelectedShipping && hasSelectedPayment))

  function canNavigateToStep(targetStep: number, activeStep: number) {
    if (targetStep < activeStep) return true
    if (targetStep !== activeStep + 1) return false

    switch (targetStep) {
      case addressStepIndex:
        return hasCustomer
      case shippingStepIndex:
        return hasSelectedAddress
      case paymentStepIndex:
        return hasSelectedShipping
      case 5:
        return hasSelectedPayment
      case 6:
        return true
      default:
        return false
    }
  }
  const processingMessage =
    selectedPayment?.type === 'pix'
      ? 'Gerando cobrança Pix e preparando o QR Code…'
      : 'Validando cartão e lacrando o pedido…'

  async function refreshShipping(zipCode: string) {
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
  }

  function handleSelectShipping(optionId: string) {
    setSelectedShippingId(optionId)
    const option = shippingOptions.find((item) => item.id === optionId)
    if (option) setShippingPrice(option.price)
  }

  const selectedZipCode = addresses.find(
    (item) => item.id === selectedAddressId,
  )?.zipCode

  useEffect(() => {
    if (!selectedZipCode) return
    void refreshShipping(selectedZipCode)
    // Recalcula assim que o endereço selecionado muda; a cotação de
    // assinatura exige planoId no body.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZipCode, planId, isSubscriptionFlow])

  function handleAddressSaved(nextAddresses: Address[]) {
    setAddresses(nextAddresses)
    setShowAddressForm(false)
    setEditingAddressId(null)
    setError(null)

    const preferred =
      nextAddresses.find((address) => address.id === selectedAddressId) ??
      nextAddresses.find((address) => address.isDefault) ??
      nextAddresses[0]

    if (preferred) {
      setSelectedAddressId(preferred.id)
    }
  }

  function resetAddressForm() {
    setShowAddressForm(false)
    setEditingAddressId(null)
  }

  function handleSelectAddress(addressId: string) {
    if (editingAddressId) return
    setSelectedAddressId(addressId)
  }

  function handleCardSaved(card: PaymentMethod) {
    const option = toCheckoutPayment(card)
    setPaymentOptions((prev) => {
      if (prev.some((item) => item.id === option.id)) return prev
      return [...prev, option]
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível finalizar o pedido. Tente novamente.',
      )
      setSubmitting(false)
      // remonta o Stepper voltando para a etapa de revisão (última)
      setCurrentStep(steps.length)
      setStepperKey((k) => k + 1)
    }
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId)
  const selectedShipping = shippingOptions.find(
    (s) => s.id === selectedShippingId,
  )
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

  return (
    <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
      <Dialog open={submitting}>
        <DialogContent
          className={cn(
            dossierCardSurface,
            warmShadowClass,
            'max-w-sm gap-0 p-6 text-center sm:p-7',
          )}
          overlayClassName="bg-foreground/30"
          showCloseButton={false}
        >
          <DialogHeader className="items-center gap-3 text-center">
            <Spinner aria-hidden className="size-8 text-(--red)" />
            <DialogTitle className={cn(fontHeading, 'text-lg text-(--ink)')}>
              Processamento em curso
            </DialogTitle>
            <DialogDescription className="text-sm/6 text-(--ink-mute)">
              {processingMessage}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="order-2 space-y-7 lg:order-1">
        <div className={cn(dossierCardSurface, warmShadowClass)}>
          <div className="flex items-center justify-between gap-4 border-b border-[rgba(33,28,24,0.12)] px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) text-(--red)">
                {(() => {
                  const StepIcon = steps[currentStep - 1]?.Icon ?? IconPackage
                  return <StepIcon className="size-5" />
                })()}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    fontHeading,
                    'truncate text-base font-semibold text-(--ink) sm:text-lg',
                  )}
                >
                  {steps[currentStep - 1]?.label}
                </p>
                <p
                  className={cn(
                    fontMono,
                    'mt-1 text-[0.58rem] tracking-[0.14em] text-(--red) uppercase sm:hidden',
                  )}
                >
                  Etapa {steps[currentStep - 1]?.code} de 06
                </p>
              </div>
            </div>
            <p
              className={cn(
                fontMono,
                'shrink-0 text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase max-sm:hidden',
              )}
            >
              {steps[currentStep - 1]?.code}/06
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <Stepper
              key={stepperKey}
              initialStep={currentStep}
              onStepChange={(step) => {
                setError(null)
                setNavigationHint(null)
                setCurrentStep(step)
              }}
              onFinalStepCompleted={handleFinalStepCompleted}
              canNavigateToStep={canNavigateToStep}
              onInvalidStepNavigation={(step) => {
                setNavigationHint(
                  `Conclua a etapa atual para acessar ${steps[step - 1]?.label ?? 'esta etapa'}.`,
                )
              }}
              stepCircleContainerClassName="space-y-6"
              stepContainerClassName="pb-5"
              contentClassName="pb-2"
              footerClassName="border-t border-[rgba(33,28,24,0.12)] pt-5"
              backButtonText={
                <>
                  <IconArrowLeft className="size-4" />
                  Voltar
                </>
              }
              nextButtonText={
                <>
                  Avançar
                  <IconArrowRight className="size-4" />
                </>
              }
              completeButtonText={
                submitting ? (
                  'Finalizando…'
                ) : (
                  <>
                    Finalizar pedido
                    <IconArrowRight className="size-4" />
                  </>
                )
              }
              backButtonProps={{ disabled: submitting }}
              nextButtonProps={{
                disabled: submitting || !canAdvance,
                className: isLastStep ? 'is-complete' : undefined,
              }}
              renderStepIndicator={(props) => (
                <StepIndicatorWithTooltip {...props} />
              )}
            >
              {/* 01 — Conta */}
              <Step>
                <Section
                  title="Identificação do assinante"
                  eyebrow="Conta"
                  code="STEP-01"
                >
                  {customer ? (
                    <div className="rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4">
                      <p
                        className={cn(
                          fontHeading,
                          'text-sm font-semibold text-(--ink)',
                        )}
                      >
                        {customer.name}
                      </p>
                      <p className="mt-1 text-sm text-(--ink-soft)">
                        {customer.email}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[10px] border border-dashed border-(--red)/40 bg-(--red)/8 p-4">
                      <p className="text-sm text-(--ink-soft)">
                        Faça login para continuar o checkout.
                      </p>
                    </div>
                  )}
                  <Button
                    asChild
                    variant="link"
                    className="mt-3 h-auto rounded-[9px] p-0 text-(--red) hover:text-(--red-deep)"
                  >
                    <Link href="/login">Alterar conta</Link>
                  </Button>
                </Section>
              </Step>

              {/* 02 — Endereço */}
              <Step>
                <Section
                  title="Endereço de entrega"
                  eyebrow="Endereço"
                  code="STEP-02"
                >
                  <div className="space-y-3">
                    {addresses.length === 0 && !showAddressForm ? (
                      <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconMapPin />
                          </EmptyMedia>
                          <EmptyTitle>Nenhum endereço cadastrado</EmptyTitle>
                          <EmptyDescription>
                            Cadastre um endereço de entrega para continuar o
                            checkout.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button
                            type="button"
                            onClick={() => {
                              resetAddressForm()
                              setShowAddressForm(true)
                            }}
                            className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
                          >
                            <IconPlus className="size-4" />
                            Cadastrar endereço
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : null}

                    {showAddressForm && !editingAddressId ? (
                      <AddressForm
                        idPrefix="checkout-addr-new"
                        onSaved={handleAddressSaved}
                        onCancel={
                          addresses.length > 0 ? resetAddressForm : undefined
                        }
                      />
                    ) : null}

                    {addresses.map((address) =>
                      editingAddressId === address.id ? (
                        <AddressForm
                          key={address.id}
                          formId={`checkout-address-edit-${address.id}`}
                          idPrefix={`checkout-addr-edit-${address.id}`}
                          address={address}
                          onSaved={handleAddressSaved}
                          onCancel={resetAddressForm}
                        />
                      ) : (
                        <OptionCard
                          key={address.id}
                          selected={selectedAddressId === address.id}
                          onSelect={() => {
                            void handleSelectAddress(address.id)
                          }}
                          name="address"
                          title={address.label}
                          detail={`${address.street}, ${address.number}${
                            address.complement ? ` (${address.complement})` : ''
                          } — ${address.neighborhood} · ${address.city}/${address.state} · CEP ${formatCep(address.zipCode)}`}
                          trailing={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={
                                Boolean(editingAddressId) || showAddressForm
                              }
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowAddressForm(false)
                                setEditingAddressId(address.id)
                              }}
                              className={cn(
                                'size-7 shrink-0 rounded-[9px] p-1 text-(--red)',
                                transitionBgColor,
                                'hover:bg-(--red)/10 hover:text-(--red-deep)',
                              )}
                              aria-label={`Editar endereço ${address.label}`}
                            >
                              <IconEdit className="size-3.5" />
                            </Button>
                          }
                        />
                      ),
                    )}

                    {!showAddressForm &&
                    !editingAddressId &&
                    addresses.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAddressId(null)
                          setShowAddressForm(true)
                        }}
                        className="inline-flex items-center gap-2 rounded-[9px]"
                      >
                        <IconPlus className="size-3.5" />
                        Adicionar outro endereço
                      </Button>
                    ) : null}
                  </div>
                </Section>
              </Step>

              {/* 03 — Frete */}
              <Step>
                <Section title="Frete" eyebrow="Envio" code="STEP-03">
                  {shippingLoading ? (
                    <div className="flex flex-col gap-3" aria-busy="true">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Spinner />
                        Consultando opções de frete para o CEP informado…
                      </div>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : shippingError ? (
                    <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <IconTruck />
                        </EmptyMedia>
                        <EmptyTitle>Frete indisponível</EmptyTitle>
                        <EmptyDescription>{shippingError}</EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!selectedZipCode}
                          onClick={() => {
                            if (selectedZipCode)
                              void refreshShipping(selectedZipCode)
                          }}
                          className="rounded-[9px]"
                        >
                          Tentar novamente
                        </Button>
                      </EmptyContent>
                    </Empty>
                  ) : shippingOptions.length === 0 ? (
                    <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <IconTruck />
                        </EmptyMedia>
                        <EmptyTitle>Nenhuma opção de frete</EmptyTitle>
                        <EmptyDescription>
                          Selecione um endereço com CEP válido para cotar o
                          envio.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <FieldSet className="gap-4">
                      <FieldLegend variant="label">
                        Escolha a forma de envio
                      </FieldLegend>
                      <FieldDescription>
                        Preços e prazos calculados para o CEP{' '}
                        {selectedZipCode ? formatCep(selectedZipCode) : '—'}.
                      </FieldDescription>
                      <RadioGroup
                        value={selectedShippingId}
                        onValueChange={handleSelectShipping}
                        className="gap-3"
                      >
                        {shippingOptions.map((option) => {
                          const optionId = `shipping-${option.id}`
                          const isCheapest =
                            cheapestShippingPrice != null &&
                            option.price === cheapestShippingPrice
                          const isFastest =
                            fastestShippingDays != null &&
                            option.estimatedDays === fastestShippingDays

                          return (
                            <FieldLabel
                              key={option.id}
                              htmlFor={optionId}
                              className={cn(
                                'w-full rounded-[10px] border transition-colors has-data-checked:bg-(--teal)/8',
                                selectedShippingId === option.id
                                  ? 'border-(--teal) bg-(--teal)/8'
                                  : 'border-[rgba(33,28,24,0.15)] bg-(--paper-soft) hover:border-(--red)/35',
                              )}
                            >
                              <Field
                                orientation="horizontal"
                                className="items-start"
                              >
                                <FieldContent className="gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <FieldTitle>{option.label}</FieldTitle>
                                    {option.carrier ? (
                                      <Badge variant="secondary">
                                        {option.carrier}
                                      </Badge>
                                    ) : null}
                                    {isFastest ? (
                                      <Badge className="border-transparent bg-(--teal)/15 text-(--teal-deep)">
                                        Mais rápida
                                      </Badge>
                                    ) : null}
                                    {isCheapest ? (
                                      <Badge className="border-transparent bg-(--amber)/20 text-(--ink-soft)">
                                        Mais econômica
                                      </Badge>
                                    ) : null}
                                  </div>
                                  <FieldDescription>
                                    Prazo estimado:{' '}
                                    {formatBusinessDays(option.estimatedDays)}
                                  </FieldDescription>
                                </FieldContent>
                                <div className="flex shrink-0 flex-col items-end gap-2">
                                  <span
                                    className={cn(
                                      fontHeading,
                                      'text-sm font-bold text-(--ink)',
                                    )}
                                  >
                                    {option.price === 0
                                      ? 'Grátis'
                                      : formatCurrency(option.price)}
                                  </span>
                                  <RadioGroupItem
                                    value={option.id}
                                    id={optionId}
                                  />
                                </div>
                              </Field>
                            </FieldLabel>
                          )
                        })}
                      </RadioGroup>
                    </FieldSet>
                  )}
                </Section>
              </Step>

              {/* 04 — Pagamento */}
              <Step>
                <Section title="Pagamento" eyebrow="Cobrança" code="STEP-04">
                  <div className="space-y-3">
                    {paymentOptions.length === 0 && !showCardForm ? (
                      <Empty className="border border-dashed border-(--ink)/15 bg-(--paper-soft) p-8">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconCreditCard />
                          </EmptyMedia>
                          <EmptyTitle>Nenhuma forma de pagamento</EmptyTitle>
                          <EmptyDescription>
                            Cadastre um cartão de crédito para finalizar o
                            pedido.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button
                            type="button"
                            onClick={() => setShowCardForm(true)}
                            className="inline-flex items-center gap-2 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
                          >
                            <IconPlus className="size-4" />
                            Cadastrar cartão
                          </Button>
                        </EmptyContent>
                      </Empty>
                    ) : null}

                    {paymentOptions.map((option) => (
                      <OptionCard
                        key={option.id}
                        selected={selectedPaymentId === option.id}
                        onSelect={() => setSelectedPaymentId(option.id)}
                        name="payment"
                        title={option.label}
                        detail={
                          option.type === 'pix'
                            ? 'Pagamento via Pix'
                            : 'Cartão de crédito'
                        }
                      />
                    ))}

                    {showCardForm ? (
                      <CardForm
                        idPrefix="checkout-card"
                        onSaved={handleCardSaved}
                        onCancel={
                          paymentOptions.length > 0
                            ? () => setShowCardForm(false)
                            : undefined
                        }
                      />
                    ) : paymentOptions.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCardForm(true)}
                        className="inline-flex items-center gap-2 rounded-[9px]"
                      >
                        <IconPlus className="size-3.5" />
                        Adicionar cartão
                      </Button>
                    ) : null}
                  </div>
                  {selectedPayment?.type === 'credit_card' &&
                    maxInstallments > 1 && (
                      <Field className="mt-4">
                        <FieldLabel
                          className={cn(
                            fontMono,
                            'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
                          )}
                        >
                          Quantidade de parcelas
                        </FieldLabel>
                        <NativeSelect
                          value={String(installments)}
                          onChange={(e) =>
                            setInstallments(Number(e.target.value))
                          }
                          className={cn(formInputClass, 'px-3')}
                        >
                          {Array.from(
                            { length: maxInstallments },
                            (_, i) => i + 1,
                          ).map((n) => {
                            const val = Math.round(totalAmount / n)
                            return (
                              <NativeSelectOption key={n} value={String(n)}>
                                {n}x de {formatCurrency(val)}
                              </NativeSelectOption>
                            )
                          })}
                        </NativeSelect>
                      </Field>
                    )}
                  <p className="mt-4 text-[0.7rem]/5 text-(--ink-mute)">
                    O cartão é tokenizado no gateway ativo antes de ser salvo.
                  </p>
                </Section>
              </Step>

              {/* 05 — Preferências */}
              <Step>
                <Section
                  title="Preferências da caixa"
                  eyebrow="Curadoria"
                  code="STEP-05"
                >
                  <p className="text-sm text-(--ink-soft)">
                    {planName
                      ? `Para o ${planName}, usamos suas preferências na curadoria dos itens surpresa da sua caixa.`
                      : 'Usamos suas preferências na curadoria dos itens surpresa da sua caixa.'}
                  </p>
                  <FieldGroup className="mt-5 gap-4 sm:grid sm:grid-cols-2">
                    <Field>
                      <FieldLabel
                        className={cn(
                          fontMono,
                          'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
                        )}
                      >
                        Tamanho de camiseta
                      </FieldLabel>
                      <NativeSelect
                        value={preferences.shirtSize ?? ''}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            shirtSize: e.target.value,
                          }))
                        }
                        className={cn(formInputClass, 'px-3')}
                      >
                        <NativeSelectOption value="">
                          Prefiro não informar
                        </NativeSelectOption>
                        {SHIRT_SIZES.map((option) => (
                          <NativeSelectOption key={option} value={option}>
                            {option}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                    <Field>
                      <FieldLabel
                        className={cn(
                          fontMono,
                          'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
                        )}
                      >
                        Tamanho de calçado
                      </FieldLabel>
                      <NativeSelect
                        value={preferences.shoeSize ?? ''}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            shoeSize: e.target.value,
                          }))
                        }
                        className={cn(formInputClass, 'px-3')}
                      >
                        <NativeSelectOption value="">
                          Prefiro não informar
                        </NativeSelectOption>
                        {SHOE_SIZES.map((option) => (
                          <NativeSelectOption key={option} value={option}>
                            {option}
                          </NativeSelectOption>
                        ))}
                      </NativeSelect>
                    </Field>
                  </FieldGroup>
                  <Field className="mt-4">
                    <FieldLabel
                      className={cn(
                        fontMono,
                        'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
                      )}
                    >
                      Notas para curadoria
                    </FieldLabel>
                    <Textarea
                      value={preferences.notes}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Preferências de cores, estilo, alergias, etc."
                      className={cn(formInputClass, 'resize-none')}
                    />
                  </Field>
                </Section>
              </Step>

              {/* 06 — Revisão */}
              <Step>
                <Section
                  title="Revisão final"
                  eyebrow="Confirmação"
                  code="STEP-06"
                >
                  <Review
                    label="Endereço"
                    value={selectedAddress?.label ?? '—'}
                    detail={
                      selectedAddress
                        ? `${selectedAddress.street}, ${selectedAddress.number} — ${selectedAddress.city}/${selectedAddress.state}`
                        : undefined
                    }
                  />
                  <Review
                    label="Frete"
                    value={selectedShipping?.label ?? '—'}
                    detail={
                      selectedShipping
                        ? [
                            selectedShipping.carrier,
                            formatBusinessDays(selectedShipping.estimatedDays),
                            formatCurrency(selectedShipping.price),
                          ]
                            .filter(Boolean)
                            .join(' · ')
                        : undefined
                    }
                  />
                  <Review
                    label="Pagamento"
                    value={
                      selectedPayment
                        ? `${selectedPayment.label}${
                            selectedPayment.type === 'credit_card' &&
                            installments > 1
                              ? ` (${installments}x de ${formatCurrency(Math.round(totalAmount / installments))})`
                              : ''
                          }`
                        : '—'
                    }
                  />
                  <Review
                    label="Preferências"
                    value={
                      [
                        preferences.shirtSize
                          ? `Camiseta ${preferences.shirtSize}`
                          : null,
                        preferences.shoeSize
                          ? `Calçado ${preferences.shoeSize}`
                          : null,
                        preferences.notes ? 'Notas informadas' : null,
                      ]
                        .filter(Boolean)
                        .join(' · ') || 'Sem preferências informadas'
                    }
                  />
                  {error ? (
                    <p className="mt-4 rounded-[10px] border border-(--red)/45 bg-(--red)/10 px-3 py-2 text-sm text-(--ink)">
                      {error}
                    </p>
                  ) : null}
                </Section>
              </Step>
            </Stepper>
            {navigationHint ? (
              <p
                id="checkout-step-navigation-hint"
                role="status"
                className="mt-3 text-sm text-(--ink-soft)"
              >
                {navigationHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <aside className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-24">
          <OrderSummary
            isSubscriptionFlow={isSubscriptionFlow}
            isAnnualSubscription={Boolean(isAnnualPlan)}
            planName={planName}
            planPrice={planPrice}
            items={cartItems}
            subtotalAmount={subtotalAmount}
            discountAmount={discountAmount}
            shippingPrice={shippingPrice}
            shippingLoading={shippingLoading}
            shippingQuoted={hasSelectedShipping}
            totalAmount={totalAmount}
            installmentsCount={
              selectedPayment?.type === 'credit_card' ? installments : 1
            }
            installmentValue={Math.round(
              totalAmount /
                (selectedPayment?.type === 'credit_card' ? installments : 1),
            )}
          />
        </div>
      </aside>
    </div>
  )
}

interface OrderSummaryItem {
  id: string
  label: string
  value: string
}

function OrderSummary({
  isSubscriptionFlow,
  isAnnualSubscription,
  planName,
  planPrice,
  items,
  subtotalAmount,
  discountAmount,
  shippingPrice,
  shippingLoading,
  shippingQuoted,
  totalAmount,
  installmentsCount,
  installmentValue,
}: {
  isSubscriptionFlow: boolean
  isAnnualSubscription: boolean
  planName?: string
  planPrice?: number
  items: OrderSummaryItem[]
  subtotalAmount: number
  discountAmount: number
  shippingPrice: number
  shippingLoading: boolean
  shippingQuoted: boolean
  totalAmount: number
  installmentsCount: number
  installmentValue: number
}) {
  const hasItems = (isSubscriptionFlow && planName != null) || items.length > 0
  const freteValueLabel = shippingLoading
    ? 'Calculando…'
    : shippingQuoted
      ? formatCurrency(shippingPrice)
      : 'A calcular'

  return (
    <section
      className={cn(
        dossierCardSurface,
        warmShadowClass,
        'overflow-hidden bg-(--card)',
      )}
    >
      <div className="border-b border-dashed border-[rgba(33,28,24,0.18)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              fontMono,
              'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
            )}
          >
            Resumo do pedido
          </p>
          {/* <p
            className={cn(
              fontMono,
              'rounded-[2px] border border-[rgba(33,28,24,0.12)] bg-(--paper-soft) px-2 py-1 text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase',
            )}
          >
            DOSS-07
          </p> */}
        </div>
      </div>

      <div className="space-y-5 p-5 text-sm sm:p-6">
        <div className="space-y-3">
          {hasItems ? (
            <ul className="space-y-2.5 text-(--ink-soft)">
              {isSubscriptionFlow && planName ? (
                <li className="flex flex-col gap-0.5">
                  <div className="flex justify-between gap-4">
                    <span className="min-w-0 truncate text-(--ink)">
                      {planName}
                    </span>
                    <span className="shrink-0 font-medium text-(--ink)">
                      {formatCurrency(planPrice ?? 0)}
                      {isAnnualSubscription ? (
                        <span className="text-(--ink-mute)">/mês</span>
                      ) : null}
                    </span>
                  </div>
                  <span className="text-xs text-(--ink-mute)">
                    Assinatura
                    {isAnnualSubscription ? ' · cobrada anualmente' : ''}
                  </span>
                </li>
              ) : null}
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="shrink-0 font-medium text-(--ink)">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-(--ink-soft)">Nenhum item selecionado.</p>
          )}
        </div>

        <div className="space-y-2.5 border-t border-dashed border-[rgba(33,28,24,0.18)] pt-4 text-(--ink-soft)">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span className="text-(--ink)">
              {formatCurrency(subtotalAmount)}
            </span>
          </div>

          {discountAmount > 0 ? (
            <div className="flex justify-between gap-4 rounded-[8px] border border-[rgba(26,165,135,0.18)] bg-[rgba(26,165,135,0.06)] px-2.5 py-2 font-semibold text-(--teal-deep)">
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className="size-1.5 shrink-0 rounded-full bg-(--teal)"
                  aria-hidden
                />
                <span className="truncate">Desconto</span>
              </span>
              <span className="shrink-0">
                − {formatCurrency(discountAmount)}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between gap-4">
            <span>Frete</span>
            <span
              className={cn(
                'text-(--ink)',
                !shippingQuoted && !shippingLoading && 'text-(--ink-mute)',
              )}
            >
              {freteValueLabel}
            </span>
          </div>
        </div>

        <div className="border-t border-[rgba(33,28,24,0.15)] pt-4">
          {installmentsCount > 1 ? (
            <div className="space-y-2">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-0.5">
                  <span
                    className={cn(
                      fontMono,
                      'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                    )}
                  >
                    Parcelas
                  </span>
                  <p className="text-[0.7rem] text-(--ink-mute)">
                    {installmentsCount}x sem juros
                    {!shippingQuoted && !shippingLoading ? ' · sem frete' : ''}
                  </p>
                </div>
                <span
                  className={cn(
                    fontHeading,
                    'text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-(--ink)',
                  )}
                >
                  {formatCurrency(installmentValue)}
                </span>
              </div>
              <div className="flex justify-between border-t border-dashed border-[rgba(33,28,24,0.18)] pt-2 text-xs text-(--ink-mute)">
                <span>Total à vista</span>
                <span className="font-semibold text-(--ink-soft)">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-0.5">
                <span
                  className={cn(
                    fontMono,
                    'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                  )}
                >
                  Total
                </span>
                {!shippingQuoted && !shippingLoading ? (
                  <p className="text-[0.7rem] text-(--ink-mute)">
                    Sem frete ainda
                  </p>
                ) : null}
              </div>
              <span
                className={cn(
                  fontHeading,
                  'text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-(--ink)',
                )}
              >
                {formatCurrency(totalAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* <div className="border-t border-dashed border-[rgba(33,28,24,0.18)] p-5 sm:p-6">
        <p className="text-[0.7rem]/5 text-(--ink-mute)">
          Ao confirmar, o pedido é criado e a cobrança é processada no gateway
          configurado (cartão ou Pix).
        </p>
      </div> */}
    </section>
  )
}

function StepIndicatorWithTooltip({
  step,
  currentStep,
  onStepClick,
  isNavigable,
}: StepperStepIndicatorProps) {
  const stepMeta = steps[step - 1]
  const StepIcon = stepMeta?.Icon ?? IconPackage
  const status =
    currentStep === step
      ? 'active'
      : currentStep < step
        ? 'inactive'
        : 'complete'

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onStepClick(step)}
            aria-disabled={!isNavigable}
            aria-describedby={
              !isNavigable ? 'checkout-step-navigation-hint' : undefined
            }
            aria-label={`Etapa ${stepMeta?.code} — ${stepMeta?.label}`}
            aria-current={status === 'active' ? 'step' : undefined}
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-[10px] border transition-colors focus-visible:ring-2 focus-visible:ring-(--red)/25 focus-visible:outline-none',
              status === 'active'
                ? 'border-(--red) bg-(--red)/10 text-(--red)'
                : status === 'complete'
                  ? 'border-(--teal) bg-(--teal) text-[#fbf9f6]'
                  : isNavigable
                    ? 'border-[rgba(33,28,24,0.15)] text-(--ink-mute) hover:border-(--red)/35 hover:text-(--red)'
                    : 'cursor-not-allowed border-[rgba(33,28,24,0.1)] text-(--ink-mute)/55',
            )}
          >
            {status === 'complete' ? (
              <IconCheck className="size-4" />
            ) : (
              <StepIcon className="size-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="border-[rgba(33,28,24,0.15)] bg-[#fbf9f6] text-[#211c18]"
        >
          <span
            className={cn(
              fontMono,
              'text-[0.6rem] tracking-[0.14em] text-[#c5271f] uppercase',
            )}
          >
            {stepMeta?.code}/06
          </span>
          <span
            className={cn(
              fontHeading,
              'mt-1 block text-sm font-semibold text-[#211c18]',
            )}
          >
            {stepMeta?.label}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function Section({
  title,
  eyebrow,
  code,
  children,
}: {
  title: string
  eyebrow: string
  code: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4 border-b border-dashed border-[rgba(33,28,24,0.12)] pb-3">
        <div>
          <p
            className={cn(
              fontMono,
              'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
            )}
          >
            {eyebrow}
          </p>
          <h2
            className={cn(
              fontHeading,
              'mt-1 text-lg font-semibold text-(--ink)',
            )}
          >
            {title}
          </h2>
        </div>
        <p
          className={cn(
            fontMono,
            'text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase',
          )}
        >
          {code}
        </p>
      </div>
      {children}
    </section>
  )
}

function OptionCard({
  selected,
  onSelect,
  name,
  title,
  detail,
  trailing,
}: {
  selected: boolean
  onSelect: () => void
  name: string
  title: string
  detail?: string
  trailing?: React.ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-[10px] border p-4 text-sm transition-colors',
        selected
          ? 'border-(--teal) bg-(--teal)/8'
          : 'border-[rgba(33,28,24,0.15)] bg-(--paper-soft) hover:border-(--red)/35',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="mt-1 accent-(--teal)"
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-4">
          <span className="font-medium text-(--ink)">{title}</span>
          {trailing}
        </span>
        {detail ? (
          <span className="mt-1 block text-(--ink-soft)">{detail}</span>
        ) : null}
      </span>
    </label>
  )
}

function Review({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-[rgba(33,28,24,0.12)] py-3 last:border-0">
      <div>
        <p
          className={cn(
            fontMono,
            'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
          )}
        >
          {label}
        </p>
        <p className="mt-1 font-medium text-(--ink)">{value}</p>
        {detail ? <p className="text-(--ink-soft)">{detail}</p> : null}
      </div>
      <IconCircleCheck className="size-5 text-(--teal)" />
    </div>
  )
}

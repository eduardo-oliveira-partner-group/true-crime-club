'use client'

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconCreditCard,
  IconMapPin,
  IconPackage,
  IconShirt,
  IconTruck,
  IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  Step,
  Stepper,
  type StepperStepIndicatorProps,
} from '@/src/components/ui/stepper'
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
  warmShadowClass,
} from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export interface CheckoutAddress {
  id: string
  label: string
  street: string
  number: string
  city: string
  state: string
  zipCode: string
}

export interface CheckoutPaymentOption {
  id: string
  label: string
  type: 'credit_card' | 'pix'
}

export interface CheckoutShippingOption {
  id: string
  label: string
  price: number
  estimatedDays: string
}

export interface SubscriberPreferencesValue {
  shirtSize?: string
  shoeSize?: string
  notes?: string
}

interface CheckoutStepperProps {
  customer: { name: string; email: string } | null
  addresses: CheckoutAddress[]
  paymentOptions: CheckoutPaymentOption[]
  shippingOptions: CheckoutShippingOption[]
  isSubscriptionFlow: boolean
  planName?: string
  /** Salva preferências do assinante (server action). */
  onSavePreferences: (preferences: SubscriberPreferencesValue) => Promise<void>
  /** Cria o pedido (server action). */
  onCreateOrder: () => Promise<void>
}

const shirtSizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG']
const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44']

const steps = [
  { key: 'conta', label: 'Conta', code: '01', Icon: IconUser },
  { key: 'endereco', label: 'Endereço', code: '02', Icon: IconMapPin },
  { key: 'frete', label: 'Frete', code: '03', Icon: IconTruck },
  { key: 'pagamento', label: 'Pagamento', code: '04', Icon: IconCreditCard },
  { key: 'preferencias', label: 'Preferências', code: '05', Icon: IconShirt },
  { key: 'revisao', label: 'Revisão', code: '06', Icon: IconPackage },
] as const

export function CheckoutStepper({
  customer,
  addresses,
  paymentOptions,
  shippingOptions,
  isSubscriptionFlow,
  planName,
  onSavePreferences,
  onCreateOrder,
}: CheckoutStepperProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses[0]?.id ?? '',
  )
  const [selectedShippingId, setSelectedShippingId] = useState(
    shippingOptions[0]?.id ?? '',
  )
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentOptions[0]?.id ?? '',
  )
  const [preferences, setPreferences] = useState<SubscriberPreferencesValue>({
    shirtSize: '',
    shoeSize: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stepperKey, setStepperKey] = useState(0)

  const isLastStep = currentStep === steps.length

  async function handleFinalStepCompleted() {
    setError(null)
    setSubmitting(true)
    try {
      if (isSubscriptionFlow) {
        await onSavePreferences(preferences)
      }
      await onCreateOrder()
      const prefix =
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/design-sugerido')
          ? '/design-sugerido'
          : ''
      router.push(`${prefix}/checkout/confirmacao`)
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
  const selectedPayment = paymentOptions.find((p) => p.id === selectedPaymentId)

  return (
    <div className="space-y-7">
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
              setCurrentStep(step)
            }}
            onFinalStepCompleted={handleFinalStepCompleted}
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
              disabled: submitting,
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
                  {addresses.length === 0 ? (
                    <p className="text-sm text-(--ink-soft)">
                      Nenhum endereço cadastrado.
                    </p>
                  ) : (
                    addresses.map((address) => (
                      <OptionCard
                        key={address.id}
                        selected={selectedAddressId === address.id}
                        onSelect={() => setSelectedAddressId(address.id)}
                        name="address"
                        title={address.label}
                        detail={`${address.street}, ${address.number} — ${address.city}/${address.state} · CEP ${address.zipCode}`}
                      />
                    ))
                  )}
                </div>
              </Section>
            </Step>

            {/* 03 — Frete */}
            <Step>
              <Section title="Frete" eyebrow="Envio" code="STEP-03">
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={selectedShippingId === option.id}
                      onSelect={() => setSelectedShippingId(option.id)}
                      name="shipping"
                      title={option.label}
                      detail={option.estimatedDays}
                      trailing={
                        <span
                          className={cn(
                            cn(fontHeading, 'text-sm font-bold'),
                            option.price === 0
                              ? 'text-(--teal-deep)'
                              : 'text-(--ink)',
                          )}
                        >
                          {option.price === 0 ? 'Grátis' : `R$ ${option.price}`}
                        </span>
                      }
                    />
                  ))}
                </div>
              </Section>
            </Step>

            {/* 04 — Pagamento */}
            <Step>
              <Section title="Pagamento" eyebrow="Cobrança" code="STEP-04">
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <OptionCard
                      key={option.id}
                      selected={selectedPaymentId === option.id}
                      onSelect={() => setSelectedPaymentId(option.id)}
                      name="payment"
                      title={option.label}
                      detail={
                        option.type === 'pix'
                          ? 'Pagamento via Pix (mockado)'
                          : 'Cartão de crédito (mockado)'
                      }
                    />
                  ))}
                </div>
                <p className="mt-4 text-[0.7rem]/5 text-(--ink-mute)">
                  Ambiente de validação — nenhum pagamento real será processado.
                </p>
              </Section>
            </Step>

            {/* 05 — Preferências */}
            <Step>
              <Section
                title="Preferências do assinante"
                eyebrow="Curadoria"
                code="STEP-05"
              >
                {isSubscriptionFlow ? (
                  <>
                    <p className="text-sm text-(--ink-soft)">
                      {planName
                        ? `Para o ${planName}, capturamos suas preferências para curadoria das boxes.`
                        : 'Capturamos suas preferências para curadoria das boxes.'}
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <Field label="Tamanho de camiseta">
                        <SelectInput
                          value={preferences.shirtSize ?? ''}
                          onChange={(value) =>
                            setPreferences((prev) => ({
                              ...prev,
                              shirtSize: value,
                            }))
                          }
                          options={shirtSizes}
                          placeholder="Prefiro não informar"
                        />
                      </Field>
                      <Field label="Tamanho de calçado">
                        <SelectInput
                          value={preferences.shoeSize ?? ''}
                          onChange={(value) =>
                            setPreferences((prev) => ({
                              ...prev,
                              shoeSize: value,
                            }))
                          }
                          options={shoeSizes}
                          placeholder="Prefiro não informar"
                        />
                      </Field>
                    </div>
                    <Field label="Notas para curadoria">
                      <textarea
                        value={preferences.notes}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Preferências de cores, estilo, alergias, etc."
                        className={cn(formInputClass, 'mt-4 resize-none')}
                      />
                    </Field>
                  </>
                ) : (
                  <p className="text-sm text-(--ink-soft)">
                    Etapa exclusiva para assinantes. Para compra avulsa, siga
                    para a revisão.
                  </p>
                )}
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
                  detail={selectedShipping?.estimatedDays}
                />
                <Review
                  label="Pagamento"
                  value={selectedPayment?.label ?? '—'}
                />
                {isSubscriptionFlow ? (
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
                ) : null}
                {error ? (
                  <p className="mt-4 rounded-[10px] border border-(--red)/45 bg-(--red)/10 px-3 py-2 text-sm text-(--ink)">
                    {error}
                  </p>
                ) : null}
              </Section>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  )
}

function StepIndicatorWithTooltip({
  step,
  currentStep,
  onStepClick,
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
            aria-label={`Etapa ${stepMeta?.code} — ${stepMeta?.label}`}
            aria-current={status === 'active' ? 'step' : undefined}
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-[10px] border transition-colors focus-visible:ring-2 focus-visible:ring-(--red)/25 focus-visible:outline-none',
              status === 'active'
                ? 'border-(--red) bg-(--red)/10 text-(--red)'
                : status === 'complete'
                  ? 'border-(--teal) bg-(--teal) text-[#fbf9f6]'
                  : 'border-[rgba(33,28,24,0.15)] text-(--ink-mute) hover:border-(--red)/35 hover:text-(--red)',
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span
        className={cn(
          fontMono,
          'text-[0.65rem] font-semibold tracking-[0.14em] text-(--ink) uppercase',
        )}
      >
        {label}
      </span>
      {children}
    </label>
  )
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(formInputClass, 'h-10 px-3 py-0')}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
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
      <span className="flex flex-1 items-start justify-between gap-4">
        <span>
          <span className="font-medium text-(--ink)">{title}</span>
          {detail ? (
            <span className="mt-1 block text-(--ink-soft)">{detail}</span>
          ) : null}
        </span>
        {trailing}
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

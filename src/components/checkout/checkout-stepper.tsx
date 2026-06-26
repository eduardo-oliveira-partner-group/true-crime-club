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

type StepKey = (typeof steps)[number]['key']

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
  const [current, setCurrent] = useState<StepKey>('conta')
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

  const currentIndex = steps.findIndex((step) => step.key === current)
  const isLast = currentIndex === steps.length - 1
  const currentStep = steps[currentIndex]

  function goTo(step: StepKey) {
    setCurrent(step)
  }

  function next() {
    if (isLast) return
    goTo(steps[currentIndex + 1].key)
  }

  function back() {
    if (currentIndex === 0) return
    goTo(steps[currentIndex - 1].key)
  }

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      if (isSubscriptionFlow) {
        await onSavePreferences(preferences)
      }
      await onCreateOrder()
      router.push('/checkout/confirmacao')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível finalizar o pedido. Tente novamente.',
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-7">
      <StepperHeader current={current} />

      <div className="border border-[#fffaf0]/12 bg-[#0b0908] shadow-[0_20px_48px_rgba(0,0,0,0.38)]">
        <div className="flex items-center justify-between border-b border-[#fffaf0]/12 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center border border-[#d7b56d]/45 bg-[#171211] text-[#d7b56d]">
              <currentStep.Icon className="size-4.5" />
            </span>
            <div>
              <p className="font-mono text-[0.6rem] tracking-[0.18em] text-[#fffaf0]/45 uppercase">
                Etapa {currentStep.code} / 06
              </p>
              <p className="font-heading text-base font-semibold text-[#fffaf0]">
                {currentStep.label}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {current === 'conta' ? (
            <Section
              title="Identificação do assinante"
              eyebrow="Conta"
              code="STEP-01"
            >
              {customer ? (
                <div className="border border-[#fffaf0]/12 bg-[#171211] p-4">
                  <p className="font-heading text-sm font-semibold text-[#fffaf0]">
                    {customer.name}
                  </p>
                  <p className="mt-1 text-sm text-[#c8bdad]">
                    {customer.email}
                  </p>
                </div>
              ) : (
                <div className="border border-dashed border-[#d84132]/40 bg-[#d84132]/8 p-4">
                  <p className="text-sm text-[#ffb0a5]">
                    Faça login para continuar o checkout.
                  </p>
                </div>
              )}
              <Button
                asChild
                variant="link"
                className="mt-3 h-auto p-0 text-[#d7b56d] hover:text-[#f0e8dd]"
              >
                <Link href="/login">Alterar conta</Link>
              </Button>
            </Section>
          ) : null}

          {current === 'endereco' ? (
            <Section
              title="Endereço de entrega"
              eyebrow="Endereço"
              code="STEP-02"
            >
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <p className="text-sm text-[#c8bdad]">
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
          ) : null}

          {current === 'frete' ? (
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
                          'font-heading text-sm font-bold',
                          option.price === 0
                            ? 'text-[#d7b56d]'
                            : 'text-[#fffaf0]',
                        )}
                      >
                        {option.price === 0 ? 'Grátis' : `R$ ${option.price}`}
                      </span>
                    }
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {current === 'pagamento' ? (
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
              <p className="mt-4 text-[0.7rem]/5 text-[#bfb4a3]">
                Ambiente de validação — nenhum pagamento real será processado.
              </p>
            </Section>
          ) : null}

          {current === 'preferencias' ? (
            <Section
              title="Preferências do assinante"
              eyebrow="Curadoria"
              code="STEP-05"
            >
              {isSubscriptionFlow ? (
                <>
                  <p className="text-sm text-[#c8bdad]">
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
                      className="mt-4 w-full resize-none border border-[#fffaf0]/14 bg-[#171211] p-3 text-sm text-[#f0e8dd] placeholder:text-[#bfb4a3]/60 focus:border-[#d7b56d]/60 focus:outline-none"
                    />
                  </Field>
                </>
              ) : (
                <p className="text-sm text-[#c8bdad]">
                  Etapa exclusiva para assinantes. Para compra avulsa, siga para
                  a revisão.
                </p>
              )}
            </Section>
          ) : null}

          {current === 'revisao' ? (
            <Section title="Revisão final" eyebrow="Confirmação" code="STEP-06">
              <Review
                label="Endereço"
                value={
                  addresses.find((a) => a.id === selectedAddressId)?.label ??
                  '—'
                }
                detail={
                  addresses.find((a) => a.id === selectedAddressId)
                    ? `${addresses.find((a) => a.id === selectedAddressId)?.street}, ${addresses.find((a) => a.id === selectedAddressId)?.number} — ${addresses.find((a) => a.id === selectedAddressId)?.city}/${addresses.find((a) => a.id === selectedAddressId)?.state}`
                    : undefined
                }
              />
              <Review
                label="Frete"
                value={
                  shippingOptions.find((s) => s.id === selectedShippingId)
                    ?.label ?? '—'
                }
                detail={
                  shippingOptions.find((s) => s.id === selectedShippingId)
                    ?.estimatedDays
                }
              />
              <Review
                label="Pagamento"
                value={
                  paymentOptions.find((p) => p.id === selectedPaymentId)
                    ?.label ?? '—'
                }
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
                <p className="mt-4 border border-[#d84132]/45 bg-[#d84132]/10 px-3 py-2 text-sm text-[#ffb0a5]">
                  {error}
                </p>
              ) : null}
            </Section>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          disabled={currentIndex === 0 || submitting}
          className="h-11 gap-1.5 border-[#fffaf0]/20 bg-transparent px-5 text-[#d7c9b5] hover:bg-[#fffaf0]/8 hover:text-[#fffaf0]"
        >
          <IconArrowLeft className="size-4" />
          Voltar
        </Button>
        {isLast ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 gap-1.5 bg-[#d84132] px-6 text-white shadow-[0_0_26px_rgba(216,65,50,0.32)] hover:bg-[#b93227]"
          >
            {submitting ? 'Finalizando…' : 'Finalizar pedido mockado'}
            <IconArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={next}
            className="h-11 gap-1.5 bg-[#d7b56d] px-6 text-[#171211] hover:bg-[#c9a65c]"
          >
            Avançar
            <IconArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function StepperHeader({ current }: { current: StepKey }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-6">
      {steps.map((step, index) => {
        const isActive = step.key === current
        const isDone = steps.findIndex((s) => s.key === current) > index
        const StepIcon = step.Icon
        return (
          <li key={step.key}>
            <div
              className={cn(
                'flex items-center gap-2.5 border px-3 py-2.5 text-xs transition-colors',
                isActive
                  ? 'border-[#d7b56d]/55 bg-[#171211] text-[#fffaf0]'
                  : isDone
                    ? 'border-[#fffaf0]/14 bg-[#0b0908] text-[#c8bdad]'
                    : 'border-[#fffaf0]/8 bg-[#0b0908] text-[#fffaf0]/45',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center border',
                  isActive
                    ? 'border-[#d7b56d] bg-[#d7b56d]/15 text-[#d7b56d]'
                    : isDone
                      ? 'border-[#d7b56d]/60 bg-[#d7b56d] text-[#171211]'
                      : 'border-[#fffaf0]/20 text-[#fffaf0]/45',
                )}
              >
                {isDone ? (
                  <IconCheck className="size-3.5" />
                ) : (
                  <StepIcon className="size-3.5" />
                )}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          </li>
        )
      })}
    </ol>
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
      <div className="flex items-end justify-between gap-4 border-b border-[#fffaf0]/10 pb-3">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-[#fffaf0]">
            {title}
          </h2>
        </div>
        <p className="font-mono text-[0.6rem] tracking-[0.16em] text-[#fffaf0]/35 uppercase">
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
      <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
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
      className="h-10 w-full border border-[#fffaf0]/14 bg-[#171211] px-3 text-sm text-[#f0e8dd] focus:border-[#d7b56d]/60 focus:outline-none"
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
        'flex cursor-pointer items-start gap-3 border p-4 text-sm transition-colors',
        selected
          ? 'border-[#d7b56d]/60 bg-[#d7b56d]/8'
          : 'border-[#fffaf0]/12 bg-[#171211] hover:border-[#fffaf0]/24',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="mt-1 accent-[#d7b56d]"
      />
      <span className="flex flex-1 items-start justify-between gap-4">
        <span>
          <span className="font-medium text-[#f0e8dd]">{title}</span>
          {detail ? (
            <span className="mt-1 block text-[#c8bdad]">{detail}</span>
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
    <div className="flex items-start justify-between gap-4 border-b border-[#fffaf0]/10 py-3 last:border-0">
      <div>
        <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
          {label}
        </p>
        <p className="mt-1 font-medium text-[#f0e8dd]">{value}</p>
        {detail ? <p className="text-[#c8bdad]">{detail}</p> : null}
      </div>
      <IconCircleCheck className="size-5 text-[#d7b56d]" />
    </div>
  )
}

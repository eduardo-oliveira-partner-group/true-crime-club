'use client'

import {
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
  { key: 'conta', label: 'Conta', Icon: IconUser },
  { key: 'endereco', label: 'Endereço', Icon: IconMapPin },
  { key: 'frete', label: 'Frete', Icon: IconTruck },
  { key: 'pagamento', label: 'Pagamento', Icon: IconCreditCard },
  { key: 'preferencias', label: 'Preferências', Icon: IconShirt },
  { key: 'revisao', label: 'Revisão', Icon: IconPackage },
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
    <div className="space-y-8">
      <StepperHeader current={current} />

      <div className="rounded-2xl border border-border bg-card p-6">
        {current === 'conta' ? (
          <Section title="Conta">
            {customer ? (
              <p className="text-sm text-muted-foreground">
                {customer.name} — {customer.email}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Faça login para continuar.
              </p>
            )}
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/login">Alterar conta</Link>
            </Button>
          </Section>
        ) : null}

        {current === 'endereco' ? (
          <Section title="Endereço de entrega">
            <div className="space-y-2">
              {addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum endereço cadastrado.
                </p>
              ) : (
                addresses.map((address) => (
                  <label
                    key={address.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm',
                      selectedAddressId === address.id
                        ? 'border-brand-accent bg-brand-muted/40'
                        : 'border-border',
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-medium">{address.label}</span>
                      <br />
                      <span className="text-muted-foreground">
                        {address.street}, {address.number} — {address.city}/
                        {address.state} · CEP {address.zipCode}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </Section>
        ) : null}

        {current === 'frete' ? (
          <Section title="Frete">
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm',
                    selectedShippingId === option.id
                      ? 'border-brand-accent bg-brand-muted/40'
                      : 'border-border',
                  )}
                >
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={selectedShippingId === option.id}
                    onChange={() => setSelectedShippingId(option.id)}
                    className="mt-1"
                  />
                  <span className="flex-1">
                    <span className="font-medium">{option.label}</span>
                    <br />
                    <span className="text-muted-foreground">
                      {option.estimatedDays}
                    </span>
                  </span>
                  <span className="font-medium">
                    {option.price === 0 ? 'Grátis' : `R$ ${option.price}`}
                  </span>
                </label>
              ))}
            </div>
          </Section>
        ) : null}

        {current === 'pagamento' ? (
          <Section title="Pagamento">
            <div className="space-y-2">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm',
                    selectedPaymentId === option.id
                      ? 'border-brand-accent bg-brand-muted/40'
                      : 'border-border',
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={selectedPaymentId === option.id}
                    onChange={() => setSelectedPaymentId(option.id)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">{option.label}</span>
                    <br />
                    <span className="text-muted-foreground">
                      {option.type === 'pix'
                        ? 'Pagamento via Pix (mockado)'
                        : 'Cartão de crédito (mockado)'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Ambiente de validação — nenhum pagamento real será processado.
            </p>
          </Section>
        ) : null}

        {current === 'preferencias' ? (
          <Section title="Preferências do assinante">
            {isSubscriptionFlow ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {planName
                    ? `Para o ${planName}, capturamos suas preferências para curadoria das boxes.`
                    : 'Capturamos suas preferências para curadoria das boxes.'}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Tamanho de camiseta">
                    <select
                      value={preferences.shirtSize}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          shirtSize: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="">Prefiro não informar</option>
                      {shirtSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tamanho de calçado">
                    <select
                      value={preferences.shoeSize}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          shoeSize: e.target.value,
                        }))
                      }
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                    >
                      <option value="">Prefiro não informar</option>
                      {shoeSizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
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
                    className="mt-4 w-full rounded-md border border-border bg-background p-3 text-sm"
                  />
                </Field>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Etapa exclusiva para assinantes. Para compra avulsa, siga para a
                revisão.
              </p>
            )}
          </Section>
        ) : null}

        {current === 'revisao' ? (
          <Section title="Revisão">
            <Review
              label="Endereço"
              value={
                addresses.find((a) => a.id === selectedAddressId)?.label ?? '—'
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
                paymentOptions.find((p) => p.id === selectedPaymentId)?.label ??
                '—'
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
              <p className="mt-4 text-sm text-destructive">{error}</p>
            ) : null}
          </Section>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={back}
          disabled={currentIndex === 0 || submitting}
        >
          Voltar
        </Button>
        {isLast ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#d84132] text-white hover:bg-[#b93227]"
          >
            {submitting ? 'Finalizando…' : 'Finalizar pedido mockado'}
          </Button>
        ) : (
          <Button type="button" onClick={next}>
            Avançar
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
                'flex items-center gap-2 rounded-md border px-3 py-2 text-xs',
                isActive
                  ? 'border-brand-accent bg-brand-muted/40 font-medium'
                  : isDone
                    ? 'border-border text-muted-foreground'
                    : 'border-border/60 text-muted-foreground/70',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full border',
                  isActive
                    ? 'border-brand-accent text-brand-accent'
                    : isDone
                      ? 'border-brand-accent bg-brand-accent text-background'
                      : 'border-border',
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
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
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
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
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
    <div className="flex items-start justify-between gap-4 border-b border-border py-3 text-sm last:border-0">
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="mt-1 font-medium">{value}</p>
        {detail ? <p className="text-muted-foreground">{detail}</p> : null}
      </div>
      <IconCircleCheck className="size-5 text-brand-accent" />
    </div>
  )
}

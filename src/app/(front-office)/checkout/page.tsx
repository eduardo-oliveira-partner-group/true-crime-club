'use client'

import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  type CheckoutShippingOption,
  CheckoutStepper,
  type SubscriberPreferencesValue,
} from '@/src/components/checkout/checkout-stepper'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert'
import { Button } from '@/src/components/ui/button'
import { CheckoutSkeleton } from '@/src/components/ui/page-loading-skeletons'
import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { saveCheckoutPixPayment } from '@/src/lib/checkout-pix-storage'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  sectionFrame,
  warmShadowClass,
} from '@/src/lib/design/classes'
import {
  getCart,
  getPlanById,
  listPlans,
  resolveMerchandiseTotals,
  updateCustomerProfile,
} from '@/src/lib/domain/repositories'
import type { CartItem, PaymentMethod } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

function isAuthError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const [loadError, setLoadError] = useState<string | null>(null)
  const [state, setState] = useState<{
    cart: Awaited<ReturnType<typeof getCart>>
    profile: Awaited<ReturnType<typeof apiClient.customer.getProfile>>
    paymentMethods: PaymentMethod[]
    plan: Awaited<ReturnType<typeof getPlanById>>
    monthlyPlan: Awaited<ReturnType<typeof getPlanById>>
    shipping: { price: number; estimatedDays: string; region: string }
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    const redirectToLogin = () => {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      )
      router.replace(`/login?next=${next}`)
    }

    setLoadError(null)

    Promise.all([getCart(), apiClient.customer.getProfile()])
      .then(async ([cart, profile]) => {
        if (cancelled) return
        if (!profile.customer?.id) {
          redirectToLogin()
          return
        }

        const resolvedPlanoId = cart.items.find(
          (item) => item.planId || item.productType === 'subscription',
        )?.planId

        const plan = resolvedPlanoId ? await getPlanById(resolvedPlanoId) : null
        if (cancelled) return

        const monthlyPlan =
          plan?.billingInterval === 'annual'
            ? ((await listPlans()).find(
                (p) => p.billingInterval === 'monthly',
              ) ?? null)
            : null
        if (cancelled) return
        const paymentMethods = await apiClient.checkout
          .listPaymentMethods()
          .catch(() => [] as PaymentMethod[])
        if (cancelled) return
        setState({
          cart,
          profile,
          paymentMethods,
          plan,
          monthlyPlan,
          shipping: {
            price: 0,
            estimatedDays: 'A calcular',
            region: '',
          },
        })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (isAuthError(error)) {
          redirectToLogin()
          return
        }

        const apiMessage =
          error instanceof ApiClientError
            ? error.message.trim()
            : error instanceof Error
              ? error.message.trim()
              : ''

        setLoadError(
          apiMessage ||
            'Não foi possível carregar o checkout. Tente novamente.',
        )
      })

    return () => {
      cancelled = true
    }
  }, [router])

  if (loadError) {
    return (
      <DesignPageShell className="overflow-hidden">
        <div className="relative z-10 flex min-h-[calc(100svh-8rem)] items-center justify-center px-4 py-16 sm:px-6">
          <section className="w-full max-w-xl rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 text-center sm:p-10">
            <div className="mx-auto flex max-w-sm flex-col items-center">
              <span className="flex size-12 items-center justify-center rounded-[12px] bg-(--amber)/15 text-(--amber)">
                <IconAlertTriangle className="size-6" stroke={1.75} />
              </span>
              <h2
                className={cn(
                  fontHeading,
                  'mt-5 text-xl font-semibold tracking-tight text-(--ink)',
                )}
              >
                Não foi possível abrir o checkout
              </h2>
              <Alert variant="destructive" className="mt-4 text-left">
                <IconAlertTriangle />
                <AlertTitle>Erro ao carregar</AlertTitle>
                <AlertDescription>{loadError}</AlertDescription>
              </Alert>
              <Button
                type="button"
                onClick={() => window.location.reload()}
                className={cn(
                  fontMono,
                  'group mt-6 inline-flex items-center gap-2 rounded-[9px] bg-(--red) px-4 py-3 text-xs font-bold tracking-[0.04em] text-[#fbf9f6] uppercase shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] [transition:background-color_0.2s_ease,translate_0.24s_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                )}
              >
                <IconRefresh className="size-4" stroke={1.75} />
                Tentar novamente
              </Button>
              <Link
                href="/"
                className={cn(
                  fontMono,
                  'mt-4 text-xs font-bold tracking-[0.04em] text-(--ink-mute) uppercase underline-offset-4 hover:text-(--ink) hover:underline',
                )}
              >
                Voltar à home
              </Link>
            </div>
          </section>
        </div>
      </DesignPageShell>
    )
  }

  if (!state) return <CheckoutSkeleton />

  const { cart, profile, paymentMethods, plan, monthlyPlan, shipping } = state
  const isSubscriptionFlow = Boolean(plan)

  const customer = profile.customer

  const addresses = profile.addresses || []

  const shippingOptions: CheckoutShippingOption[] = []

  const paymentOptions = paymentMethods.map((method) => ({
    id: method.id,
    label: method.label,
    type: method.type,
  }))

  const merchandise = resolveMerchandiseTotals({
    cart,
    plan,
    monthlyPlan,
  })
  const subtotalAmount = merchandise.subtotal
  const discountAmount = merchandise.discount

  // Frete é somado à parte — não usar total do carrinho (já pode incluir freteEstimado).
  const total = merchandise.merchandiseTotal + shipping.price

  async function submitOrder(input: {
    enderecoId: string
    pagamentoMetodoId: string
    cep: string
  }) {
    const chaveIdempotencia =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `chk-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const result = await apiClient.checkout.createOrder({
      enderecoId: input.enderecoId,
      pagamentoMetodoId: input.pagamentoMetodoId,
      cep: input.cep,
      chaveIdempotencia,
      subscription:
        isSubscriptionFlow && plan
          ? {
              id: plan.id,
            }
          : undefined,
    })
    const resultRecord =
      result && typeof result === 'object'
        ? (result as Record<string, unknown>)
        : null

    const pedido =
      resultRecord?.pedido && typeof resultRecord.pedido === 'object'
        ? (resultRecord.pedido as Record<string, unknown>)
        : null

    const orderId =
      (pedido && typeof pedido.id === 'string' && pedido.id) ||
      (typeof resultRecord?.id === 'string' && resultRecord.id) ||
      undefined

    const pagamento =
      (resultRecord?.pagamento && typeof resultRecord.pagamento === 'object'
        ? resultRecord.pagamento
        : null) ||
      (pedido?.pagamento && typeof pedido.pagamento === 'object'
        ? pedido.pagamento
        : null)

    if (orderId && pagamento && typeof pagamento === 'object') {
      const raw = pagamento as Record<string, unknown>
      saveCheckoutPixPayment(orderId, {
        id: typeof raw.id === 'string' ? raw.id : undefined,
        metodo: typeof raw.metodo === 'string' ? raw.metodo : undefined,
        pixQrCode:
          (typeof raw.pixQrCode === 'string' && raw.pixQrCode) ||
          (typeof raw.pixCopiaCola === 'string' && raw.pixCopiaCola) ||
          (typeof raw.qrCode === 'string' && raw.qrCode) ||
          undefined,
        pixQrCodeBase64:
          typeof raw.pixQrCodeBase64 === 'string'
            ? raw.pixQrCodeBase64
            : typeof raw.qrCodeBase64 === 'string'
              ? raw.qrCodeBase64
              : undefined,
        pixExpiraEm:
          (typeof raw.pixExpiraEm === 'string' && raw.pixExpiraEm) ||
          (typeof raw.pixExpiresAt === 'string' && raw.pixExpiresAt) ||
          undefined,
      })
    }

    return orderId
  }

  return (
    <DesignPageShell className="overflow-hidden">
      <div className={cn(sectionFrame, 'relative z-10 py-12 lg:py-16')}>
        <header className="flex flex-col gap-5 border-b border-[rgba(33,28,24,0.15)] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionEyebrow className="mb-0">Checkout</SectionEyebrow>
            <p
              className={cn(
                fontMono,
                'text-[0.65rem] tracking-[0.14em] text-(--ink-mute) uppercase',
              )}
            >
              PROC-07 · sessão segura
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <h1
                className={cn(
                  fontHeading,
                  'max-w-2xl text-3xl/tight font-semibold tracking-[-0.015em] text-balance text-(--ink) sm:text-4xl',
                )}
              >
                Finalize seu ingresso no clube
              </h1>
              <p className="max-w-xl text-sm/6 text-(--ink-soft)">
                Confira endereço, frete e pagamento antes de confirmar o pedido.
              </p>
            </div>
            {plan ? (
              <div
                className={cn(
                  dossierCardSurface,
                  warmShadowClass,
                  'rounded-[14px] px-4 py-3',
                )}
              >
                <p
                  className={cn(
                    fontMono,
                    'text-[0.65rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
                  )}
                >
                  Assinatura selecionada
                </p>
                <p
                  className={cn(
                    fontHeading,
                    'mt-1.5 flex items-baseline gap-2 text-sm font-semibold text-(--ink)',
                  )}
                >
                  {plan.name}
                  <span className="text-(--red)">
                    {formatCurrency(plan.price)}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        </header>

        {!isSubscriptionFlow && cart.items.length === 0 ? (
          <div className="mt-10 rounded-[14px] border border-dashed border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-10 text-center">
            <p
              className={cn(
                fontMono,
                'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
              )}
            >
              Arquivo vazio
            </p>
            <p className="mt-3 text-sm text-(--ink-soft)">
              Seu carrinho está vazio. Explore a loja e adicione uma box para
              iniciar o checkout.
            </p>
            <Button
              asChild
              className={cn(
                fontMono,
                'mt-6 h-11 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-transparent px-5 text-(--ink) hover:bg-(--ink) hover:text-[#fbf9f6]',
              )}
            >
              <Link href="/loja">Ir para a loja</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10">
            <CheckoutStepper
              customer={
                customer ? { name: customer.name, email: customer.email } : null
              }
              addresses={addresses}
              paymentOptions={paymentOptions}
              shippingOptions={shippingOptions}
              isSubscriptionFlow={isSubscriptionFlow}
              planId={plan?.id}
              planName={plan?.name}
              planPrice={
                isSubscriptionFlow && plan?.billingInterval === 'annual'
                  ? plan.pricePerMonth
                  : plan?.price
              }
              cartItems={cart.items
                .filter(
                  (item: CartItem) =>
                    item.productType !== 'subscription' && !item.planId,
                )
                .map((item: CartItem) => ({
                  id: item.id,
                  label: `${item.productName} × ${item.quantity}`,
                  value: formatCurrency(item.unitPrice * item.quantity),
                }))}
              subtotalAmount={subtotalAmount}
              discountAmount={discountAmount}
              shippingPrice={shipping.price}
              totalAmount={total}
              initialPreferences={customer?.preferences}
              onSavePreferences={savePreferences}
              onCreateOrder={submitOrder}
            />
          </div>
        )}
      </div>
    </DesignPageShell>
  )
}

async function savePreferences(preferences: SubscriberPreferencesValue) {
  await updateCustomerProfile({ preferences })
}

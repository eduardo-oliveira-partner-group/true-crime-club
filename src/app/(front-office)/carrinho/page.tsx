'use client'

import {
  IconArrowRight,
  IconClipboardText,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconShoppingBag,
  IconTag,
  IconTrash,
  IconTruck,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { SectionEyebrow } from '@/src/components/public-design/section-eyebrow'
import { Button } from '@/src/components/ui/button'
import { ConfirmDialog } from '@/src/components/ui/confirm-dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { Input } from '@/src/components/ui/input'
import { CartSkeleton } from '@/src/components/ui/page-loading-skeletons'
import { PENDING_PLAN_STORAGE_KEY } from '@/src/lib/add-to-cart'
import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { notifyCartUpdated } from '@/src/lib/cart-events'
import {
  arrowIconClass,
  buttonLiftShadow,
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  formInputClass,
  sectionFrame,
  transitionCardHover,
  transitionColors,
} from '@/src/lib/design/classes'
import {
  addCartItem,
  applyCoupon,
  calculateShipping,
  getCart,
  getPlanById,
  listPlans,
  removeCartItem,
  resolveMerchandiseTotals,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'
import { emptyCart } from '@/src/lib/domain/repository/core/helpers'
import type {
  Address,
  Cart,
  CartItem,
  SubscriptionPlan,
} from '@/src/lib/domain/types'
import {
  formatCep,
  formatCurrency,
  isValidCep,
  normalizeDigits,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

const emptyShipping = { price: 0, region: '', estimatedDays: '' }

function isAuthError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  )
}

function isPlanCartItem(item: CartItem): boolean {
  return item.productType === 'subscription' || Boolean(item.planId)
}

async function fetchShippingForCart(cart: Cart, zipCode: string | null) {
  if (cart.items.length === 0) return emptyShipping
  if (!zipCode || !isValidCep(zipCode)) return emptyShipping

  const planFromCart = cart.items.find(isPlanCartItem)
  return calculateShipping(
    normalizeDigits(zipCode),
    planFromCart?.planId ? { planoId: planFromCart.planId } : undefined,
  ).catch(() => emptyShipping)
}

function resolveZipCode(
  addresses: Address[],
  selectedAddressId: string,
  manualCep: string,
): string | null {
  const selected = addresses.find((address) => address.id === selectedAddressId)
  if (selected?.zipCode && isValidCep(selected.zipCode)) {
    return normalizeDigits(selected.zipCode)
  }
  if (isValidCep(manualCep)) return normalizeDigits(manualCep)
  return null
}

async function resolvePlansForCart(cart: Cart): Promise<{
  plan: SubscriptionPlan | null
  monthlyPlan: SubscriptionPlan | null
}> {
  const resolvedPlanoId = cart.items.find(isPlanCartItem)?.planId
  if (!resolvedPlanoId) {
    return { plan: null, monthlyPlan: null }
  }

  const plan = await getPlanById(resolvedPlanoId)
  if (!plan) {
    return { plan: null, monthlyPlan: null }
  }

  if (plan.billingInterval !== 'annual') {
    return { plan, monthlyPlan: null }
  }

  const monthlyPlan =
    (await listPlans()).find((p) => p.billingInterval === 'monthly') ?? null

  return { plan, monthlyPlan }
}

export default function CarrinhoPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [monthlyPlan, setMonthlyPlan] = useState<SubscriptionPlan | null>(null)
  const [shipping, setShipping] = useState(emptyShipping)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [manualCep, setManualCep] = useState('')
  const [shippingQuoted, setShippingQuoted] = useState(false)

  const syncPlans = async (nextCart: Cart) => {
    const resolved = await resolvePlansForCart(nextCart)
    setPlan(resolved.plan)
    setMonthlyPlan(resolved.monthlyPlan)
  }

  const applyShipping = async (nextCart: Cart, zipCode: string | null) => {
    if (!zipCode) {
      setShippingQuoted(false)
      setShippingError(null)
      setShipping(emptyShipping)
      setCart({
        ...nextCart,
        shippingEstimate: 0,
        shippingRegion: undefined,
      })
      notifyCartUpdated({
        ...nextCart,
        shippingEstimate: 0,
        shippingRegion: undefined,
      })
      return
    }

    setShippingLoading(true)
    setShippingError(null)
    try {
      const nextShipping = await fetchShippingForCart(nextCart, zipCode)
      const cartWithShipping: Cart = {
        ...nextCart,
        shippingEstimate: nextShipping.price,
        shippingRegion: nextShipping.region || undefined,
      }
      setCart(cartWithShipping)
      notifyCartUpdated(cartWithShipping)
      setShipping(nextShipping)
      setShippingQuoted(true)
      if (
        nextShipping.price === 0 &&
        !nextShipping.region &&
        !nextShipping.estimatedDays
      ) {
        setShippingError(
          'Não foi possível calcular o frete para este CEP. Tente outro.',
        )
      }
    } finally {
      setShippingLoading(false)
    }
  }

  const handleCartChange = async (nextCart: Cart) => {
    await syncPlans(nextCart)
    const zipCode = resolveZipCode(addresses, selectedAddressId, manualCep)
    await applyShipping(nextCart, zipCode)
  }

  useEffect(() => {
    let cancelled = false

    const redirectToLogin = () => {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      )
      router.replace(`/login?next=${next}`)
    }

    const searchParams = new URLSearchParams(window.location.search)
    const productToAdd = searchParams.get('adicionar')
    let pendingPlanId: string | null = null
    try {
      pendingPlanId = sessionStorage.getItem(PENDING_PLAN_STORAGE_KEY)
    } catch {
      pendingPlanId = null
    }

    apiClient.auth
      .me()
      .then(async () => {
        if (cancelled) return

        if (productToAdd) {
          try {
            const updated = await addCartItem({ productId: productToAdd })
            notifyCartUpdated(updated)
          } catch (error) {
            if (isAuthError(error)) throw error
            console.error(error)
          }
          if (cancelled) return

          window.history.replaceState(null, '', '/carrinho')
        }

        // Plano pendente pós-login (sem query string).
        if (pendingPlanId) {
          try {
            sessionStorage.removeItem(PENDING_PLAN_STORAGE_KEY)
            await addCartItem({ planoId: pendingPlanId })
          } catch (error) {
            if (isAuthError(error)) throw error
            console.error(error)
          }
          if (cancelled) return
        }

        // Links antigos `/carrinho?plano=` → adiciona e limpa a URL.
        const legacyPlanId = searchParams.get('plano')
        if (legacyPlanId && !pendingPlanId) {
          try {
            await addCartItem({ planoId: legacyPlanId })
          } catch (error) {
            if (isAuthError(error)) throw error
            console.error(error)
          }
          if (cancelled) return
          window.history.replaceState(null, '', '/carrinho')
        }

        const [nextCart, profile] = await Promise.all([
          getCart(),
          apiClient.customer.getProfile().catch(() => null),
        ])
        if (cancelled) return

        const nextAddresses = profile?.addresses ?? []
        const preferred =
          nextAddresses.find((address) => address.isDefault) ??
          nextAddresses[0] ??
          null
        const zipCode = preferred?.zipCode
          ? normalizeDigits(preferred.zipCode)
          : null

        const nextShipping = await fetchShippingForCart(nextCart, zipCode)
        const plans = await resolvePlansForCart(nextCart)
        return {
          nextCart,
          nextShipping,
          nextAddresses,
          preferredId: preferred?.id ?? '',
          zipCode,
          plan: plans.plan,
          monthlyPlan: plans.monthlyPlan,
        }
      })
      .then((result) => {
        if (cancelled || !result) return
        const {
          nextCart,
          nextShipping,
          nextAddresses,
          preferredId,
          zipCode,
          plan: nextPlan,
          monthlyPlan: nextMonthlyPlan,
        } = result
        setAddresses(nextAddresses)
        setSelectedAddressId(preferredId)
        setManualCep('')
        setPlan(nextPlan)
        setMonthlyPlan(nextMonthlyPlan)
        const cartWithShipping: Cart = {
          ...nextCart,
          shippingEstimate: zipCode ? nextShipping.price : 0,
          shippingRegion: zipCode
            ? nextShipping.region || undefined
            : undefined,
        }
        setCart(cartWithShipping)
        notifyCartUpdated(cartWithShipping)
        setShipping(zipCode ? nextShipping : emptyShipping)
        setShippingQuoted(Boolean(zipCode))
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (isAuthError(error)) {
          redirectToLogin()
          return
        }
        setCart(emptyCart())
        setPlan(null)
        setMonthlyPlan(null)
        notifyCartUpdated(emptyCart())
      })

    return () => {
      cancelled = true
    }
  }, [router])

  async function handleSelectAddress(addressId: string) {
    if (!cart) return
    setSelectedAddressId(addressId)
    setManualCep('')
    const selected = addresses.find((address) => address.id === addressId)
    await applyShipping(
      cart,
      selected?.zipCode ? normalizeDigits(selected.zipCode) : null,
    )
  }

  async function handleManualCepSubmit() {
    if (!cart || !isValidCep(manualCep)) return
    setSelectedAddressId('')
    await applyShipping(cart, normalizeDigits(manualCep))
  }

  if (!cart) return <CartSkeleton />

  const merchandise = resolveMerchandiseTotals({ cart, plan, monthlyPlan })
  const planItems = cart.items.filter(isPlanCartItem)
  const productItems = cart.items.filter((item) => !isPlanCartItem(item))
  const shippingPrice = shipping.price
  const shippingRegion = shipping.region
  const subtotalAmount = merchandise.subtotal
  const discountAmount = merchandise.discount
  const grandTotal = Math.max(merchandise.merchandiseTotal + shippingPrice, 0)
  const totalItemCount = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  )
  const dossierCode = `CART-${String(totalItemCount).padStart(2, '0')}`
  const summaryItems = cart.items
    .filter((item) => !isPlanCartItem(item))
    .map((item) => ({
      id: item.id,
      label: `${item.productName} × ${item.quantity}`,
      value: formatCurrency(item.unitPrice * item.quantity),
    }))
  const planDisplayPrice =
    merchandise.isAnnualSubscription && plan
      ? (plan.pricePerMonth ?? monthlyPlan?.price ?? plan.price)
      : plan?.price

  return (
    <DesignPageShell>
      <div className={cn(sectionFrame, 'relative z-10 py-14 lg:py-20')}>
        <header className="flex flex-col gap-5 border-b border-dashed border-[rgba(33,28,24,0.18)] pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <SectionEyebrow className="mb-0">Dossiê de compra</SectionEyebrow>
            <span className="hidden h-px flex-1 bg-[rgba(33,28,24,0.14)] sm:block" />
            <p
              className={cn(
                fontMono,
                'rounded-[2px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-(--ink-soft) uppercase',
              )}
            >
              {dossierCode}
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1
              className={cn(
                fontHeading,
                'text-wrap:balance max-w-[11ch] text-[clamp(2.5rem,5.6vw,4.625rem)] leading-[0.98] font-bold tracking-[-0.02em] text-(--ink)',
              )}
            >
              Seu carrinho
            </h1>
            {totalItemCount > 0 ? (
              <p className="rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) px-4 py-3 text-sm font-medium text-(--ink-soft)">
                {totalItemCount}{' '}
                {totalItemCount === 1 ? 'item em análise' : 'itens em análise'}
              </p>
            ) : null}
          </div>
        </header>

        {totalItemCount === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:gap-10">
            <section aria-label="Itens do carrinho" className="space-y-4">
              {planItems.map((item) => (
                <SelectedPlanLineItem
                  key={item.id}
                  item={item}
                  onRemove={async () => {
                    try {
                      const next = await removeCartItem(item.id)
                      await handleCartChange(next)
                      window.history.replaceState(null, '', '/carrinho')
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                />
              ))}
              {productItems.map((item: CartItem) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onCartChange={handleCartChange}
                />
              ))}

              <Link
                href="/loja"
                className={cn(
                  fontMono,
                  transitionColors,
                  'group inline-flex items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-4 py-3 text-[12px] font-bold tracking-[0.04em] text-(--red) uppercase hover:border-(--red) hover:bg-(--red) hover:text-[#fbf9f6] focus-visible:ring-2 focus-visible:ring-(--red)/25 focus-visible:outline-none',
                )}
              >
                <IconArrowRight
                  className={cn('size-4 rotate-180', arrowIconClass)}
                />
                Continuar investigando a loja
              </Link>
            </section>

            <aside
              aria-label="Resumo do pedido"
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <OrderSummary
                dossierCode={dossierCode}
                isSubscriptionFlow={merchandise.isSubscriptionFlow}
                isAnnualSubscription={merchandise.isAnnualSubscription}
                planName={plan?.name}
                planPrice={planDisplayPrice}
                items={summaryItems}
                subtotal={subtotalAmount}
                discount={discountAmount}
                shipping={shippingPrice}
                shippingRegion={shippingRegion}
                shippingDays={shipping.estimatedDays}
                shippingLoading={shippingLoading}
                shippingError={shippingError}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                manualCep={manualCep}
                onSelectAddress={handleSelectAddress}
                onManualCepChange={(value) => {
                  setManualCep(value)
                  setShippingQuoted(false)
                  setShippingError(null)
                }}
                onCalculateManualCep={() => {
                  void handleManualCepSubmit()
                }}
                shippingQuoted={shippingQuoted}
                total={grandTotal}
                couponCode={cart.couponCode}
              />
            </aside>
          </div>
        )}
      </div>
    </DesignPageShell>
  )
}

function EmptyCart() {
  return (
    <Empty
      className={cn(
        dossierCardSurface,
        cardShadowBase,
        'mt-12 border border-[rgba(33,28,24,0.15)] p-8 sm:p-10',
      )}
    >
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-14 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) text-(--red)"
        >
          <IconShoppingBag />
        </EmptyMedia>
        <EmptyTitle className="text-2xl/tight sm:text-3xl/tight">
          Nenhuma evidência selecionada ainda.
        </EmptyTitle>
        <EmptyDescription>
          Abra o arquivo da loja e adicione boxes avulsas e itens colecionáveis
          para montar seu dossiê de compra.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          asChild
          className={cn(
            fontMono,
            buttonLiftShadow,
            'h-11 rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-5 text-[13px] font-bold tracking-[0.04em] text-[#fbf9f6] uppercase hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:hover:translate-y-0',
          )}
        >
          <Link href="/loja">
            Ir para a loja
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function inferPlanIntervalLabel(item: CartItem): string {
  const slug = item.productSlug.toLowerCase()
  const name = item.productName.toLowerCase()
  if (slug.includes('anual') || name.includes('anual')) {
    return 'Assinatura anual'
  }
  if (slug.includes('mensal') || name.includes('mensal')) {
    return 'Assinatura mensal'
  }
  if (slug.includes('avuls') || name.includes('avuls')) {
    return 'Plano avulso'
  }
  return 'Plano de assinatura'
}

function SelectedPlanLineItem({
  item,
  onRemove,
}: {
  item: CartItem
  onRemove: () => void
}) {
  const intervalLabel = inferPlanIntervalLabel(item)
  const price = item.unitPrice * item.quantity

  return (
    <article
      className={cn(
        dossierCardSurface,
        cardShadowBase,
        'relative isolate overflow-hidden border border-(--red)/30',
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-[10px] border border-(--red)/20 bg-(--red)/10 text-(--red)">
          <IconClipboardText className="size-7" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p
            className={cn(
              fontMono,
              'text-[0.68rem] font-bold tracking-[0.14em] text-(--red) uppercase',
            )}
          >
            Plano de assinatura · {intervalLabel}
          </p>
          <h3
            className={cn(
              fontHeading,
              'text-lg/tight font-semibold tracking-[-0.01em] text-(--ink)',
            )}
          >
            {item.productName}
          </h3>
          <p className="text-sm text-(--ink-soft)">
            Assinatura TrueCrime.Club incluída neste dossiê de compra.
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p
            className={cn(
              fontHeading,
              'text-lg leading-none font-semibold text-(--ink)',
            )}
          >
            {formatCurrency(price)}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 gap-1.5 rounded-[9px] px-3 text-xs font-medium text-(--red) hover:bg-(--red)/10 hover:text-(--red-deep)"
          >
            <IconTrash className="size-4" />
            Remover
          </Button>
        </div>
      </div>
      <p className="border-t border-dashed border-[rgba(33,28,24,0.18)] px-5 py-3 text-xs text-(--ink-soft)">
        O plano entra no mesmo checkout dos demais itens do carrinho.
      </p>
    </article>
  )
}

function CartLineItem({
  item,
  onCartChange,
}: {
  item: {
    id: string
    productSlug: string
    productName: string
    productType: string
    quantity: number
    unitPrice: number
    image?: string
  }
  onCartChange: (cart: Cart) => Promise<void>
}) {
  const productImage = getProductImage(item.image ?? '')
  const lineTotal = item.unitPrice * item.quantity
  const itemCode = `EVID-${String(item.quantity).padStart(2, '0')}`
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [desktopImageSize, setDesktopImageSize] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    const content = contentRef.current
    if (!content) return

    const syncImageSize = () => {
      if (!mediaQuery.matches) {
        setDesktopImageSize(null)
        return
      }

      const nextSize = Math.ceil(content.getBoundingClientRect().height)
      setDesktopImageSize((currentSize) =>
        currentSize === nextSize ? currentSize : nextSize,
      )
    }

    const observer = new ResizeObserver(syncImageSize)
    observer.observe(content)
    mediaQuery.addEventListener('change', syncImageSize)
    syncImageSize()

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', syncImageSize)
    }
  }, [])

  const handleRemove = async () => {
    setRemoving(true)
    try {
      const next = await removeCartItem(item.id)
      await onCartChange(next)
      setConfirmOpen(false)
    } catch {
      setConfirmOpen(false)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <article
      className={cn(
        dossierCardSurface,
        cardShadowBase,
        transitionCardHover,
        'relative isolate overflow-hidden hover:-translate-y-1 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]',
      )}
    >
      <div className="flex items-stretch gap-4 p-4 sm:gap-5 sm:p-5">
        <Link
          href={`/loja/${item.productSlug}`}
          className="group relative aspect-square size-24 shrink-0 overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) sm:size-28"
          style={
            desktopImageSize
              ? { height: desktopImageSize, width: desktopImageSize }
              : undefined
          }
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={item.productName}
              fill
              sizes="(max-width: 640px) 96px, 180px"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-(--red)/50">
              <IconShoppingBag className="size-7" />
            </div>
          )}
        </Link>

        <div ref={contentRef} className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <p
                className={cn(
                  fontMono,
                  'text-[0.68rem] font-bold tracking-[0.14em] text-(--ink-soft) uppercase',
                )}
              >
                {itemCode} · {item.productType === 'box' ? 'Box' : 'Item'}
              </p>
              <h3
                className={cn(
                  fontHeading,
                  'text-lg/tight font-semibold tracking-[-0.01em] text-(--ink)',
                )}
              >
                <Link
                  href={`/loja/${item.productSlug}`}
                  className="transition hover:text-(--red)"
                >
                  {item.productName}
                </Link>
              </h3>
              <p className="text-sm text-(--ink-soft)">
                {formatCurrency(item.unitPrice)}{' '}
                <span className="text-(--ink-soft)/60">/ unidade</span>
              </p>
            </div>
            <p
              className={cn(
                fontHeading,
                'text-lg leading-none font-semibold text-(--ink)',
              )}
            >
              {formatCurrency(lineTotal)}
            </p>
          </div>

          <div className="mt-auto hidden flex-wrap items-center justify-between gap-3 border-t border-dashed border-[rgba(33,28,24,0.18)] pt-4 sm:flex">
            <QuantityControls
              itemId={item.id}
              quantity={item.quantity}
              onCartChange={onCartChange}
            />
            <div>
              <Button
                type="button"
                onClick={() => setConfirmOpen(true)}
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-[9px] px-3 text-xs font-medium text-(--red) hover:bg-(--red)/10 hover:text-(--red-deep)"
              >
                <IconTrash className="size-4" />
                Remover
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-3 border-t border-dashed border-[rgba(33,28,24,0.18)] p-4 sm:hidden">
        <QuantityControls
          itemId={item.id}
          quantity={item.quantity}
          onCartChange={onCartChange}
        />
        <Button
          type="button"
          onClick={() => setConfirmOpen(true)}
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-[9px] px-3 text-xs font-medium text-(--red) hover:bg-(--red)/10 hover:text-(--red-deep)"
        >
          <IconTrash className="size-4" />
          Remover
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remover item?"
        description={
          <>
            <span className="font-semibold text-(--ink)">
              {item.productName}
            </span>{' '}
            será removido do carrinho.
          </>
        }
        confirmLabel="Remover item"
        confirmingLabel="Removendo…"
        confirming={removing}
        onConfirm={handleRemove}
      />
    </article>
  )
}

function QuantityControls({
  itemId,
  quantity,
  onCartChange,
}: {
  itemId: string
  quantity: number
  onCartChange: (cart: Cart) => Promise<void>
}) {
  const [updating, setUpdating] = useState(false)
  const baseButton =
    'flex size-8 items-center justify-center rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) transition hover:border-(--red) hover:text-(--red) disabled:pointer-events-none disabled:opacity-40'

  const changeQuantity = async (nextQuantity: number) => {
    if (updating || nextQuantity < 1) return
    setUpdating(true)
    try {
      const nextCart = await updateCartItemQuantity(itemId, nextQuantity)
      await onCartChange(nextCart)
    } catch (error) {
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={cn(
          fontMono,
          'text-[0.68rem] font-bold tracking-[0.14em] text-(--red) uppercase',
        )}
      >
        Qtde
      </span>
      <div className="inline-flex items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-2 py-1.5">
        <div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => changeQuantity(quantity - 1)}
            aria-label="Diminuir quantidade"
            className={baseButton}
            disabled={updating || quantity <= 1}
          >
            <IconMinus className="size-3.5" />
          </Button>
        </div>
        <span
          key={quantity}
          className={cn(
            fontHeading,
            'min-w-6 text-center text-sm font-semibold text-(--ink)',
          )}
        >
          {quantity}
        </span>
        <div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => changeQuantity(quantity + 1)}
            aria-label="Aumentar quantidade"
            className={baseButton}
            disabled={updating}
          >
            <IconPlus className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  dossierCode,
  isSubscriptionFlow,
  isAnnualSubscription,
  planName,
  planPrice,
  items,
  subtotal,
  discount,
  shipping,
  shippingRegion,
  shippingDays,
  shippingLoading,
  shippingError,
  addresses,
  selectedAddressId,
  manualCep,
  onSelectAddress,
  onManualCepChange,
  onCalculateManualCep,
  shippingQuoted,
  total,
  couponCode,
}: {
  dossierCode: string
  isSubscriptionFlow: boolean
  isAnnualSubscription: boolean
  planName?: string
  planPrice?: number
  items: { id: string; label: string; value: string }[]
  subtotal: number
  discount: number
  shipping: number
  shippingRegion: string
  shippingDays: string
  shippingLoading: boolean
  shippingError: string | null
  addresses: Address[]
  selectedAddressId: string
  manualCep: string
  onSelectAddress: (addressId: string) => void
  onManualCepChange: (value: string) => void
  onCalculateManualCep: () => void
  shippingQuoted: boolean
  total: number
  couponCode?: string
}) {
  const checkoutHref = '/checkout'
  const hasAddresses = addresses.length > 0
  const manualCepValid = isValidCep(manualCep)
  const hasItems = (isSubscriptionFlow && planName != null) || items.length > 0

  return (
    <div
      className={cn(
        dossierCardSurface,
        cardShadowBase,
        'overflow-hidden bg-(--card)',
      )}
    >
      <div className="border-b border-[rgba(33,28,24,0.15)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p
            className={cn(
              fontMono,
              'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
            )}
          >
            Resumo do pedido
          </p>
          <p
            className={cn(
              fontMono,
              'text-[0.6rem] tracking-[0.14em] text-(--ink-mute) uppercase',
            )}
          >
            {dossierCode}
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 text-sm sm:p-6">
        {hasItems ? (
          <ul className="space-y-2.5 text-(--ink-soft)">
            {isSubscriptionFlow && planName ? (
              <li className="flex justify-between gap-4">
                <span>{planName} (assinatura)</span>
                <span className="font-medium text-(--ink)">
                  {formatCurrency(planPrice ?? 0)}
                  {isAnnualSubscription ? '/mês' : ''}
                </span>
              </li>
            ) : null}
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <span>{item.label}</span>
                <span className="font-medium text-(--ink)">{item.value}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-(--ink-soft)">Nenhum item selecionado.</p>
        )}

        <div className="space-y-2.5 border-t border-[rgba(33,28,24,0.15)] pt-4 text-(--ink-soft)">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span className="text-(--ink)">{formatCurrency(subtotal)}</span>
          </div>

          {discount > 0 ? (
            <div className="flex flex-col gap-1 rounded border border-[rgba(26,165,135,0.15)] bg-[rgba(26,165,135,0.06)] p-2">
              <div className="flex justify-between gap-4 font-semibold text-(--teal-deep)">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-(--teal)" />
                  Desconto{couponCode ? ` · ${couponCode}` : ''}
                </span>
                <span>− {formatCurrency(discount)}</span>
              </div>
            </div>
          ) : null}

          {hasAddresses ? (
            <select
              id="cart-shipping-address"
              aria-label="Endereço para cálculo do frete"
              value={selectedAddressId}
              onChange={(event) => onSelectAddress(event.target.value)}
              disabled={shippingLoading}
              className={cn(
                formInputClass,
                'mt-0 appearance-none bg-(--card) py-2.5 pr-8 text-sm',
              )}
            >
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label} · CEP {formatCep(address.zipCode)}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2">
              <Input
                id="cart-shipping-cep"
                value={manualCep}
                onChange={(event) =>
                  onManualCepChange(formatCep(event.target.value))
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    onCalculateManualCep()
                  }
                }}
                placeholder="CEP para frete"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
                disabled={shippingLoading}
                aria-invalid={manualCep.length > 0 && !manualCepValid}
                className={cn(
                  formInputClass,
                  'mt-0 h-10 flex-1 bg-(--card) py-2',
                )}
              />
              <Button
                type="button"
                disabled={!manualCepValid || shippingLoading}
                onClick={onCalculateManualCep}
                className="h-10 shrink-0 rounded-[9px] bg-(--red) px-3 text-[#fbf9f6] hover:bg-(--red-deep)"
              >
                {shippingLoading ? '…' : 'OK'}
              </Button>
            </div>
          )}

          {shippingQuoted || shippingLoading ? (
            <>
              <div className="flex justify-between gap-4">
                <span>Frete</span>
                <span className="text-(--ink)">
                  {shippingLoading ? 'Calculando…' : formatCurrency(shipping)}
                </span>
              </div>
              {!shippingLoading && (shippingRegion || shippingDays) ? (
                <p className="text-xs text-(--ink-soft)/70">
                  {[shippingRegion, shippingDays].filter(Boolean).join(' · ')}
                </p>
              ) : null}
            </>
          ) : null}
          {shippingError ? (
            <p className="text-xs text-(--red)" role="alert">
              {shippingError}
            </p>
          ) : null}
        </div>

        <div className="border-t border-[rgba(33,28,24,0.15)] pt-4">
          <div className="flex items-end justify-between gap-4">
            <span
              className={cn(
                fontMono,
                'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
              )}
            >
              Total
            </span>
            <span
              className={cn(fontHeading, 'text-2xl font-semibold text-(--ink)')}
            >
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        <CouponForm />
      </div>

      <div className="border-t border-dashed border-[rgba(33,28,24,0.18)] p-5 sm:p-6">
        <Button
          asChild
          size="lg"
          className={cn(
            fontMono,
            buttonLiftShadow,
            'h-12 w-full justify-between rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--red) px-5 text-[13px] font-bold tracking-[0.04em] text-[#fbf9f6] uppercase hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:hover:translate-y-0',
          )}
        >
          <Link href={checkoutHref}>
            Ir para checkout
            <IconArrowRight className="size-4" />
          </Link>
        </Button>

        <ul className="mt-5 space-y-2 text-xs text-(--ink-soft)">
          <li className="inline-flex items-center gap-2">
            <IconShieldCheck className="size-4 text-(--red)" />
            Pagamento seguro e ambiente criptografado.
          </li>
          <li className="inline-flex items-center gap-2">
            <IconTruck className="size-4 text-(--red)" />
            Envio previsto para o ciclo seguinte à compra.
          </li>
        </ul>
      </div>
    </div>
  )
}

function CouponForm() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(null)

        const formData = new FormData(event.currentTarget)
        const code = String(formData.get('coupon') ?? '').trim()
        if (!code) {
          setError('Informe o código do cupom.')
          return
        }

        setPending(true)
        try {
          const result = await applyCoupon(code)
          if (!result.valid) {
            setError(result.message || 'Cupom inválido ou expirado.')
            return
          }
          window.location.reload()
        } catch (err) {
          const message =
            err instanceof ApiClientError
              ? err.message.trim()
              : err instanceof Error
                ? err.message.trim()
                : ''
          setError(message || 'Não foi possível aplicar o cupom.')
        } finally {
          setPending(false)
        }
      }}
      className="mt-6 space-y-2"
    >
      <label
        htmlFor="coupon"
        className={cn(
          fontMono,
          'text-[0.68rem] font-bold tracking-[0.14em] text-(--red) uppercase',
        )}
      >
        Cupom de desconto
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconTag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-(--ink-soft)/60" />
          <Input
            id="coupon"
            name="coupon"
            placeholder="Informe o código"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'coupon-error' : undefined}
            onChange={() => {
              if (error) setError(null)
            }}
            className={cn(
              'h-10 w-full rounded-[10px] border bg-(--paper-soft) pr-3 pl-9 text-sm text-(--ink) placeholder:text-(--ink-mute) focus-visible:ring-2 focus-visible:outline-none',
              error
                ? 'border-(--red) focus:border-(--red) focus-visible:ring-(--red)/25'
                : 'border-[rgba(33,28,24,0.15)] focus:border-(--red) focus-visible:ring-(--red)/20',
            )}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          disabled={pending}
          className="h-10 shrink-0 rounded-[9px] border-[rgba(33,28,24,0.15)] bg-(--card) px-4 text-(--ink) hover:border-(--ink) hover:bg-(--ink) hover:text-[#fbf9f6]"
        >
          {pending ? 'Aplicando…' : 'Aplicar'}
        </Button>
      </div>
      {error ? (
        <p id="coupon-error" role="alert" className="text-xs text-(--red)">
          {error}
        </p>
      ) : null}
    </form>
  )
}

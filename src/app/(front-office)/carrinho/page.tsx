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
import { useEffect, useState } from 'react'

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
import { apiClient, ApiClientError } from '@/src/lib/api-client'
import {
  arrowIconClass,
  buttonLiftShadow,
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  sectionFrame,
  transitionCardHover,
  transitionColors,
} from '@/src/lib/design/classes'
import {
  addCartItem,
  applyCoupon,
  calculateShipping,
  getCart,
  getCartTotals,
  getPlanById,
  removeCartItem,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'
import { emptyCart } from '@/src/lib/domain/repository/core/helpers'
import type { Cart, CartItem, SubscriptionPlan } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

const sampleZipCode = '05435-020'
const emptyShipping = { price: 0, region: '', estimatedDays: '' }

function isAuthError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  )
}

export default function CarrinhoPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  )
  const [shipping, setShipping] = useState(emptyShipping)

  useEffect(() => {
    let cancelled = false

    const redirectToLogin = () => {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      )
      router.replace(`/login?next=${next}`)
    }

    const searchParams = new URLSearchParams(window.location.search)
    const planId = searchParams.get('plano')
    const productToAdd = searchParams.get('adicionar')

    apiClient.auth
      .me()
      .then(async () => {
        if (cancelled) return

        if (productToAdd) {
          try {
            await addCartItem({ productId: productToAdd })
          } catch (error) {
            if (isAuthError(error)) throw error
            console.error(error)
          }
          if (cancelled) return

          const cleaned = new URLSearchParams(searchParams)
          cleaned.delete('adicionar')
          const query = cleaned.toString()
          window.history.replaceState(
            null,
            '',
            query ? `/carrinho?${query}` : '/carrinho',
          )
        }

        return Promise.all([
          getCart(),
          calculateShipping(sampleZipCode).catch(() => emptyShipping),
          planId ? getPlanById(planId) : Promise.resolve(null),
        ])
      })
      .then((result) => {
        if (cancelled || !result) return
        const [nextCart, nextShipping, nextPlan] = result
        setCart(nextCart)
        setShipping(nextShipping)
        setSelectedPlan(nextPlan)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (isAuthError(error)) {
          redirectToLogin()
          return
        }
        setCart(emptyCart())
      })

    return () => {
      cancelled = true
    }
  }, [router])

  if (!cart) return <CartSkeleton />

  const totals = { ...cart, ...getCartTotals(cart) }
  const hasSelectedPlan = selectedPlan !== null
  const subtotal = hasSelectedPlan ? selectedPlan.price : totals.subtotal
  const discount = hasSelectedPlan ? 0 : totals.discount
  const grandTotal = subtotal - discount + shipping.price
  const itemCount = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  )
  const totalItemCount = itemCount + Number(hasSelectedPlan)
  const dossierCode = `CART-${String(totalItemCount).padStart(2, '0')}`

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
              {selectedPlan ? (
                <SelectedPlanLineItem
                  plan={selectedPlan}
                  onRemove={() => {
                    window.history.replaceState(null, '', '/carrinho')
                    setSelectedPlan(null)
                  }}
                />
              ) : null}
              {cart.items.map((item: CartItem) => (
                <CartLineItem key={item.id} item={item} />
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
                subtotal={subtotal}
                discount={discount}
                shipping={shipping.price}
                shippingRegion={shipping.region}
                shippingDays={shipping.estimatedDays}
                total={grandTotal}
                couponCode={cart.couponCode}
                selectedPlan={selectedPlan}
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

function SelectedPlanLineItem({
  plan,
  onRemove,
}: {
  plan: SubscriptionPlan
  onRemove: () => void
}) {
  const intervalLabel =
    plan.billingInterval === 'annual'
      ? 'Assinatura anual'
      : plan.billingInterval === 'monthly'
        ? 'Assinatura mensal'
        : 'Plano avulso'

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
            {plan.name}
          </h3>
          <p className="text-sm text-(--ink-soft)">{plan.description}</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p
            className={cn(
              fontHeading,
              'text-lg leading-none font-semibold text-(--ink)',
            )}
          >
            {formatCurrency(plan.price)}
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
        A assinatura será finalizada separadamente dos demais itens do carrinho.
      </p>
    </article>
  )
}

function CartLineItem({
  item,
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
}) {
  const productImage = getProductImage(item.image ?? '')
  const lineTotal = item.unitPrice * item.quantity
  const itemCode = `EVID-${String(item.quantity).padStart(2, '0')}`
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await removeCartItem(item.id)
      window.location.reload()
    } catch {
      setRemoving(false)
      setConfirmOpen(false)
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
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
        <Link
          href={`/loja/${item.productSlug}`}
          className="group relative aspect-square w-full shrink-0 overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) sm:size-28"
        >
          {productImage ? (
            <Image
              src={productImage}
              alt={item.productName}
              fill
              sizes="(max-width: 640px) 100vw, 112px"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-(--red)/50">
              <IconShoppingBag className="size-7" />
            </div>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
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

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[rgba(33,28,24,0.18)] pt-4">
            <QuantityControls itemId={item.id} quantity={item.quantity} />
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
}: {
  itemId: string
  quantity: number
}) {
  const baseButton =
    'flex size-8 items-center justify-center rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) transition hover:border-(--red) hover:text-(--red) disabled:pointer-events-none disabled:opacity-40'

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
            onClick={() =>
              updateCartItemQuantity(itemId, Math.max(quantity - 1, 1)).then(
                () => window.location.reload(),
              )
            }
            aria-label="Diminuir quantidade"
            className={baseButton}
            disabled={quantity <= 1}
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
            onClick={() =>
              updateCartItemQuantity(itemId, quantity + 1).then(() =>
                window.location.reload(),
              )
            }
            aria-label="Aumentar quantidade"
            className={baseButton}
          >
            <IconPlus className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  subtotal,
  discount,
  shipping,
  shippingRegion,
  shippingDays,
  total,
  couponCode,
  selectedPlan,
}: {
  subtotal: number
  discount: number
  shipping: number
  shippingRegion: string
  shippingDays: string
  total: number
  couponCode?: string
  selectedPlan: SubscriptionPlan | null
}) {
  const checkoutHref = selectedPlan
    ? `/checkout?plano=${encodeURIComponent(selectedPlan.id)}`
    : '/checkout'

  return (
    <div
      className={cn(
        dossierCardSurface,
        cardShadowBase,
        'overflow-hidden bg-(--card)',
      )}
    >
      <div className="border-b border-dashed border-[rgba(33,28,24,0.18)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <IconClipboardText className="size-5 text-(--red)" />
          <p
            className={cn(
              fontMono,
              'text-xs font-bold tracking-[0.12em] text-(--red) uppercase',
            )}
          >
            Resumo do pedido
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 text-sm sm:p-6">
        <SummaryRow
          label={selectedPlan ? 'Plano selecionado' : 'Subtotal'}
          value={formatCurrency(subtotal)}
        />
        {discount > 0 ? (
          <SummaryRow
            label={`Desconto${couponCode ? ` · ${couponCode}` : ''}`}
            value={`− ${formatCurrency(discount)}`}
            tone="gold"
          />
        ) : null}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-(--ink-soft)">
              <IconTruck className="size-4 text-(--red)" />
              Frete estimado
            </span>
            <span className="font-medium text-(--ink)">
              {formatCurrency(shipping)}
            </span>
          </div>
          <p className="pl-6 text-xs text-(--ink-soft)/70">
            {shippingRegion} · {shippingDays}
          </p>
        </div>

        <div className="h-px border-t border-dashed border-[rgba(33,28,24,0.18)]" />

        <div className="flex items-end justify-between gap-3">
          <span
            className={cn(
              fontMono,
              'text-xs font-bold tracking-[0.12em] text-(--red) uppercase',
            )}
          >
            Total
          </span>
          <span
            className={cn(
              fontHeading,
              'text-2xl leading-none font-bold text-(--ink)',
            )}
          >
            {formatCurrency(total)}
          </span>
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

function SummaryRow({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: string
  tone?: 'default' | 'gold'
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-(--ink-soft)">{label}</span>
      <span
        className={cn(
          'font-medium',
          tone === 'gold' ? 'text-(--red)' : 'text-(--ink)',
        )}
      >
        {value}
      </span>
    </div>
  )
}

function CouponForm() {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        applyCoupon(String(formData.get('coupon') ?? '')).then(() =>
          window.location.reload(),
        )
      }}
      className="mt-2 space-y-2"
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
            className="h-10 w-full rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) pr-3 pl-9 text-sm text-(--ink) placeholder:text-(--ink-mute) focus:border-(--red) focus-visible:ring-2 focus-visible:ring-(--red)/20 focus-visible:outline-none"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="h-10 shrink-0 rounded-[9px] border-[rgba(33,28,24,0.15)] bg-(--card) px-4 text-(--ink) hover:border-(--ink) hover:bg-(--ink) hover:text-[#fbf9f6]"
        >
          Aplicar
        </Button>
      </div>
    </form>
  )
}

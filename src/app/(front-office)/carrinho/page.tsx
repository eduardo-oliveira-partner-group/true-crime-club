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
import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { getSeoEntry } from '@/src/lib/domain/repositories'
import type { CartItem } from '@/src/lib/domain/types'
import { formatCurrency } from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { buildMetadata } from '@/src/lib/seo'
import {
  applyCoupon,
  calculateShipping,
  getCartWithTotals,
  removeCartItemWithTotals,
  updateCartItemQuantityWithTotals,
} from '@/src/lib/server/cart'
import { cn } from '@/src/lib/utils'

const sampleZipCode = '05435-020'

export const metadata = buildMetadata({
  path: '/carrinho',
  entry: getSeoEntry('/carrinho'),
  noindex: true,
})

export default async function CarrinhoPage() {
  const cart = getCartWithTotals()
  const totals = cart
  const shipping = calculateShipping(sampleZipCode)
  const grandTotal = totals.total + shipping.price
  const itemCount = cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  )
  const dossierCode = `CART-${String(cart.items.length).padStart(2, '0')}`

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-(--paper) text-(--ink)">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.025)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.025)_1px,transparent_1px)] bg-size-[56px_56px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(216,65,50,0.08),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(215,181,109,0.08),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <header className="flex flex-col gap-5 border-b border-[rgba(33,28,24,0.15)] pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-semibold tracking-[0.24em] text-(--red) uppercase">
              Dossiê de compra
            </p>
            <span className="hidden h-px flex-1 bg-[#d7b56d]/35 sm:block" />
            <p className="font-mono text-xs tracking-[0.16em] text-(--ink-soft)/55 uppercase">
              {dossierCode}
            </p>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-heading text-3xl/tight font-black tracking-wide text-(--ink) uppercase sm:text-4xl lg:text-5xl">
              Seu carrinho
            </h1>
            {cart.items.length > 0 ? (
              <p className="text-sm text-(--ink-soft)">
                {itemCount}{' '}
                {itemCount === 1 ? 'peça em análise' : 'peças em análise'}
              </p>
            ) : null}
          </div>
        </header>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:gap-10">
            <section aria-label="Itens do carrinho" className="space-y-4">
              {cart.items.map((item: CartItem) => (
                <CartLineItem key={item.id} item={item} />
              ))}

              <Link
                href="/loja"
                className="group inline-flex items-center gap-2 pt-2 text-sm font-medium text-(--red) transition hover:text-[#f4d891] focus-visible:ring-2 focus-visible:ring-[#d7b56d] focus-visible:outline-none"
              >
                <IconArrowRight className="size-4 rotate-180 transition group-hover:-translate-x-1" />
                Continuar investigando a loja
              </Link>
            </section>

            <aside
              aria-label="Resumo do pedido"
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <OrderSummary
                subtotal={totals.subtotal}
                discount={totals.discount}
                shipping={shipping.price}
                shippingRegion={shipping.region}
                shippingDays={shipping.estimatedDays}
                total={grandTotal}
                couponCode={cart.couponCode}
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="mt-12 border border-dashed border-[rgba(33,28,24,0.15)] bg-(--card)/60 p-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center border border-[rgba(33,28,24,0.15)] bg-(--paper) text-(--red)">
        <IconShoppingBag className="size-6" />
      </div>
      <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
        Arquivo vazio
      </p>
      <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-(--ink) sm:text-3xl">
        Nenhuma evidência selecionada ainda.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm/6 text-(--ink-soft)">
        Abra o arquivo da loja e adicione boxes avulsas e itens colecionáveis
        para montar seu dossiê de compra.
      </p>
      <Button
        asChild
        className="mt-6 h-11 rounded-none bg-[#d84132] px-5 text-white shadow-[0_0_24px_rgba(216,65,50,0.3)] hover:bg-[#b93227]"
      >
        <Link href="/loja">
          Ir para a loja
          <IconArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
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

  return (
    <article className="relative isolate overflow-hidden border border-[rgba(33,28,24,0.15)] bg-(--card)/70 shadow-[0_18px_40px_rgba(33,28,24,0.32)] transition hover:border-[rgba(33,28,24,0.15)]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.022)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.022)_1px,transparent_1px)] bg-size-[34px_34px]" />

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
        <Link
          href={`/loja/${item.productSlug}`}
          className="group relative aspect-square w-full shrink-0 overflow-hidden border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) sm:size-28"
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.02)_0%,rgba(9,8,7,0.45)_100%)]" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <p className="font-mono text-[0.68rem] tracking-[0.18em] text-(--ink-soft)/55 uppercase">
                {itemCode} · {item.productType === 'box' ? 'Box' : 'Item'}
              </p>
              <h3 className="font-heading text-lg/tight font-semibold tracking-wide text-(--ink) uppercase">
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
            <p className="font-heading text-lg leading-none font-semibold text-(--ink)">
              {formatCurrency(lineTotal)}
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(33,28,24,0.15)] pt-4">
            <QuantityControls itemId={item.id} quantity={item.quantity} />
            <form
              action={async () => {
                'use server'
                removeCartItemWithTotals(item.id)
                revalidatePath('/carrinho')
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 rounded-none px-3 text-xs font-medium text-(--red) hover:bg-[#d84132]/12 hover:text-(--red)"
              >
                <IconTrash className="size-4" />
                Remover
              </Button>
            </form>
          </div>
        </div>
      </div>
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
    'flex size-8 items-center justify-center border border-[rgba(33,28,24,0.15)] bg-(--card)/6 text-(--ink) transition hover:bg-(--card)/12 disabled:opacity-40'

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[0.68rem] font-semibold tracking-[0.18em] text-(--red) uppercase">
        Qtde
      </span>
      <div className="inline-flex items-center gap-2 border border-[rgba(33,28,24,0.15)] bg-(--paper)/70 px-2 py-1.5">
        <form
          action={async () => {
            'use server'
            updateCartItemQuantityWithTotals(itemId, Math.max(quantity - 1, 1))
            revalidatePath('/carrinho')
          }}
        >
          <button
            type="submit"
            aria-label="Diminuir quantidade"
            className={cn(baseButton, 'rounded-none')}
            disabled={quantity <= 1}
          >
            <IconMinus className="size-3.5" />
          </button>
        </form>
        <span
          key={quantity}
          className="min-w-6 text-center font-heading text-sm font-semibold text-(--ink)"
        >
          {quantity}
        </span>
        <form
          action={async () => {
            'use server'
            updateCartItemQuantityWithTotals(itemId, quantity + 1)
            revalidatePath('/carrinho')
          }}
        >
          <button
            type="submit"
            aria-label="Aumentar quantidade"
            className={cn(baseButton, 'rounded-none')}
          >
            <IconPlus className="size-3.5" />
          </button>
        </form>
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
}: {
  subtotal: number
  discount: number
  shipping: number
  shippingRegion: string
  shippingDays: string
  total: number
  couponCode?: string
}) {
  return (
    <div className="border border-[#b98542]/40 bg-(--paper-soft)/85 shadow-[0_18px_40px_rgba(33,28,24,0.42)] backdrop-blur-sm">
      <div className="border-b border-[rgba(33,28,24,0.15)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <IconClipboardText className="size-5 text-(--red)" />
          <p className="text-xs font-semibold tracking-[0.22em] text-(--red) uppercase">
            Resumo do pedido
          </p>
        </div>
      </div>

      <div className="space-y-4 p-5 text-sm sm:p-6">
        <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
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

        <div className="h-px bg-[#a78a5a]/30" />

        <div className="flex items-end justify-between gap-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-(--red) uppercase">
            Total
          </span>
          <span className="font-heading text-2xl leading-none font-black text-(--ink)">
            {formatCurrency(total)}
          </span>
        </div>

        <CouponForm />
      </div>

      <div className="border-t border-[rgba(33,28,24,0.15)] p-5 sm:p-6">
        <Button
          asChild
          size="lg"
          className="h-12 w-full justify-between rounded-none bg-[#d84132] px-5 text-white shadow-[0_0_26px_rgba(216,65,50,0.32)] hover:bg-[#b93227]"
        >
          <Link href="/checkout">
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
      action={async (formData) => {
        'use server'
        applyCoupon(String(formData.get('coupon') ?? ''))
        revalidatePath('/carrinho')
      }}
      className="mt-2 space-y-2"
    >
      <label
        htmlFor="coupon"
        className="text-[0.68rem] font-semibold tracking-[0.18em] text-(--red) uppercase"
      >
        Cupom de desconto
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconTag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-(--ink-soft)/60" />
          <input
            id="coupon"
            name="coupon"
            placeholder="Informe o código"
            className="h-10 w-full rounded-none border border-[rgba(33,28,24,0.15)] bg-(--paper) pr-3 pl-9 text-sm text-(--ink) placeholder:text-(--ink-soft)/50 focus:border-[#d7b56d]/60 focus-visible:ring-2 focus-visible:ring-[#d7b56d]/40 focus-visible:outline-none"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="h-10 shrink-0 rounded-none border-[rgba(33,28,24,0.15)] bg-(--card)/6 px-4 text-(--ink) hover:bg-(--card)/12 hover:text-(--ink)"
        >
          Aplicar
        </Button>
      </div>
    </form>
  )
}

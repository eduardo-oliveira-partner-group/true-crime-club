'use client'

import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconCreditCard,
  IconPackage,
  IconReceipt,
  IconTruckDelivery,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { OrderDetailSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
} from '@/src/lib/design/classes'
import { getOrderById } from '@/src/lib/domain/repositories'
import type { CartItem, Order, OrderStatus } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

const statusTone: Record<OrderStatus, string> = {
  pending_payment: 'border-(--red)/25 bg-(--red)/8 text-(--red)',
  paid: 'border-(--teal)/30 bg-(--teal)/10 text-(--teal-deep)',
  processing: 'border-(--amber)/35 bg-(--amber)/12 text-[#8a5c00]',
  awaiting_shipment:
    'border-(--purple)/30 bg-(--purple)/10 text-(--purple-deep)',
  shipped: 'border-(--teal)/30 bg-(--teal)/10 text-(--teal-deep)',
  delivered: 'border-(--teal)/30 bg-(--teal)/10 text-(--teal-deep)',
  cancelled: 'border-(--ink)/15 bg-(--ink)/5 text-(--ink-mute)',
}

const journey = [
  { label: 'Pagamento confirmado', icon: IconCreditCard },
  { label: 'Em preparação', icon: IconPackage },
  { label: 'Em trânsito', icon: IconTruckDelivery },
  { label: 'Entregue', icon: IconCheck },
]

function currentJourneyStep(status: OrderStatus) {
  if (status === 'delivered') return 4
  if (status === 'shipped') return 3
  if (status === 'processing' || status === 'awaiting_shipment') return 2
  if (status === 'paid') return 1
  return 0
}

function ValueRow({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-(--ink-mute)">{label}</span>
      <span
        className={cn(
          'font-medium text-(--ink-soft)',
          muted && 'text-(--ink-mute)',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export default function PedidoDetailPage() {
  const params = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params.id) return
    getOrderById(params.id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <OrderDetailSkeleton />

  if (!order) {
    return (
      <section
        className={`mt-8 rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 text-center sm:p-10`}
      >
        <p className={`text-xl font-semibold text-(--ink) ${fontHeading}`}>
          Pedido não encontrado
        </p>
        <p className="mt-2 text-sm text-(--ink-mute)">
          Este registro não está disponível no seu arquivo.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-6 rounded-[9px] border-(--ink)/15 text-(--ink) hover:bg-(--paper-soft)"
        >
          <Link href="/cliente/pedidos">Voltar aos pedidos</Link>
        </Button>
      </section>
    )
  }

  const journeyStep = currentJourneyStep(order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="pb-4">
      <Button
        asChild
        variant="ghost"
        className={`mb-8 h-auto gap-2 rounded-[9px] px-0 py-1 text-xs tracking-[0.04em] text-(--ink-mute) hover:bg-transparent hover:text-(--red) ${fontMono}`}
      >
        <Link href="/cliente/pedidos">
          <IconArrowLeft className="size-4" />
          Voltar ao arquivo
        </Link>
      </Button>

      <header className="border-b border-dashed border-(--ink)/15 pb-6">
        <div>
          <p
            className={`text-[11px] font-bold tracking-[0.16em] text-(--red) uppercase ${fontMono}`}
          >
            Dossiê de pedido
          </p>
          <h1
            className={`mt-3 text-[clamp(2rem,5vw,3.2rem)] leading-[0.94] font-black tracking-[-0.035em] text-(--ink) ${fontHeading}`}
          >
            {order.orderNumber}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-(--ink-mute)">
            <IconCalendar className="size-4" />
            Registrado em {formatDate(order.createdAt)}
          </p>
        </div>
      </header>

      <section
        className={`mt-8 ${dossierCardSurface} ${cardShadowBase} p-5 sm:p-7`}
      >
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className={`text-[10px] font-bold tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
              >
                Status atual
              </p>
              <span
                className={cn(
                  `mt-2 inline-flex rounded-[2px] border px-3 py-1.5 text-sm font-semibold tracking-[0.02em] ${fontHeading}`,
                  statusTone[order.status],
                )}
              >
                {formatOrderStatus(order.status)}
              </span>
            </div>
            <span className="text-right">
              <span
                className={`block text-[10px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
              >
                Total
              </span>
              <strong
                className={`mt-1 block text-xl font-bold text-(--red) ${fontHeading}`}
              >
                {formatCurrency(order.total)}
              </strong>
            </span>
          </div>

          {isCancelled ? (
            <p className="mt-6 rounded-[10px] border border-(--red)/20 bg-(--red)/6 px-4 py-3 text-sm/6 text-(--ink-soft)">
              Este pedido foi cancelado. Consulte o status do pagamento para
              acompanhar qualquer ajuste financeiro.
            </p>
          ) : (
            <ol className="mt-7 w-full space-y-5 sm:flex sm:items-start sm:space-y-0 sm:pb-7">
              {journey.map((stage, index) => {
                const complete = index < journeyStep
                const Icon = stage.icon
                return (
                  <li
                    key={stage.label}
                    className="relative flex min-w-0 items-start text-left sm:h-8 sm:flex-1 sm:flex-row sm:items-start sm:last:flex-none"
                  >
                    <div className="relative z-1 flex shrink-0 items-center sm:block">
                      <span
                        className={cn(
                          'flex size-8 items-center justify-center rounded-[10px] border',
                          complete
                            ? 'border-(--teal)/35 bg-(--teal)/12 text-(--teal-deep)'
                            : 'border-(--ink)/12 bg-(--paper-soft) text-(--ink-mute)',
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <p
                        className={cn(
                          `ml-3 text-[11px]/4 tracking-[0.08em] uppercase sm:absolute sm:top-10 sm:left-1/2 sm:ml-0 sm:-translate-x-1/2 sm:text-center sm:whitespace-nowrap ${fontMono}`,
                          complete ? 'text-(--ink-soft)' : 'text-(--ink-mute)',
                          index === 0 &&
                            'sm:left-0 sm:translate-x-0 sm:text-left',
                          index === journey.length - 1 &&
                            'sm:right-0 sm:left-auto sm:translate-x-0 sm:text-right',
                        )}
                      >
                        {stage.label}
                      </p>
                    </div>
                    {index < journey.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-8 -bottom-5 left-4 w-px overflow-hidden bg-(--ink)/12 sm:static sm:mt-4 sm:ml-0 sm:h-0.5 sm:w-auto sm:min-w-0 sm:flex-1"
                      >
                        <span
                          className={cn(
                            'block h-full bg-(--teal)',
                            index < journeyStep - 1 ? 'w-full' : 'w-0',
                          )}
                        />
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </section>

      <section
        aria-label="Detalhes do pedido"
        className="mt-8 rounded-[16px] border border-(--ink)/12 bg-(--card) p-5 sm:p-7"
      >
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <section aria-labelledby="items-heading">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-dashed border-(--ink)/15 pb-3">
              <div>
                <p
                  className={`text-[10px] font-bold tracking-[0.16em] text-(--red) uppercase ${fontMono}`}
                >
                  Evidências catalogadas
                </p>
                <h2
                  id="items-heading"
                  className={`mt-1 text-xl font-semibold text-(--ink) ${fontHeading}`}
                >
                  Itens do pedido
                </h2>
              </div>
              <span className={`text-xs text-(--ink-mute) ${fontMono}`}>
                {order.items.length}{' '}
                {order.items.length === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item: CartItem) => {
                const productImage = getProductImage(item.image ?? '')
                return (
                  <article
                    key={item.id}
                    className="flex gap-4 rounded-[14px] border border-(--ink)/12 bg-(--paper-soft) p-4 sm:items-center sm:p-5"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-[10px] bg-(--paper-soft) sm:size-24">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={item.productName}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <IconPackage className="absolute inset-0 m-auto size-7 text-(--ink-mute)" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[10px] font-bold tracking-[0.13em] text-(--red) uppercase ${fontMono}`}
                      >
                        {item.productType === 'box'
                          ? 'Box de investigação'
                          : 'Item complementar'}
                      </p>
                      <h3
                        className={`mt-1.5 text-base/tight font-semibold text-(--ink) sm:text-lg/tight ${fontHeading}`}
                      >
                        {item.productName}
                      </h3>
                      <p className="mt-2 text-xs text-(--ink-mute)">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <p
                      className={`self-end text-right text-base font-bold text-(--red) sm:self-center ${fontHeading}`}
                    >
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          <aside className="divide-y divide-dashed divide-(--ink)/15 self-start overflow-hidden rounded-[14px] border border-(--ink)/12 bg-(--paper-soft)">
            <section className="p-5">
              <p
                className={`text-[10px] font-bold tracking-[0.14em] text-(--red) uppercase ${fontMono}`}
              >
                Valores
              </p>
              <div className="mt-4 space-y-3">
                <ValueRow
                  label="Subtotal"
                  value={formatCurrency(order.subtotal)}
                />
                <ValueRow
                  label="Frete"
                  value={
                    order.shipping ? formatCurrency(order.shipping) : 'Cortesia'
                  }
                  muted={!order.shipping}
                />
                {order.discount ? (
                  <ValueRow
                    label="Desconto"
                    value={`− ${formatCurrency(order.discount)}`}
                  />
                ) : null}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-dashed border-(--ink)/15 pt-4">
                <span
                  className={`text-[10px] font-bold tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
                >
                  Total
                </span>
                <strong
                  className={`text-2xl font-bold tracking-tight text-(--red) ${fontHeading}`}
                >
                  {formatCurrency(order.total)}
                </strong>
              </div>
            </section>

            <section className="p-5">
              <p
                className={`text-[10px] font-bold tracking-[0.14em] text-(--red) uppercase ${fontMono}`}
              >
                Notas do ciclo
              </p>
              <div className="mt-4 space-y-4 text-sm/6 text-(--ink-soft)">
                {order.billingCycleNote ? (
                  <p>{order.billingCycleNote}</p>
                ) : null}
                {order.shippingCycleNote ? (
                  <p>{order.shippingCycleNote}</p>
                ) : null}
                {order.trackingCode ? (
                  <div className="border-t border-dashed border-(--ink)/12 pt-4">
                    <p
                      className={`text-[10px] font-bold tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
                    >
                      Código de rastreio
                    </p>
                    {order.trackingUrl ? (
                      <a
                        href={order.trackingUrl}
                        className={`mt-1 inline-block font-semibold text-(--red) underline decoration-(--red)/35 underline-offset-4 hover:text-(--red-deep) ${fontHeading}`}
                      >
                        {order.trackingCode}
                      </a>
                    ) : (
                      <p
                        className={`mt-1 font-semibold text-(--ink) ${fontHeading}`}
                      >
                        {order.trackingCode}
                      </p>
                    )}
                  </div>
                ) : null}
                {order.invoicePlaceholder ? (
                  <div className="flex gap-2 border-t border-dashed border-(--ink)/12 pt-4 text-(--ink-mute)">
                    <IconReceipt className="mt-1 size-4 shrink-0 text-(--amber)" />
                    <p>{order.invoicePlaceholder}</p>
                  </div>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  )
}

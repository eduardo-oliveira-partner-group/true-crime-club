'use client'

import { IconArrowRight, IconBoxSeam, IconCalendar } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { OrdersListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { listOrders } from '@/src/lib/domain/repositories'
import type { Order, OrderStatus } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
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

function orderSummary(items: Order['items']) {
  const [first, ...remaining] = items
  if (!first) return null
  return remaining.length > 0
    ? `${first.productName} + ${remaining.length} ${remaining.length === 1 ? 'item' : 'itens'}`
    : first.productName
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Meus pedidos
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Cada pedido é tratado como um dossiê: consulte o pagamento, o ciclo de
        envio e o rastreio no mesmo lugar.
      </p>

      {loading ? (
        <OrdersListSkeleton />
      ) : orders.length === 0 ? (
        <Empty className="mt-10 border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 sm:p-10">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="bg-(--amber)/15 text-(--amber)"
            >
              <IconBoxSeam />
            </EmptyMedia>
            <EmptyTitle className="text-xl">Nenhum pedido por aqui</EmptyTitle>
            <EmptyDescription>
              Quando uma nova box entrar no seu arquivo, ela aparecerá nesta
              lista com todos os próximos passos.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              asChild
              className={`group rounded-[9px] bg-(--red) px-4 py-3 text-xs font-bold tracking-[0.04em] text-[#fbf9f6] uppercase shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] [transition:background-color_0.2s_ease,translate_0.24s_cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-(--red-deep) motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${fontMono}`}
            >
              <Link href="/loja">
                Explorar a loja
                <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <section className="mt-8" aria-label="Lista de pedidos">
          <div className="space-y-4" aria-busy="false">
            {orders.map((order) => {
              const summary = orderSummary(order.items)
              return (
                <Link
                  key={order.id}
                  href={`/cliente/pedidos/${order.id}`}
                  className={cn(
                    `group block ${dossierCardSurface} ${cardShadowBase} p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--red) ${transitionCardHover}`,
                    'hover:-translate-y-1 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                  )}
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span
                          className={cn(
                            `inline-flex rounded-[2px] border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${fontMono}`,
                            statusTone[order.status],
                          )}
                        >
                          {formatOrderStatus(order.status)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-(--ink-mute)">
                          <IconCalendar className="size-3.5" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <h2
                        className={`mt-4 text-lg/tight font-semibold tracking-[-0.02em] text-(--ink) sm:text-xl/tight ${fontHeading}`}
                      >
                        Pedido {order.orderNumber}
                      </h2>
                      {summary ? (
                        <p className="mt-1.5 line-clamp-1 text-sm text-(--ink-mute)">
                          {summary}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-end justify-between gap-5 border-t border-dashed border-(--ink)/12 pt-4 sm:block sm:min-w-36 sm:border-t-0 sm:pt-0 sm:text-right">
                      <div>
                        <p
                          className={`text-[10px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
                        >
                          Total do pedido
                        </p>
                        <p
                          className={`mt-1 text-xl font-bold tracking-tight text-(--red) ${fontHeading}`}
                        >
                          {formatCurrency(order.total)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--ink-mute) transition-colors duration-200 group-hover:text-(--red) sm:mt-5 sm:justify-end">
                        Ver pedido
                        <IconArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-(--ink)/12 pt-4 text-xs/5 text-(--ink-mute)">
                    <p>
                      Pagamento:{' '}
                      <span className="font-medium text-(--ink-soft)">
                        {formatPaymentStatus(order.paymentStatus)}
                      </span>
                    </p>
                    {order.items.length > 0 ? (
                      <>
                        <span className="hidden size-1 rounded-full bg-(--ink)/25 sm:block" />
                        <p>
                          {order.items.length}{' '}
                          {order.items.length === 1
                            ? 'item registrado'
                            : 'itens registrados'}
                        </p>
                      </>
                    ) : null}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

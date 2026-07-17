'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
  transitionCardHover,
} from '@/src/lib/design/classes'
import { listOrders } from '@/src/lib/domain/repositories'
import type { Order } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const statusTone: Record<string, string> = {
  entregue: 'text-(--teal) border-(--teal)/30 bg-(--teal)/8',
  enviado: 'text-(--teal) border-(--teal)/30 bg-(--teal)/8',
  processando: 'text-(--amber) border-(--amber)/30 bg-(--amber)/8',
  pendente: 'text-(--red) border-(--red)/25 bg-(--red)/6',
  cancelado: 'text-(--ink-mute) border-(--ink)/15 bg-(--ink)/5',
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
        Acompanhe status de pagamento, despacho e rastreio. Cobrança e envio
        seguem ciclos distintos.
      </p>

      <div className="mt-8 space-y-4" aria-busy={loading}>
        {loading ? (
          <p className="text-sm text-(--ink-mute)">Carregando pedidos…</p>
        ) : null}
        {orders.map((order: Order) => {
          const tone =
            statusTone[order.status] ??
            'text-(--ink-mute) border-(--ink)/15 bg-(--ink)/5'
          return (
            <Link
              key={order.id}
              href={`/cliente/pedidos/${order.id}`}
              className={`group block ${dossierCardSurface} ${cardShadowBase} p-5 ${transitionCardHover} hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)]`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] tracking-[0.16em] text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    PED
                  </span>
                  <p
                    className={`text-sm font-semibold tracking-wide text-(--ink) ${fontHeading}`}
                  >
                    {order.orderNumber}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-[2px] border px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase',
                    tone,
                  )}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-(--ink)/10 pt-3 text-sm">
                <p className="text-(--ink-mute)">
                  Pagamento:{' '}
                  <span className="text-(--ink-soft)">
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </p>
                <p className={`font-semibold text-(--red) ${fontHeading}`}>
                  {formatCurrency(order.total)}
                </p>
              </div>

              <div
                className={`mt-3 flex items-center justify-end gap-1 text-xs font-semibold tracking-wide text-(--ink-mute) ${transitionBgColor} group-hover:text-(--red)`}
              >
                Abrir dossiê
                <IconArrowRight className="size-3.5" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

import type { Order } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { listOrders } from '@/src/lib/server/customer'
import { cn } from '@/src/lib/utils'

const statusTone: Record<string, string> = {
  entregue: 'text-[#d7b56d] border-[#d7b56d]/40 bg-[#d7b56d]/10',
  enviado: 'text-[#d7b56d] border-[#d7b56d]/40 bg-[#d7b56d]/10',
  processando: 'text-[#ffb0a5] border-[#d84132]/40 bg-[#d84132]/12',
  pendente: 'text-[#ffb0a5] border-[#d84132]/40 bg-[#d84132]/12',
  cancelado: 'text-[#bfb4a3] border-[#fffaf0]/20 bg-[#fffaf0]/5',
}

export default async function PedidosPage() {
  const orders: Order[] = listOrders()

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Meus pedidos
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Acompanhe status de pagamento, despacho e rastreio. Cobrança e envio
        seguem ciclos distintos.
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order: Order) => {
          const tone =
            statusTone[order.status] ??
            'text-[#c8bdad] border-[#fffaf0]/18 bg-[#fffaf0]/5'
          return (
            <Link
              key={order.id}
              href={`/design-sugerido/cliente/pedidos/${order.id}`}
              className="group block border border-[#fffaf0]/12 bg-[#171211] p-5 transition-all hover:-translate-y-0.5 hover:border-[#b98542]/55 hover:shadow-[0_20px_48px_rgba(0,0,0,0.38)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-[#bfb4a3] uppercase">
                    PED
                  </span>
                  <p className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0]">
                    {order.orderNumber}
                  </p>
                </div>
                <span
                  className={cn(
                    'border px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase',
                    tone,
                  )}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#fffaf0]/10 pt-3 text-sm">
                <p className="text-[#c8bdad]">
                  Pagamento:{' '}
                  <span className="text-[#f0e8dd]">
                    {formatPaymentStatus(order.paymentStatus)}
                  </span>
                </p>
                <p className="font-heading font-semibold text-[#d7b56d]">
                  {formatCurrency(order.total)}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-end gap-1 text-xs font-semibold tracking-wide text-[#bfb4a3] transition-colors group-hover:text-[#d7b56d]">
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

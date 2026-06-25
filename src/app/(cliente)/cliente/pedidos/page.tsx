import Link from 'next/link'

import { listOrders } from '@/src/lib/domain/repositories'
import {
  formatCurrency,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'

export default function PedidosPage() {
  const orders = listOrders()

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Meus pedidos</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Acompanhe status de pagamento, despacho e rastreio. Cobrança e envio
        seguem ciclos distintos.
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/cliente/pedidos/${order.id}`}
            className="block rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{order.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {formatOrderStatus(order.status)}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Pagamento: {formatPaymentStatus(order.paymentStatus)} —{' '}
              {formatCurrency(order.total)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

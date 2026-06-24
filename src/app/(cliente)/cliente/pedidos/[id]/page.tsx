import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/src/components/ui/button"
import { getOrderById } from "@/src/lib/domain/repositories"
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
} from "@/src/lib/formatters"

interface PedidoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({ params }: PedidoDetailPageProps) {
  const { id } = await params
  const order = getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <Button asChild variant="ghost" className="mb-4 h-auto p-0">
        <Link href="/cliente/pedidos">← Voltar aos pedidos</Link>
      </Button>

      <h1 className="font-heading text-2xl font-semibold">{order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Realizado em {formatDate(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm font-medium">Status do pedido</p>
          <p className="mt-1">{formatOrderStatus(order.status)}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm font-medium">Pagamento</p>
          <p className="mt-1">{formatPaymentStatus(order.paymentStatus)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border p-4 text-sm">
        <p>{order.billingCycleNote}</p>
        <p className="mt-2">{order.shippingCycleNote}</p>
        {order.trackingCode ? (
          <p className="mt-2">
            Rastreio:{" "}
            {order.trackingUrl ? (
              <a href={order.trackingUrl} className="text-primary hover:underline">
                {order.trackingCode}
              </a>
            ) : (
              order.trackingCode
            )}
          </p>
        ) : null}
        <p className="mt-2 text-muted-foreground">{order.invoicePlaceholder}</p>
      </div>

      <ul className="mt-6 space-y-2">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

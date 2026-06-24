import Link from "next/link"

import { Button } from "@/src/components/ui/button"
import { listOrders } from "@/src/lib/domain/repositories"
import {
  formatCurrency,
  formatOrderStatus,
  formatPaymentStatus,
} from "@/src/lib/formatters"

export default function ConfirmacaoPage() {
  const orders = listOrders()
  const order = orders[0]

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center sm:px-6">
        <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/loja">Voltar à loja</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-brand-accent">Pedido confirmado</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">{order.orderNumber}</h1>
        <p className="mt-4 text-muted-foreground">
          Status: {formatOrderStatus(order.status)} — Pagamento:{" "}
          {formatPaymentStatus(order.paymentStatus)}
        </p>
        <p className="mt-2 text-2xl font-semibold">{formatCurrency(order.total)}</p>
      </div>

      <div className="mt-8 space-y-4 rounded-xl border border-border p-6 text-sm">
        <p>
          <strong>Cobrança:</strong> {order.billingCycleNote}
        </p>
        <p>
          <strong>Envio:</strong> {order.shippingCycleNote}
        </p>
        {order.trackingCode ? (
          <p>
            <strong>Rastreio:</strong> {order.trackingCode}
          </p>
        ) : (
          <p className="text-muted-foreground">
            O código de rastreio será enviado por e-mail após o despacho.
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/cliente/pedidos">Ver meus pedidos</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Voltar à home</Link>
        </Button>
      </div>
    </div>
  )
}

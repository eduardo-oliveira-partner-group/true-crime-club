import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import { getOrderById } from '@/src/lib/domain/repositories'
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'

interface PedidoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({
  params,
}: PedidoDetailPageProps) {
  const { id } = await params
  const order = getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 p-0 text-[#c8bdad] hover:bg-transparent hover:text-[#d7b56d]"
      >
        <Link href="/cliente/pedidos">
          <IconArrowLeft className="size-4" />
          Voltar aos pedidos
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.16em] text-[#bfb4a3] uppercase">
          PED
        </span>
        <h1 className="font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
          {order.orderNumber}
        </h1>
      </div>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Realizado em {formatDate(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Status do pedido
          </p>
          <p className="mt-2 font-heading text-lg font-semibold text-[#fffaf0]">
            {formatOrderStatus(order.status)}
          </p>
        </div>
        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Pagamento
          </p>
          <p className="mt-2 font-heading text-lg font-semibold text-[#fffaf0]">
            {formatPaymentStatus(order.paymentStatus)}
          </p>
        </div>
      </div>

      <div className="mt-6 border border-[#fffaf0]/12 bg-[#0c0a09] p-5 text-sm/6 text-[#d7c9b5]">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
          Notas do ciclo
        </p>
        <p className="mt-3">{order.billingCycleNote}</p>
        <p className="mt-2">{order.shippingCycleNote}</p>
        {order.trackingCode ? (
          <p className="mt-2">
            Rastreio:{' '}
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                className="font-medium text-[#d7b56d] hover:text-[#fffaf0]"
              >
                {order.trackingCode}
              </a>
            ) : (
              <span className="text-[#f0e8dd]">{order.trackingCode}</span>
            )}
          </p>
        ) : null}
        <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-[#bfb4a3] uppercase">
          {order.invoicePlaceholder}
        </p>
      </div>

      <div className="mt-6 border border-[#fffaf0]/12 bg-[#171211] p-5">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
          Itens do dossiê
        </p>
        <ul className="mt-4 divide-y divide-[#fffaf0]/10">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-[#f0e8dd]">
                {item.productName}{' '}
                <span className="text-[#bfb4a3]">× {item.quantity}</span>
              </span>
              <span className="font-heading font-semibold text-[#d7b56d]">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

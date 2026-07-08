import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/src/components/ui/button'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
} from '@/src/lib/design/classes'
import type { CartItem } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { getOrderById } from '@/src/lib/server/customer'

interface PedidoDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PedidoDetailPage({
  params,
}: PedidoDetailPageProps) {
  const { id } = await params
  const order = await getOrderById(id)

  if (!order) {
    notFound()
  }

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 rounded-[9px] p-0 text-(--ink-mute) hover:bg-transparent hover:text-(--red)"
      >
        <Link href="/cliente/pedidos">
          <IconArrowLeft className="size-4" />
          Voltar aos pedidos
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <span
          className={`text-[10px] tracking-[0.16em] text-(--ink-mute) uppercase ${fontMono}`}
        >
          PED
        </span>
        <h1
          className={`text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
        >
          {order.orderNumber}
        </h1>
      </div>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Realizado em {formatDate(order.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Status do pedido
            </h3>
          </div>
          <div className="mt-4">
            <p className={`text-lg font-semibold text-(--ink) ${fontHeading}`}>
              {formatOrderStatus(order.status)}
            </p>
          </div>
        </div>
        <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Pagamento
            </h3>
          </div>
          <div className="mt-4">
            <p className={`text-lg font-semibold text-(--ink) ${fontHeading}`}>
              {formatPaymentStatus(order.paymentStatus)}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`mt-6 rounded-[14px] border border-(--ink)/10 bg-(--paper-soft) p-5 text-sm/6 text-(--ink-mute)`}
      >
        <div className="border-b border-dashed border-(--ink)/10 pb-3">
          <h3
            className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
          >
            Notas do ciclo
          </h3>
        </div>
        <div className="mt-4 space-y-2 text-(--ink-soft)">
          <p>{order.billingCycleNote}</p>
          <p>{order.shippingCycleNote}</p>
          {order.trackingCode ? (
            <p className="mt-2">
              Rastreio:{' '}
              {order.trackingUrl ? (
                <a
                  href={order.trackingUrl}
                  className="font-medium text-(--red) hover:text-(--red-deep)"
                >
                  {order.trackingCode}
                </a>
              ) : (
                <span className="text-(--ink-soft)">{order.trackingCode}</span>
              )}
            </p>
          ) : null}
          <p
            className={`mt-2 text-[11px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontMono}`}
          >
            {order.invoicePlaceholder}
          </p>
        </div>
      </div>

      <div className={`mt-6 ${dossierCardSurface} ${cardShadowBase} p-5`}>
        <div className="border-b border-dashed border-(--ink)/10 pb-3">
          <h3
            className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
          >
            Itens do dossiê
          </h3>
        </div>
        <div className="mt-4">
          <ul className="divide-y divide-dashed divide-(--ink)/10">
            {order.items.map((item: CartItem) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="text-(--ink-soft)">
                  {item.productName}{' '}
                  <span className="text-(--ink-mute)">× {item.quantity}</span>
                </span>
                <span className={`font-semibold text-(--red) ${fontHeading}`}>
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

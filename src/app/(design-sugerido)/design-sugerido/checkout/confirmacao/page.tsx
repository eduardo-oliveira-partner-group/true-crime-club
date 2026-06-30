import {
  IconArrowRight,
  IconCheck,
  IconClipboardText,
  IconCreditCard,
  IconFileInvoice,
  IconPackage,
  IconShieldCheck,
  IconTruckDelivery,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import evidenceWorkbenchPlate from '@/src/assets/images/home/evidence-workbench-plate.png'
import { Button } from '@/src/components/ui/button'
import { listOrders } from '@/src/lib/domain/repositories'
import type { CartItem } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { buildMetadata } from '@/src/lib/seo'

export const metadata = buildMetadata({
  path: '/design-sugerido/checkout/confirmacao',
  title: 'Pedido Confirmado (Design Anterior)',
  noindex: true,
})

export default function ConfirmacaoPage() {
  const orders = listOrders()
  const order = orders[0]

  if (!order) {
    return <EmptyConfirmation />
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-[#090807] text-[#fffaf0]">
      <Image
        src={evidenceWorkbenchPlate}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-center opacity-24 brightness-[0.48] saturate-[0.78]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(9,8,7,0.9)_0%,rgba(9,8,7,0.78)_42%,rgba(5,4,3,0.96)_100%),radial-gradient(circle_at_18%_12%,rgba(216,65,50,0.16),transparent_34%),radial-gradient(circle_at_82%_8%,rgba(215,181,109,0.13),transparent_32%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.028)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.028)_1px,transparent_1px)] bg-size-[42px_42px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <header className="border-b border-[#fffaf0]/12 pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-semibold tracking-[0.26em] text-[#d7b56d] uppercase">
              Pedido confirmado
            </p>
            <span className="hidden h-px flex-1 bg-[#d7b56d]/38 sm:block" />
            <p className="font-mono text-[0.68rem] tracking-[0.18em] text-[#fffaf0]/50 uppercase">
              PROC-08 · dossiê aberto
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 border border-[#d7b56d]/35 bg-[#171211]/80 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-[#d7b56d] uppercase backdrop-blur-sm">
                <IconShieldCheck className="size-4" />
                Sessão registrada
              </div>
              <h1 className="max-w-3xl font-heading text-3xl/tight font-black tracking-wide text-[#fffaf0] uppercase sm:text-4xl lg:text-5xl">
                O dossiê do seu pedido foi lacrado.
              </h1>
              <p className="max-w-2xl text-sm/6 text-[#d7c9b5] sm:text-base/7">
                Recebemos o pedido {order.orderNumber}. A confirmação foi
                registrada e os próximos passos ficam disponíveis na área do
                cliente.
              </p>
            </div>

            <div className="border border-[#d7b56d]/35 bg-[#171211]/85 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.38)] backdrop-blur-sm">
              <p className="text-[0.66rem] font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                Total confirmado
              </p>
              <p className="mt-2 font-heading text-3xl font-black text-[#fffaf0]">
                {formatCurrency(order.total)}
              </p>
              <p className="mt-2 text-xs/5 text-[#c8bdad]">
                {itemCount}{' '}
                {itemCount === 1
                  ? 'peça catalogada no pedido'
                  : 'peças catalogadas no pedido'}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.42fr] lg:gap-10">
          <main className="flex flex-col gap-6">
            <StatusPanel
              orderNumber={order.orderNumber}
              orderStatus={formatOrderStatus(order.status)}
              paymentStatus={formatPaymentStatus(order.paymentStatus)}
              createdAt={formatDateTime(order.createdAt)}
            />

            <section className="border border-[#fffaf0]/12 bg-[#171211]/78 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.32)] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fffaf0]/12 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center bg-[#d84132]/18 text-[#ffb0a5]">
                    <IconPackage className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                      Evidências do pedido
                    </p>
                    <h2 className="font-heading text-xl font-semibold tracking-wide text-[#fffaf0] uppercase">
                      Itens catalogados
                    </h2>
                  </div>
                </div>
                <p className="font-mono text-[0.65rem] tracking-[0.16em] text-[#fffaf0]/42 uppercase">
                  {String(order.items.length).padStart(2, '0')} registros
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                {order.items.map((item) => (
                  <OrderItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <NextStepCard
                icon={<IconCreditCard className="size-5" />}
                label="Cobrança"
                text={
                  order.billingCycleNote ??
                  'Cobrança registrada no mês da compra.'
                }
              />
              <NextStepCard
                icon={<IconTruckDelivery className="size-5" />}
                label="Envio"
                text={
                  order.shippingCycleNote ??
                  'O envio será preparado conforme o ciclo do pedido.'
                }
              />
              <NextStepCard
                icon={<IconFileInvoice className="size-5" />}
                label="Documento fiscal"
                text={
                  order.invoicePlaceholder ??
                  'A nota fiscal ficará disponível após a confirmação.'
                }
              />
            </section>
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-[#fffaf0]/12 bg-[#0c0a09]/90 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-[#fffaf0]/12 pb-4">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
                  Resumo financeiro
                </p>
                <p className="font-mono text-[0.62rem] tracking-[0.16em] text-[#fffaf0]/40 uppercase">
                  {order.orderNumber}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 text-sm text-[#d7c9b5]">
                <SummaryRow
                  label="Subtotal"
                  value={formatCurrency(order.subtotal)}
                />
                <SummaryRow
                  label="Frete"
                  value={formatCurrency(order.shipping)}
                />
                <SummaryRow
                  label="Desconto"
                  value={`-${formatCurrency(order.discount)}`}
                />
              </div>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-[#d7b56d]/30 pt-5">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
                  Total
                </span>
                <span className="font-heading text-2xl font-black text-[#fffaf0]">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  asChild
                  className="h-11 rounded-none bg-[#d84132] px-5 text-white shadow-[0_0_24px_rgba(216,65,50,0.28)] hover:bg-[#b93227]"
                >
                  <Link href="/design-sugerido/cliente/pedidos">
                    Ver meus pedidos
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-none border-[#d7b56d]/45 bg-transparent px-5 text-[#d7b56d] hover:bg-[#d7b56d]/12 hover:text-[#f0e8dd]"
                >
                  <Link href="/design-sugerido">Voltar à home</Link>
                </Button>
              </div>

              <p className="mt-5 text-[0.72rem]/5 text-[#bfb4a3]">
                O rastreio será enviado por e-mail após o despacho.
                {order.trackingCode
                  ? ` Código registrado: ${order.trackingCode}.`
                  : ''}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function EmptyConfirmation() {
  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-[#090807] text-[#fffaf0]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.028)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.028)_1px,transparent_1px)] bg-size-[42px_42px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(216,65,50,0.12),transparent_62%)]" />

      <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
        <div className="flex size-14 items-center justify-center border border-[#fffaf0]/14 bg-[#171211] text-[#d7b56d]">
          <IconClipboardText className="size-6" />
        </div>
        <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-[#d7b56d] uppercase">
          Arquivo não localizado
        </p>
        <h1 className="mt-3 font-heading text-3xl font-black tracking-wide text-[#fffaf0] uppercase">
          Nenhum pedido encontrado.
        </h1>
        <p className="mt-3 max-w-md text-sm/6 text-[#d7c9b5]">
          Ainda não existe um dossiê de compra para confirmar. Volte à loja e
          selecione uma box para iniciar o checkout.
        </p>
        <Button
          asChild
          className="mt-7 h-11 rounded-none bg-[#d84132] px-5 text-white shadow-[0_0_24px_rgba(216,65,50,0.28)] hover:bg-[#b93227]"
        >
          <Link href="/design-sugerido/loja">
            Voltar à loja
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function StatusPanel({
  orderNumber,
  orderStatus,
  paymentStatus,
  createdAt,
}: {
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  createdAt: string
}) {
  const statuses = [
    ['Pedido', orderNumber],
    ['Status', orderStatus],
    ['Pagamento', paymentStatus],
    ['Registro', createdAt],
  ]

  return (
    <section className="relative isolate overflow-hidden border border-[#d7b56d]/32 bg-[#171211]/82 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.36)] sm:p-6">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.024)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.024)_1px,transparent_1px)] bg-size-[34px_34px]" />
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center bg-[#d7b56d] text-[#171211]">
            <IconCheck className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
              Confirmação emitida
            </p>
            <h2 className="mt-2 font-heading text-2xl font-black tracking-wide text-[#fffaf0] uppercase">
              Pagamento validado
            </h2>
            <p className="mt-2 max-w-xl text-sm/6 text-[#c8bdad]">
              Seu pedido entrou na fila de preparação. A equipe do clube vai
              acompanhar cobrança, separação e envio pelo mesmo registro.
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map(([label, value]) => (
          <div
            key={label}
            className="border border-[#fffaf0]/10 bg-[#090807]/54 p-4"
          >
            <dt className="text-[0.66rem] font-semibold tracking-[0.18em] text-[#d7b56d] uppercase">
              {label}
            </dt>
            <dd className="mt-2 text-sm font-medium text-[#fffaf0]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function OrderItemCard({ item }: { item: CartItem }) {
  const productImage = getProductImage(item.image ?? '')
  const lineTotal = item.unitPrice * item.quantity

  return (
    <article className="flex flex-col gap-4 border border-[#fffaf0]/10 bg-[#090807]/54 p-4 sm:flex-row sm:items-center">
      <Link
        href={`/design-sugerido/loja/${item.productSlug}`}
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden border border-[#fffaf0]/12 bg-[#0b0908] sm:size-24"
      >
        {productImage ? (
          <Image
            src={productImage}
            alt={item.productName}
            fill
            sizes="(max-width: 640px) 100vw, 96px"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#d7b56d]/50">
            <IconPackage className="size-6" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.66rem] tracking-[0.18em] text-[#d7c9b5]/55 uppercase">
          EVID-{String(item.quantity).padStart(2, '0')} ·{' '}
          {item.productType === 'box' ? 'Box' : 'Item'}
        </p>
        <h3 className="mt-1 font-heading text-base font-semibold tracking-wide text-[#fffaf0] uppercase">
          <Link
            href={`/design-sugerido/loja/${item.productSlug}`}
            className="transition hover:text-[#d7b56d]"
          >
            {item.productName}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-[#c8bdad]">
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </p>
      </div>

      <p className="font-heading text-lg font-semibold text-[#fffaf0]">
        {formatCurrency(lineTotal)}
      </p>
    </article>
  )
}

function NextStepCard({
  icon,
  label,
  text,
}: {
  icon: React.ReactNode
  label: string
  text: string
}) {
  return (
    <article className="border border-[#fffaf0]/12 bg-[#0c0a09]/84 p-5 shadow-[0_16px_34px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3 text-[#d7b56d]">
        <span className="flex size-9 items-center justify-center border border-[#d7b56d]/30 bg-[#d7b56d]/8">
          {icon}
        </span>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase">
          {label}
        </p>
      </div>
      <p className="mt-4 text-sm/6 text-[#d7c9b5]">{text}</p>
    </article>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium text-[#f0e8dd]">{value}</span>
    </div>
  )
}

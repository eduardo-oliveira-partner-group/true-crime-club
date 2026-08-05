'use client'

import {
  IconArrowRight,
  IconCheck,
  IconClipboardText,
  IconClock,
  IconCreditCard,
  IconFileInvoice,
  IconPackage,
  IconShieldCheck,
  IconTruckDelivery,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { PixAwaitingPanel } from '@/src/components/checkout/pix-awaiting-panel'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { Button } from '@/src/components/ui/button'
import { ConfirmationSkeleton } from '@/src/components/ui/page-loading-skeletons'
import { useCheckoutPaymentWs } from '@/src/hooks/use-checkout-payment-ws'
import {
  type CheckoutPixPaymentSnapshot,
  clearCheckoutPixPayment,
  readCheckoutPixPayment,
  saveCheckoutPixPayment,
} from '@/src/lib/checkout-pix-storage'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  sectionFrame,
  warmShadowClass,
} from '@/src/lib/design/classes'
import {
  getOrderById,
  getPendingPixPaymentForOrder,
  listOrders,
} from '@/src/lib/domain/repositories'
import type { CartItem, Order, Payment } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

function snapshotToPixState(payment: CheckoutPixPaymentSnapshot): {
  pixPayment: Pick<Payment, 'pixQrCode' | 'pixExpiresAt'>
  pixQrImage: string | null
} {
  return {
    pixPayment: {
      pixQrCode: payment.pixQrCode,
      pixExpiresAt: payment.pixExpiraEm,
    },
    pixQrImage: payment.pixQrCodeBase64
      ? `data:image/png;base64,${payment.pixQrCodeBase64}`
      : null,
  }
}

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [pixPayment, setPixPayment] = useState<Pick<
    Payment,
    'pixQrCode' | 'pixExpiresAt'
  > | null>(null)
  const [pixQrImage, setPixQrImage] = useState<string | null>(null)
  const [awaitingPixConfirmation, setAwaitingPixConfirmation] = useState(false)

  const clearPixState = useCallback((orderId?: string) => {
    if (orderId) clearCheckoutPixPayment(orderId)
    setPixPayment(null)
    setPixQrImage(null)
    setAwaitingPixConfirmation(false)
  }, [])

  const showPixSnapshot = useCallback(
    (snapshot: CheckoutPixPaymentSnapshot) => {
      const applied = snapshotToPixState(snapshot)
      setAwaitingPixConfirmation(true)
      setPixPayment(applied.pixPayment)
      setPixQrImage(applied.pixQrImage)
    },
    [],
  )

  const refreshOrder = useCallback(
    async (orderId: string) => {
      const updated = await getOrderById(orderId)
      if (!updated) return null
      setOrder(updated)
      if (updated.paymentStatus === 'paid') {
        clearPixState(orderId)
      }
      return updated
    },
    [clearPixState],
  )

  useEffect(() => {
    let cancelled = false
    const id = searchParams.get('pedido')

    async function load() {
      setLoading(true)

      if (id) {
        const stored = readCheckoutPixPayment(id)
        if (stored) showPixSnapshot(stored)
      }

      try {
        const loaded = id
          ? await getOrderById(id)
          : ((await listOrders())[0] ?? null)

        if (cancelled) return
        setOrder(loaded)

        if (!loaded) return

        if (loaded.paymentStatus === 'paid') {
          clearPixState(loaded.id)
          return
        }

        const stored = readCheckoutPixPayment(loaded.id)
        if (stored) {
          showPixSnapshot(stored)
          return
        }

        // Pedido pendente (ou já com Pix em tela): tenta rehidratar o QR pela API.
        if (
          loaded.paymentStatus === 'pending' ||
          loaded.status === 'pending_payment'
        ) {
          try {
            const remote = await getPendingPixPaymentForOrder(loaded.id)
            if (cancelled || !remote?.pixQrCode) return

            const snapshot: CheckoutPixPaymentSnapshot = {
              id: remote.id,
              metodo: 'pix',
              pixQrCode: remote.pixQrCode,
              pixExpiraEm: remote.pixExpiresAt,
            }
            saveCheckoutPixPayment(loaded.id, snapshot)
            showPixSnapshot(snapshot)
          } catch {
            // Confirmação segue mesmo se a rehidratação do Pix falhar.
          }
        }
      } catch {
        if (!cancelled) setOrder(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [clearPixState, searchParams, showPixSnapshot])

  const orderId = order?.id
  const paymentPending =
    order?.paymentStatus === 'pending' || awaitingPixConfirmation

  useCheckoutPaymentWs(orderId, {
    enabled: Boolean(orderId && paymentPending),
    onPaymentConfirmed: () => {
      if (orderId) void refreshOrder(orderId)
    },
    onPoll: () => {
      if (orderId) void refreshOrder(orderId)
    },
  })

  if (loading) return <ConfirmationSkeleton />

  if (!order) {
    return <EmptyConfirmation />
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const pixPending = Boolean(pixPayment) || order.paymentStatus === 'pending'

  return (
    <DesignPageShell className="overflow-hidden">
      <div className={cn(sectionFrame, 'relative z-10 py-12 lg:py-16')}>
        <header className="border-b border-[rgba(33,28,24,0.15)] pb-8">
          <div className="flex flex-wrap items-center gap-4">
            <p
              className={cn(
                fontMono,
                'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
              )}
            >
              {pixPending ? 'Pagamento pendente' : 'Pedido confirmado'}
            </p>
            <span className="hidden h-px flex-1 border-t border-dashed border-[rgba(33,28,24,0.18)] sm:block" />
            <p
              className={cn(
                fontMono,
                'text-[0.68rem] tracking-[0.14em] text-(--ink-mute) uppercase',
              )}
            >
              PROC-08 · dossiê aberto
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <div
                className={cn(
                  fontMono,
                  'inline-flex w-fit items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-3 py-2 text-xs font-semibold tracking-[0.14em] uppercase',
                  pixPending ? 'text-(--amber)' : 'text-(--red)',
                )}
              >
                {pixPending ? (
                  <span className="relative flex size-2" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-(--amber) opacity-55 motion-reduce:animate-none" />
                    <span className="relative size-2 rounded-full bg-(--amber)" />
                  </span>
                ) : (
                  <IconShieldCheck className="size-4" />
                )}
                {pixPending
                  ? 'Aguardando compensação Pix'
                  : 'Sessão registrada'}
              </div>
              <h1
                className={cn(
                  fontHeading,
                  'max-w-3xl text-3xl/tight font-semibold tracking-[-0.015em] text-balance text-(--ink) sm:text-4xl lg:text-5xl',
                )}
              >
                {pixPending
                  ? 'Pedido registrado. Falta só o Pix.'
                  : 'O dossiê do seu pedido foi lacrado.'}
              </h1>
              <p className="max-w-2xl text-sm/6 text-(--ink-soft) sm:text-base/7">
                {pixPending
                  ? `Recebemos o pedido ${order.orderNumber}. Conclua o Pix abaixo — a confirmação chega automaticamente nesta tela.`
                  : `Recebemos o pedido ${order.orderNumber}. A confirmação foi registrada e os próximos passos ficam disponíveis na área do cliente.`}
              </p>
            </div>

            <div className={cn(dossierCardSurface, warmShadowClass, 'p-5')}>
              <p
                className={cn(
                  fontMono,
                  'text-[0.66rem] font-semibold tracking-[0.16em] text-(--red) uppercase',
                )}
              >
                {pixPending ? 'Total a pagar' : 'Total confirmado'}
              </p>
              <p
                className={cn(
                  fontHeading,
                  'mt-2 text-3xl font-semibold text-(--ink)',
                )}
              >
                {formatCurrency(order.total)}
              </p>
              <p className="mt-2 text-xs/5 text-(--ink-soft)">
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
            {pixPayment ? (
              <PixAwaitingPanel
                payment={pixPayment}
                qrImage={pixQrImage}
                orderNumber={order.orderNumber}
                createdAt={order.createdAt}
              />
            ) : (
              <StatusPanel
                orderNumber={order.orderNumber}
                orderStatus={formatOrderStatus(order.status)}
                paymentStatus={formatPaymentStatus(order.paymentStatus)}
                createdAt={formatDateTime(order.createdAt)}
                pixPending={pixPending}
              />
            )}

            <section
              className={cn(dossierCardSurface, warmShadowClass, 'p-5 sm:p-6')}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(33,28,24,0.15)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[10px] bg-(--red)/10 text-(--red)">
                    <IconPackage className="size-5" />
                  </span>
                  <div>
                    <p
                      className={cn(
                        fontMono,
                        'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
                      )}
                    >
                      Evidências do pedido
                    </p>
                    <h2
                      className={cn(
                        fontHeading,
                        'text-xl font-semibold text-(--ink)',
                      )}
                    >
                      Itens catalogados
                    </h2>
                  </div>
                </div>
                <p
                  className={cn(
                    fontMono,
                    'text-[0.65rem] tracking-[0.14em] text-(--ink-mute) uppercase',
                  )}
                >
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
            <div
              className={cn(dossierCardSurface, warmShadowClass, 'p-5 sm:p-6')}
            >
              <div className="flex flex-col justify-between gap-2 border-b border-[rgba(33,28,24,0.15)] pb-4">
                <p
                  className={cn(
                    fontMono,
                    'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
                  )}
                >
                  Resumo financeiro
                </p>
                <p
                  className={cn(
                    fontMono,
                    'text-[0.62rem] tracking-[0.14em] text-(--ink-mute) uppercase',
                  )}
                >
                  {order.orderNumber}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-3 text-sm text-(--ink-soft)">
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
                <span
                  className={cn(
                    fontMono,
                    'text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                  )}
                >
                  Total
                </span>
                <span
                  className={cn(
                    fontHeading,
                    'text-2xl font-semibold text-(--ink)',
                  )}
                >
                  {formatCurrency(order.total)}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  asChild
                  className={cn(
                    fontMono,
                    'h-11 rounded-[9px] bg-(--red) px-5 text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)',
                  )}
                >
                  <Link href="/cliente/pedidos">
                    Ver meus pedidos
                    <IconArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    fontMono,
                    'h-11 rounded-[10px] border-[rgba(33,28,24,0.15)] bg-transparent px-5 text-(--ink) hover:bg-(--ink) hover:text-[#fbf9f6]',
                  )}
                >
                  <Link href="/">Voltar à home</Link>
                </Button>
              </div>

              <p className="mt-5 text-[0.72rem]/5 text-(--ink-mute)">
                O rastreio será enviado por e-mail após o despacho.
                {order.trackingCode
                  ? ` Código registrado: ${order.trackingCode}.`
                  : ''}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </DesignPageShell>
  )
}

function EmptyConfirmation() {
  return (
    <DesignPageShell className="overflow-hidden">
      <div className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
        <div className="flex size-14 items-center justify-center rounded-[14px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--red)">
          <IconClipboardText className="size-6" />
        </div>
        <p
          className={cn(
            fontMono,
            'mt-6 text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
          )}
        >
          Arquivo não localizado
        </p>
        <h1
          className={cn(
            fontHeading,
            'mt-3 text-3xl font-semibold tracking-[-0.015em] text-(--ink)',
          )}
        >
          Nenhum pedido encontrado.
        </h1>
        <p className="mt-3 max-w-md text-sm/6 text-(--ink-soft)">
          Ainda não existe um dossiê de compra para confirmar. Volte à loja e
          selecione uma box para iniciar o checkout.
        </p>
        <Button
          asChild
          className={cn(
            fontMono,
            'mt-7 h-11 rounded-[9px] bg-(--red) px-5 text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)',
          )}
        >
          <Link href="/loja">
            Voltar à loja
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </DesignPageShell>
  )
}

function StatusPanel({
  orderNumber,
  orderStatus,
  paymentStatus,
  createdAt,
  pixPending,
}: {
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  createdAt: string
  pixPending: boolean
}) {
  const statuses = [
    ['Pedido', orderNumber],
    ['Status', orderStatus],
    ['Pagamento', paymentStatus],
    ['Registro', createdAt],
  ]

  return (
    <section
      className={cn(
        dossierCardSurface,
        warmShadowClass,
        'relative isolate overflow-hidden p-5 sm:p-6',
      )}
      aria-busy={pixPending || undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-[10px] text-[#fbf9f6]',
              pixPending ? 'bg-(--amber)' : 'bg-(--teal)',
            )}
          >
            {pixPending ? (
              <IconClock className="size-6" aria-hidden />
            ) : (
              <IconCheck className="size-6" />
            )}
          </span>
          <div>
            <p
              className={cn(
                fontMono,
                'flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase',
                pixPending ? 'text-(--amber' : 'text-(--red)',
              )}
            >
              {pixPending ? (
                <>
                  <span className="relative flex size-2" aria-hidden>
                    <span className="absolute inset-0 animate-ping rounded-full bg-(--amber) opacity-55 motion-reduce:animate-none" />
                    <span className="relative size-2 rounded-full bg-(--amber)" />
                  </span>
                  Cobrança aguardando ação
                </>
              ) : (
                'Confirmação emitida'
              )}
            </p>
            <h2
              className={cn(
                fontHeading,
                'mt-2 text-2xl font-semibold text-(--ink)',
              )}
            >
              {pixPending ? 'Aguardando pagamento Pix' : 'Pagamento validado'}
            </h2>
            <p className="mt-2 max-w-xl text-sm/6 text-(--ink-soft)">
              {pixPending
                ? 'Use o painel abaixo para pagar. A confirmação atualiza automaticamente após a compensação.'
                : 'Seu pedido entrou na fila de preparação. A equipe do clube vai acompanhar cobrança, separação e envio pelo mesmo registro.'}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4"
          >
            <dt
              className={cn(
                fontMono,
                'text-[0.66rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
              )}
            >
              {label}
            </dt>
            <dd className="mt-2 text-sm font-medium text-(--ink)">{value}</dd>
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
    <article className="flex flex-col gap-4 rounded-[12px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4 sm:flex-row sm:items-center">
      <Link
        href={`/loja/${item.productSlug}`}
        className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) sm:size-24"
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
          <div className="flex size-full items-center justify-center text-(--red)/50">
            <IconPackage className="size-6" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            fontMono,
            'text-[0.66rem] tracking-[0.14em] text-(--ink-mute) uppercase',
          )}
        >
          EVID-{String(item.quantity).padStart(2, '0')} ·{' '}
          {item.productType === 'box' ? 'Box' : 'Item'}
        </p>
        <h3
          className={cn(
            fontHeading,
            'mt-1 text-base font-semibold text-(--ink)',
          )}
        >
          <Link
            href={`/loja/${item.productSlug}`}
            className="transition hover:text-(--red)"
          >
            {item.productName}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-(--ink-soft)">
          {item.quantity} × {formatCurrency(item.unitPrice)}
        </p>
      </div>

      <p className={cn(fontHeading, 'text-lg font-semibold text-(--ink)')}>
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
    <article className={cn(dossierCardSurface, warmShadowClass, 'p-5')}>
      <div className="flex items-center gap-3 text-(--red)">
        <span className="flex size-9 items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft)">
          {icon}
        </span>
        <p
          className={cn(
            fontMono,
            'text-xs font-semibold tracking-[0.16em] uppercase',
          )}
        >
          {label}
        </p>
      </div>
      <p className="mt-4 text-sm/6 text-(--ink-soft)">{text}</p>
    </article>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium text-(--ink)">{value}</span>
    </div>
  )
}

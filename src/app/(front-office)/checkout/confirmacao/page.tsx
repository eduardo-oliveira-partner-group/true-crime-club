'use client'

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
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { Button } from '@/src/components/ui/button'
import { ConfirmationSkeleton } from '@/src/components/ui/page-loading-skeletons'
import { useCheckoutPaymentWs } from '@/src/hooks/use-checkout-payment-ws'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  sectionFrame,
  warmShadowClass,
} from '@/src/lib/design/classes'
import { getOrderById, listOrders } from '@/src/lib/domain/repositories'
import type { CartItem, Order, Payment } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDateTime,
  formatOrderStatus,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { getProductImage } from '@/src/lib/product-images'
import { cn } from '@/src/lib/utils'

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

  const refreshOrder = useCallback(async (orderId: string) => {
    const updated = await getOrderById(orderId)
    if (!updated) return null
    setOrder(updated)
    if (updated.paymentStatus === 'paid') {
      setPixPayment(null)
      setPixQrImage(null)
      setAwaitingPixConfirmation(false)
    }
    return updated
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem('checkout:lastPayment')
    if (!raw) return
    try {
      const payment = JSON.parse(raw) as {
        metodo?: string
        pixQrCode?: string
        pixQrCodeBase64?: string
        pixExpiraEm?: string
      }
      if (payment.metodo === 'pix' && payment.pixQrCode) {
        setAwaitingPixConfirmation(true)
        setPixPayment({
          pixQrCode: payment.pixQrCode,
          pixExpiresAt: payment.pixExpiraEm,
        })
        if (payment.pixQrCodeBase64) {
          setPixQrImage(`data:image/png;base64,${payment.pixQrCodeBase64}`)
        }
      }
    } catch {
      // ignora payload invalido
    } finally {
      sessionStorage.removeItem('checkout:lastPayment')
    }
  }, [])

  useEffect(() => {
    const id = searchParams.get('pedido')
    const request = id
      ? getOrderById(id)
      : listOrders().then((orders) => orders[0] ?? null)
    request
      .then((loaded) => {
        setOrder(loaded)
        if (loaded?.paymentStatus === 'paid') {
          setAwaitingPixConfirmation(false)
          setPixPayment(null)
          setPixQrImage(null)
        }
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [searchParams])

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
              Pedido confirmado
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
                  'inline-flex w-fit items-center gap-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) px-3 py-2 text-xs font-semibold tracking-[0.14em] text-(--red) uppercase',
                )}
              >
                <IconShieldCheck className="size-4" />
                Sessão registrada
              </div>
              <h1
                className={cn(
                  fontHeading,
                  'max-w-3xl text-3xl/tight font-semibold tracking-[-0.015em] text-balance text-(--ink) sm:text-4xl lg:text-5xl',
                )}
              >
                O dossiê do seu pedido foi lacrado.
              </h1>
              <p className="max-w-2xl text-sm/6 text-(--ink-soft) sm:text-base/7">
                Recebemos o pedido {order.orderNumber}. A confirmação foi
                registrada e os próximos passos ficam disponíveis na área do
                cliente.
              </p>
            </div>

            <div className={cn(dossierCardSurface, warmShadowClass, 'p-5')}>
              <p
                className={cn(
                  fontMono,
                  'text-[0.66rem] font-semibold tracking-[0.16em] text-(--red) uppercase',
                )}
              >
                Total confirmado
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
            <StatusPanel
              orderNumber={order.orderNumber}
              orderStatus={formatOrderStatus(order.status)}
              paymentStatus={formatPaymentStatus(order.paymentStatus)}
              createdAt={formatDateTime(order.createdAt)}
              pixPending={
                Boolean(pixPayment) || order.paymentStatus === 'pending'
              }
            />

            {pixPayment ? (
              <PixPaymentPanel payment={pixPayment} qrImage={pixQrImage} />
            ) : null}

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
              <div className="flex items-center justify-between border-b border-[rgba(33,28,24,0.15)] pb-4">
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
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-(--teal) text-[#fbf9f6]">
            <IconCheck className="size-6" />
          </span>
          <div>
            <p
              className={cn(
                fontMono,
                'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
              )}
            >
              {pixPending ? 'Cobrança aguardando ação' : 'Confirmação emitida'}
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
                ? 'Escaneie o QR Code ou copie o código Pix para confirmar a cobrança. O pedido será preparado após a compensação.'
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

function PixPaymentPanel({
  payment,
  qrImage,
}: {
  payment: Pick<Payment, 'pixQrCode' | 'pixExpiresAt'>
  qrImage: string | null
}) {
  const [copyFeedback, setCopyFeedback] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const pixCode = payment.pixQrCode ?? ''

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopyFeedback('success')
    } catch {
      setCopyFeedback('error')
    }

    window.setTimeout(() => setCopyFeedback('idle'), 2500)
  }

  return (
    <section
      className={cn(
        dossierCardSurface,
        warmShadowClass,
        'overflow-hidden border-[#d7b56d]/40 p-5 sm:p-6',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d7b56d]/30 pb-4">
        <div>
          <p
            className={cn(
              fontMono,
              'text-xs font-semibold tracking-[0.16em] text-(--red) uppercase',
            )}
          >
            Evidência de cobrança
          </p>
          <h2
            className={cn(
              fontHeading,
              'mt-1 text-xl font-semibold text-(--ink)',
            )}
          >
            Pague via Pix para concluir
          </h2>
        </div>
        <span
          className={cn(
            fontMono,
            'rounded-full bg-[#d7b56d]/15 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.13em] text-(--ink) uppercase',
          )}
        >
          Pendente
        </span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-center">
        {qrImage ? (
          <div className="rounded-[12px] border border-[rgba(33,28,24,0.15)] bg-[#fbf9f6] p-3 shadow-[0_10px_24px_-16px_rgba(33,28,24,0.5)]">
            <Image
              alt="QR Code para pagamento Pix"
              height={160}
              src={qrImage}
              unoptimized
              width={160}
            />
          </div>
        ) : null}
        <div className="space-y-3 text-sm/6 text-(--ink-soft)">
          <p>
            Use o app do seu banco para escanear o QR Code e concluir a
            cobrança.
          </p>
          {payment.pixExpiresAt ? (
            <p className="rounded-[9px] border border-[rgba(33,28,24,0.12)] bg-(--paper-soft) px-3 py-2 text-xs/5">
              Expira em {formatDateTime(payment.pixExpiresAt)}.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 border-t border-[rgba(33,28,24,0.12)] pt-4">
        <p
          className={cn(
            fontMono,
            'text-[0.62rem] font-semibold tracking-[0.14em] text-(--ink-mute) uppercase',
          )}
        >
          Código Pix copia e cola
        </p>
        <div className="mt-2 overflow-hidden rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft)">
          <code className="block p-3 text-xs/5 break-all text-(--ink)">
            {pixCode}
          </code>
          <div className="border-t border-[rgba(33,28,24,0.12)] px-2 py-1">
            <Button
              type="button"
              variant="link"
              disabled={!pixCode}
              onClick={() => void handleCopyPixCode()}
              className={cn(
                fontMono,
                'group h-10 min-h-10 gap-2 rounded-[8px] px-2.5 text-xs font-semibold tracking-[0.04em] no-underline [transition:scale_0.18s_cubic-bezier(0.22,1,0.36,1),background-color_0.2s_ease,color_0.2s_ease] hover:bg-(--red)/10 hover:text-(--red-deep) hover:no-underline focus-visible:ring-2 focus-visible:ring-(--red)/25 active:scale-[0.98] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100',
                copyFeedback === 'success'
                  ? 'bg-(--teal)/10 text-(--teal-deep) hover:bg-(--teal)/15 hover:text-(--teal-deep)'
                  : 'text-(--red)',
              )}
            >
              {copyFeedback === 'success' ? (
                <IconCheck className="size-4 animate-in duration-200 fade-in-0 zoom-in-75 motion-reduce:animate-none" />
              ) : (
                <IconClipboardText className="size-4 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none" />
              )}
              <span
                className={cn(
                  copyFeedback === 'success'
                    ? 'animate-in duration-200 fade-in-0 slide-in-from-left-1 motion-reduce:animate-none'
                    : undefined,
                )}
              >
                {copyFeedback === 'success'
                  ? 'Código copiado'
                  : 'Copiar código'}
              </span>
            </Button>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {copyFeedback === 'success'
            ? 'Código Pix copiado para a área de transferência.'
            : copyFeedback === 'error'
              ? 'Não foi possível copiar o código Pix. Selecione o código e copie manualmente.'
              : ''}
        </p>
        {copyFeedback === 'error' ? (
          <p className="mt-2 text-xs/5 text-(--red)">
            Não foi possível copiar. Selecione o código e copie manualmente.
          </p>
        ) : null}
      </div>
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

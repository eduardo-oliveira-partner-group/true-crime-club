'use client'

import {
  IconAlertCircle,
  IconArrowRight,
  IconCalendar,
  IconCreditCard,
  IconDownload,
  IconFileInvoice,
  IconReceipt2,
  IconRefresh,
} from '@tabler/icons-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { CustomerListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
  transitionCardHover,
} from '@/src/lib/design/classes'
import {
  listInvoices,
  listPayments,
  renewPixPayment,
} from '@/src/lib/domain/repositories'
import type { Invoice, Payment, PaymentStatus } from '@/src/lib/domain/types'
import {
  formatCurrency,
  formatDate,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const paymentTone: Record<PaymentStatus, string> = {
  paid: 'border-(--teal)/30 bg-(--teal)/10 text-(--teal-deep)',
  pending: 'border-(--amber)/35 bg-(--amber)/12 text-[#8a5c00]',
  refused: 'border-(--red)/25 bg-(--red)/8 text-(--red)',
  expired: 'border-(--ink)/15 bg-(--ink)/5 text-(--ink-mute)',
  refunded: 'border-(--purple)/30 bg-(--purple)/10 text-(--purple-deep)',
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        `inline-flex rounded-[2px] border px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase ${fontMono}`,
        paymentTone[status],
      )}
    >
      {formatPaymentStatus(status)}
    </span>
  )
}

function PaymentItem({ payment }: { payment: Payment }) {
  const methodLabel = payment.method === 'pix' ? 'Pix' : 'Cartão de crédito'
  const dateLabel = payment.paidAt ? 'Pago em' : 'Vencimento'
  const referenceDate = payment.paidAt ?? payment.dueDate

  return (
    <article
      className={cn(
        `${dossierCardSurface} ${cardShadowBase} p-5`,
        `${transitionCardHover} hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-18px_rgba(33,28,24,0.3),inset_0_0_0_1px_rgba(255,255,255,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0`,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <PaymentStatusBadge status={payment.status} />
            <span className="inline-flex items-center gap-1.5 text-xs text-(--ink-mute)">
              <IconCreditCard className="size-3.5" />
              {methodLabel}
            </span>
          </div>
          <h3
            className={`mt-4 text-lg/tight font-semibold tracking-[-0.02em] text-(--ink) ${fontHeading}`}
          >
            Cobrança registrada
          </h3>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-(--ink-mute)">
            <IconCalendar className="size-3.5 shrink-0" />
            {dateLabel} em {formatDate(referenceDate)}
          </p>
        </div>

        <div className="flex shrink-0 items-end justify-between gap-5 border-t border-dashed border-(--ink)/12 pt-4 sm:block sm:min-w-36 sm:border-t-0 sm:pt-0 sm:text-right">
          <div>
            <p
              className={`text-[10px] tracking-[0.14em] text-(--ink-mute) uppercase ${fontMono}`}
            >
              Valor
            </p>
            <p
              className={`mt-1 text-xl font-bold tracking-tight text-(--red) ${fontHeading}`}
            >
              {formatCurrency(payment.amount)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

function InvoiceItem({ invoice }: { invoice: Invoice }) {
  const receiptUrl = invoice.downloadUrl ?? invoice.receiptUrl

  return (
    <article className="rounded-[14px] border border-(--ink)/12 bg-(--card) p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-(--teal-deep)">
            <IconFileInvoice className="size-4 shrink-0" />
            <span
              className={`truncate text-[11px] font-bold tracking-[0.12em] uppercase ${fontMono}`}
            >
              {invoice.number}
            </span>
          </div>
          <p className="mt-3 text-sm text-(--ink-mute)">
            Emitida em {formatDate(invoice.issuedAt)}
          </p>
        </div>
        <p
          className={`text-xl font-bold tracking-tight text-(--ink) sm:text-right ${fontHeading}`}
        >
          {formatCurrency(invoice.amount)}
        </p>
      </div>

      <div className="mt-4 border-t border-dashed border-(--ink)/12 pt-3">
        {receiptUrl ? (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noreferrer"
            className={`group inline-flex min-h-11 items-center gap-2 rounded-[9px] px-2 text-sm font-semibold text-(--teal-deep) ${transitionBgColor} hover:bg-(--teal)/10 hover:text-(--teal-deep) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--red)`}
          >
            <IconDownload className="size-4" />
            Baixar comprovante
            <IconArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </a>
        ) : (
          <p className="text-xs/5 text-(--ink-mute)">
            Comprovante ainda não disponível.
          </p>
        )}
      </div>
    </article>
  )
}

function FinanceEmpty({ type }: { type: 'payments' | 'invoices' }) {
  const isPayments = type === 'payments'

  return (
    <Empty className="rounded-[14px] border border-dashed border-(--ink)/15 bg-(--paper-soft) p-7 sm:p-8">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className={
            isPayments
              ? 'bg-(--amber)/15 text-(--amber)'
              : 'bg-(--teal)/12 text-(--teal-deep)'
          }
        >
          {isPayments ? <IconReceipt2 /> : <IconFileInvoice />}
        </EmptyMedia>
        <EmptyTitle className="text-lg">
          {isPayments
            ? 'Nenhuma cobrança registrada'
            : 'Nenhum comprovante disponível'}
        </EmptyTitle>
        <EmptyDescription>
          {isPayments
            ? 'Quando houver uma nova cobrança, ela será adicionada a este arquivo.'
            : 'Os comprovantes emitidos para suas cobranças aparecerão aqui.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default function FinanceiroPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [pixError, setPixError] = useState<string | null>(null)
  const [renewingPix, setRenewingPix] = useState(false)

  const reload = useCallback(async () => {
    const [nextPayments, nextInvoices] = await Promise.all([
      listPayments(),
      listInvoices(),
    ])
    setPayments(nextPayments)
    setInvoices(nextInvoices)
    setLoadError(false)
  }, [])

  const loadFinanceData = useCallback(async () => {
    setLoading(true)
    try {
      await reload()
    } catch {
      setPayments([])
      setInvoices([])
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [reload])

  useEffect(() => {
    void loadFinanceData()
  }, [loadFinanceData])

  const handleRenewPix = async (paymentId: string) => {
    setRenewingPix(true)
    setPixError(null)
    try {
      await renewPixPayment(paymentId)
      await reload()
    } catch {
      setPixError('Não foi possível renovar o Pix agora. Tente novamente.')
    } finally {
      setRenewingPix(false)
    }
  }

  const pendingPix = payments.find(
    (payment) => payment.method === 'pix' && payment.status === 'pending',
  )
  const refused = payments.find((payment) => payment.status === 'refused')

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Visão financeira
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-b border-dashed border-(--ink)/12 pb-5">
        <div>
          <h1
            className={`text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
          >
            Financeiro
          </h1>
          <p className="mt-2 max-w-xl text-sm/6 text-(--ink-mute)">
            Acompanhe cobranças, pagamentos e comprovantes da sua conta.
          </p>
        </div>
        {!loading && !loadError ? (
          <span
            className={`rounded-[2px] border border-(--teal)/25 bg-(--teal)/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-(--teal-deep) uppercase ${fontMono}`}
          >
            Arquivo atualizado
          </span>
        ) : null}
      </div>

      {loadError ? (
        <div className="mt-6 rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-5 text-sm/6 text-(--ink-soft)">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-(--red)/10 text-(--red)">
              <IconAlertCircle className="size-4" />
            </span>
            <div>
              <p
                className={`text-sm font-semibold text-(--ink) ${fontHeading}`}
              >
                Não foi possível abrir o arquivo financeiro
              </p>
              <p className="mt-1">
                Verifique sua conexão e tente carregar os dados novamente.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadFinanceData()}
                className={`mt-4 rounded-[9px] border-(--red)/30 text-(--red) ${transitionBgColor} hover:bg-(--red)/8 hover:text-(--red-deep)`}
              >
                <IconRefresh className="size-3.5" />
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {refused || pendingPix ? (
        <section
          className="mt-6 grid gap-4 lg:grid-cols-2"
          aria-label="Pendências financeiras"
        >
          {refused ? (
            <div className="rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-5 text-sm/6 text-(--ink-soft)">
              <div className="border-b border-dashed border-(--red)/20 pb-3">
                <p
                  className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
                >
                  Pagamento recusado
                </p>
              </div>
              <div className="mt-4">
                <p>
                  {refused.refusalReason ??
                    'Verifique seu meio de pagamento para regularizar a cobrança.'}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`mt-4 rounded-[9px] border-(--red)/30 text-(--red) ${transitionBgColor} hover:bg-(--red)/8 hover:text-(--red-deep)`}
                >
                  <Link href="/cliente/cartoes?acao=adicionar">
                    Gerenciar cartões
                    <IconArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : null}

          {pendingPix ? (
            <div className={`${dossierCardSurface} ${cardShadowBase} p-5`}>
              <div className="border-b border-dashed border-(--ink)/10 pb-3">
                <p
                  className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
                >
                  Pix pendente
                </p>
              </div>
              <div className="mt-4 text-sm/6 text-(--ink-mute)">
                <p>
                  Vencimento em{' '}
                  <span className="font-medium text-(--ink-soft)">
                    {formatDate(pendingPix.dueDate)}
                  </span>
                </p>
                {pixError ? (
                  <p className="mt-2 text-sm text-(--red)" role="alert">
                    {pixError}
                  </p>
                ) : null}
                <Button
                  type="button"
                  onClick={() => void handleRenewPix(pendingPix.id)}
                  size="sm"
                  disabled={renewingPix}
                  className="mt-4 rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep) disabled:opacity-60"
                >
                  <IconRefresh className="size-3.5" />
                  {renewingPix ? 'Renovando Pix…' : 'Renovar Pix'}
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {loading ? (
        <div className="mt-8">
          <CustomerListSkeleton rows={3} />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] xl:items-start">
          <section aria-labelledby="payments-heading">
            <div className="border-b border-dashed border-(--ink)/12 pb-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.14em] text-(--red) uppercase ${fontMono}`}
                  >
                    Lançamentos
                  </p>
                  <h2
                    id="payments-heading"
                    className={`mt-1 text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
                  >
                    Cobranças
                  </h2>
                </div>
                <p className="text-xs text-(--ink-mute)">
                  {payments.length}{' '}
                  {payments.length === 1 ? 'registro' : 'registros'}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <PaymentItem key={payment.id} payment={payment} />
                ))
              ) : (
                <FinanceEmpty type="payments" />
              )}
            </div>
          </section>

          <section aria-labelledby="invoices-heading">
            <div className="border-b border-dashed border-(--ink)/12 pb-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p
                    className={`text-[10px] font-bold tracking-[0.14em] text-(--teal-deep) uppercase ${fontMono}`}
                  >
                    Documentos
                  </p>
                  <h2
                    id="invoices-heading"
                    className={`mt-1 text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
                  >
                    Faturas e recibos
                  </h2>
                </div>
                <p className="text-xs text-(--ink-mute)">
                  {invoices.length}{' '}
                  {invoices.length === 1 ? 'arquivo' : 'arquivos'}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <InvoiceItem key={invoice.id} invoice={invoice} />
                ))
              ) : (
                <FinanceEmpty type="invoices" />
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

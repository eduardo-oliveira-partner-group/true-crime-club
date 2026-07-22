'use client'

import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  cardShadowBase,
  dossierCardSurface,
  fontHeading,
  fontMono,
  transitionBgColor,
} from '@/src/lib/design/classes'
import {
  listInvoices,
  listPayments,
  renewPixPayment,
} from '@/src/lib/domain/repositories'
import {
  formatCurrency,
  formatDate,
  formatPaymentStatus,
} from '@/src/lib/formatters'
import { cn } from '@/src/lib/utils'

const paymentTone: Record<string, string> = {
  paid: 'text-(--teal)',
  pending: 'text-(--amber)',
  refused: 'text-(--red)',
  expired: 'text-(--ink-mute)',
}

export default function FinanceiroPage() {
  const [payments, setPayments] = useState<
    Awaited<ReturnType<typeof listPayments>>
  >([])
  const [invoices, setInvoices] = useState<
    Awaited<ReturnType<typeof listInvoices>>
  >([])
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const [nextPayments, nextInvoices] = await Promise.all([
      listPayments(),
      listInvoices(),
    ])
    setPayments(nextPayments)
    setInvoices(nextInvoices)
  }

  useEffect(() => {
    reload()
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }, [])
  const pendingPix = payments.find(
    (p) => p.method === 'pix' && p.status === 'pending',
  )
  const refused = payments.find((p) => p.status === 'refused')

  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Financeiro
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Histórico de cobranças, faturas e recibos.
      </p>

      {refused ? (
        <div className="mt-6 rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-5 text-sm/6 text-(--ink-soft)">
          <p
            className={`text-xs font-semibold tracking-[0.2em] text-(--red) uppercase ${fontMono}`}
          >
            Pagamento recusado
          </p>
          <p className="mt-2">
            {refused.refusalReason ?? 'Verifique seu meio de pagamento.'}
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
      ) : null}

      {pendingPix ? (
        <div
          className={`mt-6 ${dossierCardSurface} ${cardShadowBase} p-5 text-sm/6 text-(--ink-mute)`}
        >
          <div className="border-b border-dashed border-(--ink)/10 pb-3">
            <h3
              className={`text-sm font-semibold tracking-wide text-(--ink) uppercase ${fontHeading}`}
            >
              Pix pendente
            </h3>
          </div>
          <div className="mt-4">
            <p>
              Vencimento em{' '}
              <span className="text-(--ink-soft)">
                {formatDate(pendingPix.dueDate)}
              </span>
            </p>
            <div className="mt-4">
              <Button
                type="button"
                onClick={() => renewPixPayment(pendingPix.id).then(reload)}
                size="sm"
                className="rounded-[9px] bg-(--red) text-[#fbf9f6] hover:bg-(--red-deep)"
              >
                Renovar Pix
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-8">
        {loading ? (
          <p className="mb-4 text-sm text-(--ink-mute)">
            Carregando dados financeiros…
          </p>
        ) : null}
        <h2
          className={`text-xs font-semibold tracking-[0.2em] text-(--red) uppercase ${fontMono}`}
        >
          Cobranças
        </h2>
        <div className="mt-4 space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-(--ink)/10 bg-(--card) p-3 text-sm"
            >
              <span className="text-(--ink-soft)">
                {formatDate(payment.dueDate)}
              </span>
              <span className={`font-semibold text-(--red) ${fontHeading}`}>
                {formatCurrency(payment.amount)}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold tracking-wide uppercase',
                  paymentTone[payment.status] ?? 'text-(--ink-mute)',
                )}
              >
                {formatPaymentStatus(payment.status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2
          className={`text-xs font-semibold tracking-[0.2em] text-(--red) uppercase ${fontMono}`}
        >
          Faturas e recibos
        </h2>
        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-(--ink)/10 bg-(--card) p-3 text-sm"
            >
              <span
                className={`text-xs tracking-[0.12em] text-(--ink-soft) uppercase ${fontMono}`}
              >
                {invoice.number}
              </span>
              <span className={`font-semibold text-(--red) ${fontHeading}`}>
                {formatCurrency(invoice.amount)}
              </span>
              {invoice.downloadUrl ? (
                <span className="text-(--teal)">{invoice.downloadUrl}</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

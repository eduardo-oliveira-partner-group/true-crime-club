import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
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

export default function FinanceiroPage() {
  const payments = listPayments()
  const invoices = listInvoices()
  const pendingPix = payments.find(
    (p) => p.method === 'pix' && p.status === 'pending',
  )
  const refused = payments.find((p) => p.status === 'refused')

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Financeiro</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Histórico de cobranças, faturas e recibos mockados.
      </p>

      {refused ? (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          Pagamento recusado:{' '}
          {refused.refusalReason ?? 'Verifique seu meio de pagamento.'}
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link href="/cliente/financeiro/atualizar-cartao">
              Atualizar cartão
            </Link>
          </Button>
        </div>
      ) : null}

      {pendingPix ? (
        <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-sm">
          Pix pendente — vencimento em {formatDate(pendingPix.dueDate)}
          <form
            className="mt-3"
            action={async () => {
              'use server'
              renewPixPayment(pendingPix.id)
            }}
          >
            <Button type="submit" size="sm" variant="secondary">
              Renovar Pix (mock)
            </Button>
          </form>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="font-medium">Cobranças</h2>
        <div className="mt-4 space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <span>{formatDate(payment.dueDate)}</span>
              <span>{formatCurrency(payment.amount)}</span>
              <span className="text-muted-foreground">
                {formatPaymentStatus(payment.status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-medium">Faturas e recibos</h2>
        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
            >
              <span>{invoice.number}</span>
              <span>{formatCurrency(invoice.amount)}</span>
              {invoice.downloadUrl ? (
                <span className="text-primary">{invoice.downloadUrl}</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

import { IconArrowRight } from '@tabler/icons-react'
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
import { cn } from '@/src/lib/utils'

const paymentTone: Record<string, string> = {
  paid: 'text-[#d7b56d]',
  pending: 'text-[#ffb0a5]',
  refused: 'text-[#ffb0a5]',
  expired: 'text-[#bfb4a3]',
}

export default async function FinanceiroPage() {
  const payments = await listPayments()
  const invoices = await listInvoices()
  const pendingPix = payments.find(
    (p) => p.method === 'pix' && p.status === 'pending',
  )
  const refused = payments.find((p) => p.status === 'refused')

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Financeiro
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Histórico de cobranças, faturas e recibos mockados.
      </p>

      {refused ? (
        <div className="mt-6 border border-[#d84132]/45 bg-[#d84132]/12 p-5 text-sm/6 text-[#f0e8dd]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#ffb0a5] uppercase">
            Pagamento recusado
          </p>
          <p className="mt-2">
            {refused.refusalReason ?? 'Verifique seu meio de pagamento.'}
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 border-[#d7b56d]/45 text-[#d7b56d] hover:bg-[#d7b56d]/12 hover:text-[#fffaf0]"
          >
            <Link href="/design-sugerido/cliente/financeiro/atualizar-cartao">
              Atualizar cartão
              <IconArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      ) : null}

      {pendingPix ? (
        <div className="mt-6 border border-[#fffaf0]/12 bg-[#171211] p-5 text-sm/6 text-[#d7c9b5]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Pix pendente
          </p>
          <p className="mt-2">
            Vencimento em{' '}
            <span className="text-[#f0e8dd]">
              {formatDate(pendingPix.dueDate)}
            </span>
          </p>
          <form
            className="mt-4"
            action={async () => {
              'use server'
              await renewPixPayment(pendingPix.id)
            }}
          >
            <Button
              type="submit"
              size="sm"
              className="bg-[#d7b56d] text-[#171211] hover:bg-[#c69f54]"
            >
              Renovar Pix (mock)
            </Button>
          </form>
        </div>
      ) : null}

      <section className="mt-8">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
          Cobranças
        </h2>
        <div className="mt-4 space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-[#fffaf0]/10 bg-[#171211] p-3 text-sm"
            >
              <span className="text-[#f0e8dd]">
                {formatDate(payment.dueDate)}
              </span>
              <span className="font-heading font-semibold text-[#d7b56d]">
                {formatCurrency(payment.amount)}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold tracking-wide uppercase',
                  paymentTone[payment.status] ?? 'text-[#c8bdad]',
                )}
              >
                {formatPaymentStatus(payment.status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
          Faturas e recibos
        </h2>
        <div className="mt-4 space-y-2">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-[#fffaf0]/10 bg-[#171211] p-3 text-sm"
            >
              <span className="font-mono text-xs tracking-[0.12em] text-[#f0e8dd] uppercase">
                {invoice.number}
              </span>
              <span className="font-heading font-semibold text-[#d7b56d]">
                {formatCurrency(invoice.amount)}
              </span>
              {invoice.downloadUrl ? (
                <span className="text-[#d7b56d]">{invoice.downloadUrl}</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

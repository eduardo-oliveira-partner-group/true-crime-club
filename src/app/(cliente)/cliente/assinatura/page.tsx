import { IconArrowRight } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import {
  formatCurrency,
  formatDate,
  formatSubscriptionStatus,
} from '@/src/lib/formatters'

export default async function AssinaturaClientePage() {
  let subscription = null
  try {
    subscription = await apiClient.customer.getSubscription()
  } catch {}

  if (!subscription) {
    return (
      <div className="border border-dashed border-[#fffaf0]/18 bg-[#171211]/60 p-8 text-center">
        <p className="font-heading text-lg font-semibold text-[#f0e8dd]">
          Nenhuma assinatura encontrada
        </p>
        <p className="mt-2 text-sm text-[#c8bdad]">
          O arquivo desta conta ainda não foi aberto.
        </p>
        <Button
          asChild
          className="mt-5 bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
        >
          <Link href="/assinatura">
            Conhecer planos
            <IconArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
        Arquivo do assinante
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Minha assinatura
      </h1>

      <div className="mt-6 space-y-4">
        <div className="border border-[#b98542]/45 bg-[#171211] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.34)]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Plano ativo
          </p>
          <p className="mt-2 font-heading text-xl font-bold text-[#fffaf0]">
            {subscription.planName}
          </p>
          <div className="mt-4 flex items-center gap-3 border-t border-[#fffaf0]/10 pt-3">
            <span className="text-xs tracking-wide text-[#c8bdad] uppercase">
              Status
            </span>
            <span className="text-sm font-semibold text-[#d7b56d]">
              {formatSubscriptionStatus(subscription.status)}
            </span>
          </div>
        </div>

        <div className="border border-[#fffaf0]/12 bg-[#171211] p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
            Próxima cobrança
          </p>
          <p className="mt-2 font-heading text-lg font-semibold text-[#fffaf0]">
            {formatDate(subscription.nextBillingDate)}
          </p>
          <p className="mt-1 font-heading text-base font-semibold text-[#d7b56d]">
            {formatCurrency(subscription.nextBillingAmount)}
          </p>
        </div>

        {subscription.currentCycleBoxName ? (
          <div className="border border-[#fffaf0]/12 bg-[#171211] p-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d7b56d] uppercase">
              Box do ciclo atual
            </p>
            <p className="mt-2 font-heading text-lg font-semibold text-[#fffaf0]">
              {subscription.currentCycleBoxName}
            </p>
          </div>
        ) : null}

        {subscription.canCancel ? (
          <Button
            asChild
            variant="outline"
            className="border-[#d84132]/45 text-[#ffb0a5] hover:bg-[#d84132]/12 hover:text-[#ffb0a5]"
          >
            <Link href="/cliente/assinatura/cancelar">
              Cancelar assinatura
              <IconArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

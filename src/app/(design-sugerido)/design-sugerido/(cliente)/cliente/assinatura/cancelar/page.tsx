import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import {
  cancelSubscription,
  getSubscription,
} from '@/src/lib/domain/repositories'
import { formatSubscriptionStatus } from '@/src/lib/formatters'

export default function CancelarAssinaturaPage() {
  const subscription = getSubscription()

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className="mb-6 h-auto gap-1 p-0 text-[#c8bdad] hover:bg-transparent hover:text-[#d7b56d]"
      >
        <Link href="/design-sugerido/cliente/assinatura">
          <IconArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <p className="text-xs font-semibold tracking-[0.24em] text-[#d84132] uppercase">
        Ação irreversível
      </p>
      <h1 className="mt-2 font-heading text-2xl font-black tracking-tight text-[#fffaf0] uppercase">
        Cancelar assinatura
      </h1>
      <p className="mt-2 text-sm/6 text-[#d7c9b5]">
        Simulação de cancelamento — nenhuma ação real será executada.
      </p>

      {subscription ? (
        <div className="mt-5 border border-[#d84132]/40 bg-[#d84132]/10 p-5 text-sm">
          <p className="text-[#f0e8dd]">
            Plano atual:{' '}
            <span className="font-semibold text-[#fffaf0]">
              {subscription.planName}
            </span>{' '}
            ({formatSubscriptionStatus(subscription.status)})
          </p>
        </div>
      ) : null}

      <form
        className="mt-6"
        action={async () => {
          'use server'
          cancelSubscription()
        }}
      >
        <Button
          type="submit"
          className="bg-[#d84132] text-white shadow-[0_0_26px_rgba(216,65,50,0.35)] hover:bg-[#b93227]"
        >
          Confirmar cancelamento (mock)
        </Button>
      </form>
    </div>
  )
}

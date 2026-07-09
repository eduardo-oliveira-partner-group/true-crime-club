import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { fontHeading, fontMono } from '@/src/lib/design/classes'
import {
  cancelSubscription,
  getSubscription,
} from '@/src/lib/domain/repositories'
import { formatSubscriptionStatus } from '@/src/lib/formatters'

export default async function CancelarAssinaturaPage() {
  const subscription = await getSubscription()

  return (
    <div>
      <Button
        asChild
        variant="ghost"
        className={`mb-6 h-auto gap-1 rounded-[9px] p-0 text-(--ink-mute) hover:bg-transparent hover:text-(--red)`}
      >
        <Link href="/cliente/assinatura">
          <IconArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Ação irreversível
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Cancelar assinatura
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Simulação de cancelamento — nenhuma ação real será executada.
      </p>

      {subscription ? (
        <div className="mt-5 rounded-[14px] border border-(--red)/25 bg-(--red)/6 p-5 text-sm">
          <p className="text-(--ink-soft)">
            Plano atual:{' '}
            <span className={`font-semibold text-(--ink) ${fontHeading}`}>
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
          await cancelSubscription()
        }}
      >
        <Button
          type="submit"
          className="rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)"
        >
          Confirmar cancelamento
        </Button>
      </form>
    </div>
  )
}

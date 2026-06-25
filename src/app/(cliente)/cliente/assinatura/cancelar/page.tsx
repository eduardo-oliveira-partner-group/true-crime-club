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
      <Button asChild variant="ghost" className="mb-4 h-auto p-0">
        <Link href="/cliente/assinatura">← Voltar</Link>
      </Button>

      <h1 className="font-heading text-2xl font-semibold">
        Cancelar assinatura
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Simulação de cancelamento — nenhuma ação real será executada.
      </p>

      {subscription ? (
        <p className="mt-4 text-sm">
          Plano atual: {subscription.planName} (
          {formatSubscriptionStatus(subscription.status)})
        </p>
      ) : null}

      <form
        className="mt-6"
        action={async () => {
          'use server'
          cancelSubscription()
        }}
      >
        <Button type="submit" variant="destructive">
          Confirmar cancelamento (mock)
        </Button>
      </form>
    </div>
  )
}

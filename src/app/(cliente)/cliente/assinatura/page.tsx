import Link from 'next/link'

import { Button } from '@/src/components/ui/button'
import { getSubscription } from '@/src/lib/domain/repositories'
import {
  formatCurrency,
  formatDate,
  formatSubscriptionStatus,
} from '@/src/lib/formatters'

export default function AssinaturaClientePage() {
  const subscription = getSubscription()

  if (!subscription) {
    return (
      <p className="text-muted-foreground">Nenhuma assinatura encontrada.</p>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold">Minha assinatura</h1>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Plano</p>
          <p className="font-medium">{subscription.planName}</p>
          <p className="mt-2 text-sm">
            Status: {formatSubscriptionStatus(subscription.status)}
          </p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Próxima cobrança</p>
          <p className="font-medium">
            {formatDate(subscription.nextBillingDate)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(subscription.nextBillingAmount)}
          </p>
        </div>

        {subscription.currentCycleBoxName ? (
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Box do ciclo atual</p>
            <p className="font-medium">{subscription.currentCycleBoxName}</p>
          </div>
        ) : null}

        {subscription.canCancel ? (
          <Button asChild variant="outline">
            <Link href="/cliente/assinatura/cancelar">Cancelar assinatura</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

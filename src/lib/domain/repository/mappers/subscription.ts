import type { Subscription } from '../../types'

export type ApiSubscription = {
  id: string
  idCliente?: string
  idPlano: string
  nomePlano: string
  status?: string
  iniciadaEm: string
  proximaCobrancaEm: string
  valorProximaCobranca: number
  idCaixaCicloAtual?: string
  nomeCaixaCicloAtual?: string
  podeCancelar?: boolean
  podeReativar?: boolean
  canceladaEm?: string
}

export function mapApiSubscriptionToDomain(
  apiSub: ApiSubscription,
): Subscription {
  const statusMap: Record<string, Subscription['status']> = {
    ativa: 'active',
    pagamento_pendente: 'pending_payment',
    cancelada: 'cancelled',
    pausada: 'paused',
    vencida: 'past_due',
  }

  return {
    id: apiSub.id,
    customerId: apiSub.idCliente ?? '',
    planId: apiSub.idPlano,
    planName: apiSub.nomePlano,
    status: statusMap[apiSub.status ?? ''] ?? 'active',
    startedAt: apiSub.iniciadaEm,
    nextBillingDate: apiSub.proximaCobrancaEm,
    nextBillingAmount: apiSub.valorProximaCobranca,
    currentCycleBoxId: apiSub.idCaixaCicloAtual,
    currentCycleBoxName: apiSub.nomeCaixaCicloAtual,
    canCancel: apiSub.podeCancelar ?? false,
    canReactivate: apiSub.podeReativar ?? false,
    cancelledAt: apiSub.canceladaEm,
  }
}

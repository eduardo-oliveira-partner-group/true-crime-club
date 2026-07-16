import 'server-only'

import { cookies } from 'next/headers'

import { getApiBaseUrl, isExplicitLocalMockMode } from '@/src/lib/api-mode'
import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomerProfile as getCustomerProfileFromRepository,
  getOrderById as getOrderByIdFromRepository,
  getSubscription as getSubscriptionFromRepository,
  listCards as listCardsFromRepository,
  listOrders as listOrdersFromRepository,
  updateCustomerProfile as updateCustomerProfileFromRepository,
} from '@/src/lib/domain/repositories'
import type {
  Address,
  Customer,
  PaymentMethod,
  SubscriberPreferences,
  Subscription,
} from '@/src/lib/domain/types'

export { addCustomerAddress, deleteCustomerAddress }

type ProfilePayload = {
  cliente?: {
    id?: string
    nome?: string
    email?: string
    telefone?: string
    documento?: string
    preferencias?: {
      tamanhoCamiseta?: string
      tamanhoCalcado?: string
      observacoes?: string
    }
  }
  enderecos?: Array<{
    id?: string
    rotulo?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
    padrao?: boolean
  }>
  metodosPagamento?: Array<{
    id?: string
    tipo?: string
    rotulo?: string
    ultimosQuatro?: string | null
    bandeira?: string | null
    padrao?: boolean
  }>
}

type ApiOrderPayload = {
  id: string
  numeroPedido: string
  status?: string
  statusPagamento?: string
  subtotal: number
  frete: number
  desconto: number
  total: number
  criadoEm: string
  observacaoCicloCobranca?: string
  observacaoCicloEnvio?: string
  itens?: Array<{
    id: string
    idProduto: string
    identificadorProduto: string
    nomeProduto: string
    tipoProduto: string
    quantidade: number
    precoUnitario: number
    imagem?: string
  }>
}

type ApiCardPayload = {
  id?: string
  tipo?: string
  rotulo?: string
  ultimosQuatro?: string | null
  bandeira?: string | null
  padrao?: boolean
}

type ApiSubscriptionPayload = {
  id: string
  idCliente: string
  idPlano: string
  nomePlano: string
  status: string
  iniciadaEm: string
  proximaCobrancaEm: string
  valorProximaCobranca: number
  idCaixaCicloAtual?: string
  nomeCaixaCicloAtual?: string
  podeCancelar: boolean
  podeReativar: boolean
  canceladaEm?: string
}

function mapApiOrder(
  order: ApiOrderPayload,
): import('@/src/lib/domain/types').Order {
  const status = {
    pagamento_pendente: 'pending_payment',
    pago: 'paid',
    em_processamento: 'processing',
    aguardando_envio: 'awaiting_shipment',
    enviado: 'shipped',
    entregue: 'delivered',
    cancelado: 'cancelled',
  } as const
  const paymentStatus = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  } as const

  return {
    id: order.id,
    orderNumber: order.numeroPedido,
    customerId: '',
    items: (order.itens ?? []).map((item) => ({
      id: item.id,
      productId: item.idProduto,
      productSlug: item.identificadorProduto,
      productName: item.nomeProduto,
      productType: item.tipoProduto === 'caixa' ? 'box' : 'product',
      quantity: item.quantidade,
      unitPrice: item.precoUnitario,
      image: item.imagem,
    })),
    status: status[order.status as keyof typeof status] ?? 'paid',
    paymentStatus:
      paymentStatus[order.statusPagamento as keyof typeof paymentStatus] ??
      'paid',
    subtotal: order.subtotal,
    shipping: order.frete,
    discount: order.desconto,
    total: order.total,
    createdAt: order.criadoEm,
    billingCycleNote: order.observacaoCicloCobranca,
    shippingCycleNote: order.observacaoCicloEnvio,
  }
}

export async function getOrderById(
  id: string,
): Promise<import('@/src/lib/domain/types').Order | null> {
  if (isExplicitLocalMockMode()) return getOrderByIdFromRepository(id)

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) return null

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/cliente/pedidos/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  )

  if (response.status === 404) return null
  if (!response.ok) throw new Error('Não foi possível carregar o pedido.')

  return mapApiOrder((await response.json()) as ApiOrderPayload)
}

function mapApiSubscription(
  subscription: ApiSubscriptionPayload,
): Subscription {
  const statusMap: Record<string, Subscription['status']> = {
    ativa: 'active',
    pagamento_pendente: 'pending_payment',
    cancelada: 'cancelled',
    pausada: 'paused',
    vencida: 'past_due',
  }

  return {
    id: subscription.id,
    customerId: subscription.idCliente,
    planId: subscription.idPlano,
    planName: subscription.nomePlano,
    status: statusMap[subscription.status] ?? 'active',
    startedAt: subscription.iniciadaEm,
    nextBillingDate: subscription.proximaCobrancaEm,
    nextBillingAmount: subscription.valorProximaCobranca,
    currentCycleBoxId: subscription.idCaixaCicloAtual,
    currentCycleBoxName: subscription.nomeCaixaCicloAtual,
    canCancel: subscription.podeCancelar,
    canReactivate: subscription.podeReativar,
    cancelledAt: subscription.canceladaEm,
  }
}

export async function getSubscription(): Promise<Subscription | null> {
  if (isExplicitLocalMockMode()) return getSubscriptionFromRepository()

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) return null

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/cliente/assinatura`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  )

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error('Não foi possível carregar a assinatura.')
  }

  return mapApiSubscription((await response.json()) as ApiSubscriptionPayload)
}

export async function listOrders(): Promise<
  import('@/src/lib/domain/types').Order[]
> {
  if (isExplicitLocalMockMode()) return listOrdersFromRepository()

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) return []

  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, '')
  const headers = { Authorization: `Bearer ${token}` }
  const listResponse = await fetch(`${apiBaseUrl}/cliente/pedidos`, {
    headers,
    cache: 'no-store',
  })
  if (!listResponse.ok) return []

  const orders = (await listResponse.json()) as ApiOrderPayload[]
  return Promise.all(
    orders.map(async (order) => {
      const detailResponse = await fetch(
        `${apiBaseUrl}/cliente/pedidos/${order.id}`,
        {
          headers,
          cache: 'no-store',
        },
      )
      return mapApiOrder(
        detailResponse.ok
          ? ((await detailResponse.json()) as ApiOrderPayload)
          : order,
      )
    }),
  )
}

export async function listCards(): Promise<PaymentMethod[]> {
  if (isExplicitLocalMockMode()) return listCardsFromRepository()

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) return []

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/cliente/cartoes`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  )

  if (!response.ok) return []

  return ((await response.json()) as ApiCardPayload[]).map((card) => ({
    id: card.id ?? '',
    type: card.tipo === 'pix' ? 'pix' : 'credit_card',
    label: card.rotulo ?? '',
    lastFour: card.ultimosQuatro ?? undefined,
    brand: card.bandeira ?? undefined,
    isDefault: card.padrao ?? false,
  }))
}

export async function getCustomerProfile(): Promise<{
  customer: Customer | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}> {
  if (isExplicitLocalMockMode()) {
    return getCustomerProfileFromRepository()
  }

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) {
    return { customer: null, addresses: [], paymentMethods: [] }
  }

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/cliente/perfil`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    return { customer: null, addresses: [], paymentMethods: [] }
  }

  const profile = (await response.json()) as ProfilePayload
  const customer = profile.cliente

  return {
    customer: customer
      ? {
          id: customer.id ?? '',
          name: customer.nome ?? '',
          email: customer.email ?? '',
          phone: customer.telefone,
          document: customer.documento,
          preferences: customer.preferencias
            ? {
                shirtSize: customer.preferencias.tamanhoCamiseta,
                shoeSize: customer.preferencias.tamanhoCalcado,
                notes: customer.preferencias.observacoes,
              }
            : undefined,
        }
      : null,
    addresses: (profile.enderecos ?? []).map((address) => ({
      id: address.id ?? '',
      label: address.rotulo ?? '',
      street: address.logradouro ?? '',
      number: address.numero ?? '',
      complement: address.complemento,
      neighborhood: address.bairro ?? '',
      city: address.cidade ?? '',
      state: address.estado ?? '',
      zipCode: address.cep ?? '',
      isDefault: address.padrao ?? false,
    })),
    paymentMethods: (profile.metodosPagamento ?? []).map((method) => ({
      id: method.id ?? '',
      type: method.tipo === 'pix' ? 'pix' : 'credit_card',
      label: method.rotulo ?? '',
      lastFour: method.ultimosQuatro ?? undefined,
      brand: method.bandeira ?? undefined,
      isDefault: method.padrao ?? false,
    })),
  }
}

export async function updateCustomerProfile(input: {
  name?: string
  email?: string
  phone?: string
  document?: string
  preferences?: Partial<SubscriberPreferences>
}): Promise<void> {
  if (isExplicitLocalMockMode()) {
    await updateCustomerProfileFromRepository(input)
    return
  }

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) throw new Error('Faça login para atualizar seus dados.')

  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, '')
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
  const currentCustomer = await fetch(
    `${apiBaseUrl}/autenticacao/cliente-atual`,
    {
      headers,
      cache: 'no-store',
    },
  )

  if (!currentCustomer.ok) {
    throw new Error('Sessão inválida. Faça login novamente.')
  }

  const { id } = (await currentCustomer.json()) as { id?: string }
  if (!id) throw new Error('Não foi possível identificar a cliente da sessão.')

  const response = await fetch(`${apiBaseUrl}/clientes/${id}`, {
    method: 'PATCH',
    headers,
    cache: 'no-store',
    body: JSON.stringify({
      nome: input.name,
      email: input.email,
      telefone: input.phone,
      documento: input.document,
      preferencias: input.preferences
        ? {
            tamanhoCamiseta: input.preferences.shirtSize,
            tamanhoCalcado: input.preferences.shoeSize,
            observacoes: input.preferences.notes,
          }
        : undefined,
    }),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      mensagem?: string
    }
    throw new Error(data.mensagem ?? 'Não foi possível salvar as preferências.')
  }
}

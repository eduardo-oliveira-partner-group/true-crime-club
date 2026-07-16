import {
  addCartItem,
  applyCoupon,
  calculateShipping as repoCalculateShipping,
  createOrder as repoCreateOrder,
  getCart,
  getCartTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'
import type { Cart, Order, Payment } from '@/src/lib/domain/types'

export type CreateOrderInput = {
  enderecoId: string
  pagamentoMetodoId: string
  subscription?: {
    id: string
    name: string
    price: number
  }
}

export type CartWithTotals = Cart & {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export type CheckoutConfirmation = {
  order: Order
  payment: Pick<Payment, 'method' | 'status' | 'pixQrCode' | 'pixExpiresAt'>
}

type CheckoutApiResponse = {
  id: string
  numeroPedido: string
  status: string
  statusPagamento: string
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
    imagem?: string | null
  }>
  pagamento?: {
    metodo?: string
    status?: string
    pixQrCode?: string | null
    pixExpiraEm?: string | null
  }
}

function toCheckoutConfirmation(
  payload: CheckoutApiResponse,
): CheckoutConfirmation {
  const paymentStatusMap: Record<string, Payment['status']> = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  }
  const orderStatusMap: Record<string, Order['status']> = {
    pagamento_pendente: 'pending_payment',
    pago: 'paid',
    em_processamento: 'processing',
    aguardando_envio: 'awaiting_shipment',
    enviado: 'shipped',
    entregue: 'delivered',
    cancelado: 'cancelled',
  }

  return {
    order: {
      id: payload.id,
      orderNumber: payload.numeroPedido,
      customerId: '',
      items: (payload.itens ?? []).map((item) => ({
        id: item.id,
        productId: item.idProduto,
        productSlug: item.identificadorProduto,
        productName: item.nomeProduto,
        productType: item.tipoProduto === 'caixa' ? 'box' : 'product',
        quantity: item.quantidade,
        unitPrice: item.precoUnitario,
        image: item.imagem ?? undefined,
      })),
      status: orderStatusMap[payload.status] ?? 'paid',
      paymentStatus: paymentStatusMap[payload.statusPagamento] ?? 'paid',
      subtotal: payload.subtotal,
      shipping: payload.frete,
      discount: payload.desconto,
      total: payload.total,
      createdAt: payload.criadoEm,
      billingCycleNote: payload.observacaoCicloCobranca,
      shippingCycleNote: payload.observacaoCicloEnvio,
      invoicePlaceholder:
        'Nota fiscal disponível após confirmação do pagamento.',
    },
    payment: {
      method: payload.pagamento?.metodo === 'pix' ? 'pix' : 'credit_card',
      status: paymentStatusMap[payload.pagamento?.status ?? ''] ?? 'paid',
      pixQrCode: payload.pagamento?.pixQrCode ?? undefined,
      pixExpiresAt: payload.pagamento?.pixExpiraEm ?? undefined,
    },
  }
}

function withTotals(cart: Cart): CartWithTotals {
  return { ...cart, ...getCartTotals(cart) }
}

export async function getCartWithTotals(): Promise<CartWithTotals> {
  return withTotals(await getCart())
}

export async function addCartItemWithTotals(input: {
  productId: string
  quantity?: number
}): Promise<CartWithTotals> {
  return withTotals(await addCartItem(input))
}

export async function updateCartItemQuantityWithTotals(
  itemId: string,
  quantity: number,
): Promise<CartWithTotals> {
  return withTotals(await updateCartItemQuantity(itemId, quantity))
}

export async function removeCartItemWithTotals(
  itemId: string,
): Promise<CartWithTotals> {
  return withTotals(await removeCartItem(itemId))
}

export async function calculateShipping(zipCode: string) {
  return repoCalculateShipping(zipCode)
}

export async function createOrder(
  input?: CreateOrderInput,
): Promise<CheckoutConfirmation> {
  if (isExplicitLocalMockMode()) {
    const order = await repoCreateOrder(input)
    return {
      order,
      payment: {
        method: input?.pagamentoMetodoId === 'pm-002' ? 'pix' : 'credit_card',
        status: order.paymentStatus,
      },
    }
  }

  const token = (await cookies()).get('tcc_session')?.value
  if (!token) throw new Error('Faça login para finalizar o pedido.')

  const response = await fetch(
    `${getApiBaseUrl().replace(/\/$/, '')}/finalizacao/pedido`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        idEndereco: input?.enderecoId,
        idMetodoPagamento: input?.pagamentoMetodoId,
        simulacaoAssinatura: Boolean(input?.subscription),
        planoId: input?.subscription?.id,
        planoNome: input?.subscription?.name,
        planoPreco: input?.subscription?.price,
      }),
    },
  )

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as {
      mensagem?: string
    }
    throw new Error(data.mensagem ?? 'Não foi possível simular o pedido.')
  }

  return toCheckoutConfirmation((await response.json()) as CheckoutApiResponse)
}

export { applyCoupon }
import 'server-only'

import { cookies } from 'next/headers'

import { getApiBaseUrl, isExplicitLocalMockMode } from '@/src/lib/api-mode'

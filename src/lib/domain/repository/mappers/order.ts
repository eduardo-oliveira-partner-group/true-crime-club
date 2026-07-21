import { mockCustomer } from '../../mock-data'
import type { Order } from '../../types'

export type ApiCartItem = {
  id: string
  idProduto: string
  identificadorProduto: string
  nomeProduto: string
  tipoProduto?: string
  quantidade: number
  precoUnitario: number
  imagem?: string
}

export type ApiOrder = {
  id: string
  numeroPedido: string
  idCliente?: string
  itens?: ApiCartItem[]
  status?: string
  statusPagamento?: string
  subtotal: number
  frete: number
  desconto: number
  total: number
  criadoEm: string
  observacaoCicloCobranca?: string
  observacaoCicloEnvio?: string
  codigoRastreio?: string
  urlRastreio?: string
  notaFiscalPlaceholder?: string
}

export function mapApiOrderToDomain(apiOrder: ApiOrder): Order {
  const statusMap: Record<string, Order['status']> = {
    pagamento_pendente: 'pending_payment',
    pago: 'paid',
    em_processamento: 'processing',
    aguardando_envio: 'awaiting_shipment',
    enviado: 'shipped',
    entregue: 'delivered',
    cancelado: 'cancelled',
  }

  const paymentStatusMap: Record<string, Order['paymentStatus']> = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  }

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.numeroPedido,
    customerId: apiOrder.idCliente ?? mockCustomer.id,
    items: Array.isArray(apiOrder.itens)
      ? apiOrder.itens.map((item: ApiCartItem) => ({
          id: item.id,
          productId: item.idProduto,
          productSlug: item.identificadorProduto,
          productName: item.nomeProduto,
          productType: item.tipoProduto === 'caixa' ? 'box' : 'product',
          quantity: item.quantidade,
          unitPrice: item.precoUnitario,
          image: item.imagem,
        }))
      : [],
    status: statusMap[apiOrder.status ?? ''] ?? 'paid',
    paymentStatus: paymentStatusMap[apiOrder.statusPagamento ?? ''] ?? 'paid',
    subtotal: apiOrder.subtotal,
    shipping: apiOrder.frete,
    discount: apiOrder.desconto,
    total: apiOrder.total,
    createdAt: apiOrder.criadoEm,
    billingCycleNote: apiOrder.observacaoCicloCobranca,
    shippingCycleNote: apiOrder.observacaoCicloEnvio,
    trackingCode: apiOrder.codigoRastreio,
    trackingUrl: apiOrder.urlRastreio,
    invoicePlaceholder:
      apiOrder.notaFiscalPlaceholder ??
      'Nota fiscal disponível após confirmação do pagamento.',
  }
}

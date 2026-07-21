import type { Invoice, Payment } from '../../types'

export type ApiPayment = {
  id: string
  idPedido?: string
  idAssinatura?: string
  valor: number
  status?: string
  metodo?: string
  vencimento: string
  pagoEm?: string
  pixQrCode?: string
  pixExpiraEm?: string
  motivoRecusa?: string
}

export type ApiInvoice = {
  id: string
  numero: string
  idPagamento: string
  valor: number
  emitidoEm: string
  urlRecibo?: string
  urlDownload?: string
}

export function mapApiPaymentToDomain(apiPayment: ApiPayment): Payment {
  const statusMap: Record<string, Payment['status']> = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  }

  const methodMap: Record<string, Payment['method']> = {
    cartao_credito: 'credit_card',
    pix: 'pix',
  }

  return {
    id: apiPayment.id,
    orderId: apiPayment.idPedido,
    subscriptionId: apiPayment.idAssinatura,
    amount: apiPayment.valor,
    status: statusMap[apiPayment.status ?? ''] ?? 'paid',
    method: methodMap[apiPayment.metodo ?? ''] ?? 'credit_card',
    dueDate: apiPayment.vencimento,
    paidAt: apiPayment.pagoEm,
    pixQrCode: apiPayment.pixQrCode,
    pixExpiresAt: apiPayment.pixExpiraEm,
    refusalReason: apiPayment.motivoRecusa,
  }
}

export function mapApiInvoiceToDomain(apiInvoice: ApiInvoice): Invoice {
  return {
    id: apiInvoice.id,
    number: apiInvoice.numero,
    paymentId: apiInvoice.idPagamento,
    amount: apiInvoice.valor,
    issuedAt: apiInvoice.emitidoEm,
    receiptUrl: apiInvoice.urlRecibo,
    downloadUrl: apiInvoice.urlDownload,
  }
}

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
  numero?: string
  number?: string
  idPagamento?: string
  payment_id?: string
  valor?: number
  amount?: number
  emitidoEm?: string
  issued_at?: string
  urlRecibo?: string
  receipt_url?: string
  urlDownload?: string
  download_url?: string
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
    orderId: apiPayment.idPedido ?? undefined,
    subscriptionId: apiPayment.idAssinatura ?? undefined,
    amount: apiPayment.valor,
    status: statusMap[apiPayment.status ?? ''] ?? 'paid',
    method: methodMap[apiPayment.metodo ?? ''] ?? 'credit_card',
    dueDate: apiPayment.vencimento,
    paidAt: apiPayment.pagoEm ?? undefined,
    pixQrCode: apiPayment.pixQrCode ?? undefined,
    pixExpiresAt: apiPayment.pixExpiraEm ?? undefined,
    refusalReason: apiPayment.motivoRecusa ?? undefined,
  }
}

export function mapApiInvoiceToDomain(apiInvoice: ApiInvoice): Invoice {
  return {
    id: apiInvoice.id,
    number: apiInvoice.numero ?? apiInvoice.number ?? '',
    paymentId: apiInvoice.idPagamento ?? apiInvoice.payment_id ?? '',
    amount: apiInvoice.valor ?? apiInvoice.amount ?? 0,
    issuedAt: apiInvoice.emitidoEm ?? apiInvoice.issued_at ?? '',
    receiptUrl: apiInvoice.urlRecibo ?? apiInvoice.receipt_url,
    downloadUrl: apiInvoice.urlDownload ?? apiInvoice.download_url,
  }
}

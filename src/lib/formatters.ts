import type {
  AvailabilityStatus,
  ContentStatus,
  OrderStatus,
  PaymentStatus,
  SubscriptionStatus,
} from './domain/types'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}

export function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCpf(value: string): string {
  const digits = normalizeDigits(value).slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function isValidCpf(value: string): boolean {
  const digits = normalizeDigits(value)
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const calculateDigit = (base: string, factor: number) => {
    const total = base
      .split('')
      .reduce((sum, digit, index) => sum + Number(digit) * (factor - index), 0)
    return ((total * 10) % 11) % 10
  }

  return (
    calculateDigit(digits.slice(0, 9), 10) === Number(digits[9]) &&
    calculateDigit(digits.slice(0, 10), 11) === Number(digits[10])
  )
}

export function formatPhone(value: string): string {
  const digits = normalizeDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function isValidPhone(value: string): boolean {
  const digits = normalizeDigits(value)
  return digits.length === 10 || digits.length === 11
}

export function formatCep(value: string): string {
  const digits = normalizeDigits(value).slice(0, 8)
  return digits.length <= 5
    ? digits
    : `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function isValidCep(value: string): boolean {
  return normalizeDigits(value).length === 8
}

/** Normaliza UF para 2 letras maiúsculas (ex.: "sp" → "SP"). */
export function formatUf(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidUf(value: string): boolean {
  return /^[A-Z]{2}$/.test(formatUf(value))
}

/** Limite da coluna `numero` em `tb_cliente_endereco` (varchar(4)). */
export const ADDRESS_NUMBER_MAX_LENGTH = 4

export function isValidAddressNumber(value: string): boolean {
  const normalized = value.trim()
  return normalized.length > 0 && normalized.length <= ADDRESS_NUMBER_MAX_LENGTH
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}

export function formatOrderStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending_payment: 'Aguardando pagamento',
    paid: 'Pago',
    processing: 'Em processamento',
    awaiting_shipment: 'Aguardando despacho',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  }
  return labels[status]
}

export function formatPaymentStatus(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    refused: 'Recusado',
    expired: 'Expirado',
    refunded: 'Reembolsado',
  }
  return labels[status]
}

export function formatSubscriptionStatus(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Ativa',
    pending_payment: 'Pagamento pendente',
    cancelled: 'Cancelada',
    paused: 'Pausada',
    past_due: 'Em atraso',
  }
  return labels[status]
}

export function formatContentStatus(status: ContentStatus): string {
  return status === 'liberado' ? 'Liberado' : 'Bloqueado'
}

export function formatAvailability(status: AvailabilityStatus): string {
  const labels: Record<AvailabilityStatus, string> = {
    available: 'Disponível',
    limited: 'Edição limitada',
    out_of_stock: 'Esgotado',
    coming_soon: 'Em breve',
  }
  return labels[status]
}

export function formatShippingRegion(zipCode: string): string {
  const region = zipCode.slice(0, 2)
  if (
    region === '01' ||
    region === '02' ||
    region === '03' ||
    region === '04' ||
    region === '05'
  ) {
    return 'Grande São Paulo'
  }
  if (
    region === '20' ||
    region === '21' ||
    region === '22' ||
    region === '23' ||
    region === '24'
  ) {
    return 'Rio de Janeiro e região'
  }
  return 'Demais regiões do Brasil'
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatEditionMonth(editionMonth: string): string {
  const [year, month] = editionMonth.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return dateFormatter.format(date)
}

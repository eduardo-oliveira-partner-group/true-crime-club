import type {
  OrderStatus,
  PaymentStatus,
  SubscriptionStatus,
  ContentStatus,
  AvailabilityStatus,
} from "./domain/types"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate))
}

export function formatOrderStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending_payment: "Aguardando pagamento",
    paid: "Pago",
    processing: "Em processamento",
    awaiting_shipment: "Aguardando despacho",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }
  return labels[status]
}

export function formatPaymentStatus(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Pendente",
    paid: "Pago",
    refused: "Recusado",
    expired: "Expirado",
    refunded: "Reembolsado",
  }
  return labels[status]
}

export function formatSubscriptionStatus(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    active: "Ativa",
    pending_payment: "Pagamento pendente",
    cancelled: "Cancelada",
    paused: "Pausada",
    past_due: "Em atraso",
  }
  return labels[status]
}

export function formatContentStatus(status: ContentStatus): string {
  return status === "liberado" ? "Liberado" : "Bloqueado"
}

export function formatAvailability(status: AvailabilityStatus): string {
  const labels: Record<AvailabilityStatus, string> = {
    available: "Disponível",
    limited: "Edição limitada",
    out_of_stock: "Esgotado",
    coming_soon: "Em breve",
  }
  return labels[status]
}

export function formatShippingRegion(zipCode: string): string {
  const region = zipCode.slice(0, 2)
  if (region === "01" || region === "02" || region === "03" || region === "04" || region === "05") {
    return "Grande São Paulo"
  }
  if (region === "20" || region === "21" || region === "22" || region === "23" || region === "24") {
    return "Rio de Janeiro e região"
  }
  return "Demais regiões do Brasil"
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

export function formatEditionMonth(editionMonth: string): string {
  const [year, month] = editionMonth.split("-")
  const date = new Date(Number(year), Number(month) - 1, 1)
  return dateFormatter.format(date)
}

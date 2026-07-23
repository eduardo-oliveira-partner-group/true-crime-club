import { getApiBaseUrl } from '@/src/lib/api-mode'

export function getCheckoutWebSocketUrl(checkoutId: string): string {
  const apiBase = getApiBaseUrl()
  const wsBase = apiBase.replace(/^http/i, 'ws')
  return `${wsBase.replace(/\/$/, '')}/ws/checkout/${encodeURIComponent(checkoutId)}`
}

function readPayloadData(payload: Record<string, unknown>) {
  const data = payload.data ?? payload.dados
  return data && typeof data === 'object' && !Array.isArray(data)
    ? (data as Record<string, unknown>)
    : null
}

export function parseCheckoutPaymentMessage(raw: string): {
  confirmed: boolean
  timedOut: boolean
} {
  try {
    const payload = JSON.parse(raw) as Record<string, unknown>
    if (payload.status === 'TIMEOUT') {
      return { confirmed: false, timedOut: true }
    }

    const data = readPayloadData(payload)
    if (!data) {
      return { confirmed: false, timedOut: false }
    }

    const nested = data.dados
    const nestedData =
      nested && typeof nested === 'object' && !Array.isArray(nested)
        ? (nested as Record<string, unknown>)
        : null

    const paidFlag = data.pago === true || nestedData?.pago === true

    const status = String(
      data.statusGateway ?? data.status ?? nestedData?.status ?? '',
    ).toUpperCase()

    const confirmed =
      paidFlag ||
      ['PAGO', 'PAID', 'CONFIRMED', 'RECEIVED', 'ACCREDITED'].includes(
        status,
      )

    return { confirmed, timedOut: false }
  } catch {
    return { confirmed: false, timedOut: false }
  }
}

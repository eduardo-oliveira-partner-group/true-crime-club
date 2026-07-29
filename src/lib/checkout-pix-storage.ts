const KEY_PREFIX = 'checkout:pix:'
/** Chave legada (apagada no primeiro load — causa do bug). */
const LEGACY_KEY = 'checkout:lastPayment'

export type CheckoutPixPaymentSnapshot = {
  id?: string
  metodo?: string
  pixQrCode?: string
  pixQrCodeBase64?: string
  pixExpiraEm?: string
}

function hasPixCode(payment: CheckoutPixPaymentSnapshot): boolean {
  return Boolean(payment.pixQrCode?.trim())
}

function parseSnapshot(raw: string | null): CheckoutPixPaymentSnapshot | null {
  if (!raw) return null
  try {
    const payment = JSON.parse(raw) as CheckoutPixPaymentSnapshot
    if (!hasPixCode(payment)) return null
    return {
      ...payment,
      metodo: payment.metodo ?? 'pix',
    }
  } catch {
    return null
  }
}

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

export function saveCheckoutPixPayment(
  orderId: string,
  payment: CheckoutPixPaymentSnapshot,
): void {
  const store = storage()
  if (!store || !orderId || !hasPixCode(payment)) return

  const snapshot: CheckoutPixPaymentSnapshot = {
    ...payment,
    metodo: payment.metodo ?? 'pix',
  }
  store.setItem(`${KEY_PREFIX}${orderId}`, JSON.stringify(snapshot))
  store.removeItem(LEGACY_KEY)
}

export function readCheckoutPixPayment(
  orderId: string,
): CheckoutPixPaymentSnapshot | null {
  const store = storage()
  if (!store || !orderId) return null

  const keyed = parseSnapshot(store.getItem(`${KEY_PREFIX}${orderId}`))
  if (keyed) return keyed

  const legacy = parseSnapshot(store.getItem(LEGACY_KEY))
  if (!legacy) return null

  saveCheckoutPixPayment(orderId, legacy)
  return legacy
}

export function clearCheckoutPixPayment(orderId: string): void {
  const store = storage()
  if (!store) return
  if (orderId) store.removeItem(`${KEY_PREFIX}${orderId}`)
  store.removeItem(LEGACY_KEY)
}

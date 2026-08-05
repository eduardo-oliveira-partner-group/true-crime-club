import { isValidCep, normalizeDigits } from '@/src/lib/formatters'

const STORAGE_KEY = 'tcc:checkout-prefill-cep'

function storage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

export function saveCheckoutAddressPrefillCep(zipCode: string): void {
  const store = storage()
  const digits = normalizeDigits(zipCode)
  if (!store || !isValidCep(digits)) return

  try {
    store.setItem(STORAGE_KEY, digits)
  } catch {
    // sessionStorage pode falhar em modo restrito.
  }
}

export function consumeCheckoutAddressPrefillCep(): string | null {
  const store = storage()
  if (!store) return null

  try {
    const raw = store.getItem(STORAGE_KEY)
    store.removeItem(STORAGE_KEY)
    if (!raw || !isValidCep(raw)) return null
    return normalizeDigits(raw)
  } catch {
    return null
  }
}

import type { Cart } from '../../types'

export function isNotFoundError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : ''
  return (
    msg.includes('404') ||
    msg.toLowerCase().includes('não encontrado') ||
    msg.toLowerCase().includes('nao encontrado') ||
    msg.toLowerCase().includes('nenhuma assinatura')
  )
}

export function isUnauthorizedError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    msg.includes('401') ||
    msg.includes('não autenticado') ||
    msg.includes('nao autenticado') ||
    msg.includes('unauthorized')
  )
}

export function emptyCart(): Cart {
  return { id: 'cart-anonymous', items: [] }
}

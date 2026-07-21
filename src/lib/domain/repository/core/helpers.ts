import { isExplicitLocalMockMode } from '@/src/lib/api-mode'

import {
  getActiveScenario,
  getScenarioErrorMessage,
  isScenario,
} from '../../scenarios'
import type { Cart } from '../../types'

export function isLocalMockMode(): boolean {
  return isExplicitLocalMockMode()
}

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

export function throwIfError(): void {
  if (isScenario('error')) {
    throw new Error(getScenarioErrorMessage())
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

export function getActiveScenarioLabel(): string {
  return getActiveScenario()
}

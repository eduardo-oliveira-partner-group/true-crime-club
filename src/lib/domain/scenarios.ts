export type ScenarioKey =
  | 'default'
  | 'empty'
  | 'loading'
  | 'error'
  | 'success'
  | 'blocked'
  | 'pending'
  | 'product_unavailable'
  | 'payment_refused'
  | 'pix_pending'
  | 'subscription_cancelled'
  | 'reactivation_available'

let activeScenario: ScenarioKey = 'default'

export function getActiveScenario(): ScenarioKey {
  return activeScenario
}

export function setActiveScenario(scenario: ScenarioKey): void {
  activeScenario = scenario
}

export function isScenario(...keys: ScenarioKey[]): boolean {
  return keys.includes(activeScenario)
}

export function simulateDelay(ms = 0): Promise<void> {
  if (activeScenario !== 'loading' || ms === 0) {
    return Promise.resolve()
  }
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getScenarioErrorMessage(): string | undefined {
  if (activeScenario === 'error') {
    return 'Não foi possível carregar os dados. Tente novamente em instantes.'
  }
  return undefined
}

export function shouldReturnEmpty<T>(data: T[]): T[] | null {
  if (activeScenario === 'empty') {
    return []
  }
  if (activeScenario === 'error') {
    return null
  }
  return data
}

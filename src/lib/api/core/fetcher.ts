import { getApiBaseUrl } from '@/src/lib/api-mode'

import {
  isApiEnvelope,
  isApiFailureEnvelope,
  unwrapApiPayload,
} from './envelope'
import { ApiClientError } from './error'

const simulatedLoadErrors = [
  {
    matches: (endpoint: string) =>
      endpoint === '/produtos' || endpoint.startsWith('/produtos?'),
    message: 'Não foi possível carregar os produtos.',
  },
  {
    matches: (endpoint: string) => endpoint === '/cliente/pedidos',
    message: 'Não foi possível carregar os pedidos.',
  },
  {
    matches: (endpoint: string) => endpoint === '/cliente/assinatura',
    message: 'Não foi possível carregar a assinatura.',
  },
]

function getSimulatedLoadError(endpoint: string, options: RequestInit) {
  if (
    process.env.NODE_ENV !== 'development' ||
    typeof window === 'undefined' ||
    (options.method ?? 'GET').toUpperCase() !== 'GET'
  ) {
    return null
  }

  const shouldSimulate =
    new URLSearchParams(window.location.search).get('simularErroApi') === 'true'
  if (!shouldSimulate) return null

  const simulatedError = simulatedLoadErrors.find(({ matches }) =>
    matches(endpoint),
  )
  return simulatedError ?? null
}

function readStatusCode(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function extractApiErrorMessage(errorData: unknown, status: number): string {
  if (!errorData || typeof errorData !== 'object' || Array.isArray(errorData)) {
    return `Erro na requisição: ${status}`
  }

  const data = errorData as Record<string, unknown>

  if (typeof data.mensagem === 'string' && data.mensagem.trim()) {
    return data.mensagem.trim()
  }

  if (Array.isArray(data.erros) && data.erros.length > 0) {
    const messages = data.erros
      .map((item) => {
        if (typeof item === 'string' && item.trim()) return item.trim()
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const entry = item as Record<string, unknown>
          for (const key of [
            'mensagem',
            'message',
            'erro',
            'descricao',
          ] as const) {
            const value = entry[key]
            if (typeof value === 'string' && value.trim()) return value.trim()
          }
        }
        return null
      })
      .filter((item): item is string => Boolean(item))

    if (messages.length > 0) {
      return messages.join(' · ')
    }
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message.trim()
  }

  return `Erro na requisição: ${status}`
}

export async function fetcher(endpoint: string, options: RequestInit = {}) {
  const simulatedError = getSimulatedLoadError(endpoint, options)

  const apiBaseUrl = getApiBaseUrl()
  const url = `${apiBaseUrl.replace(/\/$/, '')}${endpoint}`
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  const payload = await response.json().catch(() => null)

  if (simulatedError) {
    throw new ApiClientError(
      simulatedError.message,
      503,
      'SIMULATED_LOAD_ERROR',
    )
  }

  if (!response.ok || isApiFailureEnvelope(payload)) {
    const code = isApiEnvelope(payload) ? payload.codigo : undefined
    const status = readStatusCode(code, response.status)
    throw new ApiClientError(
      extractApiErrorMessage(payload, status),
      status,
      code,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- preserva o contrato any do response.json()
  return unwrapApiPayload<any>(payload)
}

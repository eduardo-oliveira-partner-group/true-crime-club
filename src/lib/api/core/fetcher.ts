import { getApiBaseUrl } from '@/src/lib/api-mode'

import { ApiClientError } from './error'

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

function isApiFailureEnvelope(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return false
  }

  const data = payload as Record<string, unknown>
  if (data.sucesso === false) return true
  if (Array.isArray(data.erros) && data.erros.length > 0 && data.data == null) {
    return true
  }
  return false
}

export async function fetcher(endpoint: string, options: RequestInit = {}) {
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

  if (!response.ok || isApiFailureEnvelope(payload)) {
    const status = readStatusCode(
      payload && typeof payload === 'object' && !Array.isArray(payload)
        ? (payload as Record<string, unknown>).codigo
        : undefined,
      response.status,
    )
    throw new ApiClientError(extractApiErrorMessage(payload, status), status)
  }

  return payload
}

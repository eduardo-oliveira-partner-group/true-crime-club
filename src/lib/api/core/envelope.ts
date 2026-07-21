export type ApiEnvelope = {
  data?: unknown
  erros?: unknown[]
  codigo?: string | number
  sucesso?: boolean
  mensagem?: string
}

export function isApiEnvelope(payload: unknown): payload is ApiEnvelope {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return false
  }

  const value = payload as Record<string, unknown>
  if (typeof value.sucesso !== 'boolean') return false

  return (
    'data' in value ||
    'erros' in value ||
    'codigo' in value ||
    'mensagem' in value
  )
}

export function isApiFailureEnvelope(payload: unknown): boolean {
  if (!isApiEnvelope(payload)) return false
  if (payload.sucesso === false) return true
  if (
    Array.isArray(payload.erros) &&
    payload.erros.length > 0 &&
    payload.data == null
  ) {
    return true
  }
  return false
}

/** Extrai o conteúdo de `{ data, sucesso, ... }`. */
export function unwrapApiPayload<T = unknown>(payload: unknown): T {
  if (isApiEnvelope(payload) && 'data' in payload) {
    return (payload.data ?? null) as T
  }
  return payload as T
}

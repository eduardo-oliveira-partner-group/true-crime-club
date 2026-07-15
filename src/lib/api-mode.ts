export function isExplicitLocalMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'
  )
}

export function getApiBaseUrl(): string {
  // Em servidor, prioriza a URL interna de runtime para evitar problemas com caminhos relativos
  if (typeof window === 'undefined') {
    const serverUrl =
      process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
    if (serverUrl) {
      return serverUrl
    }
  }

  const url = process.env.NEXT_PUBLIC_API_BASE_URL
  if (url) {
    return url
  }
  if (isExplicitLocalMockMode()) {
    return '/api'
  }
  throw new Error(
    'API base URL is required unless local mock mode is explicitly enabled.',
  )
}

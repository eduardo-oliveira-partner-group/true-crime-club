export function isExplicitLocalMockMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'
  )
}

export function getApiBaseUrl(): string {
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

export function getApiBaseUrl(): string {
  const url =
    typeof window === 'undefined'
      ? (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL)
      : process.env.NEXT_PUBLIC_API_BASE_URL

  if (!url) {
    throw new Error(
      'API base URL is required. Set API_BASE_URL or NEXT_PUBLIC_API_BASE_URL.',
    )
  }

  return url
}

const ACCESS_TOKEN_KEY = 'tcc_access_token'
const LOGGED_IN_KEY = 'isLoggedIn'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  window.localStorage.setItem(LOGGED_IN_KEY, 'true')

  // O SSR lê a sessão pelo cookie. `Secure` é obrigatório em HTTPS, mas
  // impediria o envio do cookie para o servidor durante testes em localhost.
  const secureAttribute =
    window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `tcc_session=${token}; path=/; max-age=604800; SameSite=Lax${secureAttribute}`
}

export function clearAccessToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(LOGGED_IN_KEY)

  // Limpa o cookie
  document.cookie = `tcc_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function markLoggedIn(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOGGED_IN_KEY, 'true')
}

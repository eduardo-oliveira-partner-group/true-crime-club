import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { addCartItem } from '@/src/lib/domain/repositories'

function isAuthError(error: unknown): boolean {
  return (
    error instanceof ApiClientError &&
    (error.status === 401 || error.status === 403)
  )
}

/** Destino pós-login: carrinho com o produto a ser adicionado. */
export function loginPathToAddProduct(productId: string): string {
  const next = encodeURIComponent(
    `/carrinho?adicionar=${encodeURIComponent(productId)}`,
  )
  return `/login?next=${next}`
}

/**
 * Adiciona o produto ao carrinho. Sem sessão, redireciona para login
 * e retorna ao carrinho já com o item após autenticar.
 */
export async function addCartItemRequiringAuth(
  productId: string,
): Promise<'added' | 'login-redirect'> {
  try {
    await apiClient.auth.me()
  } catch (error) {
    if (isAuthError(error)) {
      window.location.assign(loginPathToAddProduct(productId))
      return 'login-redirect'
    }
    throw error
  }

  await addCartItem({ productId })
  return 'added'
}

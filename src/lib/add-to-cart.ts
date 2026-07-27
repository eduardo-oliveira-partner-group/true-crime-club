import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { notifyCartUpdated } from '@/src/lib/cart-events'
import { addCartItem } from '@/src/lib/domain/repositories'

export const PENDING_PLAN_STORAGE_KEY = 'tcc:pending-plan-id'

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

/** Destino pós-login: carrinho (plano pendente vai no sessionStorage). */
export function loginPathToAddPlan(): string {
  return `/login?next=${encodeURIComponent('/carrinho')}`
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

  const cart = await addCartItem({ productId })
  notifyCartUpdated(cart)
  return 'added'
}

/**
 * Adiciona o plano ao carrinho via API. Sem sessão, guarda o plano
 * pendente e redireciona para login → `/carrinho` (sem query).
 */
export async function addPlanToCartRequiringAuth(
  planId: string,
): Promise<'added' | 'login-redirect'> {
  try {
    await apiClient.auth.me()
  } catch (error) {
    if (isAuthError(error)) {
      try {
        sessionStorage.setItem(PENDING_PLAN_STORAGE_KEY, planId)
      } catch {
        // sessionStorage pode falhar em modo restrito; o usuário reescolhe o plano.
      }
      window.location.assign(loginPathToAddPlan())
      return 'login-redirect'
    }
    throw error
  }

  const cart = await addCartItem({ planoId: planId })
  notifyCartUpdated(cart)
  return 'added'
}

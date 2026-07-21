import { authApi } from './domains/auth'
import { cartApi } from './domains/cart'
import { casesApi } from './domains/cases'
import { checkoutApi } from './domains/checkout'
import { customerApi } from './domains/customer'
import { exclusiveContentApi } from './domains/exclusive-content'
import { plansApi } from './domains/plans'
import { productsApi } from './domains/products'

export { ApiClientError } from './core/error'

export const apiClient = {
  auth: authApi,
  products: productsApi,
  plans: plansApi,
  cart: cartApi,
  checkout: checkoutApi,
  customer: customerApi,
  exclusiveContent: exclusiveContentApi,
  cases: casesApi,
}

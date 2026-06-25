import {
  initialCart,
  mockActiveCase,
  mockAddresses,
  mockClues,
  mockCustomer,
  mockDynamicContent,
  mockExclusiveContent,
  mockInvoices,
  mockOrders,
  mockPaymentMethods,
  mockPayments,
  mockPlans,
  mockProducts,
  mockSeoEntries,
  mockSubscriberProgress,
  mockSubscription,
  SHIPPING_RATES,
  VALID_COUPONS,
} from './mock-data'
import {
  getActiveScenario,
  getScenarioErrorMessage,
  isScenario,
  shouldReturnEmpty,
} from './scenarios'
import type {
  Address,
  Cart,
  CartItem,
  Case,
  Clue,
  CouponResult,
  Customer,
  DynamicContentBlock,
  ExclusiveContent,
  Invoice,
  Order,
  Payment,
  PaymentMethod,
  Product,
  SeoEntry,
  ShippingEstimate,
  SubscriberPreferences,
  SubscriberProgress,
  Subscription,
  SubscriptionPlan,
} from './types'

let cartState: Cart = structuredClone(initialCart)
let subscriptionState: Subscription = structuredClone(mockSubscription)
let paymentsState: Payment[] = structuredClone(mockPayments)

function throwIfError(): void {
  if (isScenario('error')) {
    throw new Error(getScenarioErrorMessage())
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

export function listProducts(options?: {
  featured?: boolean
  category?: string
}): Product[] {
  throwIfError()
  let products = [...mockProducts]

  if (options?.featured) {
    products = products.filter((p) => p.featured)
  }
  if (options?.category) {
    products = products.filter((p) => p.categories.includes(options.category!))
  }

  if (isScenario('product_unavailable')) {
    products = products.map((p) => ({
      ...p,
      inStock: false,
      availability: 'out_of_stock' as const,
    }))
  }

  const result = shouldReturnEmpty(products)
  return result ?? products
}

export function getProductBySlug(slug: string): Product | null {
  throwIfError()
  const product = mockProducts.find((p) => p.slug === slug) ?? null
  if (!product && isScenario('empty')) {
    return null
  }
  if (isScenario('product_unavailable') && product) {
    return { ...product, inStock: false, availability: 'out_of_stock' }
  }
  return product
}

export function listPlans(): SubscriptionPlan[] {
  throwIfError()
  const result = shouldReturnEmpty(mockPlans)
  return result ?? mockPlans
}

export function getPlanBySlug(slug: string): SubscriptionPlan | null {
  throwIfError()
  return mockPlans.find((p) => p.slug === slug) ?? null
}

export function getCart(): Cart {
  throwIfError()
  return structuredClone(cartState)
}

export function addCartItem(input: {
  productId: string
  quantity?: number
}): Cart {
  throwIfError()
  const product = mockProducts.find((p) => p.id === input.productId)
  if (!product) {
    throw new Error('Produto não encontrado.')
  }
  if (!product.inStock || isScenario('product_unavailable')) {
    throw new Error('Produto indisponível no momento.')
  }

  const quantity = input.quantity ?? 1
  const unitPrice = product.subscriberPrice ?? product.price
  const existing = cartState.items.find((i) => i.productId === product.id)

  if (existing) {
    existing.quantity += quantity
  } else {
    const item: CartItem = {
      id: generateId('ci'),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.type,
      quantity,
      unitPrice,
      image: product.images[0],
    }
    cartState.items.push(item)
  }

  return getCart()
}

export function updateCartItemQuantity(itemId: string, quantity: number): Cart {
  throwIfError()
  const item = cartState.items.find((i) => i.id === itemId)
  if (!item) {
    throw new Error('Item não encontrado no carrinho.')
  }
  if (quantity <= 0) {
    cartState.items = cartState.items.filter((i) => i.id !== itemId)
  } else {
    item.quantity = quantity
  }
  return getCart()
}

export function removeCartItem(itemId: string): Cart {
  throwIfError()
  cartState.items = cartState.items.filter((i) => i.id !== itemId)
  return getCart()
}

export function calculateShipping(zipCode: string): ShippingEstimate {
  throwIfError()
  const normalized = zipCode.replace(/\D/g, '')
  const rate =
    SHIPPING_RATES[normalized] ??
    SHIPPING_RATES[`${normalized.slice(0, 5)}-${normalized.slice(5)}`] ??
    SHIPPING_RATES.default

  return {
    region: normalized ? `CEP ${normalized}` : 'Informe o CEP',
    price: rate.price,
    estimatedDays: rate.days,
  }
}

export function applyCoupon(code: string): CouponResult {
  throwIfError()
  const normalized = code.trim().toUpperCase()
  const discount = VALID_COUPONS[normalized]

  if (!discount) {
    cartState.couponCode = undefined
    cartState.couponDiscount = undefined
    return {
      valid: false,
      code: normalized,
      discount: 0,
      message: 'Cupom inválido ou expirado.',
    }
  }

  cartState.couponCode = normalized
  cartState.couponDiscount = discount

  return {
    valid: true,
    code: normalized,
    discount,
    message: 'Cupom aplicado com sucesso.',
  }
}

export function getCartTotals(cart: Cart = getCart()) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const discount = cart.couponDiscount ?? 0
  const shipping = cart.shippingEstimate ?? 0
  const total = Math.max(subtotal - discount + shipping, 0)

  return { subtotal, discount, shipping, total }
}

export function createOrder(input?: {
  customerId?: string
  shipping?: number
}): Order {
  throwIfError()
  const cart = getCart()
  const { subtotal, discount, shipping, total } = getCartTotals(cart)
  const now = new Date()

  const order: Order = {
    id: generateId('ord'),
    orderNumber: `TCC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    customerId: input?.customerId ?? mockCustomer.id,
    items: structuredClone(cart.items),
    status: isScenario('pending', 'pix_pending') ? 'pending_payment' : 'paid',
    paymentStatus: isScenario('payment_refused')
      ? 'refused'
      : isScenario('pending', 'pix_pending')
        ? 'pending'
        : 'paid',
    subtotal,
    shipping: input?.shipping ?? shipping,
    discount,
    total,
    createdAt: now.toISOString(),
    billingCycleNote: 'Cobrança processada no mês da compra.',
    shippingCycleNote:
      'Envio previsto para o mês seguinte — o rastreio será enviado por e-mail após o despacho.',
    invoicePlaceholder: 'Nota fiscal disponível após confirmação do pagamento.',
  }

  mockOrders.unshift(order)
  cartState = structuredClone(initialCart)

  return order
}

export function getCurrentCustomer(): Customer | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockCustomer
}

export function updateSubscriberPreferences(
  preferences: SubscriberPreferences,
): Customer {
  throwIfError()
  const updated: Customer = {
    ...mockCustomer,
    preferences: { ...mockCustomer.preferences, ...preferences },
  }
  return updated
}

export function listAddresses(): Address[] {
  throwIfError()
  const result = shouldReturnEmpty(mockAddresses)
  return result ?? mockAddresses
}

export function listPaymentMethods(): PaymentMethod[] {
  throwIfError()
  const result = shouldReturnEmpty(mockPaymentMethods)
  return result ?? mockPaymentMethods
}

export function listOrders(): Order[] {
  throwIfError()
  const result = shouldReturnEmpty(mockOrders)
  return result ?? mockOrders
}

export function getOrderById(id: string): Order | null {
  throwIfError()
  return mockOrders.find((o) => o.id === id) ?? null
}

export function getSubscription(): Subscription | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  if (isScenario('subscription_cancelled')) {
    return {
      ...subscriptionState,
      status: 'cancelled',
      canCancel: false,
      canReactivate: false,
      cancelledAt: new Date().toISOString(),
    }
  }
  if (isScenario('reactivation_available')) {
    return {
      ...subscriptionState,
      status: 'cancelled',
      canCancel: false,
      canReactivate: true,
      cancelledAt: new Date().toISOString(),
    }
  }
  if (isScenario('pending', 'pix_pending', 'payment_refused')) {
    return { ...subscriptionState, status: 'pending_payment' }
  }
  return subscriptionState
}

export function cancelSubscription(): Subscription {
  throwIfError()
  subscriptionState = {
    ...subscriptionState,
    status: 'cancelled',
    canCancel: false,
    canReactivate: true,
    cancelledAt: new Date().toISOString(),
  }
  return subscriptionState
}

export function reactivateSubscription(): Subscription {
  throwIfError()
  subscriptionState = {
    ...subscriptionState,
    status: 'active',
    canCancel: true,
    canReactivate: false,
    cancelledAt: undefined,
  }
  return subscriptionState
}

export function listPayments(): Payment[] {
  throwIfError()
  let payments = [...paymentsState]

  if (isScenario('payment_refused')) {
    payments = payments.map((p, index) =>
      index === 0
        ? {
            ...p,
            status: 'refused' as const,
            refusalReason: 'Cartão recusado pelo emissor. Tente outro meio.',
          }
        : p,
    )
  }
  if (isScenario('pix_pending')) {
    payments = payments.map((p) =>
      p.method === 'pix' && p.status === 'pending'
        ? p
        : { ...p, status: 'pending' as const },
    )
  }

  const result = shouldReturnEmpty(payments)
  return result ?? payments
}

export function listInvoices(): Invoice[] {
  throwIfError()
  const result = shouldReturnEmpty(mockInvoices)
  return result ?? mockInvoices
}

export function renewPixPayment(paymentId: string): Payment {
  throwIfError()
  const payment = paymentsState.find((p) => p.id === paymentId)
  if (!payment) {
    throw new Error('Pagamento não encontrado.')
  }

  const renewed: Payment = {
    ...payment,
    status: 'pending',
    pixQrCode: `00020126580014BR.GOV.BCB.PIX0136mock-renewed-${paymentId}`,
    pixExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    refusalReason: undefined,
  }

  paymentsState = paymentsState.map((p) => (p.id === paymentId ? renewed : p))
  return renewed
}

export function updateCard(input: {
  holderName: string
  lastFour: string
  brand: string
}): PaymentMethod {
  throwIfError()
  const updated: PaymentMethod = {
    id: 'pm-001',
    type: 'credit_card',
    label: `${input.brand} terminando em ${input.lastFour}`,
    lastFour: input.lastFour,
    brand: input.brand,
    isDefault: true,
  }
  return updated
}

export function listExclusiveContent(): ExclusiveContent[] {
  throwIfError()
  let content = [...mockExclusiveContent]

  if (isScenario('blocked')) {
    content = content.map((c) =>
      c.status === 'liberado'
        ? c
        : {
            ...c,
            status: 'bloqueado' as const,
            blockedReason: 'Libera no próximo ciclo',
          },
    )
  }

  const result = shouldReturnEmpty(content)
  return result ?? content
}

export function getExclusiveContentBySlug(
  slug: string,
): ExclusiveContent | null {
  throwIfError()
  return mockExclusiveContent.find((c) => c.slug === slug) ?? null
}

export function getDynamicContent(key: string): DynamicContentBlock | null {
  throwIfError()
  return mockDynamicContent.find((block) => block.key === key) ?? null
}

export function getDynamicContentByRoute(route: string): DynamicContentBlock[] {
  throwIfError()
  return mockDynamicContent.filter((block) => block.route === route)
}

export function getSeoEntry(path: string): SeoEntry | null {
  throwIfError()
  return mockSeoEntries[path] ?? null
}

export function getActiveCase(): Case | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockActiveCase
}

export function listClues(caseId?: string): Clue[] {
  throwIfError()
  let clues = caseId
    ? mockClues.filter((c) => c.caseId === caseId)
    : [...mockClues]

  if (isScenario('blocked')) {
    clues = clues.map((c, index) =>
      index >= 2
        ? {
            ...c,
            status: 'bloqueado' as const,
            blockedReason: 'Libera no próximo ciclo',
          }
        : c,
    )
  }

  const result = shouldReturnEmpty(clues)
  return result ?? clues
}

export function getClueBySlug(slug: string): Clue | null {
  throwIfError()
  return mockClues.find((c) => c.slug === slug) ?? null
}

export function getSubscriberProgress(
  caseId?: string,
): SubscriberProgress | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  if (caseId && mockSubscriberProgress.caseId !== caseId) {
    return null
  }
  return mockSubscriberProgress
}

export function resetMockState(): void {
  cartState = structuredClone(initialCart)
  subscriptionState = structuredClone(mockSubscription)
  paymentsState = structuredClone(mockPayments)
}

export function getActiveScenarioLabel(): string {
  return getActiveScenario()
}

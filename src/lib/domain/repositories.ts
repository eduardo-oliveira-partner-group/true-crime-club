import { apiClient } from '@/src/lib/api-client'

import {
  initialCart,
  mockActiveCase,
  mockAddresses,
  mockClues,
  mockCmsMenus,
  mockCmsPages,
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
import type { AvailabilityStatus, BillingInterval, ProductType } from './types'
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
  MenuCms,
  Order,
  PaginaCms,
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

function isConnectionRefused(error: any): boolean {
  if (!error) return false
  if (error.code === 'ECONNREFUSED') return true
  if (error.cause) {
    if (error.cause.code === 'ECONNREFUSED') return true
    if (Array.isArray(error.cause.errors)) {
      return error.cause.errors.some((err: any) => err?.code === 'ECONNREFUSED')
    }
  }
  const msg = String(error.message || '')
  const causeMsg = error.cause ? String(error.cause.message || '') : ''
  return msg.includes('ECONNREFUSED') || causeMsg.includes('ECONNREFUSED')
}

function throwIfError(): void {
  if (isScenario('error')) {
    throw new Error(getScenarioErrorMessage())
  }
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

export async function listProducts(options?: {
  featured?: boolean
  category?: string
}): Promise<Product[]> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiProducts = await apiClient.products.list({
        featured: options?.featured,
        category: options?.category,
      })
      return apiProducts.map(mapApiProductToDomain)
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API listProducts error, falling back to local mocks:', e)
      }
    }
  }

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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiProduct = await apiClient.products.getBySlug(slug)
      return mapApiProductToDomain(apiProduct)
    } catch (error: any) {
      const msg = error?.message || ''
      if (
        msg.includes('404') ||
        msg.toLowerCase().includes('não encontrado') ||
        msg.toLowerCase().includes('nao encontrado')
      ) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn(
          'API getProductBySlug error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  const product = mockProducts.find((p) => p.slug === slug) ?? null
  if (!product && isScenario('empty')) {
    return null
  }
  if (isScenario('product_unavailable') && product) {
    return { ...product, inStock: false, availability: 'out_of_stock' }
  }
  return product
}

export async function listPlans(): Promise<SubscriptionPlan[]> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiPlans = await apiClient.plans.list()
      return apiPlans.map(mapApiPlanToDomain)
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API listPlans error, falling back to local mocks:', e)
      }
    }
  }

  const result = shouldReturnEmpty(mockPlans)
  return result ?? mockPlans
}

export async function getPlanBySlug(
  slug: string,
): Promise<SubscriptionPlan | null> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiPlan = await apiClient.plans.getBySlug(slug)
      return mapApiPlanToDomain(apiPlan)
    } catch (error: any) {
      const msg = error?.message || ''
      if (
        msg.includes('404') ||
        msg.toLowerCase().includes('não encontrado') ||
        msg.toLowerCase().includes('nao encontrado')
      ) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn(
          'API getPlanBySlug error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return mockPlans.find((p) => p.slug === slug) ?? null
}

function mapApiProductToDomain(apiProduct: any): Product {
  const availabilityMap: Record<string, AvailabilityStatus> = {
    disponivel: 'available',
    limitado: 'limited',
    esgotado: 'out_of_stock',
    em_breve: 'coming_soon',
  }

  const typeMap: Record<string, ProductType> = {
    caixa: 'box',
    produto: 'product',
  }

  return {
    id: apiProduct.id,
    slug: apiProduct.identificador,
    name: apiProduct.nome,
    description: apiProduct.descricao ?? '',
    shortDescription: apiProduct.descricaoCurta ?? '',
    type: typeMap[apiProduct.tipo] ?? 'product',
    price: apiProduct.preco,
    subscriberPrice: apiProduct.precoAssinante,
    images: apiProduct.imagens ?? [],
    categories: apiProduct.categorias ?? [],
    inStock: apiProduct.emEstoque ?? false,
    availability: availabilityMap[apiProduct.disponibilidade] ?? 'available',
    featured:
      apiProduct.categorias?.includes('destaque') ||
      apiProduct.destaque ||
      false,
    includedItems: apiProduct.itensInclusos,
    relatedProductIds: apiProduct.relacionados,
    editionMonth: apiProduct.mesEdicao,
    cycleNumber: apiProduct.ciclo,
  }
}

function mapApiPlanToDomain(apiPlan: any): SubscriptionPlan {
  const billingIntervalMap: Record<string, BillingInterval> = {
    mensal: 'monthly',
    anual: 'annual',
    avulso: 'one_time',
  }

  return {
    id: apiPlan.id,
    slug: apiPlan.identificador,
    name: apiPlan.nome,
    description: apiPlan.descricao ?? '',
    billingInterval: billingIntervalMap[apiPlan.intervaloCobranca] ?? 'monthly',
    price: apiPlan.preco,
    pricePerMonth: apiPlan.precoPorMes,
    isRecommended: apiPlan.recomendado ?? false,
    features: apiPlan.beneficios ?? [],
    commitmentMonths: apiPlan.mesesCompromisso,
  }
}

export async function getCart(): Promise<Cart> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      return await apiClient.cart.get()
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API getCart error, falling back to local mocks:', e)
      }
    }
  }

  return structuredClone(cartState)
}

export async function addCartItem(input: {
  productId: string
  quantity?: number
}): Promise<Cart> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      return await apiClient.cart.addItem(input.productId, input.quantity ?? 1)
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API addCartItem error, falling back to local mocks:', e)
        throw e
      }
    }
  }

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

  return await getCart()
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<Cart> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      return await apiClient.cart.updateQuantity(itemId, quantity)
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API updateCartItemQuantity error, falling back to local mocks:', e)
        throw e
      }
    }
  }

  const item = cartState.items.find((i) => i.id === itemId)
  if (!item) {
    throw new Error('Item não encontrado no carrinho.')
  }
  if (quantity <= 0) {
    cartState.items = cartState.items.filter((i) => i.id !== itemId)
  } else {
    item.quantity = quantity
  }
  return await getCart()
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      return await apiClient.cart.removeItem(itemId)
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API removeCartItem error, falling back to local mocks:', e)
        throw e
      }
    }
  }

  cartState.items = cartState.items.filter((i) => i.id !== itemId)
  return await getCart()
}

export async function calculateShipping(zipCode: string): Promise<ShippingEstimate> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiResult = await apiClient.checkout.calculateShipping(zipCode)
      return {
        region: apiResult.regiao,
        price: apiResult.preco,
        estimatedDays: apiResult.prazoEstimado,
      }
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API calculateShipping error, falling back to local mocks:', e)
      }
    }
  }

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

export async function applyCoupon(code: string): Promise<CouponResult> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiResult = await apiClient.cart.applyCoupon(code)
      return {
        valid: apiResult.valido ?? apiResult.valid ?? false,
        code: apiResult.codigo ?? apiResult.code ?? code,
        discount: apiResult.desconto ?? apiResult.discount ?? 0,
        message: apiResult.mensagem ?? apiResult.message ?? '',
      }
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API applyCoupon error, falling back to local mocks:', e)
        throw e
      }
    }
  }

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

export function getCartTotals(cart: Cart) {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const discount = cart.couponDiscount ?? 0
  const shipping = cart.shippingEstimate ?? 0
  const total = Math.max(subtotal - discount + shipping, 0)

  return { subtotal, discount, shipping, total }
}

function mapApiOrderToDomain(apiOrder: any): Order {
  const statusMap: Record<string, Order['status']> = {
    pagamento_pendente: 'pending_payment',
    pago: 'paid',
    em_processamento: 'processing',
    aguardando_envio: 'awaiting_shipment',
    enviado: 'shipped',
    entregue: 'delivered',
    cancelado: 'cancelled',
  }

  const paymentStatusMap: Record<string, Order['paymentStatus']> = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  }

  return {
    id: apiOrder.id,
    orderNumber: apiOrder.numeroPedido,
    customerId: apiOrder.idCliente ?? mockCustomer.id,
    items: Array.isArray(apiOrder.itens)
      ? apiOrder.itens.map((item: any) => ({
          id: item.id,
          productId: item.idProduto,
          productSlug: item.identificadorProduto,
          productName: item.nomeProduto,
          productType: item.tipoProduto === 'caixa' ? 'box' : 'product',
          quantity: item.quantidade,
          unitPrice: item.precoUnitario,
          image: item.imagem,
        }))
      : [],
    status: statusMap[apiOrder.status] ?? 'paid',
    paymentStatus: paymentStatusMap[apiOrder.statusPagamento] ?? 'paid',
    subtotal: apiOrder.subtotal,
    shipping: apiOrder.frete,
    discount: apiOrder.desconto,
    total: apiOrder.total,
    createdAt: apiOrder.criadoEm,
    billingCycleNote: apiOrder.observacaoCicloCobranca,
    shippingCycleNote: apiOrder.observacaoCicloEnvio,
    trackingCode: apiOrder.codigoRastreio,
    trackingUrl: apiOrder.urlRastreio,
    invoicePlaceholder: apiOrder.notaFiscalPlaceholder ?? 'Nota fiscal disponível após confirmação do pagamento.',
  }
}

export async function createOrder(input?: {
  customerId?: string
  shipping?: number
  enderecoId?: string
  pagamentoMetodoId?: string
}): Promise<Order> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiOrder = await apiClient.checkout.createOrder({
        enderecoId: input?.enderecoId,
        pagamentoMetodoId: input?.pagamentoMetodoId,
      })
      const mapped = mapApiOrderToDomain(apiOrder)
      mockOrders.unshift(mapped)
      cartState = structuredClone(initialCart)
      return mapped
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API createOrder error, falling back to local mocks:', e)
      }
    }
  }

  const cart = structuredClone(cartState)
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

export async function listOrders(): Promise<Order[]> {
  throwIfError()

  const isLocalMockMode =
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'

  if (!isLocalMockMode) {
    try {
      const apiOrders = await apiClient.customer.listOrders()
      const mapped = apiOrders.map(mapApiOrderToDomain)
      return mapped
    } catch (e) {
      if (!isConnectionRefused(e)) {
        console.warn('API listOrders error, falling back to local mocks:', e)
      }
    }
  }

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
  const cmsPage = mockCmsPages.find((page) => page.rota === path)
  if (cmsPage) {
    return {
      title: cmsPage.seo.titulo,
      description: cmsPage.seo.descricao,
      canonical: cmsPage.seo.urlCanonica,
      ogImage: cmsPage.seo.imagemCompartilhamento,
      noindex: cmsPage.seo.naoIndexar,
    }
  }
  return mockSeoEntries[path] ?? null
}

export async function getCmsPageByRoute(
  route: string,
): Promise<PaginaCms | null> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(
        `${baseUrl}/paginas?rota=${encodeURIComponent(route)}`,
        {
          next: { revalidate: 300 },
        },
      )
      if (!res.ok) return null
      const data = await res.json()
      return Array.isArray(data) ? data[0] : data
    } catch (e) {
      console.error('Error fetching CMS page by route:', e)
    }
  }
  return mockCmsPages.find((p) => p.rota === route) ?? null
}

export async function listCmsPages(): Promise<PaginaCms[]> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/paginas`, {
        next: { revalidate: 300 },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error('Error listing CMS pages:', e)
    }
  }
  return mockCmsPages
}

export async function getCmsMenu(chave: string): Promise<MenuCms | null> {
  throwIfError()
  const baseUrl = process.env.CMS_DELIVERY_BASE_URL
  if (baseUrl) {
    try {
      const res = await fetch(`${baseUrl}/menus/${encodeURIComponent(chave)}`, {
        next: { revalidate: 300 },
      })
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {
      console.error('Error fetching CMS menu:', e)
    }
  }
  return mockCmsMenus[chave] ?? null
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

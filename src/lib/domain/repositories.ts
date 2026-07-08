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
  CaseFile,
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

function isLocalMockMode(): boolean {
  return (
    !process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LOCAL_MOCK === 'true' ||
    process.env.NEXT_PUBLIC_MOCK_MODE === 'true' ||
    process.env.LOCAL_MOCK_MODE === 'true'
  )
}

function isNotFoundError(error: any): boolean {
  const msg = String(error?.message || '')
  return (
    msg.includes('404') ||
    msg.toLowerCase().includes('não encontrado') ||
    msg.toLowerCase().includes('nao encontrado') ||
    msg.toLowerCase().includes('nenhuma assinatura')
  )
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
    invoicePlaceholder:
      apiOrder.notaFiscalPlaceholder ??
      'Nota fiscal disponível após confirmação do pagamento.',
  }
}

function mapApiPaymentToDomain(apiPayment: any): Payment {
  const statusMap: Record<string, Payment['status']> = {
    pendente: 'pending',
    pago: 'paid',
    recusado: 'refused',
    expirado: 'expired',
    estornado: 'refunded',
  }

  const methodMap: Record<string, Payment['method']> = {
    cartao_credito: 'credit_card',
    pix: 'pix',
  }

  return {
    id: apiPayment.id,
    orderId: apiPayment.idPedido,
    subscriptionId: apiPayment.idAssinatura,
    amount: apiPayment.valor,
    status: statusMap[apiPayment.status] ?? 'paid',
    method: methodMap[apiPayment.metodo] ?? 'credit_card',
    dueDate: apiPayment.vencimento,
    paidAt: apiPayment.pagoEm,
    pixQrCode: apiPayment.pixQrCode,
    pixExpiresAt: apiPayment.pixExpiraEm,
    refusalReason: apiPayment.motivoRecusa,
  }
}

function mapApiInvoiceToDomain(apiInvoice: any): Invoice {
  return {
    id: apiInvoice.id,
    number: apiInvoice.numero,
    paymentId: apiInvoice.idPagamento,
    amount: apiInvoice.valor,
    issuedAt: apiInvoice.emitidoEm,
    receiptUrl: apiInvoice.urlRecibo,
    downloadUrl: apiInvoice.urlDownload,
  }
}

function mapApiCaseFileToDomain(file: any): CaseFile {
  const typeMap: Record<string, 'pdf' | 'image' | 'audio' | 'video'> = {
    pdf: 'pdf',
    imagem: 'image',
    audio: 'audio',
    video: 'video',
  }

  return {
    id: file.id,
    name: file.nome,
    type: typeMap[file.tipo] ?? 'pdf',
    downloadUrl: file.urlDownload,
    sizeLabel: file.tamanho,
  }
}

function mapApiSubscriptionToDomain(apiSub: any): Subscription {
  const statusMap: Record<string, Subscription['status']> = {
    ativa: 'active',
    pagamento_pendente: 'pending_payment',
    cancelada: 'cancelled',
    pausada: 'paused',
    vencida: 'past_due',
  }

  return {
    id: apiSub.id,
    customerId: apiSub.idCliente ?? mockCustomer.id,
    planId: apiSub.idPlano,
    planName: apiSub.nomePlano,
    status: statusMap[apiSub.status] ?? 'active',
    startedAt: apiSub.iniciadaEm,
    nextBillingDate: apiSub.proximaCobrancaEm,
    nextBillingAmount: apiSub.valorProximaCobranca,
    currentCycleBoxId: apiSub.idCaixaCicloAtual,
    currentCycleBoxName: apiSub.nomeCaixaCicloAtual,
    canCancel: apiSub.podeCancelar ?? false,
    canReactivate: apiSub.podeReativar ?? false,
    cancelledAt: apiSub.canceladaEm,
  }
}

function mapApiCaseToDomain(apiCase: any): Case {
  return {
    id: apiCase.id,
    slug: apiCase.identificador,
    title: apiCase.titulo,
    description: apiCase.descricao,
    year: apiCase.ano,
    totalClues: apiCase.totalPistas,
    liveEventDate: apiCase.dataEventoAoVivo,
    liveEventTitle: apiCase.tituloEventoAoVivo,
  }
}

function mapApiProgressToDomain(apiProgress: any): SubscriberProgress {
  return {
    caseId: apiProgress.idCaso,
    collectedClues: apiProgress.pistasColetadas,
    totalClues: apiProgress.totalPistas,
    currentCycle: apiProgress.cicloAtual,
    liveEventDate: apiProgress.dataEventoAoVivo,
    liveEventTitle: apiProgress.tituloEventoAoVivo,
    percentComplete: apiProgress.percentualCompleto,
  }
}

function mapApiClueToDomain(apiClue: any): Clue {
  return {
    id: apiClue.id,
    slug: apiClue.identificador,
    caseId: apiClue.idCaso,
    title: apiClue.titulo,
    description: apiClue.descricao,
    cycleNumber: apiClue.numeroCiclo,
    status: apiClue.status === 'bloqueado' ? 'bloqueado' : 'liberado',
    blockedReason: apiClue.motivoBloqueio,
    files: Array.isArray(apiClue.arquivos)
      ? apiClue.arquivos.map(mapApiCaseFileToDomain)
      : [],
    releasedAt: apiClue.liberadoEm,
  }
}

function mapApiExclusiveContentToDomain(apiContent: any): ExclusiveContent {
  const contentTypeMap: Record<string, ExclusiveContent['type']> = {
    pista: 'clue',
    video: 'video',
    documento: 'document',
    artigo: 'article',
  }

  return {
    id: apiContent.id,
    slug: apiContent.identificador,
    title: apiContent.titulo,
    description: apiContent.descricao,
    status: apiContent.status === 'bloqueado' ? 'bloqueado' : 'liberado',
    cycleNumber: apiContent.numeroCiclo,
    blockedReason: apiContent.motivoBloqueio,
    type: contentTypeMap[apiContent.tipo] ?? 'clue',
    files: Array.isArray(apiContent.arquivos)
      ? apiContent.arquivos.map(mapApiCaseFileToDomain)
      : [],
  }
}

async function fetchCasesBundle(): Promise<{
  activeCase: Case | null
  progress: SubscriberProgress | null
  clues: Clue[]
} | null> {
  if (isLocalMockMode()) {
    return null
  }

  try {
    const data = await apiClient.cases.getData()
    return {
      activeCase: data.casoAtivo ? mapApiCaseToDomain(data.casoAtivo) : null,
      progress: data.progresso ? mapApiProgressToDomain(data.progresso) : null,
      clues: Array.isArray(data.pistas)
        ? data.pistas.map(mapApiClueToDomain)
        : [],
    }
  } catch (error) {
    if (!isConnectionRefused(error)) {
      console.warn('API cases.getData error, falling back to local mocks:', error)
    }
    return null
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

export function getCurrentCustomerMock(): Customer | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockCustomer
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  const profile = await getCustomerProfile()
  return profile.customer
}

export async function getCustomerProfile(): Promise<{
  customer: Customer | null
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      return await apiClient.customer.getProfile()
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn('API getProfile error, falling back to local mocks:', error)
      }
    }
  }

  return {
    customer: getCurrentCustomerMock(),
    addresses: listAddressesMock(),
    paymentMethods: listPaymentMethodsMock(),
  }
}

export async function updateCustomerProfile(body: {
  name?: string
  email?: string
  phone?: string
  preferences?: Partial<SubscriberPreferences>
}): Promise<Customer> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      return await apiClient.customer.updateProfile(body)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API updateProfile error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return updateCustomerProfileMock(body)
}

export function updateCustomerProfileMock(body: {
  name?: string
  email?: string
  phone?: string
  preferences?: Partial<SubscriberPreferences>
}): Customer {
  if (body.name !== undefined) mockCustomer.name = body.name
  if (body.email !== undefined) mockCustomer.email = body.email
  if (body.phone !== undefined) mockCustomer.phone = body.phone
  if (body.preferences !== undefined) {
    mockCustomer.preferences = {
      ...mockCustomer.preferences,
      ...body.preferences,
    }
  }
  return mockCustomer
}

export async function addCustomerAddress(body: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}): Promise<Address[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      return await apiClient.customer.addAddress(body)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn('API addAddress error, falling back to local mocks:', error)
      }
    }
  }

  return addCustomerAddressMock(body)
}

export function addCustomerAddressMock(body: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}): Address[] {
  const newAddress: Address = {
    id: `addr-${Date.now()}`,
    label: body.label,
    street: body.street,
    number: body.number,
    complement: body.complement,
    neighborhood: body.neighborhood,
    city: body.city,
    state: body.state,
    zipCode: body.zipCode,
    isDefault: mockAddresses.length === 0,
  }

  mockAddresses.push(newAddress)
  return [...mockAddresses]
}

export async function deleteCustomerAddress(id: string): Promise<Address[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      return await apiClient.customer.deleteAddress(id)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API deleteAddress error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return deleteCustomerAddressMock(id)
}

export function deleteCustomerAddressMock(id: string): Address[] {
  const index = mockAddresses.findIndex((addr) => addr.id === id)
  if (index !== -1) {
    mockAddresses.splice(index, 1)
  }
  return [...mockAddresses]
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

export function listAddressesMock(): Address[] {
  throwIfError()
  const result = shouldReturnEmpty(mockAddresses)
  return result ?? mockAddresses
}

export function listPaymentMethodsMock(): PaymentMethod[] {
  throwIfError()
  const result = shouldReturnEmpty(mockPaymentMethods)
  return result ?? mockPaymentMethods
}

export async function listAddresses(): Promise<Address[]> {
  const profile = await getCustomerProfile()
  return profile.addresses
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  const profile = await getCustomerProfile()
  return profile.paymentMethods
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

  return listOrdersMock()
}

export function listOrdersMock(): Order[] {
  throwIfError()
  const result = shouldReturnEmpty(mockOrders)
  return result ?? mockOrders
}

export async function getOrderById(id: string): Promise<Order | null> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiOrder = await apiClient.customer.getOrder(id)
      return mapApiOrderToDomain(apiOrder)
    } catch (error) {
      if (isNotFoundError(error)) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn('API getOrderById error, falling back to local mocks:', error)
      }
    }
  }

  return getOrderByIdMock(id)
}

export function getOrderByIdMock(id: string): Order | null {
  return mockOrders.find((o) => o.id === id) ?? null
}

export async function getSubscription(): Promise<Subscription | null> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiSub = await apiClient.customer.getSubscription()
      return mapApiSubscriptionToDomain(apiSub)
    } catch (error) {
      if (isNotFoundError(error)) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn(
          'API getSubscription error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return getSubscriptionMock()
}

export function getSubscriptionMock(): Subscription | null {
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

export async function cancelSubscription(): Promise<Subscription> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiSub = await apiClient.customer.cancelSubscription()
      return mapApiSubscriptionToDomain(apiSub)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API cancelSubscription error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return cancelSubscriptionMock()
}

export function cancelSubscriptionMock(): Subscription {
  subscriptionState = {
    ...subscriptionState,
    status: 'cancelled',
    canCancel: false,
    canReactivate: true,
    cancelledAt: new Date().toISOString(),
  }
  return subscriptionState
}

export async function reactivateSubscription(): Promise<Subscription> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiSub = await apiClient.customer.reactivateSubscription()
      return mapApiSubscriptionToDomain(apiSub)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API reactivateSubscription error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return reactivateSubscriptionMock()
}

export function reactivateSubscriptionMock(): Subscription {
  subscriptionState = {
    ...subscriptionState,
    status: 'active',
    canCancel: true,
    canReactivate: false,
    cancelledAt: undefined,
  }
  return subscriptionState
}

export async function listPayments(): Promise<Payment[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiPayments = await apiClient.customer.listPayments()
      return apiPayments.map(mapApiPaymentToDomain)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API listPayments error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return listPaymentsMock()
}

export function listPaymentsMock(): Payment[] {
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

export async function listInvoices(): Promise<Invoice[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiInvoices = await apiClient.customer.listInvoices()
      return apiInvoices.map(mapApiInvoiceToDomain)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API listInvoices error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return listInvoicesMock()
}

export function listInvoicesMock(): Invoice[] {
  throwIfError()
  const result = shouldReturnEmpty(mockInvoices)
  return result ?? mockInvoices
}

export async function renewPixPayment(paymentId: string): Promise<Payment> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiPayment = await apiClient.customer.renewPixPayment(paymentId)
      const mapped = mapApiPaymentToDomain(apiPayment)
      paymentsState = paymentsState.map((payment) =>
        payment.id === paymentId ? mapped : payment,
      )
      return mapped
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API renewPixPayment error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return renewPixPaymentMock(paymentId)
}

export function renewPixPaymentMock(paymentId: string): Payment {
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

export async function updateCard(input: {
  holderName: string
  lastFour: string
  brand: string
}): Promise<PaymentMethod> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      return await apiClient.customer.updateCard(input)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn('API updateCard error, falling back to local mocks:', error)
      }
    }
  }

  return updateCardMock(input)
}

export function updateCardMock(input: {
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

export async function listExclusiveContent(): Promise<ExclusiveContent[]> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiContent = await apiClient.exclusiveContent.list()
      return apiContent.map(mapApiExclusiveContentToDomain)
    } catch (error) {
      if (!isConnectionRefused(error)) {
        console.warn(
          'API listExclusiveContent error, falling back to local mocks:',
          error,
        )
      }
    }
  }

  return listExclusiveContentMock()
}

export function listExclusiveContentMock(): ExclusiveContent[] {
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

export async function getExclusiveContentBySlug(
  slug: string,
): Promise<ExclusiveContent | null> {
  throwIfError()

  if (!isLocalMockMode()) {
    try {
      const apiContent = await apiClient.exclusiveContent.getBySlug(slug)
      return mapApiExclusiveContentToDomain(apiContent)
    } catch (error) {
      if (isNotFoundError(error)) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn(
          'API getExclusiveContentBySlug error, falling back to local mocks:',
          error,
        )
      }
    }
  }

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

export async function getActiveCase(): Promise<Case | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    return bundle.activeCase
  }

  return getActiveCaseMock()
}

export function getActiveCaseMock(): Case | null {
  throwIfError()
  if (isScenario('empty')) {
    return null
  }
  return mockActiveCase
}

export async function listClues(caseId?: string): Promise<Clue[]> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    return caseId
      ? bundle.clues.filter((c) => c.caseId === caseId)
      : bundle.clues
  }

  return listCluesMock(caseId)
}

export function listCluesMock(caseId?: string): Clue[] {
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

export async function getClueBySlug(slug: string): Promise<Clue | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle) {
    const fromBundle = bundle.clues.find((c) => c.slug === slug)
    if (fromBundle) {
      return fromBundle
    }
  }

  if (!isLocalMockMode()) {
    try {
      const apiContent = await apiClient.exclusiveContent.getBySlug(slug)
      const mapped = mapApiExclusiveContentToDomain(apiContent)
      return {
        id: mapped.id,
        slug: mapped.slug,
        caseId: bundle?.activeCase?.id ?? mockActiveCase.id,
        title: mapped.title,
        description: mapped.description,
        cycleNumber: mapped.cycleNumber,
        status: mapped.status,
        blockedReason: mapped.blockedReason,
        files: mapped.files ?? [],
      }
    } catch (error) {
      if (isNotFoundError(error)) {
        return null
      }
      if (!isConnectionRefused(error)) {
        console.warn('API getClueBySlug error, falling back to local mocks:', error)
      }
    }
  }

  return mockClues.find((c) => c.slug === slug) ?? null
}

export async function getSubscriberProgress(
  caseId?: string,
): Promise<SubscriberProgress | null> {
  throwIfError()

  const bundle = await fetchCasesBundle()
  if (bundle?.progress) {
    if (caseId && bundle.progress.caseId !== caseId) {
      return null
    }
    return bundle.progress
  }

  return getSubscriberProgressMock(caseId)
}

export function getSubscriberProgressMock(
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

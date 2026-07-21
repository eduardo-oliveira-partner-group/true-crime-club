import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import {
  mockCmsMenus,
  mockCmsPages,
  mockDynamicContent,
} from '@/src/lib/domain/mock-data'
import {
  addCard,
  addCustomerAddressMock,
  cancelSubscriptionMock,
  createCustomerMock,
  createOrder,
  deleteCard,
  deleteCustomerAddressMock,
  getActiveCaseMock,
  getCurrentCustomerMock,
  getDynamicContent,
  getDynamicContentByRoute,
  getOrderByIdMock,
  getProductBySlug,
  getSeoEntry,
  getSubscriberProgressMock,
  getSubscriptionMock,
  listAddressesMock,
  listCluesMock,
  listExclusiveContentMock,
  listInvestigationFilesByBoxMock,
  listInvoicesMock,
  listOrdersMock,
  listPaymentMethodsMock,
  listPaymentsMock,
  listPlans,
  listProducts,
  reactivateSubscriptionMock,
  renewPixPaymentMock,
  updateCardMock,
  updateCustomerProfileMock,
} from '@/src/lib/domain/repositories'
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
  InvestigationFile,
  Invoice,
  Order,
  Payment,
  PaymentMethod,
  Product,
  SeoEntry,
  ShippingEstimate,
  SubscriberProgress,
  Subscription,
  SubscriptionPlan,
} from '@/src/lib/domain/types'
import {
  addCartItemWithTotals,
  applyCoupon,
  calculateShipping,
  getCartWithTotals,
  removeCartItemWithTotals,
  updateCartItemQuantityWithTotals,
} from '@/src/lib/server/cart'

type RouteContext = { params: Promise<{ rota: string[] }> }
type JsonBody = Record<string, unknown>

const PRODUCT_ID_PREFIX = /^produto-/
const ORDER_ID_PREFIX = /^pedido-/
const ADDRESS_ID_PREFIX = /^endereco-/

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

function error(message: string, status = 400) {
  return json({ mensagem: message }, status)
}

async function readJson(request: Request): Promise<JsonBody> {
  try {
    return (await request.json()) as JsonBody
  } catch {
    return {}
  }
}

function normalizeProductId(id: string) {
  return id.replace(PRODUCT_ID_PREFIX, 'prod-')
}

function normalizeAddressId(id: string) {
  return id.replace(ADDRESS_ID_PREFIX, 'addr-')
}

function normalizeOrderId(id: string) {
  return id.replace(ORDER_ID_PREFIX, 'ord-')
}

function toProductType(type: Product['type']) {
  return type === 'box' ? 'caixa' : 'produto'
}

function toAvailability(availability: Product['availability']) {
  const map: Record<Product['availability'], string> = {
    available: 'disponivel',
    limited: 'limitado',
    out_of_stock: 'esgotado',
    coming_soon: 'em_breve',
  }
  return map[availability]
}

function toBillingInterval(interval: SubscriptionPlan['billingInterval']) {
  const map: Record<SubscriptionPlan['billingInterval'], string> = {
    monthly: 'mensal',
    annual: 'anual',
    one_time: 'avulso',
  }
  return map[interval]
}

function toOrderStatus(status: Order['status']) {
  const map: Record<Order['status'], string> = {
    pending_payment: 'pagamento_pendente',
    paid: 'pago',
    processing: 'em_processamento',
    awaiting_shipment: 'aguardando_envio',
    shipped: 'enviado',
    delivered: 'entregue',
    cancelled: 'cancelado',
  }
  return map[status]
}

function toPaymentStatus(status: Order['paymentStatus']) {
  const map: Record<Order['paymentStatus'], string> = {
    pending: 'pendente',
    paid: 'pago',
    refused: 'recusado',
    expired: 'expirado',
    refunded: 'estornado',
  }
  return map[status]
}

function toSubscriptionStatus(status: Subscription['status']) {
  const map: Record<Subscription['status'], string> = {
    active: 'ativa',
    pending_payment: 'pagamento_pendente',
    cancelled: 'cancelada',
    paused: 'pausada',
    past_due: 'vencida',
  }
  return map[status]
}

function toFileType(type: CaseFile['type']) {
  const map: Record<CaseFile['type'], string> = {
    pdf: 'pdf',
    image: 'imagem',
    audio: 'audio',
    video: 'video',
  }
  return map[type]
}

function toContentType(type: ExclusiveContent['type']) {
  const map: Record<ExclusiveContent['type'], string> = {
    clue: 'pista',
    video: 'video',
    document: 'documento',
    article: 'artigo',
  }
  return map[type]
}

function toDynamicType(type: DynamicContentBlock['type']) {
  const map: Record<DynamicContentBlock['type'], string> = {
    text: 'texto',
    banner: 'banner',
    image: 'imagem',
    html: 'html',
  }
  return map[type]
}

function toPreferences(preferences: Customer['preferences']) {
  if (!preferences) return undefined
  return {
    tamanhoCamiseta: preferences.shirtSize,
    tamanhoCalcado: preferences.shoeSize,
    observacoes: preferences.notes,
  }
}

function fromPreferences(preferences: unknown) {
  if (!preferences || typeof preferences !== 'object') return undefined
  const input = preferences as Record<string, unknown>
  return {
    shirtSize: input.tamanhoCamiseta as string | undefined,
    shoeSize: input.tamanhoCalcado as string | undefined,
    notes: input.observacoes as string | undefined,
  }
}

function toCustomer(customer: Customer) {
  return {
    id_cliente: Number.isFinite(Number(customer.id))
      ? Number(customer.id)
      : customer.id,
    nome: customer.name,
    email: customer.email,
    telefone: customer.phone,
    documento: customer.document,
    preferencias: toPreferences(customer.preferences),
  }
}

function toAddress(address: Address) {
  const id = Number(address.id)
  return {
    id: Number.isFinite(id) ? id : address.id,
    rotulo: address.label,
    logradouro: address.street,
    numero: address.number,
    complemento: address.complement,
    bairro: address.neighborhood,
    cidade: address.city,
    estado: address.state,
    cep: address.zipCode,
    padrao: address.isDefault,
  }
}

function toPaymentMethod(method: PaymentMethod) {
  return {
    id: method.id,
    tipo: method.type === 'credit_card' ? 'cartao_credito' : 'pix',
    rotulo: method.label,
    ultimosQuatro: method.lastFour,
    bandeira: method.brand,
    padrao: method.isDefault,
  }
}

function toArquivoCasoInvestigativo(file: InvestigationFile) {
  return {
    id: file.id,
    nome: file.name,
    tipo: file.type,
    modificadoEm: file.modified,
    tamanho: file.size,
    urlDownload: file.downloadUrl,
    conteudo: file.content,
    corrompido: file.corrupted,
    colunas: file.columns,
    linhas: file.rows,
    fragmento: file.fragment,
  }
}

function toProduct(product: Product) {
  return {
    id: product.id,
    identificador: product.slug,
    nome: product.name,
    tipo: toProductType(product.type),
    preco: product.price,
    precoAssinante: product.subscriberPrice,
    imagens: product.images,
    categorias: product.categories,
    emEstoque: product.inStock,
    disponibilidade: toAvailability(product.availability),
  }
}

function toProductDetails(product: Product) {
  return {
    ...toProduct(product),
    descricao: product.description,
    descricaoCurta: product.shortDescription,
    itensInclusos: product.includedItems,
    mesEdicao: product.editionMonth,
    ciclo: product.cycleNumber,
    relacionados: product.relatedProductIds,
  }
}

function toPlan(plan: SubscriptionPlan) {
  return {
    id: plan.id,
    identificador: plan.slug,
    nome: plan.name,
    descricao: plan.description,
    intervaloCobranca: toBillingInterval(plan.billingInterval),
    preco: plan.price,
    precoPorMes: plan.pricePerMonth,
    recomendado: plan.isRecommended,
    beneficios: plan.features,
    mesesCompromisso: plan.commitmentMonths,
  }
}

function toCartItem(item: CartItem) {
  return {
    id: item.id,
    idProduto: item.productId,
    identificadorProduto: item.productSlug,
    nomeProduto: item.productName,
    tipoProduto: toProductType(item.productType),
    quantidade: item.quantity,
    precoUnitario: item.unitPrice,
    imagem: item.image,
  }
}

function toCart(
  cart: Cart & {
    subtotal?: number
    discount?: number
    shipping?: number
    total?: number
  },
) {
  return {
    id: cart.id,
    itens: cart.items.map(toCartItem),
    codigoCupom: cart.couponCode,
    descontoCupom: cart.couponDiscount,
    freteEstimado: cart.shippingEstimate ?? cart.shipping,
    regiaoFrete: cart.shippingRegion,
    subtotal: cart.subtotal,
    desconto: cart.discount,
    total: cart.total,
  }
}

function toCoupon(result: CouponResult) {
  return {
    valido: result.valid,
    codigo: result.code,
    desconto: result.discount,
    mensagem: result.message,
  }
}

function toShipping(shipping: ShippingEstimate) {
  return {
    regiao: shipping.region,
    preco: shipping.price,
    prazoEstimado: shipping.estimatedDays,
  }
}

function toOrder(order: Order) {
  return {
    id: order.id,
    numeroPedido: order.orderNumber,
    status: toOrderStatus(order.status),
    statusPagamento: toPaymentStatus(order.paymentStatus),
    subtotal: order.subtotal,
    frete: order.shipping,
    desconto: order.discount,
    total: order.total,
    criadoEm: order.createdAt,
    observacaoCicloCobranca: order.billingCycleNote,
    observacaoCicloEnvio: order.shippingCycleNote,
  }
}

function toOrderDetails(order: Order) {
  return {
    ...toOrder(order),
    itens: order.items.map(toCartItem),
  }
}

function toSubscription(subscription: Subscription) {
  return {
    id: subscription.id,
    idCliente: subscription.customerId,
    idPlano: subscription.planId,
    nomePlano: subscription.planName,
    status: toSubscriptionStatus(subscription.status),
    iniciadaEm: subscription.startedAt,
    proximaCobrancaEm: subscription.nextBillingDate,
    valorProximaCobranca: subscription.nextBillingAmount,
    idCaixaCicloAtual: subscription.currentCycleBoxId,
    nomeCaixaCicloAtual: subscription.currentCycleBoxName,
    podeCancelar: subscription.canCancel,
    podeReativar: subscription.canReactivate,
  }
}

function toPayment(payment: Payment) {
  return {
    id: payment.id,
    idPedido: payment.orderId,
    idAssinatura: payment.subscriptionId,
    valor: payment.amount,
    status: toPaymentStatus(payment.status),
    metodo: payment.method === 'pix' ? 'pix' : 'cartao_credito',
    vencimento: payment.dueDate,
    pagoEm: payment.paidAt,
    pixQrCode: payment.pixQrCode,
    pixExpiraEm: payment.pixExpiresAt,
    motivoRecusa: payment.refusalReason,
  }
}

function toInvoice(invoice: Invoice) {
  return {
    id: invoice.id,
    numero: invoice.number,
    idPagamento: invoice.paymentId,
    valor: invoice.amount,
    emitidoEm: invoice.issuedAt,
    urlRecibo: invoice.receiptUrl,
    urlDownload: invoice.downloadUrl,
  }
}

function toCaseFile(file: CaseFile) {
  return {
    id: file.id,
    nome: file.name,
    tipo: toFileType(file.type),
    urlDownload: file.downloadUrl,
    tamanho: file.sizeLabel,
  }
}

function toExclusiveContent(content: ExclusiveContent) {
  return {
    id: content.id,
    identificador: content.slug,
    titulo: content.title,
    descricao: content.description,
    status: content.status,
    numeroCiclo: content.cycleNumber,
    tipo: toContentType(content.type),
    arquivos: content.files?.map(toCaseFile),
  }
}

function toCase(activeCase: Case) {
  return {
    id: activeCase.id,
    identificador: activeCase.slug,
    titulo: activeCase.title,
    descricao: activeCase.description,
    ano: activeCase.year,
    totalPistas: activeCase.totalClues,
    dataEventoAoVivo: activeCase.liveEventDate,
    tituloEventoAoVivo: activeCase.liveEventTitle,
  }
}

function toClue(clue: Clue) {
  return {
    id: clue.id,
    identificador: clue.slug,
    idCaso: clue.caseId,
    titulo: clue.title,
    descricao: clue.description,
    numeroCiclo: clue.cycleNumber,
    status: clue.status,
    arquivos: clue.files.map(toCaseFile),
  }
}

function toProgress(progress: SubscriberProgress) {
  return {
    idCaso: progress.caseId,
    pistasColetadas: progress.collectedClues,
    totalPistas: progress.totalClues,
    cicloAtual: progress.currentCycle,
    dataEventoAoVivo: progress.liveEventDate,
    tituloEventoAoVivo: progress.liveEventTitle,
    percentualCompleto: progress.percentComplete,
  }
}

function toDynamicContent(block: DynamicContentBlock) {
  return {
    chave: block.key,
    tipo: toDynamicType(block.type),
    valor: block.value,
    rota: block.route,
  }
}

function toSeo(entry: SeoEntry) {
  return {
    titulo: entry.title,
    descricao: entry.description,
    urlCanonica: entry.canonical,
    imagemCompartilhamento: entry.ogImage,
    naoIndexar: entry.noindex,
  }
}

async function findProduct(identifier: string) {
  const normalized = normalizeProductId(identifier)
  return (
    (await getProductBySlug(identifier)) ??
    (await listProducts()).find(
      (product) => product.id === normalized || product.slug === identifier,
    ) ??
    null
  )
}

async function findPlan(identifier: string) {
  return (
    (await listPlans()).find(
      (plan) => plan.id === identifier || plan.slug === identifier,
    ) ?? null
  )
}

async function handlePtBrApi(
  request: NextRequest,
  method: string,
  { params }: RouteContext,
) {
  const { rota } = await params
  const path = rota.join('/')
  const { searchParams } = request.nextUrl

  try {
    if (method === 'POST' && path === 'autenticacao/entrar') {
      const body = await readJson(request)
      const customer = getCurrentCustomerMock()
      if (!customer) return error('Cliente mock não encontrado', 404)

      const cookieStore = await cookies()
      cookieStore.set('tcc_session', 'mock-session-id', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return json({
        cliente: toCustomer({
          ...customer,
          email: (body.email as string | undefined) || customer.email,
        }),
      })
    }

    if (method === 'POST' && path === 'autenticacao/sair') {
      const cookieStore = await cookies()
      cookieStore.delete('tcc_session')
      return json({ sucesso: true })
    }

    if (method === 'GET' && path === 'autenticacao/cliente-atual') {
      const cookieStore = await cookies()
      const session = cookieStore.get('tcc_session')
      if (!session || session.value !== 'mock-session-id') {
        return error('Não autenticado', 401)
      }

      const customer = getCurrentCustomerMock()
      if (!customer) return error('Cliente mock não encontrado', 404)
      return json(toCustomer(customer))
    }

    if (method === 'POST' && path === 'clientes/recuperar-senha') {
      const body = await readJson(request)
      return json(
        {
          status: 'email_enviado',
          email: body.email,
          mensagem:
            'Solicitação de recuperação de senha aceita no ambiente de simulação.',
        },
        202,
      )
    }

    if (method === 'POST' && path === 'clientes') {
      const body = await readJson(request)
      const name = String(body.nome ?? '').trim()
      const email = String(body.email ?? '').trim()
      const password = String(body.senha ?? '')

      if (!name || !email || !password) {
        return error('Nome, e-mail e senha são obrigatórios.', 400)
      }

      const customer = createCustomerMock({
        name,
        email,
        phone:
          typeof body.telefone === 'string' && body.telefone.trim()
            ? body.telefone
            : undefined,
      })

      const cookieStore = await cookies()
      cookieStore.set('tcc_session', 'mock-session-id', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return json(
        {
          cliente: toCustomer(customer),
        },
        201,
      )
    }

    if (method === 'GET' && path === 'cliente/perfil') {
      const customer = getCurrentCustomerMock()
      if (!customer) return error('Cliente mock não encontrado', 404)

      return json({
        cliente: toCustomer(customer),
        enderecos: listAddressesMock().map(toAddress),
        metodosPagamento: listPaymentMethodsMock().map(toPaymentMethod),
      })
    }

    const customerMatch = path.match(/^clientes\/([^/]+)$/)
    if (method === 'PATCH' && customerMatch) {
      const body = await readJson(request)
      const customer = updateCustomerProfileMock({
        name: body.nome as string | undefined,
        email: body.email as string | undefined,
        phone: body.telefone as string | undefined,
        preferences: fromPreferences(body.preferencias),
      })
      return json(toCustomer(customer))
    }

    const addressesMatch = path.match(/^clientes\/([^/]+)\/enderecos$/)
    if (addressesMatch) {
      if (method === 'GET') {
        return json(listAddressesMock().map(toAddress))
      }

      if (method === 'POST') {
        const body = await readJson(request)
        const addresses = addCustomerAddressMock({
          label: String(body.rotulo ?? ''),
          street: String(body.logradouro ?? ''),
          number: String(body.numero ?? ''),
          complement: body.complemento as string | undefined,
          neighborhood: String(body.bairro ?? ''),
          city: String(body.cidade ?? ''),
          state: String(body.estado ?? ''),
          zipCode: String(body.cep ?? ''),
        })
        return json(addresses.map(toAddress), 201)
      }
    }

    const addressMatch = path.match(/^clientes\/([^/]+)\/enderecos\/([^/]+)$/)
    if (method === 'DELETE' && addressMatch) {
      deleteCustomerAddressMock(normalizeAddressId(addressMatch[2]))
      return json({ sucesso: true })
    }

    if (method === 'GET' && path === 'produtos') {
      const featuredParam = searchParams.get('destaque')
      const featured = featuredParam === 'true' ? true : undefined
      const category = searchParams.get('categoria') ?? undefined
      return json((await listProducts({ featured, category })).map(toProduct))
    }

    const productMatch = path.match(/^produtos\/([^/]+)$/)
    if (method === 'GET' && productMatch) {
      const product = await findProduct(decodeURIComponent(productMatch[1]))
      if (!product) return error('Produto não encontrado', 404)
      return json(toProductDetails(product))
    }

    if (method === 'GET' && path === 'planos') {
      return json((await listPlans()).map(toPlan))
    }

    const planMatch = path.match(/^planos\/([^/]+)$/)
    if (method === 'GET' && planMatch) {
      const plan = await findPlan(decodeURIComponent(planMatch[1]))
      if (!plan) return error('Plano não encontrado', 404)
      return json(toPlan(plan))
    }

    if (method === 'GET' && path === 'carrinho') {
      return json(toCart(await getCartWithTotals()))
    }

    if (method === 'POST' && path === 'carrinho/itens') {
      const body = await readJson(request)
      const cart = await addCartItemWithTotals({
        productId: normalizeProductId(String(body.idProduto ?? '')),
        quantity:
          typeof body.quantidade === 'number' ? body.quantidade : undefined,
      })
      return json(toCart(cart))
    }

    const cartItemMatch = path.match(/^carrinho\/itens\/([^/]+)$/)
    if (cartItemMatch) {
      const itemId = decodeURIComponent(cartItemMatch[1])

      if (method === 'PUT') {
        const body = await readJson(request)
        const cart = await updateCartItemQuantityWithTotals(
          itemId,
          Number(body.quantidade),
        )
        return json(toCart(cart))
      }

      if (method === 'DELETE') {
        return json(toCart(await removeCartItemWithTotals(itemId)))
      }
    }

    if (method === 'POST' && path === 'carrinho/cupom') {
      const body = await readJson(request)
      return json(toCoupon(await applyCoupon(String(body.codigo ?? ''))))
    }

    if (method === 'POST' && path === 'finalizacao/frete') {
      const body = await readJson(request)
      return json(toShipping(await calculateShipping(String(body.cep ?? ''))))
    }

    if (method === 'POST' && path === 'finalizacao/pedido') {
      return json(toOrderDetails(await createOrder()), 201)
    }

    if (method === 'GET' && path === 'cliente/pedidos') {
      return json(listOrdersMock().map(toOrder))
    }

    const orderMatch = path.match(/^cliente\/pedidos\/([^/]+)$/)
    if (method === 'GET' && orderMatch) {
      const order = getOrderByIdMock(normalizeOrderId(orderMatch[1]))
      if (!order) return error('Pedido não encontrado', 404)
      return json(toOrderDetails(order))
    }

    if (path === 'cliente/assinatura') {
      if (method === 'GET') {
        const subscription = getSubscriptionMock()
        if (!subscription) return error('Nenhuma assinatura ativa', 404)
        return json(toSubscription(subscription))
      }

      if (method === 'POST') {
        const body = await readJson(request)
        const action = body.acao
        if (action === 'cancelar')
          return json(toSubscription(cancelSubscriptionMock()))
        if (action === 'reativar') {
          return json(toSubscription(reactivateSubscriptionMock()))
        }
        return error('Ação inválida', 400)
      }
    }

    if (method === 'GET' && path === 'cliente/pagamentos') {
      return json(listPaymentsMock().map(toPayment))
    }

    const paymentMatch = path.match(/^cliente\/pagamentos\/([^/]+)$/)
    if (method === 'GET' && paymentMatch) {
      const payment = listPaymentsMock().find(
        (item) => item.id === decodeURIComponent(paymentMatch[1]),
      )
      if (!payment) return error('Pagamento não encontrado', 404)
      return json(toPayment(payment))
    }

    const renewPixMatch = path.match(
      /^cliente\/pagamentos\/([^/]+)\/renovar-pix$/,
    )
    if (method === 'POST' && renewPixMatch) {
      try {
        return json(
          toPayment(renewPixPaymentMock(decodeURIComponent(renewPixMatch[1]))),
        )
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Pagamento não encontrado'
        return error(message, 404)
      }
    }

    if (method === 'GET' && path === 'cliente/faturas') {
      return json(listInvoicesMock().map(toInvoice))
    }

    if (method === 'POST' && path === 'cliente/cartao') {
      const body = await readJson(request)
      return json(
        toPaymentMethod(
          updateCardMock({
            holderName: String(body.nomeImpresso ?? ''),
            lastFour: String(body.ultimosQuatro ?? '0000').slice(-4),
            brand: String(body.bandeira ?? 'Visa'),
            token: body.token ? String(body.token) : undefined,
          }),
        ),
      )
    }

    if (method === 'GET' && path === 'cliente/cartoes') {
      return json(
        listPaymentMethodsMock()
          .filter((pm) => pm.type === 'credit_card')
          .map(toPaymentMethod),
      )
    }

    if (method === 'POST' && path === 'cliente/cartoes') {
      const body = await readJson(request)
      const newCard = await addCard({
        token: String(body.token ?? ''),
        holderName: String(body.nomeImpresso ?? ''),
        lastFour: String(body.ultimosQuatro ?? '0000').slice(-4),
        brand: String(body.bandeira ?? 'Visa'),
      })
      return json(toPaymentMethod(newCard), 201)
    }

    const cardMatch = path.match(/^cliente\/cartoes\/([^/]+)$/)
    if (method === 'DELETE' && cardMatch) {
      const id = decodeURIComponent(cardMatch[1])
      await deleteCard(id)
      return json({ sucesso: true })
    }

    if (method === 'GET' && path === 'casos/arquivos') {
      const boxes = listInvestigationFilesByBoxMock()
      return json({
        boxes: boxes.map((box) => ({
          id: box.id,
          arquivos: box.arquivos.map(toArquivoCasoInvestigativo),
          documentos: box.documentos.map(toArquivoCasoInvestigativo),
        })),
      })
    }

    if (method === 'GET' && path === 'conteudos-exclusivos') {
      return json(listExclusiveContentMock().map(toExclusiveContent))
    }

    const contentMatch = path.match(/^conteudos-exclusivos\/([^/]+)$/)
    if (method === 'GET' && contentMatch) {
      const content =
        listExclusiveContentMock().find(
          (item) =>
            item.slug === decodeURIComponent(contentMatch[1]) ||
            item.id === decodeURIComponent(contentMatch[1]),
        ) ?? null
      if (!content) return error('Conteúdo não encontrado', 404)
      return json(toExclusiveContent(content))
    }

    if (method === 'GET' && path === 'casos') {
      const activeCase = getActiveCaseMock()
      const progress = getSubscriberProgressMock()
      return json({
        casoAtivo: activeCase ? toCase(activeCase) : null,
        progresso: progress ? toProgress(progress) : null,
        pistas: listCluesMock().map(toClue),
      })
    }

    if (method === 'GET' && path === 'conteudo-dinamico') {
      const route = searchParams.get('rota')
      const blocks = route
        ? getDynamicContentByRoute(route)
        : mockDynamicContent
      return json(blocks.map(toDynamicContent))
    }

    const dynamicContentMatch = path.match(/^conteudo-dinamico\/(.+)$/)
    if (method === 'GET' && dynamicContentMatch) {
      const block = getDynamicContent(
        decodeURIComponent(dynamicContentMatch[1]),
      )
      if (!block) return error('Bloco não encontrado', 404)
      return json(toDynamicContent(block))
    }

    if (method === 'GET' && path === 'seo') {
      const route = searchParams.get('rota')
      if (!route) return error('Parâmetro rota é obrigatório', 400)

      const entry = getSeoEntry(route)
      if (!entry) return error('Entrada de SEO não encontrada', 404)
      return json(toSeo(entry))
    }

    if (method === 'GET' && path === 'paginas') {
      const route = searchParams.get('rota')
      if (route) {
        const page = mockCmsPages.find((p) => p.rota === route)
        if (!page) return error('Página não encontrada', 404)
        return json(page)
      }
      return json(mockCmsPages)
    }

    const menuMatch = path.match(/^menus\/([^/]+)$/)
    if (method === 'GET' && menuMatch) {
      const menuKey = decodeURIComponent(menuMatch[1])
      const menu = mockCmsMenus[menuKey]
      if (!menu) return error('Menu não encontrado', 404)
      return json(menu)
    }

    return error('Rota pt-BR não encontrada na simulação da API', 404)
  } catch (caught) {
    const err = caught as Error
    return error(err.message || 'Erro ao processar a rota pt-BR', 400)
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handlePtBrApi(request, 'GET', context)
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handlePtBrApi(request, 'POST', context)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handlePtBrApi(request, 'PUT', context)
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handlePtBrApi(request, 'PATCH', context)
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handlePtBrApi(request, 'DELETE', context)
}

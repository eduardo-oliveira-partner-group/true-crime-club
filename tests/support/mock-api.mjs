import { createServer } from 'node:http'

const portFlagIndex = process.argv.indexOf('--port')
const port = Number(
  portFlagIndex >= 0 ? process.argv[portFlagIndex + 1] : undefined,
)
const resolvedPort = Number.isFinite(port) && port > 0 ? port : 4100

const products = [
  {
    id: 'prod-copa',
    identificador: 'edicao-copa-do-mundo',
    nome: 'Box 10 — Arquivo Copa do Mundo',
    descricao:
      'Uma investigação especial sobre os bastidores de uma final histórica.',
    descricaoCurta: 'Edição especial com pistas, documentos e colecionáveis.',
    tipo: 'caixa',
    preco: 18990,
    precoAssinante: 16990,
    imagens: [{ url: '/imagens/pendrive/IMG_PD_04.jpg', principal: true }],
    categorias: ['box', 'destaque', 'edicao-especial'],
    emEstoque: true,
    disponibilidade: 'limitado',
    destaque: true,
    itensInclusos: [
      'Dossiê do caso',
      'Mapa de evidências',
      'Item colecionável',
    ],
    relacionados: ['prod-arquivo-09'],
    mesEdicao: '2026-07',
    ciclo: 10,
  },
  {
    id: 'prod-arquivo-09',
    identificador: 'arquivo-victoria-09',
    nome: 'Box 09 — A testemunha ausente',
    descricao: 'O nono capítulo do caso Victória Monteiro.',
    descricaoCurta: 'Documentos e novas pistas do arquivo Victória.',
    tipo: 'caixa',
    preco: 15990,
    imagens: [{ url: '/imagens/pendrive/IMG_PD_05.jpg', principal: true }],
    categorias: ['box', 'arquivos'],
    emEstoque: true,
    disponibilidade: 'disponivel',
    destaque: false,
    itensInclusos: ['Depoimento lacrado', 'Fotografias periciais'],
    relacionados: ['prod-copa'],
    mesEdicao: '2026-06',
    ciclo: 9,
  },
  {
    id: 'prod-arquivo-08',
    identificador: 'arquivo-victoria-08',
    nome: 'Box 08 — O quarto fechado',
    descricao: 'O oitavo capítulo do caso Victória Monteiro.',
    descricaoCurta: 'Uma nova cena e um conjunto de evidências conflitantes.',
    tipo: 'caixa',
    preco: 14990,
    imagens: [{ url: '/imagens/pendrive/IMG_PD_06.jpg', principal: true }],
    categorias: ['box', 'arquivos'],
    emEstoque: true,
    disponibilidade: 'disponivel',
    destaque: false,
    ciclo: 8,
  },
]

const plans = [
  {
    id: 'plan-monthly',
    identificador: 'mensal',
    nome: 'Plano Mensal',
    descricao: 'Uma nova caixa e novas pistas a cada mês.',
    intervaloCobranca: 'mensal',
    preco: 14990,
    recomendado: false,
    beneficios: ['Uma caixa por mês', 'Acesso aos arquivos digitais'],
    mesesCompromisso: 1,
  },
  {
    id: 'plan-annual',
    identificador: 'anual',
    nome: 'Plano Anual',
    descricao: 'Doze capítulos de uma investigação contínua.',
    intervaloCobranca: 'anual',
    preco: 149900,
    precoPorMes: 12492,
    recomendado: true,
    beneficios: ['Doze caixas', 'Preço especial', 'Conteúdo exclusivo'],
    mesesCompromisso: 12,
  },
]

const customer = {
  id: 'customer-001',
  nome: 'Eduardo Investigador',
  email: 'investigador@truecrime.test',
  telefone: '11999999999',
  documento: '12345678909',
  preferencias: {
    tamanhoCamiseta: 'M',
    tamanhoCalcado: '40',
    observacoes: 'Sem materiais perfumados.',
  },
}

const addresses = [
  {
    id: 'address-001',
    rotulo: 'Casa',
    logradouro: 'Rua das Evidências',
    numero: '221',
    complemento: 'Apto 12',
    bairro: 'Arquivo',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '05435020',
    padrao: true,
  },
]

const paymentMethods = [
  {
    id: 'card-001',
    tipo: 'cartao_credito',
    rotulo: 'Visa •••• 4242',
    ultimosQuatro: '4242',
    bandeira: 'Visa',
    nomeImpresso: 'EDUARDO INVESTIGADOR',
    cpfTitular: '12345678909',
    mesValidade: '12',
    anoValidade: '2030',
    padrao: true,
  },
]

function createInitialCart() {
  return {
    id: 'cart-001',
    itens: [
      {
        id: 'cart-item-001',
        idProduto: products[0].id,
        identificadorProduto: products[0].identificador,
        nomeProduto: products[0].nome,
        tipoProduto: 'caixa',
        quantidade: 1,
        precoUnitario: products[0].preco,
        imagem: products[0].imagens[0].url,
      },
    ],
    descontoCupom: 0,
    freteEstimado: 1990,
    regiaoFrete: 'São Paulo e região',
  }
}

let state

function resetState() {
  state = {
    cart: createInitialCart(),
    orderCreateCalls: 0,
    orders: [],
    idempotencyKeys: new Map(),
  }
}

resetState()

function corsHeaders(request) {
  const origin = request.headers.origin
  return {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Origin': origin ?? '*',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  }
}

function sendJson(request, response, status, payload, headers = {}) {
  response.writeHead(status, {
    ...corsHeaders(request),
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  })
  response.end(JSON.stringify(payload))
}

function sendSuccess(request, response, data, status = 200, headers = {}) {
  sendJson(
    request,
    response,
    status,
    { sucesso: true, data, erros: [], codigo: status },
    headers,
  )
}

function sendError(request, response, status, message) {
  sendJson(request, response, status, {
    sucesso: false,
    data: null,
    erros: [{ mensagem: message }],
    mensagem: message,
    codigo: status,
  })
}

function isAuthenticated(request) {
  return request.headers.cookie?.includes('tcc_test_session=authenticated')
}

function requireAuthentication(request, response) {
  if (isAuthenticated(request)) return true
  sendError(request, response, 401, 'Não autenticado')
  return false
}

async function readBody(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  if (chunks.length === 0) return {}

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return {}
  }
}

function recalculateCart() {
  const subtotal = state.cart.itens.reduce(
    (sum, item) => sum + item.precoUnitario * item.quantidade,
    0,
  )
  const discount = state.cart.descontoCupom ?? 0
  const shipping = state.cart.itens.length > 0 ? 1990 : 0

  state.cart.freteEstimado = shipping
  state.cart.regiaoFrete = shipping > 0 ? 'São Paulo e região' : undefined
  state.cart.subtotal = subtotal
  state.cart.desconto = discount
  state.cart.total = Math.max(subtotal - discount + shipping, 0)
}

function createOrder() {
  recalculateCart()
  return {
    id: 'order-001',
    numeroPedido: 'TCC-2026-0001',
    idCliente: customer.id,
    itens: state.cart.itens.map((item) => ({ ...item })),
    status: 'pago',
    statusPagamento: 'pago',
    subtotal: state.cart.subtotal,
    frete: state.cart.freteEstimado,
    desconto: state.cart.desconto,
    total: state.cart.total,
    criadoEm: '2026-07-31T14:00:00-03:00',
    observacaoCicloCobranca: 'Cobrança confirmada no cartão final 4242.',
    observacaoCicloEnvio: 'Envio previsto para o próximo ciclo do clube.',
    notaFiscalPlaceholder: 'Nota fiscal disponível após a separação.',
  }
}

const server = createServer(async (request, response) => {
  if (!request.url || !request.method) {
    sendError(request, response, 400, 'Requisição inválida')
    return
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, corsHeaders(request))
    response.end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host}`)
  const { pathname } = url

  if (request.method === 'GET' && pathname === '/__test/health') {
    sendJson(request, response, 200, { ok: true })
    return
  }

  if (request.method === 'POST' && pathname === '/__test/reset') {
    resetState()
    sendJson(request, response, 200, { ok: true })
    return
  }

  if (request.method === 'GET' && pathname === '/__test/state') {
    sendJson(request, response, 200, {
      cart: state.cart,
      orderCreateCalls: state.orderCreateCalls,
      orders: state.orders,
    })
    return
  }

  if (request.method === 'GET' && pathname === '/produtos') {
    const featured = url.searchParams.get('destaque')
    const data =
      featured === null
        ? products
        : products.filter(
            (product) => product.destaque === (featured === 'true'),
          )
    sendSuccess(request, response, data)
    return
  }

  if (request.method === 'GET' && pathname.startsWith('/produtos/')) {
    const slug = decodeURIComponent(pathname.slice('/produtos/'.length))
    const product = products.find((item) => item.identificador === slug)
    if (!product) {
      sendError(request, response, 404, 'Produto não encontrado')
      return
    }
    sendSuccess(request, response, product)
    return
  }

  if (request.method === 'GET' && pathname === '/planos') {
    sendSuccess(request, response, plans)
    return
  }

  if (request.method === 'GET' && pathname.startsWith('/planos/')) {
    const id = decodeURIComponent(pathname.slice('/planos/'.length))
    const plan = plans.find((item) => item.id === id)
    if (!plan) {
      sendError(request, response, 404, 'Plano não encontrado')
      return
    }
    sendSuccess(request, response, plan)
    return
  }

  if (request.method === 'POST' && pathname === '/autenticacao/entrar') {
    const body = await readBody(request)
    if (body.email !== customer.email || body.senha !== 'segredo123') {
      sendError(request, response, 401, 'E-mail ou senha inválidos.')
      return
    }
    sendSuccess(request, response, null, 200, {
      'Set-Cookie':
        'tcc_test_session=authenticated; HttpOnly; SameSite=Lax; Path=/',
    })
    return
  }

  if (request.method === 'GET' && pathname === '/autenticacao/cliente-atual') {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, customer)
    return
  }

  if (request.method === 'POST' && pathname === '/autenticacao/sair') {
    sendSuccess(request, response, null, 200, {
      'Set-Cookie':
        'tcc_test_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0',
    })
    return
  }

  if (request.method === 'GET' && pathname === '/cliente/perfil') {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, {
      cliente: customer,
      enderecos: addresses,
      metodosPagamento: paymentMethods,
    })
    return
  }

  if (request.method === 'PATCH' && pathname === `/clientes/${customer.id}`) {
    if (!requireAuthentication(request, response)) return
    const body = await readBody(request)
    if (body.preferencias) customer.preferencias = body.preferencias
    sendSuccess(request, response, customer)
    return
  }

  if (request.method === 'GET' && pathname === '/carrinho') {
    if (!requireAuthentication(request, response)) return
    recalculateCart()
    sendSuccess(request, response, state.cart)
    return
  }

  if (request.method === 'POST' && pathname === '/carrinho/itens') {
    if (!requireAuthentication(request, response)) return
    const body = await readBody(request)
    const product = products.find((item) => item.id === body.idProduto)
    if (!product) {
      sendError(request, response, 404, 'Produto não encontrado')
      return
    }

    const existing = state.cart.itens.find(
      (item) => item.idProduto === product.id,
    )
    if (existing) {
      existing.quantidade += Number(body.quantidade ?? 1)
    } else {
      state.cart.itens.push({
        id: `cart-item-${state.cart.itens.length + 1}`,
        idProduto: product.id,
        identificadorProduto: product.identificador,
        nomeProduto: product.nome,
        tipoProduto: product.tipo,
        quantidade: Number(body.quantidade ?? 1),
        precoUnitario: product.preco,
        imagem: product.imagens[0]?.url,
      })
    }
    recalculateCart()
    sendSuccess(request, response, state.cart)
    return
  }

  const cartItemMatch = pathname.match(/^\/carrinho\/itens\/([^/]+)$/)
  if (cartItemMatch && request.method === 'PUT') {
    if (!requireAuthentication(request, response)) return
    const body = await readBody(request)
    const item = state.cart.itens.find(
      (entry) => entry.id === decodeURIComponent(cartItemMatch[1]),
    )
    if (!item) {
      sendError(request, response, 404, 'Item não encontrado')
      return
    }
    item.quantidade = Math.max(1, Number(body.quantidade ?? 1))
    recalculateCart()
    sendSuccess(request, response, state.cart)
    return
  }

  if (cartItemMatch && request.method === 'DELETE') {
    if (!requireAuthentication(request, response)) return
    const itemId = decodeURIComponent(cartItemMatch[1])
    state.cart.itens = state.cart.itens.filter((entry) => entry.id !== itemId)
    recalculateCart()
    sendSuccess(request, response, state.cart)
    return
  }

  if (request.method === 'POST' && pathname === '/carrinho/cupom') {
    if (!requireAuthentication(request, response)) return
    const body = await readBody(request)
    const valid = String(body.codigo ?? '').toUpperCase() === 'ARQUIVO10'
    if (valid) {
      state.cart.codigoCupom = 'ARQUIVO10'
      state.cart.descontoCupom = 1000
      recalculateCart()
    }
    sendSuccess(request, response, {
      valido: valid,
      codigo: body.codigo,
      desconto: valid ? 1000 : 0,
      mensagem: valid ? 'Cupom aplicado.' : 'Cupom inválido ou expirado.',
    })
    return
  }

  if (request.method === 'POST' && pathname === '/finalizacao/frete') {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, {
      cep: '05435020',
      preco: 19.9,
      regiao: 'São Paulo e região',
      prazoDias: 3,
      sessionId: 'shipping-standard',
      opcoes: [
        {
          sessionId: 'shipping-standard',
          codigoServico: 'STANDARD',
          descricao: 'Entrega padrão',
          transportadora: 'Correios',
          preco: 19.9,
          prazoDias: 3,
        },
        {
          sessionId: 'shipping-express',
          codigoServico: 'EXPRESS',
          descricao: 'Entrega expressa',
          transportadora: 'Loggi',
          preco: 34.9,
          prazoDias: 1,
        },
      ],
    })
    return
  }

  if (
    request.method === 'GET' &&
    pathname === '/finalizacao/metodos-pagamento'
  ) {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, paymentMethods)
    return
  }

  if (request.method === 'POST' && pathname === '/finalizacao/pedido') {
    if (!requireAuthentication(request, response)) return
    const body = await readBody(request)
    state.orderCreateCalls += 1
    const idempotencyKey = String(body.chaveIdempotencia ?? '')
    const existing = idempotencyKey
      ? state.idempotencyKeys.get(idempotencyKey)
      : undefined
    const order = existing ?? createOrder()

    if (!existing) {
      state.orders = [order]
      if (idempotencyKey) state.idempotencyKeys.set(idempotencyKey, order)
    }

    sendSuccess(request, response, {
      pedido: order,
      pagamento: {
        id: 'payment-001',
        metodo: 'cartao_credito',
        status: 'pago',
      },
    })
    return
  }

  if (request.method === 'GET' && pathname === '/cliente/pedidos') {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, state.orders)
    return
  }

  if (request.method === 'GET' && pathname.startsWith('/cliente/pedidos/')) {
    if (!requireAuthentication(request, response)) return
    const id = decodeURIComponent(pathname.slice('/cliente/pedidos/'.length))
    const order = state.orders.find((item) => item.id === id)
    if (!order) {
      sendError(request, response, 404, 'Pedido não encontrado')
      return
    }
    sendSuccess(request, response, order)
    return
  }

  if (request.method === 'GET' && pathname === '/cliente/pagamentos') {
    if (!requireAuthentication(request, response)) return
    sendSuccess(request, response, [])
    return
  }

  sendError(request, response, 404, `Rota mock não implementada: ${pathname}`)
})

server.listen(resolvedPort, '127.0.0.1', () => {
  process.stdout.write(
    `Mock API listening on http://127.0.0.1:${resolvedPort}\n`,
  )
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

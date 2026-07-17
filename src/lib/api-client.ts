import { getApiBaseUrl } from '@/src/lib/api-mode'
import type {
  Address,
  Cart,
  CartItem,
  Customer,
  InvestigationFile,
  InvestigationFilesByBox,
  InvestigationFileType,
  PaymentMethod,
  SubscriberPreferences,
} from '@/src/lib/domain/types'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

type JsonObject = Record<string, JsonValue | undefined>

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

function asObject(value: JsonValue | undefined): JsonObject {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonObject)
    : {}
}

function asArray(value: JsonValue | undefined): JsonObject[] {
  return Array.isArray(value) ? value.map(asObject) : []
}

function asString(value: JsonValue | undefined, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asOptionalString(value: JsonValue | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asNumber(value: JsonValue | undefined, fallback = 0): number {
  return typeof value === 'number' ? value : fallback
}

function asOptionalNumber(value: JsonValue | undefined): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function toInvestigationFileType(
  value: JsonValue | undefined,
): InvestigationFileType {
  return value === 'audio' ||
    value === 'image' ||
    value === 'text' ||
    value === 'sheet'
    ? value
    : 'text'
}

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const apiBaseUrl = getApiBaseUrl()
  const url = `${apiBaseUrl.replace(/\/$/, '')}${endpoint}`
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiClientError(
      errorData.mensagem || `Erro na requisição: ${response.status}`,
      response.status,
    )
  }

  return response.json()
}

async function getCustomerId(): Promise<string> {
  const customer = toCustomer(await fetcher('/autenticacao/cliente-atual'))
  if (!customer.id) {
    throw new Error('Sessão inválida: não foi possível identificar o cliente')
  }
  return customer.id
}

function toCustomer(data: JsonObject): Customer {
  const preferencias = asObject(data.preferencias)

  return {
    id: asString(data.id),
    name: asString(data.nome),
    email: asString(data.email),
    phone: asOptionalString(data.telefone),
    document: asOptionalString(data.documento),
    preferences: Object.keys(preferencias).length
      ? {
          shirtSize: asOptionalString(preferencias.tamanhoCamiseta),
          shoeSize: asOptionalString(preferencias.tamanhoCalcado),
          notes: asOptionalString(preferencias.observacoes),
        }
      : undefined,
  }
}

function toAddress(data: JsonObject): Address {
  return {
    id: asString(data.id),
    label: asString(data.rotulo),
    street: asString(data.logradouro),
    number: asString(data.numero),
    complement: asOptionalString(data.complemento),
    neighborhood: asString(data.bairro),
    city: asString(data.cidade),
    state: asString(data.estado),
    zipCode: asString(data.cep),
    isDefault: data.padrao === true,
  }
}

function toPaymentMethod(data: JsonObject): PaymentMethod {
  return {
    id: asString(data.id),
    type: data.tipo === 'pix' ? 'pix' : 'credit_card',
    label: asString(data.rotulo),
    lastFour: asOptionalString(data.ultimosQuatro),
    brand: asOptionalString(data.bandeira),
    isDefault: data.padrao === true,
  }
}

function toInvestigationFile(data: JsonObject): InvestigationFile {
  return {
    id: asString(data.id),
    name: asString(data.nome),
    type: toInvestigationFileType(data.tipo),
    modified: asString(data.modificadoEm),
    size: asString(data.tamanho),
    downloadUrl: asOptionalString(data.urlDownload),
    content: asOptionalString(data.conteudo),
    corrupted: data.corrompido === true,
    columns: Array.isArray(data.colunas) ? data.colunas.map(String) : undefined,
    rows: Array.isArray(data.linhas)
      ? data.linhas.map((row) => (Array.isArray(row) ? row.map(String) : []))
      : undefined,
    fragment: asOptionalString(data.fragmento),
  }
}

function toInvestigationFilesByBox(data: JsonObject): InvestigationFilesByBox {
  return {
    id: asString(data.id),
    arquivos: asArray(data.arquivos).map(toInvestigationFile),
    documentos: asArray(data.documentos).map(toInvestigationFile),
  }
}

function toCartItem(data: JsonObject): CartItem {
  return {
    id: asString(data.id),
    productId: asString(data.idProduto),
    productSlug: asString(data.identificadorProduto),
    productName: asString(data.nomeProduto),
    productType: data.tipoProduto === 'caixa' ? 'box' : 'product',
    quantity: asNumber(data.quantidade),
    unitPrice: asNumber(data.precoUnitario),
    image: asOptionalString(data.imagem),
  }
}

function toCart(data: JsonObject): Cart & {
  subtotal?: number
  discount?: number
  shipping?: number
  total?: number
} {
  return {
    id: asString(data.id),
    items: asArray(data.itens).map(toCartItem),
    couponCode: asOptionalString(data.codigoCupom),
    couponDiscount: asOptionalNumber(data.descontoCupom),
    shippingEstimate: asOptionalNumber(data.freteEstimado),
    shippingRegion: asOptionalString(data.regiaoFrete),
    subtotal: asOptionalNumber(data.subtotal),
    discount: asOptionalNumber(data.desconto),
    shipping: asOptionalNumber(data.freteEstimado),
    total: asOptionalNumber(data.total),
  }
}

function fromPreferences(preferences?: Partial<SubscriberPreferences>) {
  if (!preferences) return undefined
  return {
    tamanhoCamiseta: preferences.shirtSize,
    tamanhoCalcado: preferences.shoeSize,
    observacoes: preferences.notes,
  }
}

function fromAddress(address: {
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}) {
  return {
    rotulo: address.label,
    logradouro: address.street,
    numero: address.number,
    complemento: address.complement,
    bairro: address.neighborhood,
    cidade: address.city,
    estado: address.state,
    cep: address.zipCode,
    padrao: address.isDefault ?? false,
  }
}

export const apiClient = {
  auth: {
    register: async (body: {
      name: string
      email: string
      password: string
      document: string
      phone: string
    }) =>
      fetcher('/clientes', {
        method: 'POST',
        body: JSON.stringify({
          nome: body.name,
          email: body.email,
          senha: body.password,
          documento: body.document,
          telefone: body.phone,
        }),
      }).then((data) => {
        return {
          ...data,
          cliente: data.cliente ? toCustomer(data.cliente) : undefined,
        }
      }),
    login: async (body: { email: string; password: string }) =>
      fetcher('/autenticacao/entrar', {
        method: 'POST',
        body: JSON.stringify({ email: body.email, senha: body.password }),
      }).then((data) => {
        return {
          ...data,
          cliente: data.cliente ? toCustomer(data.cliente) : undefined,
        }
      }),
    recoverPassword: (body: { email: string }) =>
      fetcher('/clientes/recuperar-senha', {
        method: 'POST',
        body: JSON.stringify({ email: body.email }),
      }),
    logout: async () => {
      await fetcher('/autenticacao/sair', { method: 'POST' })
      return { sucesso: true }
    },
    me: () =>
      fetcher('/autenticacao/cliente-atual')
        .then(toCustomer)
        .catch(async (error: unknown) => {
          // Perfil é fallback de compatibilidade para a API pública.
          // Não trate uma sessão expirada, erro de rede ou falha do servidor
          // como se a rota de cliente-atual não existisse.
          if (!(error instanceof ApiClientError) || error.status !== 404) {
            throw error
          }

          try {
            const profileData = await fetcher('/cliente/perfil')
            if (profileData && profileData.cliente) {
              return toCustomer(profileData.cliente)
            }
          } catch (fallbackError) {
            throw fallbackError
          }

          throw new ApiClientError('Não autenticado', 401)
        }),
  },
  products: {
    list: (params?: { featured?: boolean; category?: string }) => {
      const q = new URLSearchParams()
      if (params?.featured !== undefined) {
        q.append('destaque', String(params.featured))
      }
      if (params?.category) q.append('categoria', params.category)
      const queryStr = q.toString()
      return fetcher(`/produtos${queryStr ? `?${queryStr}` : ''}`)
    },
    getBySlug: (slug: string) => fetcher(`/produtos/${slug}`),
  },
  plans: {
    list: () => fetcher('/planos'),
    getBySlug: (slug: string) => fetcher(`/planos/${slug}`),
  },
  cart: {
    get: () => fetcher('/carrinho').then(toCart),
    addItem: (productId: string, quantity: number = 1) =>
      fetcher('/carrinho/itens', {
        method: 'POST',
        body: JSON.stringify({ idProduto: productId, quantidade: quantity }),
      }).then(toCart),
    updateQuantity: (itemId: string, quantity: number) =>
      fetcher(`/carrinho/itens/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantidade: quantity }),
      }).then(toCart),
    removeItem: (itemId: string) =>
      fetcher(`/carrinho/itens/${itemId}`, {
        method: 'DELETE',
      }).then(toCart),
    applyCoupon: (code: string) =>
      fetcher('/carrinho/cupom', {
        method: 'POST',
        body: JSON.stringify({ codigo: code }),
      }),
  },
  checkout: {
    calculateShipping: (zipCode: string) =>
      fetcher('/finalizacao/frete', {
        method: 'POST',
        body: JSON.stringify({ cep: zipCode }),
      }),
    createOrder: (body?: { enderecoId?: string; pagamentoMetodoId?: string }) =>
      fetcher('/finalizacao/pedido', {
        method: 'POST',
        body: JSON.stringify({
          idEndereco: body?.enderecoId,
          idMetodoPagamento: body?.pagamentoMetodoId,
        }),
      }),
  },
  customer: {
    getProfile: async (): Promise<{
      customer: Customer
      addresses: Address[]
      paymentMethods: PaymentMethod[]
    }> => {
      const data = await fetcher('/cliente/perfil')

      return {
        customer: toCustomer(asObject(data.cliente)),
        addresses: asArray(data.enderecos).map(toAddress),
        paymentMethods: asArray(data.metodosPagamento).map(toPaymentMethod),
      }
    },
    updateProfile: async (body: {
      name?: string
      email?: string
      phone?: string
      document?: string
      preferences?: Partial<SubscriberPreferences>
    }) => {
      const customerId = await getCustomerId()
      return fetcher(`/clientes/${customerId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nome: body.name,
          email: body.email,
          telefone: body.phone,
          documento: body.document,
          preferencias: fromPreferences(body.preferences),
        }),
      }).then(toCustomer)
    },
    addAddress: async (body: {
      label: string
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
      isDefault?: boolean
    }) => {
      const customerId = await getCustomerId()
      return fetcher(`/clientes/${customerId}/enderecos`, {
        method: 'POST',
        body: JSON.stringify(fromAddress(body)),
      }).then((items) => items.map(toAddress))
    },
    updateAddress: async (
      id: string,
      body: {
        label: string
        street: string
        number: string
        complement?: string
        neighborhood: string
        city: string
        state: string
        zipCode: string
        isDefault?: boolean
      },
    ) => {
      const customerId = await getCustomerId()
      return fetcher(`/clientes/${customerId}/enderecos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(fromAddress(body)),
      }).then((items) => items.map(toAddress))
    },
    deleteAddress: async (id: string) => {
      const customerId = await getCustomerId()
      return fetcher(`/clientes/${customerId}/enderecos/${id}`, {
        method: 'DELETE',
      }).then(() =>
        fetcher(`/clientes/${customerId}/enderecos`).then((items) =>
          items.map(toAddress),
        ),
      )
    },
    listOrders: () => fetcher('/cliente/pedidos'),
    getOrder: (id: string) => fetcher(`/cliente/pedidos/${id}`),
    getSubscription: () => fetcher('/cliente/assinatura'),
    cancelSubscription: () =>
      fetcher('/cliente/assinatura', {
        method: 'POST',
        body: JSON.stringify({ acao: 'cancelar' }),
      }),
    reactivateSubscription: () =>
      fetcher('/cliente/assinatura', {
        method: 'POST',
        body: JSON.stringify({ acao: 'reativar' }),
      }),
    listPayments: () => fetcher('/cliente/pagamentos'),
    getPayment: (id: string) => fetcher(`/cliente/pagamentos/${id}`),
    renewPixPayment: (id: string) =>
      fetcher(`/cliente/pagamentos/${id}/renovar-pix`, {
        method: 'POST',
      }),
    listInvoices: () => fetcher('/cliente/faturas'),
    updateCard: (body: {
      holderName: string
      lastFour: string
      brand: string
      token?: string
    }) =>
      fetcher('/cliente/cartao', {
        method: 'POST',
        body: JSON.stringify({
          nomeImpresso: body.holderName,
          ultimosQuatro: body.lastFour,
          bandeira: body.brand,
          token: body.token,
        }),
      }).then(toPaymentMethod),
    listCards: () =>
      fetcher('/cliente/cartoes').then((items) =>
        asArray(items).map(toPaymentMethod),
      ),
    addCard: (body: {
      token: string
      holderName: string
      lastFour: string
      brand: string
    }) =>
      fetcher('/cliente/cartoes', {
        method: 'POST',
        body: JSON.stringify({
          token: body.token,
          nomeImpresso: body.holderName,
          ultimosQuatro: body.lastFour,
          bandeira: body.brand,
        }),
      }).then(toPaymentMethod),
    deleteCard: (id: string) =>
      fetcher(`/cliente/cartoes/${id}`, {
        method: 'DELETE',
      }),
  },
  exclusiveContent: {
    list: () => fetcher('/conteudos-exclusivos'),
    getBySlug: (slug: string) => fetcher(`/conteudos-exclusivos/${slug}`),
  },
  cases: {
    getData: () => fetcher('/casos'),
    listFiles: (): Promise<InvestigationFilesByBox[]> =>
      fetcher('/casos/arquivos').then((res) =>
        asArray(res.boxes).map(toInvestigationFilesByBox),
      ),
  },
}

const isServer = typeof window === 'undefined'

function getBaseUrl() {
  if (!isServer) return '/api'

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  const port = process.env.PORT || '3000'
  return `http://localhost:${port}/api`
}

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const url = `${getBaseUrl()}${endpoint}`
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (isServer) {
    try {
      const { cookies } = require('next/headers')
      const cookieStore = await cookies()
      const cookieHeader = cookieStore.toString()
      if (cookieHeader) {
        headers.set('Cookie', cookieHeader)
      }
    } catch {
      // Ignora erro se cookies() for chamado fora do contexto de requisição do Next.js
    }
  } else {
    options.credentials = options.credentials || 'include'
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.mensagem || `Erro na requisição: ${response.status}`,
    )
  }

  return response.json()
}

export const apiClient = {
  auth: {
    login: (body: { email: string }) =>
      fetcher('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => fetcher('/auth/logout', { method: 'POST' }),
    me: () => fetcher('/auth/me'),
  },
  products: {
    list: (params?: { featured?: boolean; category?: string }) => {
      const q = new URLSearchParams()
      if (params?.featured !== undefined)
        q.append('featured', String(params.featured))
      if (params?.category) q.append('category', params.category)
      const queryStr = q.toString()
      return fetcher(`/products${queryStr ? `?${queryStr}` : ''}`)
    },
    getBySlug: (slug: string) => fetcher(`/products/${slug}`),
  },
  plans: {
    list: () => fetcher('/plans'),
    getBySlug: (slug: string) => fetcher(`/plans/${slug}`),
  },
  cart: {
    get: () => fetcher('/cart'),
    addItem: (productId: string, quantity: number = 1) =>
      fetcher('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      }),
    updateQuantity: (itemId: string, quantity: number) =>
      fetcher(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),
    removeItem: (itemId: string) =>
      fetcher(`/cart/${itemId}`, {
        method: 'DELETE',
      }),
    applyCoupon: (code: string) =>
      fetcher('/cart/coupon', {
        method: 'POST',
        body: JSON.stringify({ code }),
      }),
  },
  checkout: {
    calculateShipping: (zipCode: string) =>
      fetcher('/checkout/shipping', {
        method: 'POST',
        body: JSON.stringify({ zipCode }),
      }),
    createOrder: (body?: { enderecoId?: string; pagamentoMetodoId?: string }) =>
      fetcher('/checkout/order', {
        method: 'POST',
        body: JSON.stringify(body || {}),
      }),
  },
  customer: {
    getProfile: () => fetcher('/customer/profile'),
    updateProfile: (body: {
      name?: string
      email?: string
      phone?: string
      preferences?: { shirtSize?: string; shoeSize?: string; notes?: string }
    }) =>
      fetcher('/customer/profile', {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    addAddress: (body: {
      label: string
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
    }) =>
      fetcher('/customer/addresses', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    deleteAddress: (id: string) =>
      fetcher(`/customer/addresses/${id}`, {
        method: 'DELETE',
      }),
    listOrders: () => fetcher('/customer/orders'),
    getOrder: (id: string) => fetcher(`/customer/orders/${id}`),
    getSubscription: () => fetcher('/customer/subscription'),
    cancelSubscription: () =>
      fetcher('/customer/subscription', {
        method: 'POST',
        body: JSON.stringify({ action: 'cancel' }),
      }),
    reactivateSubscription: () =>
      fetcher('/customer/subscription', {
        method: 'POST',
        body: JSON.stringify({ action: 'reactivate' }),
      }),
  },
  exclusiveContent: {
    list: () => fetcher('/exclusive-content'),
    getBySlug: (slug: string) => fetcher(`/exclusive-content/${slug}`),
  },
  cases: {
    getData: () => fetcher('/cases'),
  },
}

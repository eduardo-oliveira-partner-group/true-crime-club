import { normalizeDigits } from '@/src/lib/formatters'

import { ApiClientError } from '../core/error'
import { fetcher } from '../core/fetcher'
import { toCustomer } from '../mappers/customer'

export const authApi = {
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
        documento: normalizeDigits(body.document),
        telefone: normalizeDigits(body.phone),
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
}

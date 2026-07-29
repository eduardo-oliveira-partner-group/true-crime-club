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
  }) => {
    // Sucesso vem do envelope ({ sucesso: true, data: null, ... }).
    await fetcher('/clientes', {
      method: 'POST',
      body: JSON.stringify({
        nome: body.name,
        email: body.email,
        senha: body.password,
        documento: normalizeDigits(body.document),
        telefone: normalizeDigits(body.phone),
      }),
    })
  },
  login: async (body: { email: string; password: string }) => {
    // Envelope: { data: null, sucesso: true, ... }. Sessão via cookie.
    // O fetcher já valida sucesso/erros; data null não é usado.
    await fetcher('/autenticacao/entrar', {
      method: 'POST',
      body: JSON.stringify({ email: body.email, senha: body.password }),
    })
  },
  requestPasswordReset: async (body: { email: string }) => {
    await fetcher('/autenticacao/esqueci-senha', {
      method: 'POST',
      body: JSON.stringify({ email: body.email }),
    })
  },
  validatePasswordResetToken: async (body: { token: string }) => {
    const data = await fetcher('/autenticacao/recuperacao-senha/validar', {
      method: 'POST',
      body: JSON.stringify({ token: body.token }),
    })

    if (!data || typeof data.valido !== 'boolean') {
      throw new Error('A API retornou uma validação de token inválida.')
    }

    return { valid: data.valido }
  },
  resetPassword: async (body: {
    token: string
    newPassword: string
    passwordConfirmation: string
  }) => {
    await fetcher('/autenticacao/recuperacao-senha/redefinir', {
      method: 'POST',
      body: JSON.stringify({
        token: body.token,
        nova_senha: body.newPassword,
        confirmacao_senha: body.passwordConfirmation,
      }),
    })
  },
  logout: async () => {
    await fetcher('/autenticacao/sair', { method: 'POST' })
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

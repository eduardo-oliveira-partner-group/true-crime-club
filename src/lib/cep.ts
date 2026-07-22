import { normalizeDigits } from '@/src/lib/formatters'

export type CepAddress = {
  street: string
  neighborhood: string
  city: string
  state: string
}

type ViaCepResponse = {
  erro?: boolean | string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

export class CepLookupError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CepLookupError'
  }
}

/** Consulta endereço pelo CEP via ViaCEP. */
export async function lookupCep(
  cep: string,
  signal?: AbortSignal,
): Promise<CepAddress> {
  const digits = normalizeDigits(cep)
  if (digits.length !== 8) {
    throw new CepLookupError('CEP deve ter 8 dígitos.')
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    signal,
  })

  if (!response.ok) {
    throw new CepLookupError('Não foi possível consultar o CEP.')
  }

  const data = (await response.json()) as ViaCepResponse
  if (data.erro === true || data.erro === 'true') {
    throw new CepLookupError('CEP não encontrado.')
  }

  return {
    street: data.logradouro?.trim() ?? '',
    neighborhood: data.bairro?.trim() ?? '',
    city: data.localidade?.trim() ?? '',
    state: data.uf?.trim().toUpperCase() ?? '',
  }
}

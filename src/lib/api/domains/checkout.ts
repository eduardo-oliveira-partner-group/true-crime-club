import { fetcher } from '../core/fetcher'

export const checkoutApi = {
  calculateShipping: (zipCode: string) =>
    fetcher('/finalizacao/frete', {
      method: 'POST',
      body: JSON.stringify({ cep: zipCode }),
    }),
  createOrder: (body?: {
    enderecoId?: string
    pagamentoMetodoId?: string
    subscription?: {
      id: string
      name: string
      price: number
    }
  }) =>
    fetcher('/finalizacao/pedido', {
      method: 'POST',
      body: JSON.stringify({
        idEndereco: body?.enderecoId,
        idMetodoPagamento: body?.pagamentoMetodoId,
        ...(body?.subscription
          ? {
              simulacaoAssinatura: true,
              planoId: body.subscription.id,
              planoNome: body.subscription.name,
              planoPreco: body.subscription.price,
            }
          : {}),
      }),
    }),
}

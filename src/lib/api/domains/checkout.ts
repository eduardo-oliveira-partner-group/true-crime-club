import { fetcher } from '../core/fetcher'

export const checkoutApi = {
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
}

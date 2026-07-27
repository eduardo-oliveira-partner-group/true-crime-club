import { fetcher } from '../core/fetcher'
import { asArray } from '../core/json'
import { toPaymentMethod } from '../mappers/payment'

export const checkoutApi = {
  listPaymentMethods: () =>
    fetcher('/finalizacao/metodos-pagamento').then((items) =>
      asArray(items).map(toPaymentMethod),
    ),
  calculateShipping: (body: {
    cep: string
    planoId?: string
  }) =>
    fetcher('/finalizacao/frete', {
      method: 'POST',
      body: JSON.stringify({
        cep: body.cep,
        ...(body.planoId ? { planoId: body.planoId } : {}),
      }),
    }),
  createOrder: (body?: {
    enderecoId?: string
    pagamentoMetodoId?: string
    cep?: string
    chaveIdempotencia?: string
    subscription?: {
      id: string
    }
  }) =>
    fetcher('/finalizacao/pedido', {
      method: 'POST',
      body: JSON.stringify({
        idEndereco: body?.enderecoId,
        idMetodoPagamento: body?.pagamentoMetodoId,
        chaveIdempotencia: body?.chaveIdempotencia,
        ...(body?.subscription
          ? {
              planoId: body.subscription.id,
              cep: body.cep,
            }
          : {}),
      }),
    }),
}

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
    simulacaoAssinatura?: boolean
  }) =>
    fetcher('/finalizacao/frete', {
      method: 'POST',
      body: JSON.stringify({
        cep: body.cep,
        planoId: body.planoId,
        simulacaoAssinatura: body.simulacaoAssinatura,
      }),
    }),
  createOrder: (body?: {
    enderecoId?: string
    pagamentoMetodoId?: string
    cep?: string
    subscription?: {
      id: string
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
              cep: body.cep,
            }
          : {}),
      }),
    }),
}

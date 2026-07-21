import type { Cart, CartItem } from '@/src/lib/domain/types'

import type { JsonObject } from '../core/json'
import {
  asArray,
  asNumber,
  asOptionalNumber,
  asOptionalString,
  asString,
} from '../core/json'

export function toCartItem(data: JsonObject): CartItem {
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

export function toCart(data: JsonObject): Cart & {
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

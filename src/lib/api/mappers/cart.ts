import type { Cart, CartItem, ProductType } from '@/src/lib/domain/types'

import type { JsonObject } from '../core/json'
import {
  asArray,
  asNumber,
  asOptionalNumber,
  asOptionalString,
  asString,
} from '../core/json'

function toProductType(tipoProduto: unknown): ProductType {
  if (tipoProduto === 'caixa') return 'box'
  if (tipoProduto === 'assinatura') return 'subscription'
  return 'product'
}

export function toCartItem(data: JsonObject): CartItem {
  const planId = asOptionalString(data.idPlano)
  const productId = asOptionalString(data.idProduto) ?? ''
  return {
    id: asString(data.id),
    productId,
    planId: planId || undefined,
    productSlug: asString(data.identificadorProduto),
    productName: asString(data.nomeProduto),
    productType: toProductType(data.tipoProduto),
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

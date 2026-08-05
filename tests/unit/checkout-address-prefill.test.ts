import { afterEach, describe, expect, it } from 'vitest'

import {
  consumeCheckoutAddressPrefillCep,
  saveCheckoutAddressPrefillCep,
} from '@/src/lib/checkout-address-prefill'

const STORAGE_KEY = 'tcc:checkout-prefill-cep'

describe('checkout-address-prefill', () => {
  afterEach(() => {
    sessionStorage.removeItem(STORAGE_KEY)
  })

  it('salva e consome o CEP normalizado', () => {
    saveCheckoutAddressPrefillCep('01310-100')
    expect(consumeCheckoutAddressPrefillCep()).toBe('01310100')
    expect(consumeCheckoutAddressPrefillCep()).toBeNull()
  })

  it('ignora CEP inválido', () => {
    saveCheckoutAddressPrefillCep('123')
    expect(consumeCheckoutAddressPrefillCep()).toBeNull()
  })
})

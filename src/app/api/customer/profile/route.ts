import { NextResponse } from 'next/server'

import { mockCustomer } from '@/src/lib/domain/mock-data'
import {
  getCurrentCustomer,
  listAddresses,
  listPaymentMethods,
} from '@/src/lib/domain/repositories'

export async function GET() {
  const customer = getCurrentCustomer()
  const addresses = listAddresses()
  const paymentMethods = listPaymentMethods()
  return NextResponse.json({ customer, addresses, paymentMethods })
}

export async function PUT(request: Request) {
  try {
    const { name, email, phone, preferences } = await request.json()

    // Mutaciona o mockCustomer diretamente para persistir as alterações na sessão do servidor
    if (name !== undefined) mockCustomer.name = name
    if (email !== undefined) mockCustomer.email = email
    if (phone !== undefined) mockCustomer.phone = phone
    if (preferences !== undefined) {
      mockCustomer.preferences = {
        ...mockCustomer.preferences,
        ...preferences,
      }
    }

    return NextResponse.json(mockCustomer)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao atualizar perfil' },
      { status: 400 },
    )
  }
}

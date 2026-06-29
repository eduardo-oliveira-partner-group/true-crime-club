import { NextResponse } from 'next/server'

import {
  getCustomerProfile,
  updateCustomerProfile,
} from '@/src/lib/server/customer'

export async function GET() {
  return NextResponse.json(getCustomerProfile())
}

export async function PUT(request: Request) {
  try {
    const { name, email, phone, preferences } = await request.json()
    const customer = updateCustomerProfile({ name, email, phone, preferences })
    return NextResponse.json(customer)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao atualizar perfil' },
      { status: 400 },
    )
  }
}

import { NextResponse } from 'next/server'

import { addCustomerAddress } from '@/src/lib/server/customer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json(addCustomerAddress(body))
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao criar endereço' },
      { status: 400 },
    )
  }
}

import { NextResponse } from 'next/server'

import { createOrder } from '@/src/lib/domain/repositories'

export async function POST() {
  try {
    const order = createOrder()
    return NextResponse.json(order)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao criar pedido' },
      { status: 400 },
    )
  }
}

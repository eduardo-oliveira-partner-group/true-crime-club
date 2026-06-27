import { NextResponse } from 'next/server'

import { getOrderById } from '@/src/lib/domain/repositories'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const order = getOrderById(id)
  if (!order) {
    return NextResponse.json(
      { mensagem: 'Pedido não encontrado' },
      { status: 404 },
    )
  }
  return NextResponse.json(order)
}

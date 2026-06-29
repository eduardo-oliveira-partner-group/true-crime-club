import { NextResponse } from 'next/server'

import { addCartItemWithTotals, getCartWithTotals } from '@/src/lib/server/cart'

export async function GET() {
  return NextResponse.json(getCartWithTotals())
}

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json()
    return NextResponse.json(addCartItemWithTotals({ productId, quantity }))
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao adicionar item ao carrinho' },
      { status: 400 },
    )
  }
}

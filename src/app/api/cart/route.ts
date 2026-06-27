import { NextResponse } from 'next/server'

import {
  addCartItem,
  getCart,
  getCartTotals,
} from '@/src/lib/domain/repositories'

export async function GET() {
  const cart = getCart()
  const totals = getCartTotals(cart)
  return NextResponse.json({ ...cart, ...totals })
}

export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json()
    const updatedCart = addCartItem({ productId, quantity })
    const totals = getCartTotals(updatedCart)
    return NextResponse.json({ ...updatedCart, ...totals })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao adicionar item ao carrinho' },
      { status: 400 },
    )
  }
}

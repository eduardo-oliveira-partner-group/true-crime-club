import { NextResponse } from 'next/server'

import {
  getCartTotals,
  removeCartItem,
  updateCartItemQuantity,
} from '@/src/lib/domain/repositories'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params
    const { quantity } = await request.json()
    const updatedCart = updateCartItemQuantity(itemId, quantity)
    const totals = getCartTotals(updatedCart)
    return NextResponse.json({ ...updatedCart, ...totals })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao atualizar quantidade' },
      { status: 400 },
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params
    const updatedCart = removeCartItem(itemId)
    const totals = getCartTotals(updatedCart)
    return NextResponse.json({ ...updatedCart, ...totals })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao remover item' },
      { status: 400 },
    )
  }
}

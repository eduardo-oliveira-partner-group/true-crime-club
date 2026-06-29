import { NextResponse } from 'next/server'

import {
  removeCartItemWithTotals,
  updateCartItemQuantityWithTotals,
} from '@/src/lib/server/cart'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await params
    const { quantity } = await request.json()
    return NextResponse.json(updateCartItemQuantityWithTotals(itemId, quantity))
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
    return NextResponse.json(removeCartItemWithTotals(itemId))
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao remover item' },
      { status: 400 },
    )
  }
}

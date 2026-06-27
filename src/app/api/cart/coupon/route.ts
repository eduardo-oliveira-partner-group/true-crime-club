import { NextResponse } from 'next/server'

import { applyCoupon } from '@/src/lib/domain/repositories'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    const result = applyCoupon(code)
    return NextResponse.json(result)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao aplicar cupom' },
      { status: 400 },
    )
  }
}

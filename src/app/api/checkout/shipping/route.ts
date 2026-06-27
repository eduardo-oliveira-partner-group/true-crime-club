import { NextResponse } from 'next/server'

import { calculateShipping } from '@/src/lib/domain/repositories'

export async function POST(request: Request) {
  try {
    const { zipCode } = await request.json()
    const shipping = calculateShipping(zipCode)
    return NextResponse.json(shipping)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao calcular frete' },
      { status: 400 },
    )
  }
}

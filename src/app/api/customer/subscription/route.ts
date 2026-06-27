import { NextResponse } from 'next/server'

import {
  cancelSubscription,
  getSubscription,
  reactivateSubscription,
} from '@/src/lib/domain/repositories'

export async function GET() {
  const sub = getSubscription()
  if (!sub) {
    return NextResponse.json(
      { mensagem: 'Assinatura não encontrada' },
      { status: 404 },
    )
  }
  return NextResponse.json(sub)
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()

    if (action === 'cancel') {
      const sub = cancelSubscription()
      return NextResponse.json(sub)
    } else if (action === 'reactivate') {
      const sub = reactivateSubscription()
      return NextResponse.json(sub)
    } else {
      return NextResponse.json({ mensagem: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao processar assinatura' },
      { status: 400 },
    )
  }
}

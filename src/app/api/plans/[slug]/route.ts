import { NextResponse } from 'next/server'

import { getPlanBySlug } from '@/src/lib/domain/repositories'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const plan = getPlanBySlug(slug)
  if (!plan) {
    return NextResponse.json(
      { mensagem: 'Plano não encontrado' },
      { status: 404 },
    )
  }
  return NextResponse.json(plan)
}

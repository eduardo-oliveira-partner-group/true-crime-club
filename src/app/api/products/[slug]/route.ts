import { NextResponse } from 'next/server'

import { getProductBySlug } from '@/src/lib/domain/repositories'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) {
    return NextResponse.json(
      { mensagem: 'Produto não encontrado' },
      { status: 404 },
    )
  }
  return NextResponse.json(product)
}

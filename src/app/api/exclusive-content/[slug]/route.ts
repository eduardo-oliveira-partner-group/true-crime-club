import { NextResponse } from 'next/server'

import { getExclusiveContentBySlug } from '@/src/lib/domain/repositories'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const content = getExclusiveContentBySlug(slug)
  if (!content) {
    return NextResponse.json(
      { mensagem: 'Conteúdo não encontrado' },
      { status: 404 },
    )
  }
  return NextResponse.json(content)
}

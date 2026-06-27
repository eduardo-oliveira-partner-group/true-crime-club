import { type NextRequest, NextResponse } from 'next/server'

import { listProducts } from '@/src/lib/domain/repositories'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const featuredParam =
    searchParams.get('destaque') || searchParams.get('featured')
  const featured = featuredParam === 'true' ? true : undefined
  const category =
    searchParams.get('categoria') || searchParams.get('category') || undefined

  const products = listProducts({
    featured,
    category,
  })

  return NextResponse.json(products)
}

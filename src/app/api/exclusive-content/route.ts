import { NextResponse } from 'next/server'

import { listExclusiveContent } from '@/src/lib/domain/repositories'

export async function GET() {
  const content = listExclusiveContent()
  return NextResponse.json(content)
}

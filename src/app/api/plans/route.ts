import { NextResponse } from 'next/server'

import { listPlans } from '@/src/lib/domain/repositories'

export async function GET() {
  const plans = listPlans()
  return NextResponse.json(plans)
}

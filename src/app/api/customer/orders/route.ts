import { NextResponse } from 'next/server'

import { listOrders } from '@/src/lib/domain/repositories'

export async function GET() {
  const orders = listOrders()
  return NextResponse.json(orders)
}

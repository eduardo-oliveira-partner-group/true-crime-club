import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCurrentCustomer } from '@/src/lib/domain/repositories'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('tcc_session')

  if (!session || session.value !== 'mock-session-id') {
    return NextResponse.json({ mensagem: 'Não autenticado' }, { status: 401 })
  }

  const customer = getCurrentCustomer()
  if (!customer) {
    return NextResponse.json(
      { mensagem: 'Cliente mock não encontrado' },
      { status: 404 },
    )
  }

  return NextResponse.json(customer)
}

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { getCurrentCustomer } from '@/src/lib/domain/repositories'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const customer = getCurrentCustomer()
    if (!customer) {
      return NextResponse.json(
        { mensagem: 'Cliente mock não encontrado' },
        { status: 404 },
      )
    }

    // Retorna o e-mail que o usuário digitou, mantendo o mock
    const responseCustomer = {
      ...customer,
      email: email || customer.email,
    }

    const cookieStore = await cookies()
    cookieStore.set('tcc_session', 'mock-session-id', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return NextResponse.json({
      token: 'jwt_exemplo',
      cliente: responseCustomer,
    })
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao processar autenticação' },
      { status: 400 },
    )
  }
}

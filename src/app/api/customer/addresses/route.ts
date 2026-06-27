import { NextResponse } from 'next/server'

import { mockAddresses } from '@/src/lib/domain/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newAddress = {
      id: `addr-${Date.now()}`,
      label: body.label,
      street: body.street,
      number: body.number,
      complement: body.complement,
      neighborhood: body.neighborhood,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      isDefault: mockAddresses.length === 0,
    }

    mockAddresses.push(newAddress)
    return NextResponse.json(mockAddresses)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao criar endereço' },
      { status: 400 },
    )
  }
}

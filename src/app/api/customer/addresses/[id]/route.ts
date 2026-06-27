import { NextResponse } from 'next/server'

import { mockAddresses } from '@/src/lib/domain/mock-data'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const index = mockAddresses.findIndex((addr) => addr.id === id)

    if (index !== -1) {
      mockAddresses.splice(index, 1)
    }

    return NextResponse.json(mockAddresses)
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao remover endereço' },
      { status: 400 },
    )
  }
}

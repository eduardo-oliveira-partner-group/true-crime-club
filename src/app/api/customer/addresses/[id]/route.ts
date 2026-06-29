import { NextResponse } from 'next/server'

import { deleteCustomerAddress } from '@/src/lib/server/customer'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    return NextResponse.json(deleteCustomerAddress(id))
  } catch (error) {
    const err = error as Error
    return NextResponse.json(
      { mensagem: err.message || 'Erro ao remover endereço' },
      { status: 400 },
    )
  }
}

import CartoesClient from './cartoes-client'

import { listCards } from '@/src/lib/server/customer'

export default async function CartoesPage() {
  const cards = await listCards()

  return <CartoesClient cards={cards} />
}

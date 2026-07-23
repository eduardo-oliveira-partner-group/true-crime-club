import { Suspense } from 'react'

import { CardsListSkeleton } from '@/src/components/ui/page-loading-skeletons'
import { fontHeading, fontMono } from '@/src/lib/design/classes'

import CartoesClient from './cartoes-client'

function CartoesPageFallback() {
  return (
    <div>
      <p
        className={`text-[13px] leading-none font-bold tracking-[0.12em] text-(--red) uppercase ${fontMono}`}
      >
        Arquivo do assinante
      </p>
      <h1
        className={`mt-2 text-2xl font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
      >
        Meus cartões
      </h1>
      <p className="mt-2 text-sm/6 text-(--ink-mute)">
        Gerencie as formas de pagamento vinculadas à sua assinatura e compras
        futuras no clube.
      </p>
      <CardsListSkeleton cards={2} />
    </div>
  )
}

export default function CartoesPage() {
  return (
    <Suspense fallback={<CartoesPageFallback />}>
      <CartoesClient />
    </Suspense>
  )
}

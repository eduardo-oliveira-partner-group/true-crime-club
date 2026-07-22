import { Suspense } from 'react'

import { CustomerListSkeleton } from '@/src/components/ui/page-loading-skeletons'

import CartoesClient from './cartoes-client'

export default function CartoesPage() {
  return (
    <Suspense
      fallback={
        <div className="mt-8">
          <CustomerListSkeleton rows={2} />
        </div>
      }
    >
      <CartoesClient />
    </Suspense>
  )
}

import { getSeoEntry } from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

import { LojaPageClient } from './loja-page-client'

export const metadata = buildMetadata({
  path: '/loja',
  entry: getSeoEntry('/loja'),
})

export default function LojaPage() {
  return <LojaPageClient />
}

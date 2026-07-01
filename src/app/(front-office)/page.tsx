import type { Metadata } from 'next'

import { getSeoEntry } from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

import { Landing } from './landing'

export const metadata: Metadata = buildMetadata({
  path: '/',
  entry: getSeoEntry('/'),
})

export default function HomePage() {
  return <Landing />
}

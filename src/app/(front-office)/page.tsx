import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCmsPageByRoute } from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

import { Landing } from './landing'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCmsPageByRoute('/')
  if (!page) return {}

  return buildMetadata({
    path: '/',
    entry: {
      title: page.seo.titulo,
      description: page.seo.descricao,
      canonical: page.seo.urlCanonica,
      ogImage: page.seo.imagemCompartilhamento,
      noindex: page.seo.naoIndexar,
    },
  })
}

export default async function HomePage() {
  const page = await getCmsPageByRoute('/')
  if (!page) {
    notFound()
  }

  return <Landing page={page} />
}

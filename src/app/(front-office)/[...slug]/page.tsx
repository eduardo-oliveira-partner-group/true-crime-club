import { notFound } from 'next/navigation'

import { PageRenderer } from '@/src/app/(front-office)/_landing/landing'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { getCmsPageByRoute } from '@/src/lib/domain/repositories'
import { buildMetadata } from '@/src/lib/seo'

const RESERVED_ROUTES = new Set([
  'loja',
  'assinatura',
  'carrinho',
  'checkout',
  'faq',
  'cliente',
  'casos',
  'api',
  'api-docs',
])

interface CatchAllProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: CatchAllProps) {
  const { slug } = await params
  const firstSegment = slug[0]

  if (RESERVED_ROUTES.has(firstSegment)) {
    return {}
  }

  const routePath = '/' + slug.join('/')
  const page = await getCmsPageByRoute(routePath)

  if (!page || page.status !== 'publicada') {
    return {}
  }

  return buildMetadata({
    path: routePath,
    entry: {
      title: page.seo.titulo,
      description: page.seo.descricao,
      canonical: page.seo.urlCanonica,
      ogImage: page.seo.imagemCompartilhamento,
      noindex: page.seo.naoIndexar,
    },
  })
}

export default async function CatchAllPage({ params }: CatchAllProps) {
  const { slug } = await params
  const firstSegment = slug[0]

  if (RESERVED_ROUTES.has(firstSegment)) {
    notFound()
  }

  const routePath = '/' + slug.join('/')
  const page = await getCmsPageByRoute(routePath)

  if (!page || page.status !== 'publicada') {
    notFound()
  }

  return (
    <DesignPageShell showOverlays={false}>
      <main>
        <PageRenderer sections={page.sections} />
      </main>
    </DesignPageShell>
  )
}

import { getOpenApiSpec } from '@/src/lib/openapi'

import ApiDocsClient from './api-docs-client'

export const metadata = {
  title: 'Portal de API | True Crime Club',
  description:
    'Especificação técnica e documentação das rotas da API do True Crime Club.',
}

export default async function Page(props: {
  searchParams?: Promise<{ tag?: string; q?: string }>
}) {
  // Await searchParams as required by Next.js 16
  const resolvedParams = (await props.searchParams) || {}
  const spec = getOpenApiSpec()

  return (
    <div className="min-h-screen bg-[#090807] font-sans text-[#fffaf0] selection:bg-[#d84132]/30 selection:text-[#fffaf0]">
      {/* Background Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,250,240,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,250,240,0.02)_1px,transparent_1px)] bg-size-[40px_40px] opacity-40" />

      {/* Light Radial Gradient Center */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-linear-to-b from-[#b98542]/5 to-transparent blur-[120px]" />

      <ApiDocsClient
        spec={spec}
        initialTag={resolvedParams.tag}
        initialQuery={resolvedParams.q}
      />
    </div>
  )
}

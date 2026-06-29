import { getOpenApiSpec } from '@/src/lib/openapi'
import ApiDocsClient from './api-docs-client'

export const metadata = {
  title: 'Portal de API | True Crime Club',
  description: 'Especificação técnica e documentação das rotas da API do True Crime Club.',
}

export default async function Page(props: {
  searchParams?: Promise<{ tag?: string; q?: string }>
}) {
  // Await searchParams as required by Next.js 16
  const resolvedParams = (await props.searchParams) || {}
  const spec = getOpenApiSpec()

  return (
    <div className="min-h-screen bg-[#090807] text-[#fffaf0] font-sans selection:bg-[#d84132]/30 selection:text-[#fffaf0]">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,250,240,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,250,240,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />
      
      {/* Light Radial Gradient Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#b98542]/5 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <ApiDocsClient 
        spec={spec} 
        initialTag={resolvedParams.tag} 
        initialQuery={resolvedParams.q} 
      />
    </div>
  )
}

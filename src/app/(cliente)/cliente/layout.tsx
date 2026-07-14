import type { Metadata } from 'next'

import { RequireAuth } from '@/src/components/auth/require-auth'
import { ClientShell } from '@/src/components/layout/client-shell'

// Área autenticada: depende de cookie/sessão por request.
// Sem force-dynamic o Next tenta prerender no build, chama a API sem auth e falha com 401.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ClienteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RequireAuth>
      <ClientShell>{children}</ClientShell>
    </RequireAuth>
  )
}

import type { Metadata } from 'next'

import { ClientShell } from '@/src/components/layout/client-shell'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ClienteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientShell>{children}</ClientShell>
}

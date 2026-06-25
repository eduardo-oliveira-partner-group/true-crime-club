import { ClientShell } from '@/src/components/layout/client-shell'

export default function ClienteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientShell>{children}</ClientShell>
}

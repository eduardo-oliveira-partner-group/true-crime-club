'use client'

import { usePathname } from 'next/navigation'

export function ConditionalLayoutWrapper({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname === '/') {
    return fallback
  }
  return <>{children}</>
}

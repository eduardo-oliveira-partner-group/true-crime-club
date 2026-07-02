import type { Metadata } from 'next'
import Link from 'next/link'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { DesignPageShell } from '@/src/components/public-design/design-page-shell'
import { designFontClassName } from '@/src/lib/design/fonts'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DesignPageShell className={designFontClassName}>
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 py-10">
        <Link href="/" className="mb-16 inline-block">
          <BrandLogo className="h-9 w-auto sm:h-10" priority />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </DesignPageShell>
  )
}

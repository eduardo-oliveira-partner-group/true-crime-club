import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import logo from '@/src/assets/images/brand/logo.png'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dark relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#090807] px-4 py-10 text-[#fffaf0]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(216,65,50,0.14),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(215,181,109,0.1),transparent_30%),linear-gradient(180deg,rgba(11,9,8,0.6)_0%,rgba(9,8,7,0.86)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.035)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.035)_1px,transparent_1px)] bg-size-[56px_56px]" />

      <Link href="/" className="mb-8 inline-block">
        <Image
          src={logo}
          alt="True Crime Club"
          className="h-9 w-auto sm:h-10"
          priority
        />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

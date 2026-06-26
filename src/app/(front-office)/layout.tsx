import { CookieConsentBanner } from '@/src/components/layout/cookie-consent-banner'
import { PublicFooter } from '@/src/components/layout/public-footer'
import { PublicHeader } from '@/src/components/layout/public-header'

export default function FrontOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="dark flex min-h-svh flex-col bg-[#090807] text-[#fffaf0]">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <CookieConsentBanner />
    </div>
  )
}

import { ConditionalLayoutWrapper } from '@/src/components/layout/conditional-layout-wrapper'
import { CookieConsentBanner } from '@/src/components/layout/cookie-consent-banner'
import { FloatingActionButton } from '@/src/components/layout/floating-action-button'
import { PublicFooter } from '@/src/components/layout/public-footer'
import { PublicHeader } from '@/src/components/layout/public-header'

export default function FrontOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col bg-[#f4f1ec] text-[#211c18] dark:bg-[#090807] dark:text-[#fffaf0]">
      <ConditionalLayoutWrapper>
        <PublicHeader />
      </ConditionalLayoutWrapper>
      <main className="flex-1">{children}</main>
      <ConditionalLayoutWrapper>
        <PublicFooter />
        <FloatingActionButton />
      </ConditionalLayoutWrapper>
      <CookieConsentBanner />
    </div>
  )
}

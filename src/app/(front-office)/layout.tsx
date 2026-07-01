import { CookieConsentBanner } from '@/src/components/layout/cookie-consent-banner'
import { FloatingActionButton } from '@/src/components/layout/floating-action-button'
import { PublicFooter } from '@/src/components/layout/public-footer'
import { PublicHeader } from '@/src/components/layout/public-header'
import { DesignOverlays } from '@/src/components/public-design/design-overlays'
import { PublicPromoMarquee } from '@/src/components/public-design/promo-marquee'
import { paperPageClass } from '@/src/lib/design/classes'
import { designFontClassName } from '@/src/lib/design/fonts'
import { designTokens } from '@/src/lib/design/tokens'

export default function FrontOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div
      className={`front-office-shell flex min-h-svh flex-col ${paperPageClass} ${designFontClassName}`}
      style={designTokens}
    >
      <DesignOverlays />
      <PublicPromoMarquee />
      <PublicHeader />
      <main className="relative z-10 flex-1">{children}</main>
      <PublicFooter />
      <FloatingActionButton />
      <CookieConsentBanner />
    </div>
  )
}

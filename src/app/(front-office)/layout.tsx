import { PublicFooter } from "@/src/components/layout/public-footer"
import { PublicHeader } from "@/src/components/layout/public-header"

export default function FrontOfficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}

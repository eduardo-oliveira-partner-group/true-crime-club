'use client'

import { IconShoppingCart, IconUser } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

const navLinks = [
  { href: '/loja', label: 'Loja' },
  { href: '/assinatura', label: 'Assine' },
  { href: '/faq', label: 'Dúvidas' },
]

type PublicHeaderContentProps = {
  itemCount: number
}

export function PublicHeaderContent({ itemCount }: PublicHeaderContentProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const shouldOverlayContent = pathname === '/'
  const shouldShowBackdrop = isScrolled || !shouldOverlayContent

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ease-out',
          shouldShowBackdrop
            ? 'border-[#fffaf0]/12 bg-[#090807]/82 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl supports-backdrop-filter:bg-[#090807]/72'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
          <Link href="/" className="min-w-0 shrink">
            <BrandLogo
              className="h-7 max-w-[9.5rem] drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:h-8 sm:max-w-none"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-[0.18em] text-[#d7c9b5] uppercase transition-colors hover:text-[#fffaf0]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#fffaf0] hover:bg-[#fffaf0]/10 hover:text-[#fffaf0]"
              asChild
            >
              <Link href="/login" aria-label="Conta">
                <IconUser className="size-4" />
                <span className="hidden sm:inline">Conta</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#d7b56d]/35 bg-[#fffaf0]/8 text-[#fffaf0] hover:border-[#d7b56d]/60 hover:bg-[#fffaf0]/14 hover:text-[#fffaf0]"
              asChild
            >
              <Link href="/carrinho" aria-label="Carrinho">
                <IconShoppingCart className="size-4" />
                <span className="hidden min-[380px]:inline">Carrinho</span>
                {itemCount > 0 ? (
                  <span className="rounded-full bg-[#d84132] px-1.5 py-0.5 text-xs text-[#fffaf0]">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </Button>
          </div>
        </div>

        <nav
          className={cn(
            'flex max-w-full gap-4 overflow-x-auto border-t px-3 py-2 transition-colors md:hidden',
            shouldShowBackdrop ? 'border-[#fffaf0]/10' : 'border-transparent',
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 text-xs font-semibold tracking-[0.16em] text-[#d7c9b5] uppercase transition-colors hover:text-[#fffaf0]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {!shouldOverlayContent ? (
        <div aria-hidden="true" className="h-[99px] md:h-[65px]" />
      ) : null}
    </>
  )
}

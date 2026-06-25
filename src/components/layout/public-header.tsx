import { IconShoppingCart, IconUser } from '@tabler/icons-react'
import Link from 'next/link'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { Button } from '@/src/components/ui/button'
import { getCart } from '@/src/lib/domain/repositories'

const navLinks = [
  { href: '/loja', label: 'Loja' },
  { href: '/assinatura', label: 'Assine' },
  { href: '/faq', label: 'Dúvidas' },
]

export function PublicHeader() {
  const cart = getCart()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
        <Link href="/" className="min-w-0 shrink">
          <BrandLogo
            className="h-7 max-w-[9.5rem] sm:h-8 sm:max-w-none"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" aria-label="Conta">
              <IconUser className="size-4" />
              <span className="hidden sm:inline">Conta</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/carrinho" aria-label="Carrinho">
              <IconShoppingCart className="size-4" />
              <span className="hidden min-[380px]:inline">Carrinho</span>
              {itemCount > 0 ? (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </div>

      <nav className="flex max-w-full gap-4 overflow-x-auto border-t border-border px-3 py-2 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 text-sm text-muted-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

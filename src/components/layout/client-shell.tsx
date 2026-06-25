'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { getCurrentCustomer } from '@/src/lib/domain/repositories'
import { cn } from '@/src/lib/utils'

const navItems = [
  { href: '/cliente/pedidos', label: 'Pedidos' },
  { href: '/cliente/assinatura', label: 'Assinatura' },
  { href: '/cliente/financeiro', label: 'Financeiro' },
  { href: '/cliente/conteudos', label: 'Conteúdos' },
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const customer = getCurrentCustomer()

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-sm font-semibold">
            True Crime Club
          </Link>
          <div className="text-right text-sm">
            <p className="font-medium">{customer?.name ?? 'Visitante'}</p>
            <p className="text-xs text-muted-foreground">{customer?.email}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'shrink-0 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

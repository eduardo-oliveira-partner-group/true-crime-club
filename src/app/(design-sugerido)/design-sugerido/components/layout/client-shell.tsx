'use client'

import {
  IconBoxSeam,
  IconCreditCard,
  IconHome,
  IconLogout,
  IconMenu2,
  IconUser,
  IconUsers,
  IconX,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import logo from '@/src/assets/images/brand/logo.png'
import { apiClient } from '@/src/lib/api-client'
import type { Customer } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

const navItems = [
  { href: '/cliente/perfil', label: 'Minha conta', icon: IconUser },
  { href: '/cliente/pedidos', label: 'Meus pedidos', icon: IconBoxSeam },
  { href: '/cliente/assinatura', label: 'Minhas assinaturas', icon: IconHome },
  { href: '/cliente/cartoes', label: 'Meus cartões', icon: IconCreditCard },
  { href: '/casos', label: 'Casos', icon: IconUsers, isGreen: true },
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isSuggested = true
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const activeNavItems = navItems.map((item) => {
    if (isSuggested && item.href.startsWith('/cliente')) {
      return { ...item, href: `/design-sugerido${item.href}` }
    }
    return item
  })

  useEffect(() => {
    apiClient.auth
      .me()
      .then(setCustomer)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <div className="dark relative isolate min-h-svh bg-[#090807] text-[#fffaf0]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,250,240,0.028)_1px,transparent_1px),linear-gradient(rgba(255,250,240,0.028)_1px,transparent_1px)] bg-size-[56px_56px]" />

      <header className="border-b border-[#fffaf0]/12 bg-[#0b0908]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={isSuggested ? '/design-sugerido' : '/'}
            className="inline-flex items-center"
          >
            <Image src={logo} alt="True Crime Club" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-heading text-sm font-semibold tracking-wide text-[#fffaf0]">
                {customer?.name ?? 'Visitante'}
              </p>
              <p className="font-mono text-[10px] tracking-[0.12em] text-[#bfb4a3] uppercase">
                {customer?.email}
              </p>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex size-9 cursor-pointer items-center justify-center border border-[#fffaf0]/12 bg-[#fffaf0]/5 text-[#fffaf0] transition-colors hover:bg-[#fffaf0]/10 lg:hidden"
              aria-label="Abrir menu do assinante"
            >
              <IconMenu2 className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dashboard Drawer (Sidebar) */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-300 lg:hidden',
          isMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-[#090807]/80 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar container */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-72 flex-col justify-between border-l border-[#fffaf0]/12 bg-[#0b0908] p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase">
                Arquivo do assinante
              </span>
              <button
                className="flex size-9 items-center justify-center text-[#fffaf0] hover:bg-[#fffaf0]/10"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <IconX className="size-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              {activeNavItems.map((item) => {
                const active = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors',
                      active
                        ? 'border-[#d7b56d]/45 bg-[#171211] text-[#fffaf0]'
                        : item.isGreen
                          ? 'glitch-btn-container border-transparent text-[#62d84e] hover:border-[#62d84e]/20 hover:bg-[#171211]/60'
                          : 'border-transparent text-[#c8bdad] hover:border-[#fffaf0]/12 hover:bg-[#171211]/60 hover:text-[#fffaf0]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        active
                          ? 'text-[#d7b56d]'
                          : item.isGreen
                            ? 'glitch-icon text-[#62d84e]'
                            : 'text-[#bfb4a3] group-hover:text-[#d7b56d]',
                      )}
                    />
                    <span
                      data-text={item.label}
                      className={cn(
                        item.isGreen &&
                          'glitch-text font-semibold text-[#62d84e] drop-shadow-[0_0_6px_rgba(98,216,78,0.25)]',
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t border-[#fffaf0]/10 pt-6">
            <button
              onClick={async () => {
                setIsMenuOpen(false)
                try {
                  await apiClient.auth.logout()
                } catch (e) {
                  console.error(e)
                }
                localStorage.removeItem('isLoggedIn')
                router.replace(isSuggested ? '/design-sugerido' : '/')
              }}
              className="group flex w-full cursor-pointer items-center gap-2.5 border border-transparent px-3 py-2.5 text-left text-sm text-[#ffb0a5] transition-colors hover:border-[#d84132]/25 hover:bg-[#d84132]/8"
            >
              <IconLogout className="size-4 shrink-0 text-[#ffb0a5]" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-10">
        <aside className="lg:w-60 lg:shrink-0">
          <p className="mb-3 hidden text-xs font-semibold tracking-[0.24em] text-[#d7b56d] uppercase lg:block">
            Arquivo do assinante
          </p>
          <nav className="hidden lg:flex lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0">
            {activeNavItems.map((item) => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex shrink-0 items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors',
                    active
                      ? 'border-[#d7b56d]/45 bg-[#171211] text-[#fffaf0]'
                      : item.isGreen
                        ? 'glitch-btn-container border-transparent text-[#62d84e] hover:border-[#62d84e]/20 hover:bg-[#171211]/60'
                        : 'border-transparent text-[#c8bdad] hover:border-[#fffaf0]/12 hover:bg-[#171211]/60 hover:text-[#fffaf0]',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 shrink-0',
                      active
                        ? 'text-[#d7b56d]'
                        : item.isGreen
                          ? 'glitch-icon text-[#62d84e]'
                          : 'text-[#bfb4a3] group-hover:text-[#d7b56d]',
                    )}
                  />
                  <span
                    data-text={item.label}
                    className={cn(
                      item.isGreen &&
                        'glitch-text font-semibold text-[#62d84e] drop-shadow-[0_0_6px_rgba(98,216,78,0.25)]',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            })}
            <button
              onClick={async () => {
                try {
                  await apiClient.auth.logout()
                } catch (e) {
                  console.error(e)
                }
                localStorage.removeItem('isLoggedIn')
                router.replace(isSuggested ? '/design-sugerido' : '/')
              }}
              className="group flex shrink-0 cursor-pointer items-center gap-2.5 border border-transparent px-3 py-2.5 text-left text-sm text-[#ffb0a5] transition-colors hover:border-[#d84132]/25 hover:bg-[#d84132]/8 lg:mt-6"
            >
              <IconLogout className="size-4 shrink-0 text-[#ffb0a5]" />
              Sair
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

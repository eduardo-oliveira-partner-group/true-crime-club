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
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { apiClient } from '@/src/lib/api-client'
import { clearAccessToken } from '@/src/lib/auth-token'
import {
  fontHeading,
  fontMono,
  transitionBgColor,
} from '@/src/lib/design/classes'
import { designTokens } from '@/src/lib/design/tokens'
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
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    <div
      className="relative isolate min-h-svh overflow-x-clip bg-(--paper) [font-family:var(--design-font-body),system-ui,sans-serif] text-(--ink) antialiased"
      style={designTokens}
    >
      {/* Micro-dot paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(33,28,24,0.06)_0.7px,transparent_0.7px),radial-gradient(rgba(33,28,24,0.035)_0.7px,transparent_0.7px)] bg-size-[5px_5px,5px_5px] bg-position-[0_0,2px_2px]"
      />

      <header className="border-b border-dashed border-(--ink)/10 bg-(--paper)/92 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center">
            <BrandLogo className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p
                className={`text-sm font-semibold tracking-wide text-(--ink) ${fontHeading}`}
              >
                {customer?.name ?? 'Visitante'}
              </p>
              <p
                className={`text-[10px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontMono}`}
              >
                {customer?.email}
              </p>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-[9px] border border-(--ink)/12 bg-(--card) text-(--ink) ${transitionBgColor} hover:bg-(--paper-soft) lg:hidden`}
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
          className="absolute inset-0 bg-(--ink)/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar container */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-72 flex-col justify-between rounded-l-[14px] border-l border-(--ink)/10 bg-(--card) p-6 shadow-[0_0_50px_rgba(33,28,24,0.3)] transition-transform duration-300 ease-out',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
          style={designTokens}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold tracking-[0.24em] text-(--red) uppercase ${fontHeading}`}
              >
                Arquivo do assinante
              </span>
              <button
                className={`flex size-9 items-center justify-center rounded-[9px] text-(--ink) ${transitionBgColor} hover:bg-(--paper-soft)`}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <IconX className="size-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      `group flex items-center gap-2.5 rounded-[9px] border px-3 py-2.5 text-sm ${transitionBgColor}`,
                      active
                        ? 'border-(--red)/25 bg-(--paper-soft) text-(--ink)'
                        : item.isGreen
                          ? 'glitch-btn-container border-transparent text-[#62d84e] hover:border-[#62d84e]/20 hover:bg-(--paper-soft)'
                          : 'border-transparent text-(--ink-mute) hover:border-(--ink)/8 hover:bg-(--paper-soft) hover:text-(--ink)',
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 shrink-0',
                        active
                          ? 'text-(--red)'
                          : item.isGreen
                            ? 'glitch-icon text-[#62d84e]'
                            : 'text-(--ink-mute) group-hover:text-(--red)',
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

          <div className="border-t border-dashed border-(--ink)/10 pt-6">
            <button
              onClick={async () => {
                setIsMenuOpen(false)
                try {
                  await apiClient.auth.logout()
                } catch (e) {
                  console.error(e)
                  clearAccessToken()
                }
                router.replace('/')
              }}
              className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-[9px] border border-transparent px-3 py-2.5 text-left text-sm text-(--red) ${transitionBgColor} hover:border-(--red)/15 hover:bg-(--red)/6`}
            >
              <IconLogout className="size-4 shrink-0 text-(--red)" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-10">
        <aside className="lg:w-60 lg:shrink-0">
          <p
            className={`mb-3 hidden text-xs font-semibold tracking-[0.24em] text-(--red) uppercase lg:block ${fontMono}`}
          >
            Arquivo do assinante
          </p>
          <nav className="hidden lg:flex lg:flex-col lg:gap-1.5 lg:overflow-visible lg:border-b-0 lg:pb-0">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `group flex shrink-0 items-center gap-2.5 rounded-[9px] border px-3 py-2.5 text-sm ${transitionBgColor}`,
                    active
                      ? 'border-(--red)/25 bg-(--card) text-(--ink) shadow-[0_4px_12px_-4px_rgba(33,28,24,0.1)]'
                      : item.isGreen
                        ? 'glitch-btn-container border-transparent text-[#62d84e] hover:border-[#62d84e]/20 hover:bg-(--card)'
                        : 'border-transparent text-(--ink-mute) hover:border-(--ink)/8 hover:bg-(--card) hover:text-(--ink)',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 shrink-0',
                      active
                        ? 'text-(--red)'
                        : item.isGreen
                          ? 'glitch-icon text-[#62d84e]'
                          : 'text-(--ink-mute) group-hover:text-(--red)',
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
                  clearAccessToken()
                }
                router.replace('/')
              }}
              className={`group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-[9px] border border-transparent px-3 py-2.5 text-left text-sm text-(--red) ${transitionBgColor} hover:border-(--red)/15 hover:bg-(--red)/6 lg:mt-6`}
            >
              <IconLogout className="size-4 shrink-0 text-(--red)" />
              Sair
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

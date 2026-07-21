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
import { Button } from '@/src/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/src/components/ui/sheet'
import { Skeleton } from '@/src/components/ui/skeleton'
import { apiClient } from '@/src/lib/api-client'
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
  const [isCustomerLoading, setIsCustomerLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    apiClient.auth
      .me()
      .then(setCustomer)
      .catch(() => {})
      .finally(() => setIsCustomerLoading(false))
  }, [])

  const logout = async () => {
    setIsMenuOpen(false)
    try {
      await apiClient.auth.logout()
    } catch (e) {
      console.error(e)
    }
    router.replace('/')
  }

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
            <div className="min-w-36 text-right">
              {isCustomerLoading ? (
                <div
                  className="flex flex-col items-end gap-1.5"
                  aria-label="Carregando dados do assinante"
                  role="status"
                >
                  <Skeleton className="h-4 w-28 rounded-[5px] bg-(--ink)/10" />
                  <Skeleton className="h-2.5 w-36 rounded-[4px] bg-(--ink)/8" />
                </div>
              ) : (
                <>
                  <p
                    className={`text-sm font-semibold tracking-wide text-(--ink) ${fontHeading}`}
                  >
                    {customer?.name}
                  </p>
                  <p
                    className={`text-[10px] tracking-[0.12em] text-(--ink-mute) uppercase ${fontMono}`}
                  >
                    {customer?.email}
                  </p>
                </>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsMenuOpen(true)}
              className={`flex size-9 cursor-pointer items-center justify-center rounded-[9px] border border-(--ink)/12 bg-(--card) text-(--ink) ${transitionBgColor} hover:bg-(--paper-soft) lg:hidden`}
              aria-label="Abrir menu do assinante"
            >
              <IconMenu2 className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          overlayClassName="bg-(--ink)/40 supports-backdrop-filter:backdrop-blur-sm lg:hidden"
          className="w-72 max-w-none gap-0 rounded-l-[14px] border-l border-(--ink)/10 bg-(--card) p-6 text-(--ink) shadow-[0_0_50px_rgba(33,28,24,0.3)] sm:max-w-none lg:hidden"
          style={designTokens}
        >
          <SheetTitle className="sr-only">Menu do assinante</SheetTitle>
          <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold tracking-[0.24em] text-(--red) uppercase ${fontHeading}`}
                >
                  Arquivo do assinante
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className={`flex size-9 items-center justify-center rounded-[9px] text-(--ink) ${transitionBgColor} hover:bg-(--paper-soft)`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <IconX className="size-5" />
                </Button>
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
              <Button
                type="button"
                variant="ghost"
                onClick={logout}
                className={`group flex h-auto w-full cursor-pointer items-center justify-start gap-2.5 rounded-[9px] border border-transparent px-3 py-2.5 text-left text-sm text-(--red) ${transitionBgColor} hover:border-(--red)/15 hover:bg-(--red)/6 hover:text-(--red)`}
              >
                <IconLogout className="size-4 shrink-0 text-(--red)" />
                Sair
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
            <Button
              type="button"
              variant="ghost"
              onClick={logout}
              className={`group flex h-auto shrink-0 cursor-pointer items-center justify-start gap-2.5 rounded-[9px] border border-transparent px-3 py-2.5 text-left text-sm text-(--red) ${transitionBgColor} hover:border-(--red)/15 hover:bg-(--red)/6 hover:text-(--red) lg:mt-6`}
            >
              <IconLogout className="size-4 shrink-0 text-(--red)" />
              Sair
            </Button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

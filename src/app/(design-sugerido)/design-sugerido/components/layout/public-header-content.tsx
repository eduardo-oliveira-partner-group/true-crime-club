'use client'

import {
  IconMenu2,
  IconMoon,
  IconShoppingCart,
  IconSun,
  IconUser,
  IconX,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import { cn } from '@/src/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/loja', label: 'Loja' },
  { href: '/assinatura', label: 'Assine' },
  { href: '/faq', label: 'Dúvidas' },
]

type PublicHeaderContentProps = {
  itemCount: number
}

export function PublicHeaderContent({ itemCount }: PublicHeaderContentProps) {
  const pathname = usePathname()
  const prefix = '/design-sugerido'
  const prefixPath = (href: string) => {
    if (href === '/') return '/design-sugerido'
    return `${prefix}${href}`
  }
  const { resolvedTheme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const shouldOverlayContent = pathname === '/design-sugerido'
  const shouldShowBackdrop = isScrolled || !shouldOverlayContent
  const isDarkTheme = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDarkTheme ? 'light' : 'dark')
  }

  useEffect(() => {
    setHasMounted(true)

    const localLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(localLoggedIn)

    apiClient.auth
      .me()
      .then((customer) => {
        if (customer) {
          setIsLoggedIn(true)
          localStorage.setItem('isLoggedIn', 'true')
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
        localStorage.removeItem('isLoggedIn')
      })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
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
    <>
      <header
        className={cn(
          'fixed inset-x-0 z-50 border-b transition-all duration-300 ease-out',
          pathname === '/design-sugerido' && !isScrolled
            ? 'top-[38px]'
            : 'top-0',
          shouldShowBackdrop
            ? 'border-[#211c18]/12 bg-[#fffaf2]/84 shadow-[0_14px_36px_rgba(63,46,34,0.14)] backdrop-blur-xl supports-backdrop-filter:bg-[#fffaf2]/74 dark:border-[#fffaf0]/12 dark:bg-[#090807]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.28)] dark:supports-backdrop-filter:bg-[#090807]/72'
            : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6">
          <Link href={prefixPath('/')} className="min-w-0 shrink">
            <BrandLogo
              className="h-7 max-w-38 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)] sm:h-8 sm:max-w-none"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={prefixPath(link.href)}
                className="text-xs font-semibold tracking-[0.18em] text-[#4f433b] uppercase transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                href="/casos"
                data-text="Casos"
                className="glitch-text text-xs font-semibold tracking-[0.18em] text-[#62d84e] uppercase drop-shadow-[0_0_8px_rgba(98,216,78,0.35)] transition-all hover:text-[#7fff6b]"
              >
                Casos
              </Link>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              role="switch"
              aria-checked={hasMounted ? isDarkTheme : undefined}
              aria-label={
                hasMounted
                  ? `Alternar para tema ${isDarkTheme ? 'claro' : 'escuro'}`
                  : 'Alternar tema'
              }
              className="h-8 min-w-17 gap-1 rounded-full border-[#9a662a]/35 bg-[#211c18]/6 px-1.5 text-[#211c18] hover:border-[#9a662a]/60 hover:bg-[#211c18]/10 hover:text-[#211c18] dark:border-[#d7b56d]/35 dark:bg-[#fffaf0]/8 dark:text-[#fffaf0] dark:hover:border-[#d7b56d]/60 dark:hover:bg-[#fffaf0]/14 dark:hover:text-[#fffaf0]"
              onClick={toggleTheme}
            >
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full transition-colors',
                  hasMounted && !isDarkTheme
                    ? 'bg-[#b5332a] text-white'
                    : 'text-[#7c5323] dark:text-[#d7c9b5]',
                )}
                aria-hidden="true"
              >
                <IconSun className="size-3.5" />
              </span>
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full transition-colors',
                  hasMounted && isDarkTheme
                    ? 'bg-[#d7b56d] text-[#171211]'
                    : 'text-[#7c5323] dark:text-[#d7c9b5]',
                )}
                aria-hidden="true"
              >
                <IconMoon className="size-3.5" />
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#211c18] hover:bg-[#211c18]/8 hover:text-[#211c18] dark:text-[#fffaf0] dark:hover:bg-[#fffaf0]/10 dark:hover:text-[#fffaf0]"
              asChild
            >
              <Link
                href={prefixPath(isLoggedIn ? '/cliente/perfil' : '/login')}
                aria-label="Conta"
              >
                <IconUser className="size-4" />
                <span className="hidden sm:inline">Conta</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[#9a662a]/35 bg-[#211c18]/6 text-[#211c18] hover:border-[#9a662a]/60 hover:bg-[#211c18]/10 hover:text-[#211c18] dark:border-[#d7b56d]/35 dark:bg-[#fffaf0]/8 dark:text-[#fffaf0] dark:hover:border-[#d7b56d]/60 dark:hover:bg-[#fffaf0]/14 dark:hover:text-[#fffaf0]"
              asChild
            >
              <Link href={prefixPath('/carrinho')} aria-label="Carrinho">
                <IconShoppingCart className="size-4" />
                <span className="hidden min-[380px]:inline">Carrinho</span>
                {itemCount > 0 ? (
                  <span className="rounded-full bg-[#d84132] px-1.5 py-0.5 text-xs text-[#fffaf0]">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#211c18] hover:bg-[#211c18]/8 hover:text-[#211c18] md:hidden dark:text-[#fffaf0] dark:hover:bg-[#fffaf0]/10 dark:hover:text-[#fffaf0]"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <IconMenu2 className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Sidebar) */}
      <div
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-300 md:hidden',
          isMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-[#211c18]/36 backdrop-blur-sm transition-opacity duration-300 dark:bg-[#090807]/80"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar container */}
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-72 flex-col justify-between border-l border-[#211c18]/12 bg-[#fffaf2] p-6 shadow-[0_0_50px_rgba(63,46,34,0.24)] transition-transform duration-300 ease-out dark:border-[#fffaf0]/12 dark:bg-[#0b0908] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)]',
            isMenuOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Link href={prefixPath('/')} onClick={() => setIsMenuOpen(false)}>
                <BrandLogo className="h-7 w-auto" />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#211c18] hover:bg-[#211c18]/8 dark:text-[#fffaf0] dark:hover:bg-[#fffaf0]/10"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <IconX className="size-5" />
              </Button>
            </div>

            <nav className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={prefixPath(link.href)}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'border-b border-[#211c18]/8 py-2 text-xs font-semibold tracking-[0.18em] text-[#5f5147] uppercase transition-colors hover:text-[#211c18] dark:border-[#fffaf0]/5 dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]',
                    pathname === prefixPath(link.href) &&
                      'border-l-2 border-[#9a662a]/50 pl-1 text-[#211c18] dark:border-[#d7b56d]/50 dark:text-[#fffaf0]',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  href="/casos"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'glitch-text border-b border-[#fffaf0]/5 py-2 text-xs font-semibold tracking-[0.18em] text-[#62d84e] uppercase drop-shadow-[0_0_8px_rgba(98,216,78,0.35)] transition-all hover:text-[#7fff6b]',
                    pathname === '/casos' && 'border-l-2 border-[#62d84e] pl-1',
                  )}
                >
                  Casos
                </Link>
              )}
            </nav>
          </div>

          {/* Footer of Drawer */}
          <div className="flex flex-col gap-4 border-t border-[#211c18]/10 pt-6 dark:border-[#fffaf0]/10">
            <button
              type="button"
              role="switch"
              aria-checked={hasMounted ? isDarkTheme : undefined}
              onClick={toggleTheme}
              className="flex items-center justify-between gap-3 text-left text-xs font-semibold tracking-[0.12em] text-[#5f5147] uppercase transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
            >
              <span className="flex items-center gap-3">
                {hasMounted && isDarkTheme ? (
                  <IconMoon className="size-4 text-[#d7b56d]" />
                ) : (
                  <IconSun className="size-4 text-[#8f6126]" />
                )}
                <span>Tema</span>
              </span>
              <span className="rounded-full border border-[#9a662a]/30 px-2 py-1 text-[10px] text-[#8f6126] dark:border-[#d7b56d]/30 dark:text-[#d7b56d]">
                {hasMounted && isDarkTheme ? 'Escuro' : 'Claro'}
              </span>
            </button>
            <Link
              href={prefixPath(isLoggedIn ? '/cliente/perfil' : '/login')}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-xs font-semibold tracking-[0.12em] text-[#5f5147] uppercase transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
            >
              <IconUser className="size-4 text-[#8f6126] dark:text-[#d7b56d]" />
              <span>Minha Conta</span>
            </Link>
            <Link
              href={prefixPath('/carrinho')}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 text-xs font-semibold tracking-[0.12em] text-[#5f5147] uppercase transition-colors hover:text-[#211c18] dark:text-[#d7c9b5] dark:hover:text-[#fffaf0]"
            >
              <IconShoppingCart className="size-4 text-[#8f6126] dark:text-[#d7b56d]" />
              <span>Carrinho ({itemCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {!shouldOverlayContent ? (
        <div aria-hidden="true" className="h-[65px]" />
      ) : null}
    </>
  )
}

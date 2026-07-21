'use client'

import { IconMenu2, IconShoppingBag, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { landingNavLinks } from '@/src/app/(front-office)/_landing/content'
import logo from '@/src/assets/images/brand/logo.png'
import { Button } from '@/src/components/ui/button'
import { apiClient } from '@/src/lib/api-client'
import {
  fontMono,
  fontType,
  sectionFrame,
  transitionColors,
} from '@/src/lib/design/classes'

const routeNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/loja', label: 'Loja' },
  { href: '/assinatura', label: 'Assine' },
  { href: '/faq', label: 'Dúvidas' },
]

export function PublicHeaderContent() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const navLinks = isHome ? landingNavLinks : routeNavLinks
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [itemCount, setItemCount] = useState(0)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    apiClient.auth
      .me()
      .then((customer) => {
        if (customer) {
          setIsLoggedIn(true)
        }
      })
      .catch(() => {
        setIsLoggedIn(false)
      })
  }, [])

  useEffect(() => {
    apiClient.cart
      .get()
      .then((cart) => {
        setItemCount(
          cart.items.reduce((total, item) => total + item.quantity, 0),
        )
      })
      .catch(() => {
        setItemCount(0)
      })
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClick = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)
  const logoHref = isHome ? '#topo' : '/'

  return (
    <header
      ref={headerRef}
      className={`z-50 border-b ${
        isMenuOpen
          ? 'fixed inset-x-0 top-0 border-[rgba(33,28,24,0.12)] bg-(--paper)'
          : 'sticky top-0 border-dashed border-[rgba(33,28,24,0.22)] bg-[rgba(237,228,221,0.92)] backdrop-blur-sm'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-6 ${sectionFrame} py-[14px]`}
      >
        {isHome ? (
          <a
            href={logoHref}
            className="flex h-[42px] min-w-0 items-center no-underline"
            onClick={closeMenu}
          >
            <Image
              src={logo}
              alt="TrueCrime.Club"
              className="block h-8 w-auto"
              priority
            />
          </a>
        ) : (
          <Link
            href={logoHref}
            className="flex h-[42px] min-w-0 items-center no-underline"
            onClick={closeMenu}
          >
            <Image
              src={logo}
              alt="TrueCrime.Club"
              className="block h-8 w-auto"
              priority
            />
          </Link>
        )}

        <nav
          className={`flex items-center gap-[22px] text-[13px] tracking-[0.03em] whitespace-nowrap uppercase max-[860px]:hidden ${fontType}`}
          aria-label="Navegação principal"
        >
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.href}
                href={link.href}
                className={`relative inline-flex h-[42px] items-center leading-none text-(--ink) no-underline ${transitionColors} after:absolute after:inset-x-0 after:bottom-[9px] after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-current after:content-[''] after:[transition:scale_0.28s_cubic-bezier(0.22,1,0.36,1),transform_0.28s_cubic-bezier(0.22,1,0.36,1)] hover:text-(--red) hover:after:scale-x-100`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative inline-flex h-[42px] items-center leading-none text-(--ink) no-underline ${transitionColors} after:absolute after:inset-x-0 after:bottom-[9px] after:h-[1.5px] after:origin-left after:scale-x-0 after:bg-current after:content-[''] after:[transition:scale_0.28s_cubic-bezier(0.22,1,0.36,1),transform_0.28s_cubic-bezier(0.22,1,0.36,1)] hover:text-(--red) hover:after:scale-x-100`}
              >
                {link.label}
              </Link>
            ),
          )}
          {isLoggedIn ? (
            <Link
              href="/casos"
              className="group relative inline-flex h-[42px] items-center leading-none no-underline"
            >
              <span
                data-text="Casos"
                className="glitch-text leading-none text-[#15735d] drop-shadow-[0_0_5px_rgba(21,115,93,0.24)] transition-all group-hover:text-[#0f5f4e]"
              >
                Casos
              </span>
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={isLoggedIn ? '/cliente/perfil' : '/login'}
            className={`inline-flex h-[42px] items-center gap-[7px] text-[13px] leading-none tracking-[0.04em] text-(--ink) uppercase no-underline ${transitionColors} hover:text-(--red) max-[860px]:hidden ${fontType}`}
          >
            <IconUser size={16} stroke={2} className="shrink-0" aria-hidden />
            <span className="leading-none">
              {isLoggedIn ? 'Conta' : 'Entrar'}
            </span>
          </Link>
          <Link
            href="/carrinho"
            aria-label="Caixas no carrinho — finalizar compra"
            className={`relative inline-flex size-[42px] items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--card) text-(--ink) no-underline ${transitionColors} hover:bg-(--ink) hover:text-[#fbf9f6]`}
          >
            <IconShoppingBag size={20} stroke={1.75} aria-hidden />
            {itemCount > 0 ? (
              <span
                className={`absolute top-[-7px] right-[-7px] flex h-[19px] min-w-[19px] items-center justify-center rounded-[10px] border-[1.5px] border-(--paper) bg-(--red) px-[5px] text-[11px] font-bold text-[#fbf9f6] ${fontMono}`}
              >
                {itemCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/assinatura"
            className={`inline-flex items-center rounded-lg border border-[rgba(33,28,24,0.15)] bg-(--ink) px-[18px] py-[11px] text-[13px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_6px_16px_-6px_rgba(33,28,24,0.18)] ${transitionColors} hover:-translate-y-0.5 hover:shadow-[0_11px_24px_-8px_rgba(33,28,24,0.22)] max-[860px]:hidden ${fontMono}`}
          >
            Assinar
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden size-[42px] items-center justify-center rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--ink) p-0 text-[#fbf9f6] hover:bg-(--ink) hover:text-[#fbf9f6] max-[860px]:inline-flex"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isMenuOpen}
          >
            <IconMenu2 size={19} stroke={2.2} aria-hidden />
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          className={`flex flex-col gap-0.5 border-t border-[rgba(33,28,24,0.12)] px-[22px] pt-2 pb-[18px] text-[14px] tracking-[0.03em] uppercase ${fontType}`}
          aria-label="Navegação mobile"
        >
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-[rgba(33,28,24,0.08)] px-1 py-[13px] text-(--ink) no-underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-[rgba(33,28,24,0.08)] px-1 py-[13px] text-(--ink) no-underline"
              >
                {link.label}
              </Link>
            ),
          )}
          {isLoggedIn ? (
            <Link
              href="/casos"
              onClick={closeMenu}
              className="group border-b border-[rgba(33,28,24,0.08)] px-1 py-[13px] no-underline"
            >
              <span
                data-text="Casos"
                className="glitch-text leading-none text-[#15735d] drop-shadow-[0_0_5px_rgba(21,115,93,0.24)] transition-all group-hover:text-[#0f5f4e]"
              >
                Casos
              </span>
            </Link>
          ) : null}
          <div className="mt-[14px] flex gap-[10px]">
            <Link
              href={isLoggedIn ? '/cliente/perfil' : '/login'}
              onClick={closeMenu}
              className={`inline-flex flex-1 items-center justify-center gap-[7px] rounded-[9px] border border-[rgba(33,28,24,0.2)] p-[13px] leading-none font-bold tracking-[0.04em] text-(--ink) no-underline ${transitionColors} hover:border-(--red) hover:text-(--red)`}
            >
              <IconUser size={16} stroke={2} className="shrink-0" aria-hidden />
              <span className="leading-none">
                {isLoggedIn ? 'Conta' : 'Entrar'}
              </span>
            </Link>
            <Link
              href="/assinatura"
              onClick={closeMenu}
              className={`inline-flex flex-1 items-center justify-center rounded-[9px] border border-[rgba(33,28,24,0.15)] bg-(--red) p-[13px] font-bold tracking-[0.04em] text-[#fbf9f6] no-underline ${transitionColors} hover:bg-(--red-deep)`}
            >
              Assinar
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}

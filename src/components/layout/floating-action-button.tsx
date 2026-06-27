'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPastHero = window.scrollY > 300
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 600

      setIsVisible(scrolledPastHero && !isNearBottom)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide the FAB on pages where it is not appropriate (signature itself, checkout, auth)
  if (
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/cadastro') ||
    pathname?.startsWith('/assinatura')
  ) {
    return null
  }

  return (
    <div
      className={`fixed right-5 bottom-5 z-50 transition-all duration-300 max-sm:inset-x-3.5 max-sm:bottom-3.5 ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-6 scale-95 opacity-0'
      }`}
    >
      <Link
        href="/assinatura"
        className="inline-flex w-full items-center justify-center gap-[11px] rounded-[13px] border border-[#211c18]/25 bg-[#c5271f] px-6 py-4 font-mono text-sm font-bold tracking-[0.04em] text-[#fbf9f6] uppercase shadow-[0_16px_38px_-10px_rgba(33,28,24,0.55)] transition-all hover:bg-[#a91d16] max-sm:py-3.5"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
          <path d="M3 8l9 5 9-5" />
          <path d="M12 13v8" />
        </svg>
        Entrar no clube
        <span className="text-base leading-none">→</span>
      </Link>
    </div>
  )
}

'use client'

import { IconArrowRight, IconBoxSeam } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  fontMono,
  transitionColors,
  transitionFab,
} from '@/src/lib/design/classes'

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const hero = document.getElementById('topo')
    const cta = document.getElementById('cta-final')

    let frame = 0
    const updateFab = () => {
      frame = 0
      if (pathname === '/') {
        if (!hero || !cta) {
          setIsVisible(false)
          return
        }
        const heroOut = hero.getBoundingClientRect().bottom <= 0
        const beforeFinalCta =
          cta.getBoundingClientRect().top > window.innerHeight
        setIsVisible(heroOut && beforeFinalCta)
        return
      }

      const scrolledPastHero = window.scrollY > 300
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 600
      setIsVisible(scrolledPastHero && !isNearBottom)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updateFab)
    }

    updateFab()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [pathname])

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
      className={`fixed right-5 bottom-5 z-60 ${transitionFab} motion-reduce:transition-none max-[540px]:inset-x-[14px] max-[540px]:bottom-[14px] ${
        isVisible
          ? ''
          : 'pointer-events-none translate-y-6 scale-[0.96] opacity-0'
      }`}
    >
      <Link
        href="/assinatura"
        className={`flex items-center gap-[11px] rounded-[13px] border border-[rgba(33,28,24,0.25)] bg-(--red) px-6 py-4 text-[14px] leading-none font-bold tracking-[0.04em] text-[#fbf9f6] uppercase no-underline shadow-[0_16px_38px_-10px_rgba(33,28,24,0.55)] ${transitionColors} hover:bg-(--red-deep) max-[540px]:w-full max-[540px]:justify-center ${fontMono}`}
      >
        <IconBoxSeam size={20} stroke={1.75} aria-hidden />
        Entrar no clube
        <IconArrowRight
          size={16}
          stroke={2}
          className="inline-flex items-center leading-none"
          aria-hidden
        />
      </Link>
    </div>
  )
}

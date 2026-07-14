'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { apiClient } from '@/src/lib/api-client'
import { fontMono } from '@/src/lib/design/classes'

const AUTH_TIMEOUT_MS = 8000

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const next = encodeURIComponent(pathname || '/cliente/perfil')

    const redirectToLogin = () => {
      if (!cancelled) {
        router.replace(`/login?next=${next}`)
      }
    }

    const timeoutId = window.setTimeout(() => {
      redirectToLogin()
    }, AUTH_TIMEOUT_MS)

    apiClient.auth
      .me()
      .then(() => {
        if (cancelled) return
        window.clearTimeout(timeoutId)
        setReady(true)
      })
      .catch(() => {
        window.clearTimeout(timeoutId)
        redirectToLogin()
      })

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [pathname, router])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-(--paper) px-4 text-(--ink)">
        <p
          className={`text-xs tracking-[0.18em] text-(--ink-mute) uppercase ${fontMono}`}
        >
          Verificando sessão…
        </p>
      </div>
    )
  }

  return children
}

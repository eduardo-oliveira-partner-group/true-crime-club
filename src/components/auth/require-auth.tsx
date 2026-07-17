'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { apiClient, ApiClientError } from '@/src/lib/api-client'
import { fontMono } from '@/src/lib/design/classes'

const AUTH_TIMEOUT_MS = 20_000

class AuthCheckTimeoutError extends Error {
  constructor() {
    super('A verificação da sessão demorou mais do que o esperado.')
    this.name = 'AuthCheckTimeoutError'
  }
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    const next = encodeURIComponent(pathname || '/cliente/perfil')

    const redirectToLogin = () => {
      if (!cancelled) {
        router.replace(`/login?next=${next}`)
      }
    }

    let timeoutId: number | undefined
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(
        () => reject(new AuthCheckTimeoutError()),
        AUTH_TIMEOUT_MS,
      )
    })

    Promise.race([apiClient.auth.me(), timeout])
      .then(() => {
        if (cancelled) return
        setReady(true)
      })
      .catch((error: unknown) => {
        if (cancelled) return

        if (
          error instanceof ApiClientError &&
          (error.status === 401 || error.status === 403)
        ) {
          redirectToLogin()
          return
        }

        setVerificationError(
          error instanceof AuthCheckTimeoutError
            ? error.message
            : 'Não foi possível verificar sua sessão. Tente novamente.',
        )
      })
      .finally(() => {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      })

    return () => {
      cancelled = true
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [attempt, pathname, router])

  if (verificationError) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-(--paper) px-4 text-(--ink)">
        <div className="max-w-sm text-center">
          <p
            className={`text-xs tracking-[0.18em] text-(--ink-mute) uppercase ${fontMono}`}
          >
            Sessão não confirmada
          </p>
          <p className="mt-3 text-sm/6 text-(--ink-soft)">
            {verificationError}
          </p>
          <button
            type="button"
            className={`mt-6 border border-(--ink) px-4 py-2 text-xs tracking-[0.14em] uppercase ${fontMono}`}
            onClick={() => {
              setVerificationError(null)
              setAttempt((value) => value + 1)
            }}
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

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

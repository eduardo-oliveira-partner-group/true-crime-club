'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import {
  SessionVerificationError,
  SessionVerifying,
} from '@/src/components/auth/session-verifying'
import { apiClient, ApiClientError } from '@/src/lib/api-client'

const AUTH_TIMEOUT_MS = 20_000

class AuthCheckTimeoutError extends Error {
  constructor() {
    super('A verificação da sessão demorou mais do que o esperado.')
    this.name = 'AuthCheckTimeoutError'
  }
}

function RequireAuthInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [ready, setReady] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    const search = searchParams.toString()
    const returnPath = `${pathname || '/cliente/perfil'}${search ? `?${search}` : ''}`
    const next = encodeURIComponent(returnPath)

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
  }, [attempt, pathname, router, searchParams])

  if (verificationError) {
    return (
      <SessionVerificationError
        message={verificationError}
        onRetry={() => {
          setVerificationError(null)
          setAttempt((value) => value + 1)
        }}
      />
    )
  }

  if (!ready) {
    return <SessionVerifying />
  }

  return children
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SessionVerifying />}>
      <RequireAuthInner>{children}</RequireAuthInner>
    </Suspense>
  )
}

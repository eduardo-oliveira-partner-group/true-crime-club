'use client'

import { useEffect, useState } from 'react'

import { BrandLogo } from '@/src/components/layout/brand-logo'
import { fontHeading, fontMono, fontType } from '@/src/lib/design/classes'
import { designFontClassName } from '@/src/lib/design/fonts'
import { designTokens } from '@/src/lib/design/tokens'
import { cn } from '@/src/lib/utils'

const VERIFYING_MESSAGES = [
  'Verificando sessão…',
  'Consultando o arquivo de membros…',
  'Confirmando sua credencial…',
  'Liberando acesso ao clube…',
] as const

function SessionGateShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'relative isolate flex min-h-svh flex-col items-center justify-center overflow-x-clip bg-(--paper) px-4 py-12 text-(--ink) antialiased',
        designFontClassName,
        '[font-family:var(--design-font-body),system-ui,sans-serif]',
      )}
      style={designTokens}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(33,28,24,0.06)_0.7px,transparent_0.7px),radial-gradient(rgba(33,28,24,0.035)_0.7px,transparent_0.7px)] bg-size-[5px_5px,5px_5px] bg-position-[0_0,2px_2px]"
      />
      {children}
    </div>
  )
}

function SessionLoader({ tone = 'verify' }: { tone?: 'verify' | 'denied' }) {
  const isDenied = tone === 'denied'
  const stroke = isDenied ? 'var(--amber)' : 'var(--ink)'
  const accent = isDenied ? 'var(--amber)' : 'var(--red)'
  const track = isDenied ? 'rgba(224,165,10,0.22)' : 'rgba(33,28,24,0.12)'

  return (
    <div
      className="relative mx-auto size-[168px] sm:size-[184px]"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 184 184"
        fill="none"
      >
        <circle cx="92" cy="92" r="78" stroke={track} strokeWidth="1.5" />
        <circle
          cx="92"
          cy="92"
          r="66"
          stroke={track}
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {isDenied ? (
          <circle
            cx="92"
            cy="92"
            r="78"
            stroke={accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="36 460"
            transform="rotate(-90 92 92)"
            opacity="0.75"
          />
        ) : null}
      </svg>

      {!isDenied ? (
        <div className="session-ring-spin absolute inset-0">
          <svg className="size-full" viewBox="0 0 184 184" fill="none">
            <circle
              cx="92"
              cy="92"
              r="78"
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="58 432"
              transform="rotate(-90 92 92)"
            />
          </svg>
        </div>
      ) : null}

      <div className="absolute inset-[18%] overflow-hidden rounded-full border border-[rgba(33,28,24,0.1)] bg-(--card) bg-[linear-gradient(160deg,var(--card)_0%,var(--paper-soft)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_10px_24px_-14px_rgba(33,28,24,0.25)]">
        {/* Compensa o peso visual do cabo, sem interferir na animação interna. */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{
            transform: 'translate(calc(-50% - 4px), calc(-50% - 4px))',
          }}
        >
          <div
            className={cn(
              !isDenied && 'session-loupe-search',
              isDenied && '-rotate-6',
            )}
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 52 52"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="26"
                cy="26"
                r="13"
                fill="rgba(251,249,246,0.55)"
                stroke={stroke}
                strokeWidth="3"
              />
              <circle
                cx="26"
                cy="26"
                r="8"
                fill="none"
                stroke={accent}
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <path
                d="M20 19c2-2 5-2.5 7.5-1"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M36 36 L47 47"
                stroke={stroke}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M36 36 L47 47"
                stroke={accent}
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return reducedMotion
}

export function SessionVerifying() {
  const reducedMotion = useReducedMotion()
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(
      () => {
        setMessageIndex((current) => (current + 1) % VERIFYING_MESSAGES.length)
      },
      reducedMotion ? 3200 : 2200,
    )
    return () => window.clearInterval(id)
  }, [reducedMotion])

  const message = VERIFYING_MESSAGES[messageIndex]

  return (
    <SessionGateShell>
      <div className="session-gate-enter flex w-full max-w-sm flex-col items-center text-center">
        <BrandLogo className="mb-8 h-8 w-auto sm:mb-9 sm:h-9" priority />

        <SessionLoader />

        <p
          key={message}
          className={cn(
            `mt-8 min-h-[1.4em] text-lg font-semibold tracking-[-0.015em] text-balance text-(--ink) sm:text-xl ${fontHeading}`,
            !reducedMotion && 'session-message-in',
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          {message}
        </p>
      </div>
    </SessionGateShell>
  )
}

type SessionVerificationErrorProps = {
  message: string
  onRetry: () => void
}

export function SessionVerificationError({
  message,
  onRetry,
}: SessionVerificationErrorProps) {
  return (
    <SessionGateShell>
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <BrandLogo className="mb-8 h-8 w-auto sm:mb-9 sm:h-9" priority />

        <SessionLoader tone="denied" />

        <p
          className={`mt-8 text-xs tracking-[0.18em] text-(--amber) uppercase ${fontType}`}
        >
          Sessão não confirmada
        </p>
        <p
          className={`mt-3 text-lg font-semibold tracking-[-0.015em] text-balance text-(--ink) ${fontHeading}`}
        >
          {message}
        </p>
        <button
          type="button"
          className={`mt-7 rounded-[9px] border border-(--ink) px-5 py-2.5 text-xs tracking-[0.14em] text-(--ink) uppercase transition-[background-color,color] duration-200 hover:bg-(--ink) hover:text-(--card) ${fontMono}`}
          onClick={onRetry}
        >
          Tentar novamente
        </button>
      </div>
    </SessionGateShell>
  )
}

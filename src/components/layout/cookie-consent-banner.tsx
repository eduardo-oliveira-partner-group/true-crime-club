'use client'

import { IconCookie, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import { cn } from '@/src/lib/utils'

const STORAGE_KEY = 'tcc:cookie-consent'

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = window.localStorage.getItem(STORAGE_KEY)
      if (!consent) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
    setVisible(false)
  }

  function handleDismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed')
    } catch {
      // ignore storage errors
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      aria-live="polite"
      className={cn(
        'fixed inset-x-3 bottom-3 z-50 rounded-[14px_14px_16px_16px] border border-[#fffaf0]/12 bg-[#0b0908]/95 p-4 text-[#fffaf0] shadow-[0_-18px_44px_rgba(0,0,0,0.42)] backdrop-blur-sm sm:px-6',
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-[#d7b56d]/30 bg-[#171211] text-[#d7b56d]">
            <IconCookie className="size-5" />
          </span>
          <p className="max-w-2xl text-sm/6 text-[#d7c9b5]">
            Usamos cookies para lembrar suas preferências e melhorar sua
            experiência no clube. Você pode aceitar ou fechar este aviso —
            nenhuma decisão é definitiva nesta versão de validação.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAccept}
            className="h-9 rounded-[10px] bg-[#d84132] px-4 text-white hover:bg-[#b93227]"
          >
            Aceitar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label="Fechar aviso de cookies"
            onClick={handleDismiss}
            className="h-9 rounded-[10px] px-3 text-[#d7c9b5] hover:bg-[#fffaf0]/8 hover:text-[#fffaf0]"
          >
            <IconX className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

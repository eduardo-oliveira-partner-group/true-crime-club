'use client'

import { IconRefresh } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactNode, useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/ui/empty'
import { fontHeading, fontMono } from '@/src/lib/design/classes'
import { cn } from '@/src/lib/utils'

export function LoadErrorState({
  code = 'Arquivo temporariamente fechado',
  title,
  description = 'Tente carregar os dados novamente.',
  onRetry,
  secondaryLink,
  details,
  className,
}: {
  code?: string
  title: string
  description?: string
  onRetry: () => void | Promise<void>
  secondaryLink?: {
    href: string
    label: string
  }
  details?: ReactNode
  className?: string
}) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = async () => {
    setRetrying(true)
    const startedAt = Date.now()

    try {
      await onRetry()
    } finally {
      const remainingFeedbackTime = 500 - (Date.now() - startedAt)

      if (remainingFeedbackTime > 0) {
        await new Promise((resolve) =>
          window.setTimeout(resolve, remainingFeedbackTime),
        )
      }

      setRetrying(false)
    }
  }

  return (
    <Empty
      role="alert"
      aria-live="assertive"
      className={cn(
        'mx-auto min-h-[520px] max-w-3xl border-0 px-4 py-12 text-(--ink) sm:px-6 sm:py-16',
        className,
      )}
    >
      <EmptyHeader className="max-w-xl gap-3">
        <EmptyMedia className="mb-1 w-full max-w-[430px]">
          <Image
            src="/imagens/erros/arquivo-indisponivel-vivo.png"
            alt="Dossiê temporariamente indisponível, com lupa, fio de evidência interrompido e selo de alerta"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 640px) calc(100vw - 48px), 430px"
            className="h-auto w-full"
          />
        </EmptyMedia>
        <p
          className={`text-xs font-bold tracking-[0.2em] text-(--amber) uppercase ${fontMono}`}
        >
          {code}
        </p>
        <EmptyTitle className="text-balance">
          <h1
            className={`text-3xl font-black tracking-tight sm:text-4xl ${fontHeading}`}
          >
            {title}
          </h1>
        </EmptyTitle>
        <EmptyDescription className="max-w-lg text-pretty sm:text-base/7">
          {description}
        </EmptyDescription>
        {details ? (
          <div
            className={`text-xs tracking-wide text-(--ink-mute)/70 uppercase ${fontMono}`}
          >
            {details}
          </div>
        ) : null}
      </EmptyHeader>
      <EmptyContent className="max-w-none flex-row flex-wrap justify-center gap-3">
        <Button
          type="button"
          size="lg"
          disabled={retrying}
          onClick={() => void handleRetry()}
          className={`min-w-44 rounded-[9px] bg-(--red) px-5 text-xs font-bold tracking-[0.04em] text-[#fbf9f6] uppercase hover:bg-(--red-deep) ${fontMono}`}
        >
          <IconRefresh className={cn('size-4', retrying && 'animate-spin')} />
          {retrying ? 'Tentando novamente…' : 'Tentar novamente'}
        </Button>
        {secondaryLink ? (
          <Button
            asChild
            variant="outline"
            size="lg"
            className={`min-w-44 rounded-[9px] px-5 text-xs font-bold tracking-[0.04em] uppercase ${fontMono}`}
          >
            <Link href={secondaryLink.href}>{secondaryLink.label}</Link>
          </Button>
        ) : null}
      </EmptyContent>
    </Empty>
  )
}

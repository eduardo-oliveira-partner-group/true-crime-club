import Image from 'next/image'
import type { ReactNode } from 'react'

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

type NotFoundEmptyStateProps = {
  code: string
  title: string
  description: string
  actions: ReactNode
  className?: string
  mediaClassName?: string
  imageSizes?: string
}

/** Shared shadcn Empty composition for unavailable pages and resources. */
export function NotFoundEmptyState({
  code,
  title,
  description,
  actions,
  className,
  mediaClassName,
  imageSizes = '(max-width: 640px) 240px, 320px',
}: NotFoundEmptyStateProps) {
  return (
    <Empty
      className={cn('mx-auto max-w-2xl border-0 p-0 text-(--ink)', className)}
    >
      <EmptyHeader className="max-w-xl">
        <EmptyMedia className={cn('w-full max-w-[320px]', mediaClassName)}>
          <Image
            src="/imagens/erros/nao-encontrado-404.png"
            alt="Ilustração 404 com lupa, dossiê e pistas de um caso não encontrado"
            width={1536}
            height={1024}
            priority
            sizes={imageSizes}
            className="h-auto w-full"
          />
        </EmptyMedia>
        <p
          className={`text-xs font-bold tracking-[0.24em] text-(--amber) uppercase ${fontMono}`}
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
        <EmptyDescription className="text-pretty">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-none flex-row flex-wrap justify-center gap-3">
        {actions}
      </EmptyContent>
    </Empty>
  )
}

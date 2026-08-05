'use client'

import {
  IconCheck,
  IconClipboardCopy,
  IconClock,
  IconQrcode,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/src/components/ui/button'
import {
  dossierCardSurface,
  fontHeading,
  fontMono,
  warmShadowClass,
} from '@/src/lib/design/classes'
import type { Payment } from '@/src/lib/domain/types'
import { cn } from '@/src/lib/utils'

const PAYMENT_STEPS = [
  {
    title: 'Abra o banco',
    detail: 'Entre no app ou internet banking.',
  },
  {
    title: 'Pague com Pix',
    detail: 'Escaneie o QR ou cole o código.',
  },
  {
    title: 'Confirme',
    detail: 'Revise o valor e finalize no app.',
  },
] as const

function formatShortDate(isoDate?: string | null): string {
  if (!isoDate) return '—'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={cn('relative flex size-2 shrink-0', className)}
      aria-hidden
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-55 motion-reduce:animate-none" />
      <span className="relative size-2 rounded-full bg-current" />
    </span>
  )
}

export function PixAwaitingPanel({
  payment,
  qrImage,
  orderNumber,
  createdAt,
}: {
  payment: Pick<Payment, 'pixQrCode' | 'pixExpiresAt'>
  qrImage: string | null
  orderNumber: string
  createdAt: string
}) {
  const [copyFeedback, setCopyFeedback] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const pixCode = payment.pixQrCode ?? ''

  const statuses = [
    ['Pedido', orderNumber],
    ['Status', 'Pendente'],
    ['Vencimento', formatShortDate(payment.pixExpiresAt)],
    ['Registro', formatShortDate(createdAt)],
  ]

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopyFeedback('success')
    } catch {
      setCopyFeedback('error')
    }

    window.setTimeout(() => setCopyFeedback('idle'), 2500)
  }

  return (
    <section
      className={cn(
        dossierCardSurface,
        warmShadowClass,
        'relative isolate overflow-hidden p-5 sm:p-6',
      )}
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-(--amber) text-[#fbf9f6]">
            <IconClock className="size-6" aria-hidden />
          </span>
          <div>
            <p
              className={cn(
                fontMono,
                'flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-(--amber) uppercase',
              )}
            >
              <LiveDot className="text-(--amber)" />
              Pendente
            </p>
            <h2
              className={cn(fontHeading, 'text-2xl font-semibold text-(--ink)')}
            >
              Pagamento via PIX
            </h2>
            <p className="mt-2 max-w-xl text-sm/6 text-(--ink-soft)">
              Escaneie o QR Code ou copie o código. A confirmação atualiza
              automaticamente nesta tela.
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-4"
          >
            <dt
              className={cn(
                fontMono,
                'text-[0.66rem] font-semibold tracking-[0.14em] text-(--red) uppercase',
              )}
            >
              {label}
            </dt>
            <dd className="mt-2 text-sm font-medium text-(--ink)">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 border-t border-[rgba(33,28,24,0.12)] pt-5 lg:grid-cols-[minmax(0,11rem)_1fr] lg:items-center">
        <div className="flex justify-center lg:justify-start">
          {qrImage ? (
            <div className="rounded-[12px] border border-[rgba(33,28,24,0.15)] bg-[#fbf9f6] p-3">
              <Image
                alt="QR Code para pagamento Pix"
                height={176}
                src={qrImage}
                unoptimized
                width={176}
                className="size-[160px] sm:size-[176px]"
              />
            </div>
          ) : (
            <div className="flex size-[160px] items-center justify-center rounded-[12px] border border-dashed border-[rgba(33,28,24,0.2)] bg-(--paper-soft) text-(--ink-mute) sm:size-[176px]">
              <IconQrcode className="size-10" aria-hidden />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-(--ink)">
              Código PIX copia e cola
            </p>
            <Button
              type="button"
              variant="link"
              disabled={!pixCode}
              onClick={() => void handleCopyPixCode()}
              className={cn(
                'h-auto min-h-0 gap-1.5 p-0 text-sm font-medium text-(--teal-deep) no-underline hover:text-(--teal) hover:no-underline disabled:opacity-50',
                copyFeedback === 'success' && 'text-(--teal-deep)',
              )}
            >
              {copyFeedback === 'success' ? (
                <IconCheck className="size-3.5" />
              ) : (
                <IconClipboardCopy className="size-3.5" />
              )}
              {copyFeedback === 'success' ? 'Copiado' : 'Copiar código'}
            </Button>
          </div>
          <div className="mt-2 rounded-[10px] border border-[rgba(33,28,24,0.15)] bg-(--paper-soft) p-3">
            <code className="block text-xs/5 break-all text-(--ink-soft)">
              {pixCode || 'Código indisponível'}
            </code>
          </div>
          <p className="sr-only" aria-live="polite">
            {copyFeedback === 'success'
              ? 'Código Pix copiado para a área de transferência.'
              : copyFeedback === 'error'
                ? 'Não foi possível copiar o código Pix. Selecione o código e copie manualmente.'
                : ''}
          </p>
          {copyFeedback === 'error' ? (
            <p className="mt-2 text-xs/5 text-(--red)">
              Não foi possível copiar. Selecione o código e copie manualmente.
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-[10px] border border-(--amber)/30 bg-(--amber)/8 px-3.5 py-3 pb-3.5">
        <div className="flex items-start gap-2.5">
          <IconClock
            className="mt-0.5 size-4 shrink-0 text-(--amber)"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-(--ink)">
              Aguardando compensação
            </p>
            <p className="mt-1 text-sm/5 text-(--ink-soft)">
              Identificamos o pagamento automaticamente.
            </p>
          </div>
        </div>
        <span
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-(--amber)/15"
          aria-hidden
        >
          <span className="pix-await-loading-bar absolute bottom-0 left-0 h-full w-2/5 rounded-full bg-(--amber)" />
        </span>
      </div>

      <div className="mt-5 border-t border-dashed border-[rgba(33,28,24,0.14)] pt-5">
        <p
          className={cn(
            fontMono,
            'text-[0.62rem] font-semibold tracking-[0.14em] text-(--ink-mute) uppercase',
          )}
        >
          Como pagar
        </p>
        <ol className="mt-2.5 grid gap-2 sm:grid-cols-3">
          {PAYMENT_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-[10px] border border-[rgba(33,28,24,0.12)] bg-(--paper-soft) px-3 py-2.5"
            >
              {index < PAYMENT_STEPS.length - 1 ? (
                <span
                  className="pointer-events-none absolute top-1/2 -right-1.5 z-10 hidden h-px w-3 border-t border-dashed border-(--teal)/45 sm:block"
                  aria-hidden
                />
              ) : null}
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    fontMono,
                    'inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-(--teal) text-[0.6rem] font-bold text-[#fbf9f6]',
                  )}
                >
                  {index + 1}
                </span>
                <p className="text-xs font-semibold text-(--ink)">
                  {step.title}
                </p>
              </div>
              <p className="mt-1 pl-7 text-[0.7rem]/4 text-(--ink-soft)">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pix-await-loading-bar {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(320%); }
            }
            .pix-await-loading-bar {
              animation: pix-await-loading-bar 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .pix-await-loading-bar {
                animation: none;
                left: 30%;
                width: 40%;
                opacity: 0.7;
              }
            }
          `,
        }}
      />
    </section>
  )
}

'use client'

import { IconAlertTriangle } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog'
import { Button } from '@/src/components/ui/button'
import { Spinner } from '@/src/components/ui/spinner'
import { fontHeading } from '@/src/lib/design/classes'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  children?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmingLabel?: string
  confirming?: boolean
  tone?: 'destructive' | 'default'
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Voltar',
  confirmingLabel = 'Confirmando…',
  confirming = false,
  tone = 'destructive',
  onConfirm,
}: ConfirmDialogProps) {
  const handleOpenChange = (next: boolean) => {
    if (confirming) return
    onOpenChange(next)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="rounded-[16px] border border-(--ink)/10 bg-(--card) text-(--ink) shadow-[0_24px_48px_-20px_rgba(33,28,24,0.45)] ring-0">
        <AlertDialogHeader>
          <AlertDialogMedia
            className={
              tone === 'destructive'
                ? 'bg-(--red)/10 text-(--red)'
                : 'bg-(--ink)/8 text-(--ink-soft)'
            }
          >
            <IconAlertTriangle />
          </AlertDialogMedia>
          <AlertDialogTitle
            className={`text-lg font-black tracking-tight text-(--ink) uppercase ${fontHeading}`}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm/6 text-(--ink-mute)">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={confirming}
            className="rounded-[9px] border-(--ink)/15 bg-(--card) text-(--ink-soft) hover:bg-(--paper-soft) hover:text-(--ink)"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={confirming}
            onClick={() => void onConfirm()}
            className={
              tone === 'destructive'
                ? 'rounded-[9px] bg-(--red) text-[#fbf9f6] shadow-[0_9px_22px_-8px_rgba(33,28,24,0.13)] hover:bg-(--red-deep)'
                : 'rounded-[9px]'
            }
          >
            {confirming ? (
              <>
                <Spinner data-icon="inline-start" />
                {confirmingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
